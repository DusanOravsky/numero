import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { getTimezoneFromCoords } from '../data/cities';
import { evaluateChakras } from '../engine/chakraEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { getDoshaInfo } from '../data/ayurveda';
import { getTCMElement } from '../data/tcm';
import { BACH_FLOWERS_BY_CHAKRA } from '../data/bachFlowers';
import { getZodiacCrystals, getBlockedChakraCrystals } from '../data/crystals';
import { deriveArchetype } from '../engine/archetypeEngine';
import type { ArchetypeResult } from '../engine/archetypeEngine';
import { calculateKua } from '../engine/kuaEngine';
import type { KuaResult } from '../engine/kuaEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import type { DoshaProfile } from '../data/ayurveda';
import type { TCMResult } from '../engine/tcmEngine';
import type { ChakraState } from '../engine/chakraEngine';
import type { BachFlower } from '../data/bachFlowers';

interface ModalityData {
  dosha: DoshaProfile;
  tcm: TCMResult;
  chakras: ChakraState[];
  blockedChakras: number[];
  sunSign: string;
  archetype: ArchetypeResult | null;
  kua: KuaResult | null;
  lifePathNumber: number;
}

function computeModality(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  lat: number = 48.15, lon: number = 17.11, tz: number = 1
): ModalityData {
  const numerology = calculateFullNumerology(day, month, year);
  const astrology = calculateAstrology(day, month, year, hour, minute, lat, lon, tz);
  const hd = calculateHumanDesign(day, month, year, hour, minute, tz);
  const gridCounts = getGridCount(numerology.grid);
  const chakras = evaluateChakras(
    numerology.lifePathNumber,
    gridCounts,
    numerology.isolatedNumbers,
    hd.definedCenters,
    astrology.dominantElement
  );

  const dosha = deriveDosha(numerology, astrology, hd);
  const tcm = deriveTCMElement(numerology, astrology);
  const blockedChakras = chakras
    .filter(c => c.status === 'blocked')
    .map(c => c.chakra.number);

  const devNum = calculateDevelopmentalNumerology(day, month, year);
  const enneagram = deriveEnneagramType(numerology, devNum, 'developmental');
  const archetype = enneagram
    ? deriveArchetype(numerology.lifePathNumber, enneagram.coreType, hd.type)
    : null;

  return {
    dosha, tcm, chakras, blockedChakras,
    sunSign: astrology.sunSign.name,
    archetype,
    kua: null,
    lifePathNumber: numerology.lifePathNumber,
  };
}

export function ModalityPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useSubject();
  const [manualData, setManualData] = useState<ModalityData | null>(null);

  const profileData = useMemo<ModalityData | null>(() => {
    if (!profile) return null;
    const lat = profile.birthLatitude ?? 48.15;
    const lon = profile.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    return computeModality(
      profile.birthDay,
      profile.birthMonth,
      profile.birthYear,
      profile.birthHour ?? 12,
      profile.birthMinute ?? 0,
      lat,
      lon,
      tz
    );
  }, [profile]);

  const data = manualData ?? profileData;

  // Kua — potrebuje pohlavie z profilu (hook musí byť pred early return)
  const kuaResult = useMemo<KuaResult | null>(() => {
    if (!profile) return null;
    const gender = (profile as { gender?: string }).gender === 'female' ? 'female' : 'male';
    return calculateKua(profile.birthYear, gender as 'male' | 'female');
  }, [profile]);

  // Tab routing (hooks musia byť pred early return)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = useCallback((tab: string) => {
    setSearchParams(prev => { prev.set('tab', tab); return prev; }, { replace: true });
  }, [setSearchParams]);

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => {
    const tz = lon !== undefined ? Math.round(lon / 15) : 1;
    setManualData(computeModality(day, month, year, hour ?? 12, minute ?? 0, lat ?? 48.15, lon ?? 17.11, tz));
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-white">{t('modality.title')}</h1>
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label={t('profile.birthDate')} />
        </GlassCard>
      </div>
    );
  }

  const primaryDosha = getDoshaInfo(data.dosha.primary, language);
  const secondaryDosha = data.dosha.secondary ? getDoshaInfo(data.dosha.secondary, language) : null;
  const primaryTCM = getTCMElement(data.tcm.primary, language);
  const secondaryTCM = getTCMElement(data.tcm.secondary, language);

  // Collect Bach flowers for blocked chakras
  const recommendedFlowers: BachFlower[] = [];
  for (const chakraNum of data.blockedChakras) {
    const flowers = BACH_FLOWERS_BY_CHAKRA[chakraNum];
    if (flowers) {
      recommendedFlowers.push(...flowers);
    }
  }

  // Kryštály, archetypy
  const sunSign = data.sunSign;
  const zodiacCrystals = getZodiacCrystals(sunSign, language);
  const blockedCrystals = getBlockedChakraCrystals(data.blockedChakras, language);
  const archetype = data.archetype;

  const TABS = [
    { id: 'overview', label: t('modality.tabOverview'), icon: '◉' },
    { id: 'ayurveda', label: t('modality.tabAyurveda'), icon: '🌿' },
    { id: 'bach', label: t('modality.tabBach'), icon: '✿' },
    { id: 'crystals', label: t('modality.tabCrystals'), icon: '💎' },
    { id: 'archetype', label: t('modality.tabArchetype'), icon: '🎭' },
    { id: 'fengshui', label: t('modality.tabFengShui'), icon: '🧭' },
  ];

  return (
    <div className="space-y-6">
      <div>
        {profile?.isClient && (
          <button
            onClick={() => navigate(`/clients/${profile.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            {t('clients.backToClient')} {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">{t('modality.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{profile.name}</strong>
            </span>
          )}
          {manualData && (
            <button
              onClick={() => setManualData(null)}
              className="text-xs px-3 py-1 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {t('common.newCalculation')}
            </button>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {t('modality.subtitle')}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      {activeTab === 'overview' && (<>
      {/* Ako sa to počíta — vysvetlenie pre laikov */}
      <GlassCard>
        <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Ako sa to počíta' : 'How it is calculated'}</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            {language === 'sk'
              ? <>Tieto modality nie sú tradičný dotazník — sú <strong className="text-white">derivované z tvojich existujúcich výsledkov</strong>. Každý systém sa pozerá na tie isté dáta z iného uhla:</>
              : <>These modalities are not a traditional questionnaire — they are <strong className="text-white">derived from your existing results</strong>. Each system looks at the same data from a different angle:</>
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 font-semibold mb-1">{language === 'sk' ? '🌿 Ayurvéda' : '🌿 Ayurveda'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? 'Dominantný astro element (Oheň→Pitta, Vzduch→Vata, Zem/Voda→Kapha) → dóša. HD typ → energetický štýl. ŽČ → temperament.'
                  : 'Dominant astro element (Fire→Pitta, Air→Vata, Earth/Water→Kapha) → dosha. HD type → energy style. LP → temperament.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold mb-1">{language === 'sk' ? '🌳 TCM 5 elementov' : '🌳 TCM 5 Elements'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? 'Astro element priamo mapuje na TCM element. ŽČ dodáva sekundárny element (1,9→Drevo, 3,7→Oheň, 2,5→Zem, 4,8→Kov, 6→Voda).'
                  : 'Astro element maps directly to TCM element. LP provides secondary element (1,9→Wood, 3,7→Fire, 2,5→Earth, 4,8→Metal, 6→Water).'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
              <p className="text-xs text-violet-700 font-semibold mb-1">{language === 'sk' ? '✿ Bachove kvety' : '✿ Bach Flowers'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? <>Blokované čakry (skóre &lt; 50) → mapujú sa na esencie riešiace danú emočnú tému (strach, vina, nedôvera...).</>
                  : <>Blocked chakras (score &lt; 50) → mapped to essences addressing the emotional theme (fear, guilt, distrust...).</>}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-xs text-purple-700 font-semibold mb-1">{language === 'sk' ? '💎 Kristaloterapia' : '💎 Crystal Therapy'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? 'Kryštály mapované na vaše slnečné znamenie + blokované čakry + ODV číslo dňa. Praktické rady nosenia a použitia.'
                  : 'Crystals mapped to your sun sign + blocked chakras + PDV day number. Practical tips for wearing and using them.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <p className="text-xs text-indigo-700 font-semibold mb-1">{language === 'sk' ? '🎭 Jungov archetyp' : '🎭 Jungian Archetype'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? '12 archetypov derivovaných z ŽČ + Enneagram + HD typ. Primárny (kto ste), sekundárny (skrytá stránka), tieňový (výzva).'
                  : '12 archetypes derived from LP + Enneagram + HD type. Primary (who you are), secondary (hidden side), shadow (challenge).'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <p className="text-xs text-orange-700 font-semibold mb-1">{language === 'sk' ? '🧭 Kua (Feng Shui)' : '🧭 Kua (Feng Shui)'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? 'Osobné číslo z roku + pohlavia → 4 priaznivé a 4 nepriaznivé svetové strany. Kam orientovať posteľ, stôl, vchod.'
                  : 'Personal number from year + gender → 4 favorable and 4 unfavorable cardinal directions. Where to orient bed, desk, entrance.'}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tvoje čítanie — personalizovaný sprievodca modalitami */}
      <GlassCard>
        <details open>
          <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
            <span className="font-medium text-white">{language === 'sk' ? 'Tvoje čítanie — čo s tým prakticky' : 'Your reading — practical takeaways'}</span>
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-400">
              {language === 'sk'
                ? 'Šesť systémov sa pozerá na tvoje telo, energiu, emócie a priestor z rôznych tradícií. Neukazujú „diagnózu" — ukazujú tvoju prirodzenosť, darčeky a čo potrebuješ pre rovnováhu.'
                : 'Six systems look at your body, energy, emotions and space from different traditions. They do not show a "diagnosis" — they show your nature, gifts, and what you need for balance.'}
            </p>

            {/* Ayurvéda — prakticky */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-semibold text-amber-300 mb-1">
                {language === 'sk' ? 'Tvoja dóša' : 'Your dosha'}: {primaryDosha.name} ({primaryDosha.element})
              </p>
              <p className="text-xs text-slate-300">
                {primaryDosha.mind} {language === 'sk' ? 'Typ tela' : 'Body type'}: {primaryDosha.bodyType.toLowerCase()}.
                {language === 'sk' ? 'Najsilnejšia sezóna' : 'Strongest season'}: {primaryDosha.season.toLowerCase()}.
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                {language === 'sk' ? 'Prakticky' : 'Practically'}: {primaryDosha.balanceTips[0]}
              </p>
            </div>

            {/* TCM — prakticky */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-300 mb-1">
                {language === 'sk' ? 'Tvoj TCM element' : 'Your TCM element'}: {primaryTCM.name} ({language === 'sk' ? 'orgán' : 'organ'}: {primaryTCM.organ})
              </p>
              <p className="text-xs text-slate-300">
                {language === 'sk' ? 'Emócia' : 'Emotion'}: {primaryTCM.emotion}. {language === 'sk' ? 'Cnosť' : 'Virtue'}: {primaryTCM.virtue}. {language === 'sk' ? 'Sezóna' : 'Season'}: {primaryTCM.season}.
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                {language === 'sk' ? 'Prakticky' : 'Practically'}: {primaryTCM.balanceTip}
              </p>
            </div>

            {/* Bach — prakticky */}
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-xs font-semibold text-violet-300 mb-1">
                {language === 'sk' ? 'Bachove kvety' : 'Bach Flowers'}: {data.blockedChakras.length === 0
                  ? (language === 'sk' ? 'žiadna blokáda — nie sú odporúčané esencie' : 'no blockage — no essences recommended')
                  : (language === 'sk' ? `${recommendedFlowers.length} esencií pre ${data.blockedChakras.length} blokované čakry` : `${recommendedFlowers.length} essences for ${data.blockedChakras.length} blocked chakras`)}
              </p>
              <p className="text-xs text-slate-300">
                {data.blockedChakras.length > 0
                  ? (language === 'sk'
                    ? `Blokované čakry (${data.blockedChakras.join(', ')}) indikujú emočné témy, pri ktorých ti môžu pomôcť kvetové esencie. Pozri detail nižšie.`
                    : `Blocked chakras (${data.blockedChakras.join(', ')}) indicate emotional themes where flower essences can help. See details below.`)
                  : (language === 'sk' ? 'Tvoj energetický systém je momentálne vyvážený — gratulujeme!' : 'Your energy system is currently balanced — congratulations!')}
              </p>
            </div>

            {/* Kryštály — prakticky */}
            {zodiacCrystals.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-300 mb-1">
                  {language === 'sk' ? 'Tvoje kryštály' : 'Your crystals'} ({sunSign})
                </p>
                <p className="text-xs text-slate-300">
                  {zodiacCrystals.map(c => c.name).join(', ')} — {language === 'sk' ? 'nos ich blízko tela pre rezonanciu s tvojím znamením.' : 'wear them close to your body for resonance with your sign.'}
                  {blockedCrystals.length > 0 && (language === 'sk' ? ` Pre blokované čakry: ${blockedCrystals.map(c => c.name).join(', ')}.` : ` For blocked chakras: ${blockedCrystals.map(c => c.name).join(', ')}.`)}
                </p>
              </div>
            )}

            {/* Archetyp — prakticky */}
            {archetype && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs font-semibold text-indigo-300 mb-1">
                  {language === 'sk' ? 'Tvoj archetyp' : 'Your archetype'}: {archetype.primary.name}
                </p>
                <p className="text-xs text-slate-300">
                  &ldquo;{archetype.primary.motto}&rdquo; — {archetype.primary.strategy}
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  {language === 'sk'
                    ? `Tieňový archetyp (${archetype.shadow.name}): dávaj pozor na ${archetype.shadow.shadow.toLowerCase()}.`
                    : `Shadow archetype (${archetype.shadow.name}): watch out for ${archetype.shadow.shadow.toLowerCase()}.`}
                </p>
              </div>
            )}

            {/* Kua — prakticky */}
            {kuaResult && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs font-semibold text-orange-300 mb-1">
                  Kua {kuaResult.kuaNumber} — {kuaResult.group === 'east' ? (language === 'sk' ? 'Východná' : 'East') : (language === 'sk' ? 'Západná' : 'West')} {language === 'sk' ? 'skupina' : 'group'}
                </p>
                <p className="text-xs text-slate-300">
                  {language === 'sk'
                    ? `Spálňa: orientuj hlavu na ${kuaResult.bestForSleep}. Pracovný stôl: smerom na ${kuaResult.bestForWork}. Vstup: ideálne z ${kuaResult.bestForEntrance}.`
                    : `Bedroom: orient your head towards ${kuaResult.bestForSleep}. Desk: face ${kuaResult.bestForWork}. Entrance: ideally from ${kuaResult.bestForEntrance}.`}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
              <p className="text-xs text-slate-300">
                {language === 'sk'
                  ? 'Začni od dóše — pochopenie svojho typu ti pomôže s jedlom, pohybom a denným rytmom. TCM element ti ukáže emočnú tému. Kryštály nos pri sebe podľa toho, čo práve potrebuješ. Archetyp ti ukáže tvoj životný príbeh. Kua ti povie kam orientovať nábytok.'
                  : 'Start with the dosha — understanding your type helps with food, movement, and daily rhythm. The TCM element shows your emotional theme. Wear crystals based on what you currently need. The archetype reveals your life story. Kua tells you where to orient your furniture.'}
              </p>
            </div>
          </div>
        </details>
      </GlassCard>
      </>)}

      {activeTab === 'ayurveda' && (<>
      {/* Ayurvéda */}
      <GlassCard delay={0.1}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">☘</span> {language === 'sk' ? 'Ayurvéda — Dóša profil' : 'Ayurveda — Dosha Profile'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary dosha */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DoshaBadge dosha={data.dosha.primary} size="lg" />
              <div>
                <p className="text-sm text-slate-400">{language === 'sk' ? 'Primárna dóša' : 'Primary dosha'}</p>
                <p className="text-lg font-bold text-white">{primaryDosha.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">{language === 'sk' ? 'Element' : 'Element'}:</span> {primaryDosha.element}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">{language === 'sk' ? 'Typ tela' : 'Body type'}:</span> {primaryDosha.bodyType}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">{language === 'sk' ? 'Myseľ' : 'Mind'}:</span> {primaryDosha.mind}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">{language === 'sk' ? 'Najsilnejšia sezóna' : 'Strongest season'}:</span> {primaryDosha.season}
            </p>

            {/* Balance bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{language === 'sk' ? 'Dominancia' : 'Dominance'}</span>
                <span>{data.dosha.balance}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${data.dosha.balance}%` }}
                />
              </div>
            </div>
          </div>

          {/* Secondary dosha */}
          <div className="space-y-3">
            {secondaryDosha ? (
              <>
                <div className="flex items-center gap-3">
                  <DoshaBadge dosha={data.dosha.secondary!} size="lg" />
                  <div>
                    <p className="text-sm text-slate-400">{language === 'sk' ? 'Sekundárna dóša' : 'Secondary dosha'}</p>
                    <p className="text-lg font-bold text-white">{secondaryDosha.name}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">{language === 'sk' ? 'Element' : 'Element'}:</span> {secondaryDosha.element}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">{language === 'sk' ? 'Typ tela' : 'Body type'}:</span> {secondaryDosha.bodyType}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {language === 'sk' ? `Jednodóšový typ — jasná dominancia ${primaryDosha.name}.` : `Single-dosha type — clear dominance of ${primaryDosha.name}.`}
              </p>
            )}
          </div>
        </div>

        {/* Strengths + tips */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">{language === 'sk' ? 'Silné stránky' : 'Strengths'}</h3>
            <ul className="space-y-1">
              {primaryDosha.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">{language === 'sk' ? 'Znaky nerovnováhy' : 'Imbalance signs'}</h3>
            <ul className="space-y-1">
              {primaryDosha.imbalanceSigns.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">{language === 'sk' ? 'Tipy na balancovanie' : 'Balancing tips'}</h3>
          <ul className="space-y-1">
            {primaryDosha.balanceTips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* TCM */}
      <GlassCard delay={0.2}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">☯</span> {language === 'sk' ? 'Tradičná čínska medicína — 5 elementov' : 'Traditional Chinese Medicine — 5 Elements'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.primary} />
              <div>
                <p className="text-sm text-slate-400">{language === 'sk' ? 'Primárny element' : 'Primary element'}</p>
                <p className="text-lg font-bold text-white">{primaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Sezóna' : 'Season'}:</span> {primaryTCM.season}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'v tejto sezóne si najsilnejší, ale aj najzraniteľnejší' : 'in this season you are strongest, but also most vulnerable'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Orgán' : 'Organ'}:</span> {primaryTCM.organ}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'dávaj naň pozor, reaguje na tvoje emócie' : 'take care of it, it reacts to your emotions'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Emócia' : 'Emotion'}:</span> {primaryTCM.emotion}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'keď je nerovnováha, táto emócia sa zosilní' : 'when out of balance, this emotion intensifies'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Cnosť' : 'Virtue'}:</span> {primaryTCM.virtue}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'toto lieči tvoj element, keď je oslabený' : 'this heals your element when weakened'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Farba' : 'Color'}:</span> {primaryTCM.color}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'obliekaj si ju, obklopuj sa ňou pre podporu' : 'wear it, surround yourself with it for support'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Chuť' : 'Taste'}:</span> {primaryTCM.taste}
                <span className="text-[11px] text-slate-500 ml-2">— {language === 'sk' ? 'detail jedál nižšie v sekcii Potraviny' : 'food details below in the Foods section'}</span>
              </p>
            </div>
          </div>

          {/* Secondary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.secondary} />
              <div>
                <p className="text-sm text-slate-400">{language === 'sk' ? 'Sekundárny element' : 'Secondary element'}</p>
                <p className="text-lg font-bold text-white">{secondaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Sezóna' : 'Season'}:</span> {secondaryTCM.season}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Orgán' : 'Organ'}:</span> {secondaryTCM.organ}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">{language === 'sk' ? 'Emócia' : 'Emotion'}:</span> {secondaryTCM.emotion}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">{language === 'sk' ? 'Znaky sily' : 'Signs of strength'}</h3>
            <p className="text-sm text-slate-300">{primaryTCM.strengthSign}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">{language === 'sk' ? 'Znaky slabosti' : 'Signs of weakness'}</h3>
            <p className="text-sm text-slate-300">{primaryTCM.weaknessSign}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">{language === 'sk' ? 'Tip na harmonizáciu' : 'Harmonization tip'}</h3>
          <p className="text-sm text-slate-300">{primaryTCM.balanceTip}</p>
        </div>

        {/* Jedálniček */}
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <h3 className="text-xs text-green-400 uppercase mb-2">{language === 'sk' ? 'Potraviny, ktoré ťa živia' : 'Foods that nourish you'}</h3>
            <p className="text-xs text-slate-300">{primaryTCM.foods.nourishing}</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <h3 className="text-xs text-red-400 uppercase mb-2">{language === 'sk' ? 'Potraviny, ktorým sa vyhýbaj' : 'Foods to avoid'}</h3>
            <p className="text-xs text-slate-300">{primaryTCM.foods.weakening}</p>
          </div>
        </div>

        {/* Meridiánové hodiny */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <h3 className="text-xs text-cyan-400 uppercase mb-2">{language === 'sk' ? 'Orgánové hodiny (meridiány)' : 'Organ hours (meridians)'}</h3>
          <p className="text-xs text-slate-300">{primaryTCM.meridianHours}</p>
          <p className="text-xs text-slate-400 mt-1 italic">{primaryTCM.meridianNote}</p>
        </div>

        {/* Cyklus 5 elementov */}
        <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h3 className="text-xs text-purple-400 uppercase mb-2">{language === 'sk' ? 'Tvoje miesto v cykle 5 elementov' : 'Your place in the 5 elements cycle'}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <p><span className="text-emerald-300">{language === 'sk' ? 'Živí ťa' : 'Nourishes you'}:</span> {primaryTCM.generatedBy} → {primaryTCM.name}</p>
            <p><span className="text-amber-300">{language === 'sk' ? 'Ty živíš' : 'You nourish'}:</span> {primaryTCM.name} → {primaryTCM.generates}</p>
            <p><span className="text-rose-300">{language === 'sk' ? 'Kontroluje ťa' : 'Controls you'}:</span> {primaryTCM.controlledBy}</p>
            <p><span className="text-indigo-300">{language === 'sk' ? 'Ty kontroluješ' : 'You control'}:</span> {primaryTCM.controls}</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 italic">
            {language === 'sk'
              ? 'Generujúci cyklus: Drevo → Oheň → Zem → Kov → Voda → Drevo. Kontrolný cyklus drží rovnováhu — bez neho by jeden element dominoval.'
              : 'Generating cycle: Wood → Fire → Earth → Metal → Water → Wood. The control cycle maintains balance — without it one element would dominate.'}
          </p>
        </div>

        {/* Sezónne odporúčanie */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <h3 className="text-xs text-amber-400 uppercase mb-2">{language === 'sk' ? 'Sezónne odporúčanie' : 'Seasonal recommendation'} ({primaryTCM.season})</h3>
          <p className="text-xs text-slate-300">{primaryTCM.seasonalAdvice}</p>
        </div>

        {/* Cross-system prepojenie */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <h3 className="text-xs text-indigo-400 uppercase mb-2">{language === 'sk' ? 'Prepojenie s čakrami' : 'Chakra connection'}</h3>
          <p className="text-xs text-slate-300">
            {language === 'sk'
              ? <>Element {primaryTCM.name} rezonuje s <strong>{primaryTCM.chakra}. čakrou</strong>. Keď pracuješ na vyvážení tohto elementu (jedlo, dych, emócie), automaticky podporuješ aj túto čakru.</>
              : <>The {primaryTCM.name} element resonates with the <strong>{primaryTCM.chakra}th chakra</strong>. When you work on balancing this element (food, breath, emotions), you automatically support this chakra as well.</>}
          </p>
        </div>
      </GlassCard>

      </>)}

      {activeTab === 'bach' && (<>
      {/* Bach Flowers */}
      <GlassCard delay={0.3}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">✿</span> {language === 'sk' ? 'Bachove kvetové esencie' : 'Bach Flower Essences'}
        </h2>

        {data.blockedChakras.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            {language === 'sk' ? 'Žiadna čakra nie je blokovaná — gratulujeme k energetickej rovnováhe!' : 'No chakra is blocked — congratulations on your energetic balance!'}
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              {language === 'sk'
                ? <>Odporúčané esencie pre blokované čakry ({data.blockedChakras.map(n => `${n}.`).join(' ')}):</>
                : <>Recommended essences for blocked chakras ({data.blockedChakras.map(n => `${n}.`).join(' ')}):</>}
            </p>
            <div className="space-y-4">
              {data.blockedChakras.map(chakraNum => {
                const flowers = BACH_FLOWERS_BY_CHAKRA[chakraNum];
                if (!flowers) return null;
                const chakraState = data.chakras.find(c => c.chakra.number === chakraNum);
                return (
                  <div key={chakraNum} className="border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-rose-400 mb-3">
                      {chakraState?.chakra.name} ({language === 'sk' ? 'skóre' : 'score'}: {chakraState?.score})
                    </h3>
                    <div className="grid gap-3">
                      {flowers.map(flower => (
                        <FlowerCard key={flower.name} flower={flower} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="text-xs text-slate-500 mt-4 italic">
          {language === 'sk'
            ? 'Bachove kvetové esencie sú jemná energetická podpora. Nie sú náhradou za odbornú lekársku starostlivosť.'
            : 'Bach flower essences are a gentle energetic support. They are not a substitute for professional medical care.'}
        </p>
      </GlassCard>

      </>)}

      {activeTab === 'crystals' && (<>
      {/* === KRISTALOTERAPIA === */}
      <GlassCard>
        <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">💎</span> {language === 'sk' ? 'Kristaloterapia' : 'Crystal Therapy'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'sk'
            ? `Ako ${sunSign} s životným číslom ${data.lifePathNumber} máte prirodzenú rezonanciu s určitými minerálmi.`
            : `As a ${sunSign} with life path number ${data.lifePathNumber}, you have a natural resonance with certain minerals.`}
          {data.blockedChakras.length > 0
            ? (language === 'sk'
              ? ` Vaše blokované čakry (${data.blockedChakras.join(', ')}) potrebujú podporu — kryštály nižšie sú vybrané presne pre vás.`
              : ` Your blocked chakras (${data.blockedChakras.join(', ')}) need support — the crystals below are selected specifically for you.`)
            : (language === 'sk'
              ? ' Vaše čakry sú vyvážené — kryštály znamenia posilnia to, čo už funguje.'
              : ' Your chakras are balanced — zodiac crystals will strengthen what already works.')}
        </p>

        {zodiacCrystals.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{language === 'sk' ? `Kryštály pre ${sunSign}` : `Crystals for ${sunSign}`}</h3>
            <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Tieto kamene rezonujú s energiou vášho slnečného znamenia. Nos ich blízko tela alebo ich používajte pri meditácii.' : 'These stones resonate with your sun sign energy. Wear them close to your body or use them during meditation.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zodiacCrystals.map(c => (
                <div key={c.name} className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: c.color, borderColor: c.color + '60' }} />
                    <span className="text-sm font-medium text-violet-300">{c.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{c.properties}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">💡 {c.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {blockedCrystals.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{language === 'sk' ? 'Liečivé kryštály pre vaše blokované čakry' : 'Healing crystals for your blocked chakras'}</h3>
            <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Tieto kamene pomáhajú uvoľniť energetické bloky. Prikladajte na zodpovedajúcu čakru počas meditácie (5-15 min).' : 'These stones help release energy blocks. Place them on the corresponding chakra during meditation (5-15 min).'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {blockedCrystals.map(c => (
                <div key={c.name + c.chakra} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: c.color, borderColor: c.color + '60' }} />
                    <span className="text-sm font-medium text-rose-300">{c.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400">{language === 'sk' ? 'čakra' : 'chakra'} {c.chakra}</span>
                  </div>
                  <p className="text-xs text-slate-400">{c.properties}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">💡 {c.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 mt-4">
          <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Ako pracovať s kryštálmi' : 'How to work with crystals'}</p>
          <p className="text-xs text-slate-400">
            {language === 'sk'
              ? 'Pred prvým použitím kameň očistite (prúdiacou vodou, slnkom, alebo selenitom). Nabite ho úmyslom — držte v rukách a vizualizujte čo chcete dosiahnuť. Nos pri sebe, na nočnom stolíku, alebo prikladajte na čakru. Kryštál dňa (podľa ODV) sa mení — reaguje na dennú energiu.'
              : 'Before first use, cleanse the stone (running water, sunlight, or selenite). Charge it with intention — hold it in your hands and visualize what you want to achieve. Carry it with you, on your nightstand, or place it on the chakra. The crystal of the day (based on PDV) changes — it responds to daily energy.'}
          </p>
        </div>
      </GlassCard>

      </>)}

      {activeTab === 'archetype' && (<>
      {/* === JUNGOVE ARCHETYPY === */}
      {!archetype && (
        <GlassCard>
          <p className="text-sm text-slate-400">{language === 'sk' ? 'Archetyp sa nepodarilo odvodiť — pre výpočet je potrebný kompletný profil s dátumom narodenia.' : 'Could not derive archetype — a complete profile with birth date is required for calculation.'}</p>
        </GlassCard>
      )}
      {archetype && (
        <GlassCard>
          <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="text-2xl">🎭</span> {language === 'sk' ? 'Jungov archetyp' : 'Jungian Archetype'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'sk'
              ? <>Váš životný príbeh sa odvíja cez archetyp <strong className="text-indigo-300">{archetype.primary.name}</strong>. S ŽČ {data.lifePathNumber} a znamením {sunSign} prirodzene hráte túto rolu vo svete — nie je to maska, je to vaša podstata.</>
              : <>Your life story unfolds through the <strong className="text-indigo-300">{archetype.primary.name}</strong> archetype. With LP {data.lifePathNumber} and {sunSign} sign, you naturally play this role in the world — it is not a mask, it is your essence.</>}
          </p>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <p className="text-xs text-indigo-400 uppercase mb-1">{language === 'sk' ? 'Primárny archetyp — kto ste vo svete' : 'Primary archetype — who you are in the world'}</p>
            <p className="text-lg font-bold text-indigo-300">{archetype.primary.name}</p>
            <p className="text-sm text-slate-400 italic mb-2">„{archetype.primary.motto}"</p>
            <p className="text-xs text-slate-400 mb-1"><strong className="text-slate-300">{language === 'sk' ? 'Základná túžba' : 'Core desire'}:</strong> {archetype.primary.coreDesire}</p>
            <p className="text-xs text-slate-400 mb-1"><strong className="text-slate-300">{language === 'sk' ? 'Dar' : 'Gift'}:</strong> {archetype.primary.gift}</p>
            <p className="text-xs text-slate-400"><strong className="text-slate-300">{language === 'sk' ? 'Stratégia na každý deň' : 'Daily strategy'}:</strong> {archetype.primary.strategy}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] text-purple-400 uppercase mb-1">{language === 'sk' ? 'Sekundárny — skrytá stránka' : 'Secondary — hidden side'}</p>
              <p className="text-sm font-medium text-purple-300">{archetype.secondary.name}</p>
              <p className="text-[10px] text-slate-400 italic mb-1">„{archetype.secondary.motto}"</p>
              <p className="text-xs text-slate-400">{archetype.secondary.gift}</p>
              <p className="text-xs text-slate-500 mt-1">{language === 'sk' ? 'Toto je energia, ku ktorej sa obraciate v kľúčových momentoch — keď primárny archetyp nestačí.' : 'This is the energy you turn to in key moments — when the primary archetype is not enough.'}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-[10px] text-rose-400 uppercase mb-1">{language === 'sk' ? 'Tieňový — výzva k integrácii' : 'Shadow — challenge to integrate'}</p>
              <p className="text-sm font-medium text-rose-300">{archetype.shadow.name}</p>
              <p className="text-[10px] text-slate-400 italic mb-1">„{archetype.shadow.motto}"</p>
              <p className="text-xs text-slate-400">{archetype.shadow.shadow}</p>
              <p className="text-xs text-slate-500 mt-1">{language === 'sk' ? 'Keď sa cítite v nerovnováhe, pravdepodobne žijete tento tieň. Rozpoznajte ho bez súdenia.' : 'When you feel out of balance, you are probably living this shadow. Recognize it without judgment.'}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
            <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Ako pracovať s archetypom' : 'How to work with the archetype'}</p>
            <p className="text-xs text-slate-400">
              {language === 'sk'
                ? 'Primárny archetyp nie je cieľ — je to štartovací bod. Cieľom je integrovať všetky tri: žiť dar primárneho, rozvíjať múdrosť sekundárneho a s láskou prijať tieňového. Všímajte si, kedy počas dňa „hráte" ktorú rolu — a či je to vedomá voľba.'
                : 'The primary archetype is not the goal — it is the starting point. The aim is to integrate all three: live the gift of the primary, develop the wisdom of the secondary, and lovingly accept the shadow. Notice when during the day you "play" which role — and whether it is a conscious choice.'}
            </p>
          </div>
        </GlassCard>
      )}

      </>)}

      {activeTab === 'fengshui' && (<>
      {/* === KUA ČÍSLO (FENG SHUI) === */}
      {kuaResult && (
        <GlassCard>
          <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="text-2xl">🧭</span> {language === 'sk' ? 'Kua číslo (Feng Shui)' : 'Kua Number (Feng Shui)'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'sk'
              ? <>Vaše Kua číslo je <strong className="text-amber-300">{kuaResult.kuaNumber}</strong> ({kuaResult.group === 'east' ? 'Východná' : 'Západná'} skupina, element {kuaResult.element}). Toto číslo určuje, ktoré svetové strany vám prinášajú energiu a ktoré ju odoberajú — ovplyvňuje kvalitu spánku, produktivitu pri práci a tok energie vo vašom domove.</>
              : <>Your Kua number is <strong className="text-amber-300">{kuaResult.kuaNumber}</strong> ({kuaResult.group === 'east' ? 'East' : 'West'} group, element {kuaResult.element}). This number determines which cardinal directions bring you energy and which drain it — affecting sleep quality, work productivity, and energy flow in your home.</>}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
              {kuaResult.kuaNumber}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{kuaResult.group === 'east' ? (language === 'sk' ? 'Východná' : 'East') : (language === 'sk' ? 'Západná' : 'West')} {language === 'sk' ? 'skupina' : 'group'}</p>
              <p className="text-xs text-slate-500">{language === 'sk' ? 'Element' : 'Element'}: {kuaResult.element} | {language === 'sk' ? 'Rok' : 'Year'}: {profile?.birthYear}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-slate-700 mb-2">{language === 'sk' ? 'Praktické odporúčania pre váš priestor' : 'Practical recommendations for your space'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 uppercase">{language === 'sk' ? '🛏 Spálňa / Hlava' : '🛏 Bedroom / Head'}</p>
              <p className="text-sm font-bold text-emerald-300">{kuaResult.bestForSleep}</p>
              <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? `Orientujte hlavu postele smerom na ${kuaResult.bestForSleep} pre hlbší a regeneratívnejší spánok.` : `Orient your bed headboard towards ${kuaResult.bestForSleep} for deeper and more restorative sleep.`}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] text-blue-400 uppercase">{language === 'sk' ? '💻 Pracovný stôl' : '💻 Work Desk'}</p>
              <p className="text-sm font-bold text-blue-300">{kuaResult.bestForWork}</p>
              <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? `Seďte čelom na ${kuaResult.bestForWork} pri práci vyžadujúcej sústredenie a kreativitu.` : `Sit facing ${kuaResult.bestForWork} when working on tasks requiring focus and creativity.`}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] text-amber-400 uppercase">{language === 'sk' ? '🚪 Hlavný vstup' : '🚪 Main Entrance'}</p>
              <p className="text-sm font-bold text-amber-300">{kuaResult.bestForEntrance}</p>
              <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? `Ak máte voľbu, vstupujte do domu z ${kuaResult.bestForEntrance} — prináša pozitívnu Chi.` : `If you have the choice, enter your home from ${kuaResult.bestForEntrance} — it brings positive Chi.`}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 uppercase mb-2">{language === 'sk' ? '✓ Priaznivé smery' : '✓ Favorable directions'}</p>
              {kuaResult.favorable.map(d => (
                <div key={d.direction} className="mb-1.5">
                  <p className="text-xs text-slate-300 font-medium">✓ {d.direction}</p>
                  <p className="text-[10px] text-slate-500">{d.meaning} — {d.use}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-[10px] text-rose-400 uppercase mb-2">{language === 'sk' ? '✗ Nepriaznivé smery' : '✗ Unfavorable directions'}</p>
              {kuaResult.unfavorable.map(d => (
                <div key={d.direction} className="mb-1.5">
                  <p className="text-xs text-slate-300 font-medium">✗ {d.direction}</p>
                  <p className="text-[10px] text-slate-500">{d.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
            <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
            <p className="text-xs text-slate-400">
              {language === 'sk'
                ? 'Ak nemôžete zmeniť orientáciu postele alebo stola, umiestnite do priaznivého smeru aspoň symbolický prvok — kryštál, rastlinu, alebo zrkadlo. Najdôležitejší je smer spánku (hlava) — tam trávite 8h denne.'
                : 'If you cannot change the orientation of your bed or desk, place at least a symbolic element in the favorable direction — a crystal, plant, or mirror. The sleep direction (head) is most important — you spend 8 hours a day there.'}
            </p>
          </div>
        </GlassCard>
      )}

      </>)}

    </div>
  );
}

// ─── Helper components ─────────────────────────────────────────────

function DoshaBadge({ dosha, size = 'md' }: { dosha: 'vata' | 'pitta' | 'kapha'; size?: 'md' | 'lg' }) {
  const colors = {
    vata: 'from-sky-400 to-blue-600',
    pitta: 'from-orange-400 to-red-600',
    kapha: 'from-emerald-400 to-green-600',
  };
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-8 h-8 text-sm';
  const icons = { vata: '💨', pitta: '🔥', kapha: '🌍' };

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colors[dosha]} flex items-center justify-center`}>
      {icons[dosha]}
    </div>
  );
}

function TCMBadge({ element }: { element: string }) {
  const config: Record<string, { icon: string; gradient: string }> = {
    drevo: { icon: '🌳', gradient: 'from-green-400 to-emerald-600' },
    ohen: { icon: '🔥', gradient: 'from-red-400 to-orange-600' },
    zem: { icon: '⛰', gradient: 'from-yellow-400 to-amber-600' },
    kov: { icon: '⚒', gradient: 'from-slate-300 to-slate-500' },
    voda: { icon: '💧', gradient: 'from-blue-400 to-indigo-600' },
  };
  const c = config[element] ?? { icon: '?', gradient: 'from-slate-400 to-slate-600' };

  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-lg`}>
      {c.icon}
    </div>
  );
}

function FlowerCard({ flower }: { flower: BachFlower }) {
  const { language } = useTranslation();
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{flower.name}</span>
        <span className="text-xs text-slate-500 italic">{flower.latinName}</span>
      </div>
      <p className="text-xs text-rose-300">
        <span className="text-slate-500">{language === 'sk' ? 'Stav' : 'State'}:</span> {flower.emotionalState}
      </p>
      <p className="text-xs text-emerald-300">
        <span className="text-slate-500">{language === 'sk' ? 'Pomáha' : 'Helps'}:</span> {flower.helps}
      </p>
      <p className="text-xs text-indigo-300 italic">
        &ldquo;{flower.affirmation}&rdquo;
      </p>
    </div>
  );
}
