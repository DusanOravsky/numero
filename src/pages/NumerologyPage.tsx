import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useSubject } from '../hooks/useSubject';
import { useTranslation } from '../i18n/useTranslation';
import { WEEKDAY_SHORT, MONTH_NAMES } from '../i18n/entityNames';
import { GlassCard } from '../components/GlassCard';
import { NumerologyGrid } from '../components/NumerologyGrid';
import { EnergyCard } from '../components/EnergyCard';
import { VibrationCard } from '../components/VibrationCard';
import { DateInput } from '../components/DateInput';
import { DevelopmentalNumerologyView } from '../components/DevelopmentalNumerologyView';
import { calculateFullNumerology, calculateORV, calculateOMV, calculateODV } from '../engine/numerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import lifePathsData from '../data/lifePaths';
import isolatedData from '../data/isolatedNumbers';
import { getOrvDescription } from '../data/orvDescriptions';
import { getOmvDescription } from '../data/omvDescriptions';
import { getOdvDescription } from '../data/odvDescriptions';
import { findMissingCharacterNumbers } from '../data/characterMissingNumbers';
import { ORVLifeHistogram } from '../components/ORVLifeHistogram';
import { PersonalYearTimeline } from '../components/PersonalYearTimeline';
import { RadarChart9 } from '../components/RadarChart9';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import type { EnneagramResult } from '../engine/enneagramEngine';
import { PlanesTab } from '../components/numerology/PlanesTab';
import { KarmicTab } from '../components/numerology/KarmicTab';
import { LoveTab } from '../components/numerology/LoveTab';
import { NameTab } from '../components/numerology/NameTab';
import { EnneagramTab } from '../components/numerology/EnneagramTab';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string; lesson: string; recommendation: string; career: string[]; relationships: string }>;
const isolatedInfo = isolatedData as Record<string, { type: string; effect: string; description: string; theme: string; shadow: string; recommendation: string; body: string }>;

export function NumerologyPage() {
  const navigate = useNavigate();
  const { numerologyMethod } = useStore();
  // Subject = aktívny profil alebo klient z ?client=ID query param.
  // Nazývame ju 'profile' kvôli minimalizácii diff-ov v rendrovacom kóde.
  const profile = useSubject();
  const { t, language } = useTranslation();
  const [manualResult, setManualResult] = useState<NumerologyResult | null>(null);
  const [manualDevResult, setManualDevResult] = useState<DevelopmentalNumerologyResult | null>(null);

  // Auto-results odvodené od profilu — useMemo namiesto setState v useEffect.
  const profileResult = useMemo<NumerologyResult | null>(() => {
    if (!profile) return null;
    return calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
  }, [profile]);
  const profileDevResult = useMemo<DevelopmentalNumerologyResult | null>(() => {
    if (!profile) return null;
    return calculateDevelopmentalNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
  }, [profile]);

  const result = manualResult ?? profileResult;
  const devResult = manualDevResult ?? profileDevResult;
  const enneagramResult = useMemo<EnneagramResult | null>(() => {
    if (!result) return null;
    return deriveEnneagramType(result, devResult ?? null, numerologyMethod);
  }, [result, devResult, numerologyMethod]);
  const [searchParams, setSearchParams] = useSearchParams();
  type TabId = 'overview' | 'planes' | 'vibrations' | 'karmic' | 'love' | 'name' | 'archetype';
  const validTabs: TabId[] = ['overview', 'planes', 'vibrations', 'karmic', 'love', 'name', 'archetype'];
  const urlTab = searchParams.get('tab');
  const initialTab: TabId = urlTab && (validTabs as string[]).includes(urlTab) ? (urlTab as TabId) : 'overview';
  const [activeTab, setActiveTabState] = useState<TabId>(initialTab);

  // Custom setter — synchronizuje URL ?tab=… s aktívnou záložkou bez setState v useEffect.
  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  // Cycle picker pre vibrácie – default = dnes
  const todayISO = new Date().toISOString().slice(0, 10);
  const [vibDate, setVibDate] = useState<string>(todayISO);
  const vibDateObj = new Date(vibDate || todayISO);
  const vibYear = vibDateObj.getFullYear();
  const vibMonth = vibDateObj.getMonth() + 1;
  const vibDay = vibDateObj.getDate();
  const customOrv = profile ? calculateORV(profile.birthDay, profile.birthMonth, vibYear, vibMonth, vibDay) : 0;
  const customOmv = profile ? calculateOMV(customOrv, vibMonth) : 0;
  const customOdv = profile ? calculateODV(customOrv, vibDay, vibMonth) : 0;
  const isToday = vibDate === todayISO;

  const handleCalculate = (day: number, month: number, year: number) => {
    setManualResult(calculateFullNumerology(day, month, year));
    setManualDevResult(calculateDevelopmentalNumerology(day, month, year));
  };

  const lifePathInfo = result ? lifePaths[String(result.lifePathNumber)] : null;

  // Záložky — niektoré sekcie sú špecifické pre Charakterovú metódu
  // (Roviny, Karmické cykly + Pinnacles + Challenges, Jazyky lásky), iné sú spoločné.
  const allTabs = [
    { id: 'overview' as const, label: t('numerology.tabOverview'), methods: ['characterological', 'developmental'] },
    { id: 'planes' as const, label: t('numerology.tabPlanes'), methods: ['characterological'] },
    { id: 'vibrations' as const, label: t('numerology.tabVibrations'), methods: ['characterological', 'developmental'] },
    { id: 'karmic' as const, label: t('numerology.tabKarmic'), methods: ['characterological'] },
    { id: 'love' as const, label: t('numerology.tabLove'), methods: ['characterological'] },
    { id: 'archetype' as const, label: t('numerology.tabArchetype'), methods: ['characterological', 'developmental'] },
    { id: 'name' as const, label: t('numerology.tabName'), methods: ['characterological', 'developmental'] },
  ];
  const tabs = allTabs.filter(tab => tab.methods.includes(numerologyMethod));

  // Ak je aktívna záložka skrytá pri zmene metódy, použijeme 'overview'.
  // Derivovaný tab — žiadne setState v useEffect.
  const visibleTab: TabId = tabs.find(tab => tab.id === activeTab) ? activeTab : 'overview';

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
          <h1 className="font-serif text-3xl font-bold text-white">{t('numerology.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {t('clients.title')}: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient ? `${t('numerology.subtitle')} — ${profile.name}` : t('numerology.subtitle')}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label={language === 'sk' ? 'Zadajte dátum narodenia' : 'Enter date of birth'} />
        </GlassCard>
      )}

      {result && (
        <>
          {/* Info o aktívnej metóde */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
            <span className="text-indigo-600 mt-0.5">ⓘ</span>
            <div className="flex-1 text-xs text-slate-700">
              {numerologyMethod === 'characterological' ? (
                <>
                  {language === 'sk'
                    ? <>Aktívna metóda: <strong>Charakterová mriežka</strong> – ukazuje vrodené kvality (1=Ja, 2=Intuícia, 6=Láska, 9=Múdrosť…). <em>Zdroj: Robin Steinová – Numerológia: Čísla Lásky.</em></>
                    : <>Active method: <strong>Characterological grid</strong> – shows innate qualities (1=Self, 2=Intuition, 6=Love, 9=Wisdom…). <em>Source: Robin Stein – Numerology: Numbers of Love.</em></>
                  }
                </>
              ) : (
                <>
                  {language === 'sk'
                    ? <>Aktívna metóda: <strong>Vývojová mriežka</strong> – ukazuje životné úlohy a karmické cykly cez 4 zakrúžkované čísla (1=Ego, 2=Bioenergia, 6=Vytrvalosť, 9=Financie…). <em>Zdroj: Lívia Mičková – Duchovná numerológia.</em></>
                    : <>Active method: <strong>Developmental grid</strong> – shows life tasks and karmic cycles through 4 circled numbers (1=Ego, 2=Bioenergy, 6=Perseverance, 9=Finances…). <em>Source: Lívia Mičková – Spiritual Numerology.</em></>
                  }
                </>
              )}
              <button
                onClick={() => navigate('/settings')}
                className="ml-2 text-indigo-600 underline hover:text-indigo-800"
              >
                {t('numerology.changeMethod')}
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  visibleTab === tab.id
                    ? 'bg-indigo-600 text-white glow'
                    : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {manualResult && (
              <button
                onClick={() => { setManualResult(null); setManualDevResult(null); }}
                className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white ml-auto"
              >
                {t('common.newCalculation')}
              </button>
            )}
          </div>

          {visibleTab === 'overview' && (
            <div className="space-y-6">
              {/* Osobný sumár — kľúčové hodnoty zo všetkých sekcií */}
              {result && (
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">{t('numerology.profileOverview')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {numerologyMethod === 'developmental' && devResult && (
                      <>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{t('numerology.k3Mission')}</p>
                          <p className="text-xl font-bold text-amber-300">{devResult.circled[2].value}</p>
                          <p className="text-[10px] text-slate-400">{language === 'sk' ? 'životná misia' : 'life mission'}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">K1 · K2 · K4</p>
                          <p className="text-lg font-bold text-amber-300">{devResult.circled[0].value} · {devResult.circled[1].value} · {devResult.circled[3].value}</p>
                          <p className="text-[10px] text-slate-400">{language === 'sk' ? 'karmické cykly' : 'karmic cycles'}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{t('numerology.egoPolarity')}</p>
                          <p className="text-sm font-bold text-violet-300">{devResult.egoPolarity === 'masculine' ? t('dev.masculine') : devResult.egoPolarity === 'feminine' ? t('dev.feminine') : t('dev.none')}</p>
                          <p className="text-[10px] text-slate-400">{devResult.oneCount}× jednotka</p>
                        </div>
                      </>
                    )}
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                      <p className="text-[10px] text-slate-500 uppercase">{t('numerology.orv')}</p>
                      <p className="text-xl font-bold text-purple-300">{result.orv}</p>
                      <p className="text-[10px] text-slate-400">{getOrvDescription(result.orv, language)?.title || ''}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-center">
                      <p className="text-[10px] text-slate-500 uppercase">{t('numerology.omv')}</p>
                      <p className="text-xl font-bold text-fuchsia-300">{result.omv}</p>
                      <p className="text-[10px] text-slate-400">{getOmvDescription(result.omv, language)?.title || ''}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                      <p className="text-[10px] text-slate-500 uppercase">{t('numerology.odv')}</p>
                      <p className="text-xl font-bold text-amber-300">{result.odv}</p>
                      <p className="text-[10px] text-slate-400">{getOdvDescription(result.odv, language)?.title || ''}</p>
                    </div>
                    {numerologyMethod === 'characterological' && (
                      <>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{t('numerology.fullPlanes')}</p>
                          <p className="text-xl font-bold text-emerald-300">{result.fullPlanes.length}</p>
                          <p className="text-[10px] text-slate-400">{language === 'sk' ? 'z 15 možných' : 'of 15 possible'}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{t('numerology.missing')}</p>
                          <p className="text-xl font-bold text-rose-300">
                            {(() => { const counts: Record<number, number> = {}; for (let i = 1; i <= 9; i++) counts[i] = result.grid[i]?.length || 0; return Object.values(counts).filter(c => c === 0).length; })()}
                          </p>
                          <p className="text-[10px] text-slate-400">{language === 'sk' ? 'smery rastu' : 'growth areas'}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                          <p className="text-[10px] text-slate-500 uppercase">{t('numerology.isolated')}</p>
                          <p className="text-xl font-bold text-rose-300">{result.isolatedNumbers.length}</p>
                          <p className="text-[10px] text-slate-400">{result.isolatedNumbers.length > 0 ? result.isolatedNumbers.join(', ') : (language === 'sk' ? 'žiadne' : 'none')}</p>
                        </div>
                      </>
                    )}
                    {enneagramResult && (
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">Enneagram</p>
                        <p className="text-xl font-bold text-cyan-300">{enneagramResult.coreType}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'typ' : 'type'}</p>
                      </div>
                    )}
                    {numerologyMethod === 'developmental' && (
                      <div className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">{language === 'sk' ? 'Číslo zrelosti' : 'Maturity number'}</p>
                        <p className="text-xl font-bold text-slate-300">{result.maturityNumber}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'aktív. ~35-40 r.' : 'active ~35-40 y.'}</p>
                      </div>
                    )}
                    {result.loveLanguages.length > 0 && numerologyMethod === 'characterological' && (
                      <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">{language === 'sk' ? 'Jazyk lásky' : 'Love language'}</p>
                        <p className="text-sm font-bold text-pink-300">{result.loveLanguages[0].language.split(' ').slice(0, 2).join(' ')}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'primárny' : 'primary'}</p>
                      </div>
                    )}
                    {numerologyMethod === 'characterological' && (
                      <div className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">{language === 'sk' ? 'Číslo zrelosti' : 'Maturity number'}</p>
                        <p className="text-xl font-bold text-slate-300">{result.maturityNumber}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'aktív. ~35-40 r.' : 'active ~35-40 y.'}</p>
                      </div>
                    )}
                  </div>
                  {result.karmicDebts.length > 0 && (
                    <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-xs font-medium text-red-600">
                        {t('numerology.karmicDebts')} {result.karmicDebts.map(d => `${d.number} (${d.theme})`).join(', ')}
                      </p>
                    </div>
                  )}
                </GlassCard>
              )}

              {/* HERO STRIP — pri Charakterovej ŽČ, pri Vývojovej K3 (Životné poslanie) */}
              {numerologyMethod === 'characterological' ? (
                <GlassCard glow>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* ŽČ kruh */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <span className="text-3xl font-serif font-bold text-white">{result.lifePathNumber}</span>
                    </div>

                    {/* Detail */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                        <h2 className="text-lg font-medium text-white">{language === 'sk' ? 'Životné číslo' : 'Life Path Number'} {result.lifePathNumber}</h2>
                        <span className="text-sm text-slate-500">z {result.lifePathFrom}</span>
                      </div>
                      {lifePathInfo?.title && (
                        <p className="text-sm text-indigo-700 font-medium mt-0.5">{lifePathInfo.title}</p>
                      )}
                      <div className="flex gap-1 mt-2 flex-wrap justify-center sm:justify-start">
                        {lifePathInfo?.keywords.map(k => (
                          <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{k}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">{result.formula}</p>
                    </div>
                  </div>
                </GlassCard>
              ) : devResult ? (
                <GlassCard glow>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* ŽČ kruh — primárne (rovnaké v oboch metódach) */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <span className="text-3xl font-serif font-bold text-white">{result.lifePathNumber}</span>
                    </div>

                    {/* Detail */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                        <h2 className="text-lg font-medium text-white">{language === 'sk' ? 'Životné číslo' : 'Life Path Number'} {result.lifePathNumber}</h2>
                        <span className="text-sm text-slate-500">z {result.lifePathFrom}</span>
                      </div>
                      <p className="text-sm text-indigo-700 font-medium mt-0.5">{t('numerology.sharedBothMethods')}</p>
                      <div className="mt-3 flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-sm flex items-center justify-center">{devResult.circled[2].value}</span>
                          <span className="text-xs text-amber-700 font-medium">{t('numerology.k3Mission')}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          K1={devResult.circled[0].value} · K2={devResult.circled[1].value} · K3={devResult.circled[2].value} · K4={devResult.circled[3].value}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">{result.formula}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {language === 'sk'
                          ? <>K1 psych. stabilita · K2 mat. stabilita · <strong>K3 životné poslanie</strong> · K4 detské sny</>
                          : <>K1 psych. stability · K2 mat. stability · <strong>K3 life mission</strong> · K4 childhood dreams</>}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ) : null}

              {numerologyMethod === 'characterological' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <VibrationCard
                    title="VDD"
                    value={result.vdd}
                    subtitle={language === 'sk' ? 'Vek duchovnej dospelosti' : 'Age of spiritual maturity'}
                    icon="⟡"
                    color="purple"
                    formula={`36 - ${language === 'sk' ? 'ŽČ' : 'LPN'}(${result.lifePathNumber}) = ${result.vdd}`}
                    description={language === 'sk' ? 'Vek duchovnej dospelosti (VDD) je okamih, kedy človek začína plniť svoje životné poslanie. Do tohto veku sa pripravuje – učí sa, zbiera skúsenosti. Po VDD nastupujú karmické cykly K1-K4.' : 'Age of spiritual maturity (VDD) is the moment when a person begins to fulfill their life mission. Until this age, they prepare — learning and gathering experiences. After VDD, the karmic cycles K1-K4 begin.'}
                  />
                  <VibrationCard
                    title="ODD"
                    value={result.oddPeriod}
                    subtitle={language === 'sk' ? 'Obdobie duch. detstva' : 'Spiritual childhood period'}
                    icon="◇"
                    color="purple"
                    formula={`VDD(${result.vdd}) ÷ 3 = ${result.oddPeriod}`}
                    description={language === 'sk' ? `Obdobie duchovného detstva (ODD) = ${result.oddPeriod} rokov. Duchovné detstvo trvá od narodenia do ${result.vdd} rokov a delí sa na 3 cykly po ${result.oddPeriod} rokov: 1. cyklus (0–${result.oddPeriod} r.) = vplyv matky, 2. cyklus (${result.oddPeriod}–${result.oddPeriod * 2} r.) = vplyv otca, 3. cyklus (${result.oddPeriod * 2}–${result.vdd} r.) = vplyv spoločnosti.` : `Spiritual childhood period (ODD) = ${result.oddPeriod} years. Spiritual childhood lasts from birth to ${result.vdd} years and divides into 3 cycles of ${result.oddPeriod} years: 1st cycle (0–${result.oddPeriod} y.) = mother's influence, 2nd cycle (${result.oddPeriod}–${result.oddPeriod * 2} y.) = father's influence, 3rd cycle (${result.oddPeriod * 2}–${result.vdd} y.) = society's influence.`}
                  />
                  <VibrationCard
                    title="ΣT"
                    value={result.sigmaT}
                    subtitle={result.age === 'aquarius' ? (language === 'sk' ? 'Vek Vodnára' : 'Age of Aquarius') : (language === 'sk' ? 'Vek Rýb' : 'Age of Pisces')}
                    icon="☿"
                    color="gold"
                    formula={`D + M + R = ${result.sigmaT}`}
                    description={language === 'sk' ? 'Suma tarotu (ΣT) je súčet celého dátumu narodenia bez redukcie. Určuje, či osoba patrí do Veku Rýb (< 2000, duchovná introspekcia) alebo Veku Vodnára (>= 2000, nové paradigmy a technológie).' : 'Tarot sum (ΣT) is the sum of the entire date of birth without reduction. It determines whether a person belongs to the Age of Pisces (< 2000, spiritual introspection) or Age of Aquarius (>= 2000, new paradigms and technologies).'}
                  />
                  <VibrationCard
                    title={language === 'sk' ? 'Kozmický vek' : 'Cosmic age'}
                    value={result.sigmaT >= 2000 ? 2 : 1}
                    subtitle={result.age === 'aquarius' ? (language === 'sk' ? 'Vodnár' : 'Aquarius') : (language === 'sk' ? 'Ryby' : 'Pisces')}
                    icon="⚛"
                    color="indigo"
                    formula={`ΣT = ${result.sigmaT} → ${result.age === 'aquarius' ? (language === 'sk' ? '≥ 2000 = Vodnár' : '≥ 2000 = Aquarius') : (language === 'sk' ? '< 2000 = Ryby' : '< 2000 = Pisces')}`}
                    description={result.age === 'aquarius' ? (language === 'sk' ? 'Vek Vodnára – nové technológie, kolektívne vedomie, inovácie. Človek je otvorený novým prístupom a má schopnosť prepájať duchovné s moderným.' : 'Age of Aquarius — new technologies, collective consciousness, innovation. The person is open to new approaches and has the ability to connect the spiritual with the modern.') : (language === 'sk' ? 'Vek Rýb – hlboká duchovnosť, introspekcia, tradičná múdrosť. Človek inklinuje k duchovným cestám a vnútornému hľadaniu pravdy.' : 'Age of Pisces — deep spirituality, introspection, traditional wisdom. The person inclines toward spiritual paths and inner seeking of truth.')}
                  />
                </div>
              )}

              {/* MRIEŽKA — plná šírka, dosť priestoru */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="text-lg font-medium text-white">
                    {language === 'sk' ? 'Mriežka 3×3' : '3×3 Grid'} — {numerologyMethod === 'characterological' ? (language === 'sk' ? 'Charakterová' : 'Characterological') : (language === 'sk' ? 'Vývojová' : 'Developmental')}
                  </h2>
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 underline"
                  >
                    {t('numerology.changeMethod')}
                  </button>
                </div>
                {numerologyMethod === 'characterological' ? (
                  <div className="space-y-4">
                    <NumerologyGrid grid={result.grid} />
                    <div className="flex gap-4 justify-center text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span> {t('numerology.baseDigits')}</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-400"></span> {t('numerology.derivedDigits')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic text-center">
                      {language === 'sk' ? 'Zdroj: Robin Steinová – Numerológia: Čísla Lásky' : 'Source: Robin Stein – Numerology: Numbers of Love'}
                    </p>
                  </div>
                ) : devResult ? (
                  <DevelopmentalNumerologyView result={devResult} gender={profile?.gender} />
                ) : null}
              </GlassCard>

              {/* Tvoje čítanie — personalizovaný sprievodca pre Charakterovú */}
              {numerologyMethod === 'characterological' && result && (() => {
                const charCounts: Record<number, number> = {};
                for (let i = 1; i <= 9; i++) charCounts[i] = result.grid[i]?.length || 0;
                const charZeros = Object.entries(charCounts).filter(([, c]) => c === 0).map(([n]) => Number(n));
                const charHigh = Object.entries(charCounts).filter(([, c]) => c >= 3).map(([n, c]) => ({ num: Number(n), count: c }));
                const NUMBER_THEMES: Record<number, string> = language === 'sk'
                  ? { 1: 'Ja, ego, začiatok', 2: 'Intuícia, partnerstvo', 3: 'Kreativita, komunikácia', 4: 'Stabilita, práca', 5: 'Sloboda, zmena', 6: 'Láska, rodina, domov', 7: 'Duchovno, pochopenie', 8: 'Hojnosť, moc', 9: 'Múdrosť, zavŕšenie' }
                  : { 1: 'Self, ego, beginning', 2: 'Intuition, partnership', 3: 'Creativity, communication', 4: 'Stability, work', 5: 'Freedom, change', 6: 'Love, family, home', 7: 'Spirituality, understanding', 8: 'Abundance, power', 9: 'Wisdom, completion' };
                return (
                  <GlassCard>
                    <details open>
                      <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                        <span className="font-medium text-white">{language === 'sk' ? 'Tvoje čítanie — ako pracovať s mriežkou' : 'Your reading — how to work with the grid'}</span>
                      </summary>
                      <div className="mt-4 space-y-4">
                        <p className="text-xs text-slate-400">
                          {language === 'sk'
                            ? 'Charakterová mriežka ukazuje tvoje vrodené kvality — čím sú „vybavené" tvoje životné energie. Čísla v mriežke nie sú „dobré" ani „zlé" — sú to tvoje nástroje. Prázdne bunky nie sú deficity, ale smery rastu.'
                            : 'The character grid shows your innate qualities — what your life energies are "equipped" with. Numbers in the grid are not "good" or "bad" — they are your tools. Empty cells are not deficits, but directions of growth.'}
                        </p>

                        {/* Životné číslo */}
                        {lifePathInfo && (
                          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                            <p className="text-xs font-semibold text-violet-300 mb-1">
                              {language === 'sk' ? `Tvoje životné číslo ${result.lifePathNumber} — „${lifePathInfo.title}"` : `Your Life Path Number ${result.lifePathNumber} — "${lifePathInfo.title}"`}
                            </p>
                            <p className="text-xs text-slate-300">{lifePathInfo.description}</p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="p-2 rounded-lg bg-emerald-500/10">
                                <p className="text-[10px] text-emerald-400 uppercase">{language === 'sk' ? 'Dar' : 'Gift'}</p>
                                <p className="text-[11px] text-slate-300">{lifePathInfo.gift}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-rose-500/10">
                                <p className="text-[10px] text-rose-400 uppercase">{t('numerology.shadow')}</p>
                                <p className="text-[11px] text-slate-300">{lifePathInfo.shadow}</p>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2 italic">{lifePathInfo.recommendation}</p>
                          </div>
                        )}

                        {/* Chýbajúce čísla */}
                        {charZeros.length > 0 && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs font-semibold text-amber-300 mb-2">
                              {language === 'sk' ? `Tvoje smery rastu (chýbajúce): ${charZeros.join(', ')}` : `Your growth directions (missing): ${charZeros.join(', ')}`}
                            </p>
                            <p className="text-[11px] text-slate-400 mb-2">
                              {language === 'sk'
                                ? 'Tieto čísla nemáš v mriežke — sú to oblasti, kde sa vyvíjaš cez vedomé úsilie.'
                                : 'These numbers are not in your grid — they are areas where you develop through conscious effort.'}
                            </p>
                            <div className="space-y-1.5">
                              {charZeros.map(n => (
                                <div key={n} className="pl-3 border-l-2 border-amber-500/30">
                                  <p className="text-[11px] text-slate-300"><strong className="text-amber-300">{n}</strong> — {NUMBER_THEMES[n]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Silné čísla */}
                        {charHigh.length > 0 && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xs font-semibold text-emerald-300 mb-2">
                              {language === 'sk' ? `Tvoje silné energie (3+×): ${charHigh.map(h => `${h.num} (${h.count}×)`).join(', ')}` : `Your strong energies (3+×): ${charHigh.map(h => `${h.num} (${h.count}×)`).join(', ')}`}
                            </p>
                            <p className="text-[11px] text-slate-400 mb-2">
                              {language === 'sk'
                                ? 'Tieto energie máš silne prítomné — sú to tvoje dary, ale v nadbytku aj výzvy.'
                                : 'These energies are strongly present — they are your gifts, but in excess also challenges.'}
                            </p>
                            <div className="space-y-1.5">
                              {charHigh.map(h => (
                                <div key={h.num} className="pl-3 border-l-2 border-emerald-500/30">
                                  <p className="text-[11px] text-slate-300"><strong className="text-emerald-300">{h.num}</strong> — {NUMBER_THEMES[h.num]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Izolované čísla */}
                        {result.isolatedNumbers.length > 0 && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                            <p className="text-xs font-semibold text-rose-300 mb-1">
                              {language === 'sk' ? `Izolované čísla: ${result.isolatedNumbers.join(', ')}` : `Isolated numbers: ${result.isolatedNumbers.join(', ')}`}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {language === 'sk'
                                ? 'Tieto čísla sú obklopené prázdnymi bunkami — ich energia sa nemôže voľne prepájať s ostatnými. Prejavuje sa to ako vnútorné napätie alebo frustrácia v danej oblasti. Pozri detaily nižšie.'
                                : 'These numbers are surrounded by empty cells — their energy cannot freely connect with others. This manifests as inner tension or frustration in that area. See details below.'}
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                          <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
                          <p className="text-xs text-slate-300">
                            {language === 'sk'
                              ? 'Začni od životného čísla — to je tvoja „červená niť". Potom si pozri chýbajúce čísla (smery rastu) a izolované čísla (blokovaná energia). Klikni na mriežku vyššie pre detailný výklad každej bunky.'
                              : 'Start with the Life Path Number — it is your "red thread". Then look at missing numbers (growth directions) and isolated numbers (blocked energy). Click the grid above for a detailed interpretation of each cell.'}
                          </p>
                        </div>
                      </div>
                    </details>
                  </GlassCard>
                );
              })()}

              {/* Radar chart 9 energií (B28) — pre obe metódy, počíta sa zo zvolenej mriežky */}
              {numerologyMethod === 'characterological' && (
                <RadarChart9
                  counts={(() => {
                    const map = new Map<number, number>();
                    for (let i = 1; i <= 9; i++) map.set(i, result.grid[i]?.length || 0);
                    return map;
                  })()}
                  title={t('numerology.radarCharacter')}
                  subtitle={language === 'sk' ? 'Vizualizácia distribúcie čísel 1-9 v Charakterovej (Steinová) mriežke.' : 'Visualization of number 1-9 distribution in the Characterological (Stein) grid.'}
                />
              )}
              {numerologyMethod === 'developmental' && devResult && (
                <RadarChart9
                  counts={devResult.counts}
                  title={t('numerology.radarDevelopmental')}
                  subtitle={language === 'sk' ? 'Vizualizácia distribúcie čísel 1-9 vo Vývojovej (Lívia) mriežke vrátane zakrúžkovaných.' : 'Visualization of number 1-9 distribution in the Developmental (Lívia) grid including circled numbers.'}
                />
              )}

              {numerologyMethod === 'developmental' && devResult && devResult.isolatedNumbers.length > 0 && (
                <GlassCard delay={0.3}>
                  <h3 className="font-medium text-white mb-2">{t('numerology.isolated')}</h3>
                  <p className="text-sm text-slate-400 mb-4">{t('numerology.isolatedDesc')}</p>
                  <div className="space-y-4">
                    {devResult.isolatedNumbers.map(n => {
                      const info = isolatedInfo[String(n)];
                      return (
                        <div key={n} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
                              {n}
                            </div>
                            <div>
                              <p className="font-medium text-white">{info?.theme || `Izolované číslo ${n}`}</p>
                              <p className="text-xs text-rose-300">{info?.type === 'nepárne' ? t('numerology.oddTension') : t('numerology.evenPassivity')}</p>
                            </div>
                          </div>
                          {info && (
                            <div className="space-y-2 mt-3">
                              <p className="text-sm text-slate-300">{info.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                  <p className="text-xs text-red-400">{t('numerology.shadow')}</p>
                                  <p className="text-xs text-slate-300">{info.shadow}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                  <p className="text-xs text-amber-400">{t('numerology.bodyLabel')}</p>
                                  <p className="text-xs text-slate-300">{info.body}</p>
                                </div>
                              </div>
                              <div className="p-2 rounded-lg bg-indigo-500/10 mt-2">
                                <p className="text-xs text-indigo-400">{t('numerology.recommendation')}</p>
                                <p className="text-xs text-slate-300">{info.recommendation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              )}

              {numerologyMethod === 'characterological' && lifePathInfo && (
                <GlassCard delay={0.2}>
                  <details open>
                    <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                      <span className="font-medium text-white">{language === 'sk' ? `Detailný výklad ŽČ ${result.lifePathNumber} — Lekcia a odporúčanie` : `Detailed LPN ${result.lifePathNumber} interpretation — Lesson and recommendation`}</span>
                    </summary>
                    <div className="mt-3">
                      <p className="text-slate-300 mb-4">{lifePathInfo.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-xs text-blue-400 uppercase mb-1">{t('numerology.lesson')}</p>
                          <p className="text-sm text-slate-300">{lifePathInfo.lesson}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-amber-400 uppercase mb-1">{t('numerology.recommendation')}</p>
                          <p className="text-sm text-slate-300">{lifePathInfo.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </details>
                </GlassCard>
              )}

              {numerologyMethod === 'characterological' && result.isolatedNumbers.length > 0 && (
                <GlassCard delay={0.3}>
                  <h3 className="font-medium text-white mb-2">{t('numerology.isolated')}</h3>
                  <p className="text-sm text-slate-400 mb-4">{t('numerology.isolatedDesc')}</p>
                  <div className="space-y-4">
                    {result.isolatedNumbers.map(n => {
                      const info = isolatedInfo[String(n)];
                      return (
                        <div key={n} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
                              {n}
                            </div>
                            <div>
                              <p className="font-medium text-white">{info?.theme || `Izolované číslo ${n}`}</p>
                              <p className="text-xs text-rose-300">{info?.type === 'nepárne' ? t('numerology.oddTension') : t('numerology.evenPassivity')}</p>
                            </div>
                          </div>
                          {info && (
                            <div className="space-y-2 mt-3">
                              <p className="text-sm text-slate-300">{info.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                  <p className="text-xs text-red-400">{t('numerology.shadow')}</p>
                                  <p className="text-xs text-slate-300">{info.shadow}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                  <p className="text-xs text-amber-400">{t('numerology.bodyLabel')}</p>
                                  <p className="text-xs text-slate-300">{info.body}</p>
                                </div>
                              </div>
                              <div className="p-2 rounded-lg bg-indigo-500/10 mt-2">
                                <p className="text-xs text-indigo-400">{t('numerology.recommendation')}</p>
                                <p className="text-xs text-slate-300">{info.recommendation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              )}

              {/* Chýbajúce čísla 1-9 — len pre Charakterovú */}
              {numerologyMethod === 'characterological' && (() => {
                const missing = findMissingCharacterNumbers(result.grid);
                if (missing.length === 0) return null;
                return (
                  <GlassCard delay={0.35}>
                    <h3 className="font-medium text-white mb-2">{t('numerology.missingNumbers')}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {t('numerology.missingDesc')}
                    </p>
                    <div className="space-y-3">
                      {missing.map(info => (
                        <motion.div
                          key={info.number}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: info.number * 0.05 }}
                          className="p-3 rounded-xl bg-amber-50 border border-amber-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-sm shrink-0">
                              {info.number}
                            </div>
                            <p className="text-sm font-medium text-amber-700">{info.title}</p>
                          </div>
                          <p className="text-xs text-slate-700 mt-1">{info.description}</p>
                          <p className="text-xs text-slate-600 mt-1.5 italic">
                            <strong>{t('numerology.recommendation')}:</strong> {info.recommendation}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 italic mt-3">
                      {language === 'sk' ? 'Zdroj: Robin Steinová – Numerológia: Čísla Lásky' : 'Source: Robin Stein – Numerology: Numbers of Love'}
                    </p>
                  </GlassCard>
                );
              })()}


              {/* Vysvetlenie a porovnanie metód — pre obe je obsah iný */}
              {numerologyMethod === 'developmental' && devResult ? (
                <GlassCard>
                  <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Čo znamenajú tieto čísla' : 'What these numbers mean'}</h3>
                  <p className="text-sm text-slate-700 mb-3">
                    {language === 'sk'
                      ? <>Vývojová numerológia (Lívia Mičková) nepoužíva klasické životné číslo zo Steinovej tradície. Namiesto neho pracuje so <strong>4 zakrúžkovanými číslami (K1–K4)</strong>, ktoré opisujú postupné karmické úlohy duše počas života.</>
                      : <>Developmental numerology (Lívia Mičková) does not use the classic Life Path Number from the Stein tradition. Instead, it works with <strong>4 circled numbers (K1–K4)</strong> that describe progressive karmic tasks of the soul throughout life.</>}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{language === 'sk' ? `K1 – Psychická stabilita (${devResult.circled[0].value})` : `K1 – Psychological stability (${devResult.circled[0].value})`}</p>
                      <p className="text-xs text-slate-700">{language === 'sk' ? 'Téma prvého cyklu: budovanie vnútorného sveta a sebaobrazu.' : 'Theme of the first cycle: building inner world and self-image.'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{language === 'sk' ? `K2 – Materiálna stabilita (${devResult.circled[1].value})` : `K2 – Material stability (${devResult.circled[1].value})`}</p>
                      <p className="text-xs text-slate-700">{language === 'sk' ? 'Druhý cyklus: usadenie sa vo svete, hmotná báza.' : 'Second cycle: settling in the world, material foundation.'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-100 border border-orange-300">
                      <p className="text-xs text-orange-800 font-semibold uppercase mb-1">{language === 'sk' ? `★ K3 – Životné poslanie (${devResult.circled[2].value})` : `★ K3 – Life mission (${devResult.circled[2].value})`}</p>
                      <p className="text-xs text-slate-700">{language === 'sk' ? <><strong>Najdôležitejšie z karmických čísel.</strong> To, prečo si tu — hlavná misia duše.</> : <><strong>Most important of the karmic numbers.</strong> Why you are here — the main soul mission.</>}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 font-semibold uppercase mb-1">{language === 'sk' ? `K4 – Detské sny (${devResult.circled[3].value})` : `K4 – Childhood dreams (${devResult.circled[3].value})`}</p>
                      <p className="text-xs text-slate-700">{language === 'sk' ? 'Záver života: napĺňanie detských snov, návrat k pôvodnej radosti.' : 'End of life: fulfilling childhood dreams, return to original joy.'}</p>
                    </div>
                  </div>

                  <details className="mt-3">
                    <summary className="text-sm font-medium text-indigo-700 cursor-pointer hover:text-indigo-800 select-none">
                      {language === 'sk' ? 'Porovnanie s Charakterovou metódou (Steinová)' : 'Comparison with Characterological method (Stein)'}
                    </summary>
                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      <p>
                        {language === 'sk'
                          ? <><strong className="text-blue-700">Charakterová (Steinová):</strong> hlavné je <strong>životné číslo</strong> ({result.lifePathNumber} z {result.lifePathFrom}). Vyjadruje vrodenú povahu — kto si od narodenia. K tomu sa viaže VDD (vek duchovnej dospelosti = {result.vdd} r.), ΣT (suma tarotu) a klasické karmické trojuholníky.</>
                          : <><strong className="text-blue-700">Characterological (Stein):</strong> the main element is the <strong>Life Path Number</strong> ({result.lifePathNumber} from {result.lifePathFrom}). It expresses innate nature — who you are from birth. Related: VDD (age of spiritual maturity = {result.vdd} y.), ΣT (tarot sum) and classic karmic triangles.</>}
                      </p>
                      <p>
                        {language === 'sk'
                          ? <><strong className="text-amber-700">Vývojová (Lívia):</strong> hlavné sú <strong>4 zakrúžkované karmické čísla</strong> ({devResult.circled[0].value}, {devResult.circled[1].value}, {devResult.circled[2].value}, {devResult.circled[3].value}). Vyjadrujú postupné úlohy duše počas života. K3 je vrcholná misia. Roviny ani izolované čísla sa nepoužívajú.</>
                          : <><strong className="text-amber-700">Developmental (Lívia):</strong> the main elements are <strong>4 circled karmic numbers</strong> ({devResult.circled[0].value}, {devResult.circled[1].value}, {devResult.circled[2].value}, {devResult.circled[3].value}). They express progressive soul tasks throughout life. K3 is the peak mission. Planes and isolated numbers are not used.</>}
                      </p>
                      <p className="italic">
                        {language === 'sk'
                          ? 'Obe metódy môžu byť pravdivé súčasne — ide o dva uhly pohľadu na tú istú dušu. Ak chceš vidieť obe naraz, prepni sa v Settings na druhú metódu, alebo pozri Dashboard, ktorý oba zobrazuje.'
                          : 'Both methods can be true simultaneously — they are two angles of view on the same soul. To see both at once, switch to the other method in Settings, or see the Dashboard which displays both.'}
                      </p>
                    </div>
                  </details>
                  <p className="text-[11px] text-slate-500 italic mt-3">
                    {language === 'sk' ? 'Zdroj: kniha Lívia Mičková – Duchovná numerológia' : 'Source: Lívia Mičková – Spiritual Numerology'}
                  </p>
                </GlassCard>
              ) : null}

            </div>
          )}

          {visibleTab === 'planes' && (
            <PlanesTab result={result} />
          )}

          {visibleTab === 'vibrations' && (
            <div className="space-y-6">
              <GlassCard>
                <p className="text-sm text-slate-400">
                  <strong className="text-white">{language === 'sk' ? 'Vibrácie' : 'Vibrations'}</strong> {language === 'sk' ? 'sú osobné energetické cykly odvodené z vášho dátumu narodenia a aktuálneho času. Ukazujú, aké témy a úlohy sú pre vás relevantné v danom roku, mesiaci a dni. Pomáhajú plánovať dôležité rozhodnutia a aktivity v súlade s vašou osobnou energiou.' : 'are personal energy cycles derived from your date of birth and current time. They show what themes and tasks are relevant for you in a given year, month, and day. They help plan important decisions and activities in alignment with your personal energy.'}
                </p>
              </GlassCard>

              {/* Cycle picker */}
              {profile && (
                <GlassCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-white">{language === 'sk' ? 'Dátum pre výpočet vibrácií' : 'Date for vibration calculation'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'sk' ? 'Pozri si svoje ORV/OMV/ODV pre minulé alebo budúce dátumy.' : 'View your ORV/OMV/ODV for past or future dates.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={vibDate}
                        onChange={e => setVibDate(e.target.value || todayISO)}
                        className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-indigo-400"
                      />
                      {!isToday && (
                        <button
                          type="button"
                          onClick={() => setVibDate(todayISO)}
                          className="text-xs px-2 py-1 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                          ↺ {t('common.today')}
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Mesačný kalendár ODV */}
              {profile && (() => {
                const firstDay = new Date(vibYear, vibMonth - 1, 1);
                const daysInMonth = new Date(vibYear, vibMonth, 0).getDate();
                // Posun pre prvý deň – Pondelok ako prvý deň týždňa (po Európsky)
                const startWeekday = (firstDay.getDay() + 6) % 7;
                const cells: Array<{ day: number; odv: number } | null> = [];
                for (let i = 0; i < startWeekday; i++) cells.push(null);
                for (let d = 1; d <= daysInMonth; d++) {
                  const dayOdv = calculateODV(
                    calculateORV(profile.birthDay, profile.birthMonth, vibYear, vibMonth, d),
                    d,
                    vibMonth
                  );
                  cells.push({ day: d, odv: dayOdv });
                }
                while (cells.length % 7 !== 0) cells.push(null);

                // Farby podľa ODV (čakrová paleta 1-9)
                const odvColors: Record<number, { bg: string; text: string; border: string }> = {
                  1: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
                  2: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
                  3: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
                  4: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
                  5: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
                  6: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
                  7: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
                  8: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
                  9: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
                };
                const monthNames = MONTH_NAMES[language];
                const today = new Date();
                const isCurrentMonth = today.getFullYear() === vibYear && today.getMonth() + 1 === vibMonth;
                const todayDay = isCurrentMonth ? today.getDate() : -1;

                return (
                  <GlassCard>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{t('numerology.monthCalendar')}</h3>
                      <span className="text-xs text-slate-500">{monthNames[vibMonth - 1]} {vibYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {t('numerology.monthCalendarDesc')}
                    </p>

                    <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500 mb-1 text-center font-medium">
                      {WEEKDAY_SHORT[language].map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((cell, idx) => {
                        if (!cell) return <div key={idx} className="aspect-square" />;
                        const colors = odvColors[cell.odv] || odvColors[1];
                        const isToday = cell.day === todayDay;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setVibDate(`${vibYear}-${String(vibMonth).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`)}
                            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${colors.bg} ${colors.border} ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                            title={`${cell.day}. ${monthNames[vibMonth - 1]} – ODV ${cell.odv}`}
                          >
                            <span className="text-[10px] text-slate-600">{cell.day}</span>
                            <span className={`text-sm font-bold ${colors.text}`}>{cell.odv}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Legenda farieb */}
                    <div className="grid grid-cols-9 gap-1 mt-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                        const c = odvColors[n];
                        return (
                          <div key={n} className={`text-center py-1 rounded ${c.bg} ${c.border} border`}>
                            <span className={`text-[10px] font-bold ${c.text}`}>{n}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic text-center">
                      {t('numerology.tapDayHint')}
                    </p>
                  </GlassCard>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <EnergyCard
                  title={isToday ? 'ORV' : `ORV ${vibYear}`}
                  value={profile ? customOrv : result.orv}
                  subtitle={t('numerology.orvYear')}
                  icon="✦"
                  color="indigo"
                  delay={0.1}
                />
                <EnergyCard
                  title={isToday ? 'OMV' : `OMV ${vibMonth}/${vibYear}`}
                  value={profile ? customOmv : result.omv}
                  subtitle={t('numerology.omvMonth')}
                  icon="☽"
                  color="purple"
                  delay={0.2}
                />
                <EnergyCard
                  title={isToday ? 'ODV' : `ODV ${vibDay}.${vibMonth}.`}
                  value={profile ? customOdv : result.odv}
                  subtitle={t('numerology.odvDay')}
                  icon="☀"
                  color="gold"
                  delay={0.3}
                />
              </div>

              <GlassCard>
                <h3 className="font-medium text-white mb-3">{t('numerology.howVibrationsWork')}</h3>
                <div className="space-y-4 text-sm text-slate-300">
                  <p><strong className="text-indigo-300">{t('numerology.orvYear')}</strong> — {t('numerology.orvExplanation')}</p>
                  <p><strong className="text-purple-300">{t('numerology.omvMonth')}</strong> — {t('numerology.omvExplanation')}</p>
                  <p><strong className="text-amber-300">{t('numerology.odvDay')}</strong> — {t('numerology.odvExplanation')}</p>
                </div>
              </GlassCard>

              {getOrvDescription(result.orv, language) && (
                <GlassCard glow>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    ORV {result.orv} – {getOrvDescription(result.orv, language).title}
                  </h3>
                  <p className="text-sm text-indigo-300 mb-3">{getOrvDescription(result.orv, language).theme}</p>
                  <p className="text-sm text-slate-300 mb-4">{getOrvDescription(result.orv, language).description}</p>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3">
                    <p className="text-xs text-indigo-400 uppercase mb-1">{t('numerology.yearRecommendation')}</p>
                    <p className="text-sm text-slate-300">{getOrvDescription(result.orv, language).advice}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {getOrvDescription(result.orv, language).keywords.map(k => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{k}</span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {getOmvDescription(profile ? customOmv : result.omv, language) && (
                <GlassCard>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    OMV {profile ? customOmv : result.omv} – {getOmvDescription(profile ? customOmv : result.omv, language).title}
                  </h3>
                  <p className="text-sm text-purple-300 mb-3">{getOmvDescription(profile ? customOmv : result.omv, language).theme}</p>
                  <p className="text-sm text-slate-300 mb-4">{getOmvDescription(profile ? customOmv : result.omv, language).description}</p>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-3">
                    <p className="text-xs text-purple-400 uppercase mb-1">{t('numerology.monthRecommendation')}</p>
                    <p className="text-sm text-slate-300">{getOmvDescription(profile ? customOmv : result.omv, language).advice}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {getOmvDescription(profile ? customOmv : result.omv, language).keywords.map(k => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{k}</span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard>
                <h3 className="font-medium text-white mb-3">{t('numerology.allOrvOverview')}</h3>
                <p className="text-xs text-slate-400 mb-4">{t('numerology.allOrvDesc')}</p>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <div
                      key={n}
                      className={`p-3 rounded-xl border ${n === result.orv ? 'bg-indigo-500/15 border-indigo-500/40' : 'bg-slate-800/30 border-slate-700/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${n === result.orv ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-700/50 text-slate-400'}`}>
                          {n}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${n === result.orv ? 'text-white' : 'text-slate-300'}`}>{getOrvDescription(n, language).title}</p>
                          <p className="text-xs text-slate-400">{getOrvDescription(n, language).theme}</p>
                        </div>
                        {n === result.orv && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">{t('numerology.current')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {profile && (
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">{t('numerology.orvTimeline')}</h3>
                  <p className="text-xs text-slate-400 mb-4">{t('numerology.orvTimelineDesc')}</p>
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-2">
                      {(() => {
                        const now = new Date();
                        const currentYear = now.getFullYear();
                        const years = [];
                        for (let y = currentYear - 4; y <= currentYear + 4; y++) {
                          const yearOrv = calculateORV(profile.birthDay, profile.birthMonth, y);
                          years.push({ year: y, orv: yearOrv });
                        }
                        return years.map(({ year, orv: yearOrv }) => (
                          <div
                            key={year}
                            className={`flex flex-col items-center p-3 rounded-xl border min-w-[80px] ${year === currentYear ? 'bg-indigo-500/20 border-indigo-500/50 ring-1 ring-indigo-400/50' : 'bg-slate-800/30 border-slate-700/30'}`}
                          >
                            <span className={`text-xs ${year === currentYear ? 'text-indigo-300 font-bold' : 'text-slate-500'}`}>{year}</span>
                            <span className={`text-xl font-serif font-bold mt-1 ${year === currentYear ? 'text-white' : 'text-slate-300'}`}>{yearOrv}</span>
                            <span className={`text-[10px] mt-1 text-center leading-tight ${year === currentYear ? 'text-indigo-200' : 'text-slate-500'}`}>
                              {getOrvDescription(yearOrv, language)?.title.split(' ').slice(1).join(' ') || ''}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500/50"></div>
                    <span>{t('numerology.currentYear')}</span>
                  </div>
                </GlassCard>
              )}

              {/* Personal Year Timeline (B1) */}
              {profile && (
                <PersonalYearTimeline
                  birthDay={profile.birthDay}
                  birthMonth={profile.birthMonth}
                  birthYear={profile.birthYear}
                />
              )}

              {/* Histogram ORV cez celý život */}
              {profile && (
                <ORVLifeHistogram
                  birthDay={profile.birthDay}
                  birthMonth={profile.birthMonth}
                  birthYear={profile.birthYear}
                />
              )}
            </div>
          )}

          {visibleTab === 'karmic' && (
            <KarmicTab result={result} />
          )}


          {visibleTab === 'love' && (
            <LoveTab result={result} />
          )}

          {visibleTab === 'name' && (
            <NameTab defaultName={profile?.name} storageKey={profile?.id} />
          )}

          {visibleTab === 'archetype' && enneagramResult && (
            <EnneagramTab result={result} enneagramResult={enneagramResult} devResult={devResult} numerologyMethod={numerologyMethod} />
          )}

        </>
      )}
    </div>
  );
}
