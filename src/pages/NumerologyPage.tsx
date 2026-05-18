import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { NumerologyGrid } from '../components/NumerologyGrid';
import { EnergyCard } from '../components/EnergyCard';
import { VibrationCard } from '../components/VibrationCard';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology, calculateORV } from '../engine/numerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import { calculateNameNumerology } from '../engine/nameNumerologyEngine';
import type { NameNumerologyResult } from '../engine/nameNumerologyEngine';
import lifePathsData from '../data/lifePaths.json';
import isolatedData from '../data/isolatedNumbers.json';
import planesData from '../data/planes.json';
import { orvDescriptions, loveLanguageDescriptions, loveLanguageScoringExplanation, cosmicAgeDescriptions } from '../data/orvDescriptions';
import { cycleVibrationDescriptions } from '../data/planetSignDescriptions';

const planesInfo = planesData as { full: Record<string, { description: string; gift: string; recommendation: string }>; empty: Record<string, { description: string; lesson: string; recommendation: string }> };

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string; lesson: string; recommendation: string; career: string[]; relationships: string }>;
const isolatedInfo = isolatedData as Record<string, { type: string; effect: string; description: string; theme: string; shadow: string; recommendation: string; body: string }>;

export function NumerologyPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [nameResult, setNameResult] = useState<NameNumerologyResult | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'planes' | 'vibrations' | 'karmic' | 'love' | 'name'>('overview');

  const handleCalculate = (day: number, month: number, year: number) => {
    setResult(calculateFullNumerology(day, month, year));
  };

  useEffect(() => {
    if (profile && !result) {
      setResult(calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear));
    }
  }, [profile, result]);

  const lifePathInfo = result ? lifePaths[String(result.lifePathNumber)] : null;

  const tabs = [
    { id: 'overview' as const, label: 'Prehľad' },
    { id: 'planes' as const, label: 'Roviny' },
    { id: 'vibrations' as const, label: 'Vibrácie' },
    { id: 'karmic' as const, label: 'Karmické cykly' },
    { id: 'love' as const, label: 'Jazyky lásky' },
    { id: 'name' as const, label: 'Meno' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Numerológia</h1>
        <p className="text-slate-400 mt-1">Kompletný numerologický rozbor</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Zadajte dátum narodenia" />
        </GlassCard>
      )}

      {result && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white glow'
                    : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white ml-auto"
            >
              Nový výpočet
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard glow>
                  <h2 className="text-lg font-medium text-white mb-1">Životné číslo</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                      <span className="text-3xl font-serif font-bold text-white">{result.lifePathNumber}</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">z {result.lifePathFrom}</p>
                      <p className="text-lg font-medium text-white">{lifePathInfo?.title || ''}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {lifePathInfo?.keywords.map(k => (
                          <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{result.formula}</p>
                </GlassCard>

                <GlassCard>
                  <h2 className="text-lg font-medium text-white mb-4">Mriežka 3x3</h2>
                  <NumerologyGrid grid={result.grid} />
                  <div className="flex gap-4 mt-4 justify-center text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Základné</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-400"></span> Doplnkové</span>
                  </div>
                </GlassCard>
              </div>

              {lifePathInfo && (
                <GlassCard delay={0.2}>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">Výklad životného čísla {result.lifePathNumber}</h3>
                  <p className="text-slate-300 mb-4">{lifePathInfo.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-green-400 uppercase mb-1">Dar</p>
                      <p className="text-sm text-slate-300">{lifePathInfo.gift}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-red-400 uppercase mb-1">Tieň</p>
                      <p className="text-sm text-slate-300">{lifePathInfo.shadow}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-blue-400 uppercase mb-1">Lekcia</p>
                      <p className="text-sm text-slate-300">{lifePathInfo.lesson}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-400 uppercase mb-1">Odporúčanie</p>
                      <p className="text-sm text-slate-300">{lifePathInfo.recommendation}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {result.isolatedNumbers.length > 0 && (
                <GlassCard delay={0.3}>
                  <h3 className="font-medium text-white mb-2">Izolované čísla</h3>
                  <p className="text-sm text-slate-400 mb-4">Izolované čísla sú obklopené prázdnymi políčkami v mriežke. Spôsobuje to zablokovanie energie, čo sa môže prejaviť ako frustrácia, zmeny nálad, vnútorné napätie alebo agresivita.</p>
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
                              <p className="text-xs text-rose-300">{info?.type === 'nepárne' ? 'Nepárne – napätie, agresivita' : 'Párne – pasivita, utiahnutosť'}</p>
                            </div>
                          </div>
                          {info && (
                            <div className="space-y-2 mt-3">
                              <p className="text-sm text-slate-300">{info.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                  <p className="text-xs text-red-400">Tieň</p>
                                  <p className="text-xs text-slate-300">{info.shadow}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                  <p className="text-xs text-amber-400">Telo</p>
                                  <p className="text-xs text-slate-300">{info.body}</p>
                                </div>
                              </div>
                              <div className="p-2 rounded-lg bg-indigo-500/10 mt-2">
                                <p className="text-xs text-indigo-400">Odporúčanie</p>
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

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <VibrationCard
                  title="VDD"
                  value={result.vdd}
                  subtitle="Vek duchovnej dospelosti"
                  icon="⟡"
                  color="purple"
                  formula={`36 - ŽČ(${result.lifePathNumber}) = ${result.vdd}`}
                  description="Vek duchovnej dospelosti (VDD) je okamih, kedy človek začína plniť svoje životné poslanie. Do tohto veku sa pripravuje – učí sa, zbiera skúsenosti. Po VDD nastupujú karmické cykly K1-K4."
                />
                <VibrationCard
                  title="ODD"
                  value={result.oddPeriod}
                  subtitle="Obdobie duch. detstva"
                  icon="◇"
                  color="purple"
                  formula={`VDD(${result.vdd}) ÷ 3 = ${result.oddPeriod}`}
                  description={`Obdobie duchovného detstva (ODD) = ${result.oddPeriod} rokov. Duchovné detstvo trvá od narodenia do ${result.vdd} rokov a delí sa na 3 cykly po ${result.oddPeriod} rokov: 1. cyklus (0–${result.oddPeriod} r.) = vplyv matky, 2. cyklus (${result.oddPeriod}–${result.oddPeriod * 2} r.) = vplyv otca, 3. cyklus (${result.oddPeriod * 2}–${result.vdd} r.) = vplyv spoločnosti.`}
                />
                <VibrationCard
                  title="ΣT"
                  value={result.sigmaT}
                  subtitle={result.age === 'aquarius' ? 'Vek Vodnára' : 'Vek Rýb'}
                  icon="☿"
                  color="gold"
                  formula={`D + M + R = ${result.sigmaT}`}
                  description="Suma tarotu (ΣT) je súčet celého dátumu narodenia bez redukcie. Určuje, či osoba patrí do Veku Rýb (< 2000, duchovná introspekcia) alebo Veku Vodnára (>= 2000, nové paradigmy a technológie)."
                />
                <VibrationCard
                  title="Kozmický vek"
                  value={result.sigmaT >= 2000 ? 2 : 1}
                  subtitle={result.age === 'aquarius' ? 'Vodnár' : 'Ryby'}
                  icon="⚛"
                  color="indigo"
                  formula={`ΣT = ${result.sigmaT} → ${result.age === 'aquarius' ? '≥ 2000 = Vodnár' : '< 2000 = Ryby'}`}
                  description={result.age === 'aquarius' ? 'Vek Vodnára – nové technológie, kolektívne vedomie, inovácie. Človek je otvorený novým prístupom a má schopnosť prepájať duchovné s moderným.' : 'Vek Rýb – hlboká duchovnosť, introspekcia, tradičná múdrosť. Človek inklinuje k duchovným cestám a vnútornému hľadaniu pravdy.'}
                />
              </div>
            </div>
          )}

          {activeTab === 'planes' && (
            <div className="space-y-6">
              <GlassCard>
                <p className="text-sm text-slate-400">
                  <strong className="text-white">Roviny</strong> sú zoskupenia troch čísel v mriežke (riadok, stĺpec alebo uhlopriečka). <strong className="text-green-300">Plné roviny</strong> vyjadrujú schopnosti, ktoré človek dostal do vienka. <strong className="text-amber-300">Prázdne roviny</strong> naznačujú smer, ktorým sa má osoba uberať v ďalšom rozvoji.
                </p>
              </GlassCard>

              {result.fullPlanes.length > 0 && (
                <GlassCard>
                  <h3 className="font-medium text-white mb-4">Plné roviny – vaše vrodené schopnosti</h3>
                  <div className="space-y-3">
                    {result.fullPlanes.map(plane => {
                      const info = planesInfo.full[plane];
                      return (
                        <motion.div
                          key={plane}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                        >
                          <p className="font-medium text-green-300 mb-1">{plane}</p>
                          {info && (
                            <>
                              <p className="text-sm text-slate-300">{info.description}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                  <p className="text-[10px] text-green-400 uppercase">Dar</p>
                                  <p className="text-xs text-slate-300">{info.gift}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                  <p className="text-[10px] text-indigo-400 uppercase">Odporúčanie</p>
                                  <p className="text-xs text-slate-300">{info.recommendation}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>
              )}

              {result.emptyPlanes.length > 0 && (
                <GlassCard>
                  <h3 className="font-medium text-white mb-4">Prázdne roviny – oblasti rastu</h3>
                  <div className="space-y-3">
                    {result.emptyPlanes.map(plane => {
                      const info = planesInfo.empty[plane];
                      return (
                        <motion.div
                          key={plane}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                        >
                          <p className="font-medium text-amber-300 mb-1">{plane}</p>
                          {info && (
                            <>
                              <p className="text-sm text-slate-300">{info.description}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                  <p className="text-[10px] text-amber-400 uppercase">Lekcia</p>
                                  <p className="text-xs text-slate-300">{info.lesson}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                  <p className="text-[10px] text-indigo-400 uppercase">Odporúčanie</p>
                                  <p className="text-xs text-slate-300">{info.recommendation}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'vibrations' && (
            <div className="space-y-6">
              <GlassCard>
                <p className="text-sm text-slate-400">
                  <strong className="text-white">Vibrácie</strong> sú osobné energetické cykly odvodené z vášho dátumu narodenia a aktuálneho času. Ukazujú, aké témy a úlohy sú pre vás relevantné v danom roku, mesiaci a dni. Pomáhajú plánovať dôležité rozhodnutia a aktivity v súlade s vašou osobnou energiou.
                </p>
              </GlassCard>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <EnergyCard title="ORV" value={result.orv} subtitle="Osobná ročná vibrácia" icon="✦" color="indigo" delay={0.1} />
                <EnergyCard title="OMV" value={result.omv} subtitle="Osobná mesačná vibrácia" icon="☽" color="purple" delay={0.2} />
                <EnergyCard title="ODV" value={result.odv} subtitle="Osobná denná vibrácia" icon="☀" color="gold" delay={0.3} />
              </div>

              <GlassCard>
                <h3 className="font-medium text-white mb-3">Ako fungujú vibrácie</h3>
                <div className="space-y-4 text-sm text-slate-300">
                  <p><strong className="text-indigo-300">ORV (Osobná ročná vibrácia)</strong> = deň narodenia + mesiac narodenia + aktuálny rok (redukované na jednociferné). Určuje hlavnú tému celého roka od narodenín do narodenín.</p>
                  <p><strong className="text-purple-300">OMV (Osobná mesačná vibrácia)</strong> = aktuálny mesiac + ORV (redukované). Špecifikuje energiu a úlohy daného mesiaca v rámci vášho osobného roka.</p>
                  <p><strong className="text-amber-300">ODV (Osobná denná vibrácia)</strong> = aktuálny deň + aktuálny mesiac + ORV (redukované). Charakterizuje energiu konkrétneho dňa a aktivity, ktoré sú v ňom podporované.</p>
                </div>
              </GlassCard>

              {orvDescriptions[result.orv] && (
                <GlassCard glow>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    ORV {result.orv} – {orvDescriptions[result.orv].title}
                  </h3>
                  <p className="text-sm text-indigo-300 mb-3">{orvDescriptions[result.orv].theme}</p>
                  <p className="text-sm text-slate-300 mb-4">{orvDescriptions[result.orv].description}</p>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3">
                    <p className="text-xs text-indigo-400 uppercase mb-1">Odporúčanie pre tento rok</p>
                    <p className="text-sm text-slate-300">{orvDescriptions[result.orv].advice}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {orvDescriptions[result.orv].keywords.map(k => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{k}</span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard>
                <h3 className="font-medium text-white mb-3">Prehľad všetkých ORV (1-9)</h3>
                <p className="text-xs text-slate-400 mb-4">Každý rok v deväťročnom cykle má svoju jedinečnú energiu. Vaša aktuálna ORV je zvýraznená.</p>
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
                          <p className={`text-sm font-medium ${n === result.orv ? 'text-white' : 'text-slate-300'}`}>{orvDescriptions[n].title}</p>
                          <p className="text-xs text-slate-400">{orvDescriptions[n].theme}</p>
                        </div>
                        {n === result.orv && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">Aktuálny</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {profile && (
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">ORV Timeline</h3>
                  <p className="text-xs text-slate-400 mb-4">Vizualizácia vášho 9-ročného cyklu. Aktuálny rok je zvýraznený.</p>
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
                              {orvDescriptions[yearOrv]?.title.split(' ').slice(1).join(' ') || ''}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500/50"></div>
                    <span>Aktuálny rok</span>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'karmic' && (
            <div className="space-y-4">
              <GlassCard>
                <h3 className="font-medium text-white mb-2">Karmické trojuholníky</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Karmické trojuholníky udávajú životné smerovanie na obdobie 9 rokov. Čísla vo vrcholoch vyjadrujú vplyv, smerovanie a charakter obdobia daného cyklu. Život sa delí na Duchovné detstvo (príprava) a Duchovnú dospelosť (realizácia).
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-xs text-indigo-300">VDD = 36 − ŽČ</p>
                    <p className="text-lg font-bold text-white">{result.vdd} rokov</p>
                    <p className="text-xs text-slate-400">Vek duchovnej dospelosti</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs text-purple-300">ODD = VDD ÷ 3</p>
                    <p className="text-lg font-bold text-white">{result.oddPeriod} rokov</p>
                    <p className="text-xs text-slate-400">Obdobie duch. detstva (1 cyklus)</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="text-sm text-amber-300 font-medium mb-3">Duchovné detstvo</h4>
                <p className="text-xs text-slate-400 mb-3">Obdobie, ktoré pripravuje človeka na plnenie životných úloh. Doplnkové čísla (D, M, R) určujú, pod akou vibráciou sa človek vyvíja.</p>
                <div className="space-y-2">
                  {result.karmicTriangles.slice(0, 3).map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{t.label}</span>
                        <span className="text-xs text-amber-300">{t.fromAge}–{t.toAge} r.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-amber-300">{t.vibration}</span>
                        <span className="text-xs text-slate-400">({t.influence})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{t.description}</p>
                      {cycleVibrationDescriptions[t.vibration] && (
                        <p className="text-xs text-amber-200/70 mt-1 italic">{cycleVibrationDescriptions[t.vibration]}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="text-sm text-green-300 font-medium mb-3">Duchovná dospelosť (K1–K4)</h4>
                <p className="text-xs text-slate-400 mb-3">Deväťročné cykly od veku duchovnej dospelosti. Prinášajú zmeny v energii, vzťahoch, zdraví a profesii.</p>
                <div className="space-y-2">
                  {result.karmicTriangles.slice(3).map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{t.label}</span>
                        <span className="text-xs text-green-300">{t.fromAge}–{t.toAge ? t.toAge + ' r.' : '∞'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-300">{t.vibration}</span>
                        <span className="text-xs text-slate-400">({t.influence})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{t.description}</p>
                      {cycleVibrationDescriptions[t.vibration] && (
                        <p className="text-xs text-green-200/70 mt-1 italic">{cycleVibrationDescriptions[t.vibration]}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="text-sm text-cyan-300 font-medium mb-2">ΣT – Suma tarotu (Tarotové brány)</h4>
                <p className="text-xs text-slate-400 mb-3">Suma tarotu = súčet celého dátumu narodenia (deň + mesiac + rok bez redukcie). Určuje kozmický vek – aká kolektívna energia vás sprevádzala pri narodení.</p>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400">ΣT = D + M + R</p>
                    <p className="text-2xl font-bold text-white">{result.sigmaT}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${result.age === 'aquarius' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
                    {result.age === 'aquarius' ? 'Vek Vodnára (≥ 2000)' : 'Vek Rýb (< 2000)'}
                  </div>
                </div>
                {(() => {
                  const ageInfo = cosmicAgeDescriptions[result.age];
                  return ageInfo ? (
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-sm font-medium text-slate-800">{ageInfo.title}</p>
                      <p className="text-xs text-slate-600">{ageInfo.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded-lg bg-white">
                          <p className="text-[10px] text-indigo-600 uppercase">Vlastnosti</p>
                          <p className="text-xs text-slate-600">{ageInfo.traits}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white">
                          <p className="text-[10px] text-rose-600 uppercase">Vzťahy</p>
                          <p className="text-xs text-slate-600">{ageInfo.relationship}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </GlassCard>
            </div>
          )}

          {activeTab === 'love' && (
            <div className="space-y-4">
              <GlassCard>
                <p className="text-sm text-slate-400">
                  <strong className="text-white">5 jazykov lásky</strong> je koncept Garyho Chapmana, ktorý identifikuje 5 základných spôsobov, akými ľudia prijímajú a dávajú lásku. Numerologický výpočet odhaľuje váš prirodzený jazyk lásky na základe rozloženia čísel vo vašej mriežke.
                </p>
                <p className="text-xs text-slate-500 mt-2">{loveLanguageScoringExplanation}</p>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-4">Vaše jazyky lásky – numerologické skóre</h3>
                <div className="space-y-4">
                  {result.loveLanguages.map((lang, idx) => {
                    const langInfo = loveLanguageDescriptions[lang.language];
                    return (
                      <motion.div
                        key={lang.language}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{lang.language}</span>
                          <span className="text-sm text-slate-400">{lang.score} bodov</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, Math.min(100, (lang.score + 5) * 8))}%` }}
                            transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                            className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                          />
                        </div>
                        {langInfo && (
                          <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-slate-800/30 border border-slate-700/20'}`}>
                            <p className="text-xs text-slate-300 mb-1">{langInfo.description}</p>
                            <p className="text-xs text-slate-400"><strong className="text-slate-300">Príklady:</strong> {langInfo.examples}</p>
                            {idx === 0 && (
                              <p className="text-xs text-rose-300 mt-1"><strong>Ako prejaviť:</strong> {langInfo.howToShow}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-2">Ako pracovať s jazykmi lásky</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>1. <strong className="text-rose-300">Váš primárny jazyk</strong> (najvyššie skóre) je spôsob, akým najprirodzejšie prijímate aj dávate lásku.</p>
                  <p>2. <strong className="text-indigo-300">Sekundárny jazyk</strong> dopĺňa primárny a ukazuje ďalší dôležitý spôsob prepojenia.</p>
                  <p>3. <strong className="text-slate-400">Nízke skóre</strong> neznamená neschopnosť – len to, že tento jazyk vyžaduje vedomé úsilie.</p>
                  <p>4. Vo vzťahu je dôležité poznať jazyk lásky partnera a vedome ho používať.</p>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'name' && (
            <div className="space-y-4">
              <GlassCard>
                <h3 className="font-medium text-white mb-3">Numerológia mena</h3>
                <p className="text-sm text-slate-400 mb-4">Zadajte celé meno (krstné + priezvisko) pre výpočet čísla výrazu, duše a osobnosti.</p>
                <form onSubmit={(e) => { e.preventDefault(); if (nameInput.trim()) setNameResult(calculateNameNumerology(nameInput)); }} className="flex gap-3">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Meno a priezvisko"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                  <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500">
                    Vypočítať
                  </button>
                </form>
              </GlassCard>

              {nameResult && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <EnergyCard title="Číslo výrazu" value={nameResult.expressionNumber} subtitle="Celé meno – životná cesta" icon="✦" color="indigo" delay={0.1} />
                    <EnergyCard title="Číslo duše" value={nameResult.soulNumber} subtitle="Samohlásky – vnútorná túžba" icon="♡" color="rose" delay={0.2} />
                    <EnergyCard title="Číslo osobnosti" value={nameResult.personalityNumber} subtitle="Spoluhlásky – vonkajší prejav" icon="◎" color="cyan" delay={0.3} />
                  </div>

                  <GlassCard>
                    <h4 className="text-sm text-slate-400 mb-3">Rozklad písmen</h4>
                    <div className="flex flex-wrap gap-1">
                      {nameResult.letters.map((l, i) => (
                        <div key={i} className={`w-8 h-10 rounded-lg flex flex-col items-center justify-center text-xs ${l.isVowel ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'}`}>
                          <span className="text-white font-medium uppercase">{l.letter}</span>
                          <span className={`text-[10px] ${l.isVowel ? 'text-rose-300' : 'text-indigo-300'}`}>{l.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500/30"></span> Samohlásky (duša)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500/30"></span> Spoluhlásky (osobnosť)</span>
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-indigo-400 uppercase mb-1">Číslo výrazu ({nameResult.expressionNumber})</p>
                        <p className="text-sm text-slate-300">{nameResult.expressionDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-rose-400 uppercase mb-1">Číslo duše ({nameResult.soulNumber})</p>
                        <p className="text-sm text-slate-300">{nameResult.soulDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400 uppercase mb-1">Číslo osobnosti ({nameResult.personalityNumber})</p>
                        <p className="text-sm text-slate-300">{nameResult.personalityDescription}</p>
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
