import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { getTimezoneFromCoords } from '../data/cities';
import { evaluateChakras } from '../engine/chakraEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { DOSHA_INFO } from '../data/ayurveda';
import { TCM_ELEMENTS } from '../data/tcm';
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
  const activeTab = searchParams.get('tab') || 'ayurveda';
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
        <h1 className="font-serif text-3xl font-bold text-white">Doplnkové systémy</h1>
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label="Dátum narodenia (pre presnejší výpočet aj čas a miesto)" />
        </GlassCard>
      </div>
    );
  }

  const primaryDosha = DOSHA_INFO[data.dosha.primary];
  const secondaryDosha = data.dosha.secondary ? DOSHA_INFO[data.dosha.secondary] : null;
  const primaryTCM = TCM_ELEMENTS[data.tcm.primary];
  const secondaryTCM = TCM_ELEMENTS[data.tcm.secondary];

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
  const zodiacCrystals = getZodiacCrystals(sunSign);
  const blockedCrystals = getBlockedChakraCrystals(data.blockedChakras);
  const archetype = data.archetype;

  const TABS = [
    { id: 'ayurveda', label: 'Ayurvéda & TCM', icon: '🌿' },
    { id: 'bach', label: 'Bachove kvety', icon: '✿' },
    { id: 'crystals', label: 'Kryštály', icon: '💎' },
    { id: 'archetype', label: 'Archetyp', icon: '🎭' },
    { id: 'fengshui', label: 'Feng Shui', icon: '🧭' },
  ];

  return (
    <div className="space-y-6">
      <div>
        {profile?.isClient && (
          <button
            onClick={() => navigate(`/clients/${profile.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            ← Späť na klienta {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">Doplnkové systémy</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              Klient: <strong>{profile.name}</strong>
            </span>
          )}
          {manualData && (
            <button
              onClick={() => setManualData(null)}
              className="text-xs px-3 py-1 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Nový výpočet
            </button>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          Ayurvéda, TCM, Bachove kvety, Kristaloterapia, Jungov archetyp, Feng Shui
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
      {activeTab === 'ayurveda' && (<>
      {/* Ako sa to počíta — vysvetlenie pre laikov */}
      <GlassCard>
        <h3 className="font-medium text-white mb-3">Ako sa to počíta</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            Tieto modality nie sú tradičný dotazník — sú <strong className="text-white">derivované z tvojich existujúcich výsledkov</strong>. Každý systém sa pozerá na tie isté dáta z iného uhla:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 font-semibold mb-1">🌿 Ayurvéda</p>
              <p className="text-xs text-slate-700">
                Dominantný astro element (Oheň→Pitta, Vzduch→Vata, Zem/Voda→Kapha) → dóša.
                HD typ → energetický štýl. ŽČ → temperament.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold mb-1">🌳 TCM 5 elementov</p>
              <p className="text-xs text-slate-700">
                Astro element priamo mapuje na TCM element.
                ŽČ dodáva sekundárny element (1,9→Drevo, 3,7→Oheň, 2,5→Zem, 4,8→Kov, 6→Voda).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
              <p className="text-xs text-violet-700 font-semibold mb-1">✿ Bachove kvety</p>
              <p className="text-xs text-slate-700">
                Blokované čakry (skóre &lt; 50) → mapujú sa na esencie
                riešiace danú emočnú tému (strach, vina, nedôvera...).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-xs text-purple-700 font-semibold mb-1">💎 Kristaloterapia</p>
              <p className="text-xs text-slate-700">
                Kryštály mapované na vaše slnečné znamenie + blokované čakry + ODV číslo dňa.
                Praktické rady nosenia a použitia.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <p className="text-xs text-indigo-700 font-semibold mb-1">🎭 Jungov archetyp</p>
              <p className="text-xs text-slate-700">
                12 archetypov derivovaných z ŽČ + Enneagram + HD typ.
                Primárny (kto ste), sekundárny (skrytá stránka), tieňový (výzva).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <p className="text-xs text-orange-700 font-semibold mb-1">🧭 Kua (Feng Shui)</p>
              <p className="text-xs text-slate-700">
                Osobné číslo z roku + pohlavia → 4 priaznivé a 4 nepriaznivé svetové strany.
                Kam orientovať posteľ, stôl, vchod.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tvoje čítanie — personalizovaný sprievodca modalitami */}
      <GlassCard>
        <details open>
          <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
            <span className="font-medium text-white">Tvoje čítanie — čo s tým prakticky</span>
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-400">
              Šesť systémov sa pozerá na tvoje telo, energiu, emócie a priestor z rôznych tradícií.
              Neukazujú „diagnózu" — ukazujú tvoju prirodzenosť, darčeky a čo potrebuješ pre rovnováhu.
            </p>

            {/* Ayurvéda — prakticky */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-semibold text-amber-300 mb-1">
                Tvoja dóša: {primaryDosha.name} ({primaryDosha.element})
              </p>
              <p className="text-xs text-slate-300">
                {primaryDosha.mind} Typ tela: {primaryDosha.bodyType.toLowerCase()}.
                Najsilnejšia sezóna: {primaryDosha.season.toLowerCase()}.
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                Prakticky: {primaryDosha.balanceTips[0]}
              </p>
            </div>

            {/* TCM — prakticky */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-300 mb-1">
                Tvoj TCM element: {primaryTCM.name} (orgán: {primaryTCM.organ})
              </p>
              <p className="text-xs text-slate-300">
                Emócia: {primaryTCM.emotion}. Cnosť: {primaryTCM.virtue}. Sezóna: {primaryTCM.season}.
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                Prakticky: {primaryTCM.balanceTip}
              </p>
            </div>

            {/* Bach — prakticky */}
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-xs font-semibold text-violet-300 mb-1">
                Bachove kvety: {data.blockedChakras.length === 0
                  ? 'žiadna blokáda — nie sú odporúčané esencie'
                  : `${recommendedFlowers.length} esencií pre ${data.blockedChakras.length} blokované čakry`}
              </p>
              <p className="text-xs text-slate-300">
                {data.blockedChakras.length > 0
                  ? `Blokované čakry (${data.blockedChakras.join(', ')}) indikujú emočné témy, pri ktorých ti môžu pomôcť kvetové esencie. Pozri detail nižšie.`
                  : 'Tvoj energetický systém je momentálne vyvážený — gratulujeme!'}
              </p>
            </div>

            {/* Kryštály — prakticky */}
            {zodiacCrystals.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-300 mb-1">
                  Tvoje kryštály ({sunSign})
                </p>
                <p className="text-xs text-slate-300">
                  {zodiacCrystals.map(c => c.name).join(', ')} — nos ich blízko tela pre rezonanciu s tvojím znamením.
                  {blockedCrystals.length > 0 && ` Pre blokované čakry: ${blockedCrystals.map(c => c.name).join(', ')}.`}
                </p>
              </div>
            )}

            {/* Archetyp — prakticky */}
            {archetype && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs font-semibold text-indigo-300 mb-1">
                  Tvoj archetyp: {archetype.primary.name}
                </p>
                <p className="text-xs text-slate-300">
                  „{archetype.primary.motto}" — {archetype.primary.strategy}
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Tieňový archetyp ({archetype.shadow.name}): dávaj pozor na {archetype.shadow.shadow.toLowerCase()}.
                </p>
              </div>
            )}

            {/* Kua — prakticky */}
            {kuaResult && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs font-semibold text-orange-300 mb-1">
                  Kua {kuaResult.kuaNumber} — {kuaResult.group === 'east' ? 'Východná' : 'Západná'} skupina
                </p>
                <p className="text-xs text-slate-300">
                  Spálňa: orientuj hlavu na {kuaResult.bestForSleep}. Pracovný stôl: smerom na {kuaResult.bestForWork}. Vstup: ideálne z {kuaResult.bestForEntrance}.
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Praktický tip</p>
              <p className="text-xs text-slate-300">
                Začni od dóše — pochopenie svojho typu ti pomôže s jedlom, pohybom a denným rytmom.
                TCM element ti ukáže emočnú tému. Kryštály nos pri sebe podľa toho, čo práve potrebuješ.
                Archetyp ti ukáže tvoj životný príbeh. Kua ti povie kam orientovať nábytok.
              </p>
            </div>
          </div>
        </details>
      </GlassCard>

      {/* Ayurvéda */}
      <GlassCard delay={0.1}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">☘</span> Ayurvéda — Dóša profil
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary dosha */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DoshaBadge dosha={data.dosha.primary} size="lg" />
              <div>
                <p className="text-sm text-slate-400">Primárna dóša</p>
                <p className="text-lg font-bold text-white">{primaryDosha.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Element:</span> {primaryDosha.element}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Typ tela:</span> {primaryDosha.bodyType}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Myseľ:</span> {primaryDosha.mind}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Najsilnejšia sezóna:</span> {primaryDosha.season}
            </p>

            {/* Balance bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Dominancia</span>
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
                    <p className="text-sm text-slate-400">Sekundárna dóša</p>
                    <p className="text-lg font-bold text-white">{secondaryDosha.name}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Element:</span> {secondaryDosha.element}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Typ tela:</span> {secondaryDosha.bodyType}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Jednodóšový typ — jasná dominancia {primaryDosha.name}.
              </p>
            )}
          </div>
        </div>

        {/* Strengths + tips */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Silné stránky</h3>
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
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Znaky nerovnováhy</h3>
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
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">Tipy na balancovanie</h3>
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
          <span className="text-2xl">☯</span> Tradičná čínska medicína — 5 elementov
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.primary} />
              <div>
                <p className="text-sm text-slate-400">Primárny element</p>
                <p className="text-lg font-bold text-white">{primaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">Sezóna:</span> {primaryTCM.season}
                <span className="text-[11px] text-slate-500 ml-2">— v tejto sezóne si najsilnejší, ale aj najzraniteľnejší</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Orgán:</span> {primaryTCM.organ}
                <span className="text-[11px] text-slate-500 ml-2">— dávaj naň pozor, reaguje na tvoje emócie</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Emócia:</span> {primaryTCM.emotion}
                <span className="text-[11px] text-slate-500 ml-2">— keď je nerovnováha, táto emócia sa zosilní</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Cnosť:</span> {primaryTCM.virtue}
                <span className="text-[11px] text-slate-500 ml-2">— toto lieči tvoj element, keď je oslabený</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Farba:</span> {primaryTCM.color}
                <span className="text-[11px] text-slate-500 ml-2">— obliekaj si ju, obklopuj sa ňou pre podporu</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Chuť:</span> {primaryTCM.taste}
                <span className="text-[11px] text-slate-500 ml-2">— detail jedál nižšie v sekcii Potraviny</span>
              </p>
            </div>
          </div>

          {/* Secondary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.secondary} />
              <div>
                <p className="text-sm text-slate-400">Sekundárny element</p>
                <p className="text-lg font-bold text-white">{secondaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">Sezóna:</span> {secondaryTCM.season}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Orgán:</span> {secondaryTCM.organ}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Emócia:</span> {secondaryTCM.emotion}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Znaky sily</h3>
            <p className="text-sm text-slate-300">{primaryTCM.strengthSign}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Znaky slabosti</h3>
            <p className="text-sm text-slate-300">{primaryTCM.weaknessSign}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">Tip na harmonizáciu</h3>
          <p className="text-sm text-slate-300">{primaryTCM.balanceTip}</p>
        </div>

        {/* Jedálniček */}
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <h3 className="text-xs text-green-400 uppercase mb-2">Potraviny, ktoré ťa živia</h3>
            <p className="text-xs text-slate-300">{primaryTCM.foods.nourishing}</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <h3 className="text-xs text-red-400 uppercase mb-2">Potraviny, ktorým sa vyhýbaj</h3>
            <p className="text-xs text-slate-300">{primaryTCM.foods.weakening}</p>
          </div>
        </div>

        {/* Meridiánové hodiny */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <h3 className="text-xs text-cyan-400 uppercase mb-2">Orgánové hodiny (meridiány)</h3>
          <p className="text-xs text-slate-300">{primaryTCM.meridianHours}</p>
          <p className="text-xs text-slate-400 mt-1 italic">{primaryTCM.meridianNote}</p>
        </div>

        {/* Cyklus 5 elementov */}
        <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h3 className="text-xs text-purple-400 uppercase mb-2">Tvoje miesto v cykle 5 elementov</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <p><span className="text-emerald-300">Živí ťa:</span> {primaryTCM.generatedBy} → {primaryTCM.name}</p>
            <p><span className="text-amber-300">Ty živíš:</span> {primaryTCM.name} → {primaryTCM.generates}</p>
            <p><span className="text-rose-300">Kontroluje ťa:</span> {primaryTCM.controlledBy}</p>
            <p><span className="text-indigo-300">Ty kontroluješ:</span> {primaryTCM.controls}</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 italic">
            Generujúci cyklus: Drevo → Oheň → Zem → Kov → Voda → Drevo. Kontrolný cyklus drží rovnováhu — bez neho by jeden element dominoval.
          </p>
        </div>

        {/* Sezónne odporúčanie */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <h3 className="text-xs text-amber-400 uppercase mb-2">Sezónne odporúčanie ({primaryTCM.season})</h3>
          <p className="text-xs text-slate-300">{primaryTCM.seasonalAdvice}</p>
        </div>

        {/* Cross-system prepojenie */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <h3 className="text-xs text-indigo-400 uppercase mb-2">Prepojenie s čakrami</h3>
          <p className="text-xs text-slate-300">
            Element {primaryTCM.name} rezonuje s <strong>{primaryTCM.chakra}. čakrou</strong>.
            Keď pracuješ na vyvážení tohto elementu (jedlo, dych, emócie), automaticky podporuješ aj túto čakru.
          </p>
        </div>
      </GlassCard>

      </>)}

      {activeTab === 'bach' && (<>
      {/* Bach Flowers */}
      <GlassCard delay={0.3}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">✿</span> Bachove kvetové esencie
        </h2>

        {data.blockedChakras.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            Žiadna čakra nie je blokovaná — gratulujeme k energetickej rovnováhe!
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Odporúčané esencie pre blokované čakry ({data.blockedChakras.map(n => `${n}.`).join(' ')}):
            </p>
            <div className="space-y-4">
              {data.blockedChakras.map(chakraNum => {
                const flowers = BACH_FLOWERS_BY_CHAKRA[chakraNum];
                if (!flowers) return null;
                const chakraState = data.chakras.find(c => c.chakra.number === chakraNum);
                return (
                  <div key={chakraNum} className="border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-rose-400 mb-3">
                      {chakraState?.chakra.name} (skóre: {chakraState?.score})
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
          Bachove kvetové esencie sú jemná energetická podpora. Nie sú náhradou za odbornú lekársku starostlivosť.
        </p>
      </GlassCard>

      </>)}

      {activeTab === 'crystals' && (<>
      {/* === KRISTALOTERAPIA === */}
      <GlassCard>
        <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">💎</span> Kristaloterapia
        </h2>
        <p className="text-xs text-slate-400 mb-4">Kryštály podľa vášho znamenia, blokovaných čakier a ODV čísla.</p>

        {zodiacCrystals.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Kryštály pre vaše znamenie ({sunSign})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zodiacCrystals.map(c => (
                <div key={c.name} className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium text-violet-300">{c.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{c.properties}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">{c.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {blockedCrystals.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Pre blokované čakry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {blockedCrystals.map(c => (
                <div key={c.name + c.chakra} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium text-rose-300">{c.name}</span>
                    <span className="text-[9px] text-slate-500">čakra {c.chakra}</span>
                  </div>
                  <p className="text-xs text-slate-400">{c.properties}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">{c.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      </>)}

      {activeTab === 'archetype' && (<>
      {/* === JUNGOVE ARCHETYPY === */}
      {archetype && (
        <GlassCard>
          <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="text-2xl">🎭</span> Jungov archetyp
          </h2>
          <p className="text-xs text-slate-400 mb-4">Derivovaný z vášho ŽČ, Enneagramu a HD typu.</p>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3">
            <p className="text-xs text-indigo-400 uppercase mb-1">Primárny archetyp</p>
            <p className="text-lg font-bold text-indigo-300">{archetype.primary.name}</p>
            <p className="text-sm text-slate-400 italic mb-2">„{archetype.primary.motto}"</p>
            <p className="text-xs text-slate-400"><strong className="text-slate-300">Dar:</strong> {archetype.primary.gift}</p>
            <p className="text-xs text-slate-400"><strong className="text-slate-300">Stratégia:</strong> {archetype.primary.strategy}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] text-purple-400 uppercase mb-1">Sekundárny</p>
              <p className="text-sm font-medium text-purple-300">{archetype.secondary.name}</p>
              <p className="text-[10px] text-slate-400 italic">„{archetype.secondary.motto}"</p>
              <p className="text-xs text-slate-400 mt-1">{archetype.secondary.gift}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-[10px] text-rose-400 uppercase mb-1">Tieňový</p>
              <p className="text-sm font-medium text-rose-300">{archetype.shadow.name}</p>
              <p className="text-[10px] text-slate-400 italic">„{archetype.shadow.motto}"</p>
              <p className="text-xs text-slate-400 mt-1">{archetype.shadow.shadow}</p>
            </div>
          </div>
        </GlassCard>
      )}

      </>)}

      {activeTab === 'fengshui' && (<>
      {/* === KUA ČÍSLO (FENG SHUI) === */}
      {kuaResult && (
        <GlassCard>
          <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="text-2xl">🧭</span> Kua číslo (Feng Shui)
          </h2>
          <p className="text-xs text-slate-400 mb-4">Vaše osobné číslo určuje priaznivé svetové strany pre spánok, prácu a vstup.</p>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
              {kuaResult.kuaNumber}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Skupina: {kuaResult.group === 'east' ? 'Východná' : 'Západná'}</p>
              <p className="text-xs text-slate-500">Element: {kuaResult.element}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-[10px] text-emerald-400 uppercase">Spálňa</p>
              <p className="text-sm font-bold text-emerald-300">{kuaResult.bestForSleep}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-[10px] text-blue-400 uppercase">Pracovný stôl</p>
              <p className="text-sm font-bold text-blue-300">{kuaResult.bestForWork}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-[10px] text-amber-400 uppercase">Vstup</p>
              <p className="text-sm font-bold text-amber-300">{kuaResult.bestForEntrance}</p>
            </div>
          </div>

          <details>
            <summary className="text-[11px] text-indigo-400 cursor-pointer hover:text-indigo-300">Všetky priaznivé a nepriaznivé smery</summary>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-emerald-400 uppercase mb-1">Priaznivé</p>
                {kuaResult.favorable.map(d => (
                  <p key={d.direction} className="text-xs text-slate-400">✓ {d.direction} — {d.meaning}</p>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-rose-400 uppercase mb-1">Nepriaznivé</p>
                {kuaResult.unfavorable.map(d => (
                  <p key={d.direction} className="text-xs text-slate-400">✗ {d.direction}</p>
                ))}
              </div>
            </div>
          </details>
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
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{flower.name}</span>
        <span className="text-xs text-slate-500 italic">{flower.latinName}</span>
      </div>
      <p className="text-xs text-rose-300">
        <span className="text-slate-500">Stav:</span> {flower.emotionalState}
      </p>
      <p className="text-xs text-emerald-300">
        <span className="text-slate-500">Pomáha:</span> {flower.helps}
      </p>
      <p className="text-xs text-indigo-300 italic">
        &ldquo;{flower.affirmation}&rdquo;
      </p>
    </div>
  );
}
