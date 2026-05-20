import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { ChakraWheel } from '../components/ChakraWheel';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import type { ChakraState } from '../engine/chakraEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { motion } from 'framer-motion';
import { SkeletonChakraList } from '../components/Skeleton';
import { getEtikoterapiaForChakra } from '../data/etikoterapia';

function computeChakras(day: number, month: number, year: number, hour: number = 12, minute: number = 0): ChakraState[] {
  const numerology = calculateFullNumerology(day, month, year);
  const hd = calculateHumanDesign(day, month, year, hour, minute);
  const astro = calculateAstrology(day, month, year, hour, minute);
  const gridCounts = getGridCount(numerology.grid);
  return evaluateChakras(
    numerology.lifePathNumber,
    gridCounts,
    numerology.isolatedNumbers,
    hd.definedCenters,
    astro.dominantElement
  );
}

export function ChakrasPage() {
  const navigate = useNavigate();
  const profile = useSubject();
  const [manualChakras, setManualChakras] = useState<ChakraState[] | null>(null);

  const profileChakras = useMemo<ChakraState[] | null>(() => {
    if (!profile) return null;
    return computeChakras(
      profile.birthDay,
      profile.birthMonth,
      profile.birthYear,
      profile.birthHour ?? 12,
      profile.birthMinute ?? 0
    );
  }, [profile]);

  const chakras = manualChakras ?? profileChakras;

  const handleCalculate = (day: number, month: number, year: number, hour: number = 12, minute: number = 0) => {
    setManualChakras(computeChakras(day, month, year, hour, minute));
  };

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
          <h1 className="font-serif text-3xl font-bold text-white">Čakry</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              Klient: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient ? `Čakrová analýza klienta ${profile.name}` : 'Energetická analýza čakrového systému'}
        </p>
      </div>

      {!chakras && !profile && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Dátum narodenia" />
        </GlassCard>
      )}

      {!chakras && profile && (
        <SkeletonChakraList />
      )}

      {chakras && (
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-medium text-white mb-2">Ako sa vyhodnocujú čakry</h3>
            <p className="text-sm text-slate-400 mb-3">Stav čakier je odvodený kombináciou viacerých systémov:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <span className="text-indigo-300 font-medium">Numerológia:</span>
                <span className="text-slate-400 ml-1">Prítomnosť/absencia čísel priradených čakre v mriežke</span>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <span className="text-purple-300 font-medium">Human Design:</span>
                <span className="text-slate-400 ml-1">Definované/otvorené centrá zodpovedajúce čakrám</span>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <span className="text-cyan-300 font-medium">Astrológia:</span>
                <span className="text-slate-400 ml-1">Dominantný živel a jeho rezonancia s čakrou</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10">
                <span className="text-rose-300 font-medium">Izolované čísla:</span>
                <span className="text-slate-400 ml-1">Znižujú skóre súvisiacej čakry</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow>
            <ChakraWheel chakras={chakras} />
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca čakrami */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">Tvoje čítanie — ako pracovať s čakrami</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  Čakry nie sú „zlomené" — blokáda je signál, že v danej oblasti niečo volá po pozornosti.
                  Hyperaktivita je opačný extrém — príliš veľa energie bez usmernenia. Cieľom je rovnováha.
                </p>

                {/* Blokované čakry */}
                {(() => {
                  const blocked = chakras.filter(c => c.status === 'blocked');
                  if (blocked.length === 0) return null;
                  return (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-xs font-semibold text-rose-300 mb-2">
                        Blokované čakry ({blocked.length}): oblasti, ktoré volajú po pozornosti
                      </p>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Tieto čakry majú nízke skóre — energia v nich neprúdi voľne. Nie je to „chyba" — je to smer, kam zamerať pozornosť.
                      </p>
                      <div className="space-y-2">
                        {blocked.map(c => (
                          <div key={c.chakra.number} className="pl-3 border-l-2 border-rose-500/40">
                            <p className="text-xs text-slate-300">
                              <strong className="text-rose-300">{c.chakra.name}</strong> ({c.score}/100) — {c.chakra.blocked}
                            </p>
                            {c.recommendations[0] && (
                              <p className="text-[11px] text-slate-400 mt-0.5 italic">→ {c.recommendations[0]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Hyperaktívne čakry */}
                {(() => {
                  const hyper = chakras.filter(c => c.status === 'hyperactive');
                  if (hyper.length === 0) return null;
                  return (
                    <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs font-semibold text-yellow-300 mb-2">
                        Hyperaktívne čakry ({hyper.length}): príliš veľa energie bez usmernenia
                      </p>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Energia je tu silná — ale nemusí byť správne nasmerovaná. Pozor na „prehnanie" v týchto oblastiach.
                      </p>
                      <div className="space-y-2">
                        {hyper.map(c => (
                          <div key={c.chakra.number} className="pl-3 border-l-2 border-yellow-500/40">
                            <p className="text-xs text-slate-300">
                              <strong className="text-yellow-300">{c.chakra.name}</strong> ({c.score}/100) — {c.chakra.hyperactive}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Vyvážené čakry */}
                {(() => {
                  const balanced = chakras.filter(c => c.status === 'balanced');
                  if (balanced.length === 0) return null;
                  return (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-semibold text-emerald-300 mb-1">
                        Vyvážené čakry ({balanced.length}): {balanced.map(c => c.chakra.name).join(', ')}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tu energia prúdi zdravo. Netreba nič meniť — tieto oblasti sú tvoja opora.
                      </p>
                    </div>
                  );
                })()}

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Praktický tip</p>
                  <p className="text-xs text-slate-300">
                    Začni od blokovaných čakier — tam je najväčší potenciál zmeny. Klikni na „Etická príčina a cnosť" pri
                    blokovanej čakre nižšie — nájdeš tam konkrétne otázky a praktickú cestu. Jedna čakra naraz stačí.
                  </p>
                </div>
              </div>
            </details>
          </GlassCard>

          <div className="space-y-4">
            {chakras.map((state, idx) => (
              <motion.div
                key={state.chakra.number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: `${state.chakra.colorHex}40`, border: `2px solid ${state.chakra.colorHex}` }}
                    >
                      {state.chakra.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-white">{state.chakra.name}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-400" title="Energetické skóre čakry (0–100)">
                            {state.score}/100
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            state.status === 'balanced' ? 'bg-green-500/20 text-green-400' :
                            state.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {state.status === 'balanced' ? 'Vyvážená' : state.status === 'blocked' ? 'Blokovaná' : 'Hyperaktívna'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{state.chakra.sanskrit} | {state.chakra.location}</p>

                      {/* Vizualizácia skóre */}
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${state.score}%`,
                            backgroundColor: state.chakra.colorHex,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                        <span>0 blokovaná</span>
                        <span>50 vyvážená</span>
                        <span>80 hyperaktívna</span>
                      </div>

                      <p className="text-sm text-slate-300 mt-2">
                        {state.status === 'balanced' ? state.chakra.balanced :
                         state.status === 'blocked' ? state.chakra.blocked : state.chakra.hyperactive}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {state.chakra.themes.map(theme => (
                          <span key={theme} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{theme}</span>
                        ))}
                      </div>

                      {/* Detail výpočtu */}
                      <details className="mt-3">
                        <summary className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800 select-none">
                          Ako sa skóre {state.score} vyrátalo?
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                          <p>Východiskové skóre: <strong>50</strong></p>
                          <p>Korešpondencia s číslami {state.chakra.numerologyNumbers.join(' a ')} v mriežke:</p>
                          <ul className="list-disc list-inside ml-2 text-slate-500">
                            <li>0× → −15 bodov (chýbajúca energia)</li>
                            <li>1× → +5 bodov</li>
                            <li>2× → +10 bodov</li>
                            <li>3+× → +20 bodov</li>
                            <li>izolované číslo → −10 bodov</li>
                          </ul>
                          <p>Definované HD centrum zodpovedajúce tejto čakre: <strong>+10</strong></p>
                          <p>Dominantný element zhodný s {state.chakra.element}: <strong>+10</strong></p>
                          <p>Životné číslo = {state.chakra.number}: <strong>+15</strong></p>
                          <p className="pt-1 border-t border-slate-200 mt-1">Vyhodnotenie:</p>
                          <ul className="list-disc list-inside ml-2 text-slate-500">
                            <li>&lt; 50 → blokovaná (málo podpory)</li>
                            <li>50–79 → vyvážená (zdravá)</li>
                            <li>≥ 80 alebo 4+× rovnaké číslo → hyperaktívna</li>
                          </ul>
                        </div>
                      </details>

                      {state.recommendations.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {state.recommendations.map((rec, i) => (
                            <p key={i} className="text-xs text-indigo-300">→ {rec}</p>
                          ))}
                        </div>
                      )}

                      {/* Ayurvéda prepojenie */}
                      {state.status === 'blocked' && (
                        <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-[11px] text-amber-300">
                            {state.chakra.number === 1 ? 'Ayurvéda: Koreňová čakra súvisí s Vata dósou — strach a nestabilita. Uzemni sa teplom, rutinou a koreňovou zeleninou.' :
                             state.chakra.number === 2 ? 'Ayurvéda: Sakrálna čakra súvisí s Kapha dósou — stagnácia a emocionálne bloky. Pohyb a kreativita uvoľňujú.' :
                             state.chakra.number === 3 ? 'Ayurvéda: Solar plexus súvisí s Pitta dósou — hnev a kontrola. Chladiace jedlá a púšťanie kontroly pomáhajú.' :
                             state.chakra.number === 4 ? 'Ayurvéda: Srdcová čakra — všetky tri dóše sa tu stretávajú. Láska a odpustenie je univerzálny liek.' :
                             state.chakra.number === 5 ? 'Ayurvéda: Krčná čakra súvisí s Vata dósou — suchosť a nevyjadrenie. Spev, teplé nápoje, oleje na krk.' :
                             state.chakra.number === 6 ? 'Ayurvéda: Tretie oko — Vata/Pitta. Príliš myslenia = Vata, príliš analýzy = Pitta. Meditácia a ghee.' :
                             'Ayurvéda: Korunná čakra — presahuje dóše. Ticho, pôst, meditácia.'}
                          </p>
                        </div>
                      )}

                      {/* Etikoterapia — etická príčina + cnosť (Vogeltanz, Bezděk) */}
                      {(() => {
                        const eth = getEtikoterapiaForChakra(state.chakra.number);
                        if (!eth) return null;
                        const isBlocked = state.status === 'blocked';
                        return (
                          <details className="mt-3" open={isBlocked}>
                            <summary className="text-xs text-rose-600 cursor-pointer hover:text-rose-800 select-none flex items-center gap-1">
                              <span>✦ Etická príčina a cnosť (etikoterapia)</span>
                              {isBlocked && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                  Pri blokáde najpotrebnejšie
                                </span>
                              )}
                            </summary>
                            <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-slate-700 space-y-2">
                              <div>
                                <p className="font-medium text-rose-900">Etická téma</p>
                                <p className="text-slate-600">{eth.ethicalTheme}</p>
                              </div>
                              <div>
                                <p className="font-medium text-rose-900">Blokujúce emócie / postoje</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {eth.blockingEmotions.map(e => (
                                    <span key={e} className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px]">
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-emerald-900">Oslobodzujúca cnosť: {eth.liberatingVirtue}</p>
                                <p className="text-slate-600 leading-relaxed">{eth.virtueDescription}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">Súvisiace orgány a systémy</p>
                                <p className="text-slate-600">{eth.relatedOrgans.join(', ')}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">Typické indikátory bloku</p>
                                <ul className="list-disc list-inside ml-1 text-slate-600 space-y-0.5">
                                  {eth.symptomsHints.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-indigo-900">Otázky pre sebareflexiu</p>
                                <ul className="list-disc list-inside ml-1 text-slate-700 space-y-0.5">
                                  {eth.reflectionQuestions.map((q, i) => (
                                    <li key={i} className="italic">{q}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-emerald-900">Praktická cesta</p>
                                <p className="text-slate-700 leading-relaxed">{eth.practicalPath}</p>
                              </div>
                              <p className="pt-2 border-t border-rose-200 text-[10px] text-slate-500 italic">
                                Etikoterapia (V. Vogeltanz, C. Bezděk) — reflexný nástroj, nie medicínska diagnostika. Pri fyzických ťažkostiach navštívte lekára.
                              </p>
                            </div>
                          </details>
                        );
                      })()}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>


          {manualChakras && (
            <button
              onClick={() => setManualChakras(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
            >
              Nový výpočet
            </button>
          )}
        </div>
      )}
    </div>
  );
}
