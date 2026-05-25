import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from '../components/GlassCard';
import { ChakraBody } from '../components/ChakraBody';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import type { ChakraState } from '../engine/chakraEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { motion } from 'framer-motion';
import { SkeletonChakraList } from '../components/Skeleton';
import { getEtikoterapiaForChakra } from '../data/etikoterapia';
import { displayName, CHAKRA_NAME_DISPLAY, CHAKRA_LOCATION_DISPLAY, CHAKRA_ELEMENT_DISPLAY, CHAKRA_THEME_DISPLAY, CHAKRA_STATUS_TEXT } from '../i18n/entityNames';

function computeChakras(day: number, month: number, year: number, hour: number = 12, minute: number = 0, lat: number = 48.15, lon: number = 17.11, tz: number = 1): ChakraState[] {
  const numerology = calculateFullNumerology(day, month, year);
  const hd = calculateHumanDesign(day, month, year, hour, minute, tz);
  const astro = calculateAstrology(day, month, year, hour, minute, lat, lon, tz);
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
  const { t, language } = useTranslation();
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
      profile.birthMinute ?? 0,
      profile.birthLatitude ?? 48.15,
      profile.birthLongitude ?? 17.11,
      profile.timezoneOffset
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
            {t('clients.backToClient')} {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">{t('chakras.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient
            ? (language === 'sk' ? `Čakrová analýza klienta ${profile.name}` : `Chakra analysis of client ${profile.name}`)
            : (language === 'sk' ? 'Energetická analýza čakrového systému' : 'Energy analysis of the chakra system')}
        </p>
      </div>

      {!chakras && !profile && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label={t('profile.birthDate')} />
        </GlassCard>
      )}

      {!chakras && profile && (
        <SkeletonChakraList />
      )}

      {chakras && (
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-medium text-white mb-2">{t('chakras.howEvaluated')}</h3>
            <p className="text-sm text-slate-400 mb-3">{language === 'sk' ? 'Stav čakier je odvodený kombináciou viacerých systémov:' : 'Chakra state is derived from a combination of multiple systems:'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <span className="text-indigo-300 font-medium">{language === 'sk' ? 'Numerológia:' : 'Numerology:'}</span>
                <span className="text-slate-400 ml-1">{language === 'sk' ? 'Prítomnosť/absencia čísel priradených čakre v mriežke' : 'Presence/absence of numbers assigned to the chakra in the grid'}</span>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <span className="text-purple-300 font-medium">Human Design:</span>
                <span className="text-slate-400 ml-1">{language === 'sk' ? 'Definované/otvorené centrá zodpovedajúce čakrám' : 'Defined/open centers corresponding to chakras'}</span>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <span className="text-cyan-300 font-medium">{language === 'sk' ? 'Astrológia:' : 'Astrology:'}</span>
                <span className="text-slate-400 ml-1">{language === 'sk' ? 'Dominantný živel a jeho rezonancia s čakrou' : 'Dominant element and its resonance with the chakra'}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10">
                <span className="text-rose-300 font-medium">{language === 'sk' ? 'Izolované čísla:' : 'Isolated numbers:'}</span>
                <span className="text-slate-400 ml-1">{language === 'sk' ? 'Znižujú skóre súvisiacej čakry' : 'Reduce the score of the related chakra'}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow>
            <ChakraBody chakras={chakras} />
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca čakrami */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">{t('chakras.yourReading')}</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  {language === 'sk'
                    ? 'Čakry nie sú „zlomené" — blokáda je signál, že v danej oblasti niečo volá po pozornosti. Hyperaktivita je opačný extrém — príliš veľa energie bez usmernenia. Cieľom je rovnováha.'
                    : 'Chakras are not "broken" — a blockage is a signal that something in that area calls for attention. Hyperactivity is the opposite extreme — too much energy without direction. The goal is balance.'}
                </p>

                {/* Blokované čakry */}
                {(() => {
                  const blocked = chakras.filter(c => c.status === 'blocked');
                  if (blocked.length === 0) return null;
                  return (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-xs font-semibold text-rose-300 mb-2">
                        {language === 'sk'
                          ? `Blokované čakry (${blocked.length}): oblasti, ktoré volajú po pozornosti`
                          : `Blocked chakras (${blocked.length}): areas that call for attention`}
                      </p>
                      <p className="text-[11px] text-slate-400 mb-2">
                        {language === 'sk'
                          ? 'Tieto čakry majú nízke skóre — energia v nich neprúdi voľne. Nie je to „chyba" — je to smer, kam zamerať pozornosť.'
                          : 'These chakras have low scores — energy does not flow freely through them. This is not a "fault" — it is a direction to focus your attention.'}
                      </p>
                      <div className="space-y-2">
                        {blocked.map(c => (
                          <div key={c.chakra.number} className="pl-3 border-l-2 border-rose-500/40">
                            <p className="text-xs text-slate-300">
                              <strong className="text-rose-300">{displayName(CHAKRA_NAME_DISPLAY, c.chakra.name, language)}</strong> ({c.score}/100) — {CHAKRA_STATUS_TEXT[c.chakra.number]?.blocked[language] ?? c.chakra.blocked}
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
                        {language === 'sk'
                          ? `Hyperaktívne čakry (${hyper.length}): príliš veľa energie bez usmernenia`
                          : `Hyperactive chakras (${hyper.length}): too much energy without direction`}
                      </p>
                      <p className="text-[11px] text-slate-400 mb-2">
                        {language === 'sk'
                          ? 'Energia je tu silná — ale nemusí byť správne nasmerovaná. Pozor na „prehnanie" v týchto oblastiach.'
                          : 'The energy here is strong — but it may not be properly directed. Watch out for "overdoing it" in these areas.'}
                      </p>
                      <div className="space-y-2">
                        {hyper.map(c => (
                          <div key={c.chakra.number} className="pl-3 border-l-2 border-yellow-500/40">
                            <p className="text-xs text-slate-300">
                              <strong className="text-yellow-300">{displayName(CHAKRA_NAME_DISPLAY, c.chakra.name, language)}</strong> ({c.score}/100) — {CHAKRA_STATUS_TEXT[c.chakra.number]?.hyperactive[language] ?? c.chakra.hyperactive}
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
                        {language === 'sk'
                          ? `Vyvážené čakry (${balanced.length}): ${balanced.map(c => c.chakra.name).join(', ')}`
                          : `Balanced chakras (${balanced.length}): ${balanced.map(c => displayName(CHAKRA_NAME_DISPLAY, c.chakra.name, language)).join(', ')}`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {language === 'sk'
                          ? 'Tu energia prúdi zdravo. Netreba nič meniť — tieto oblasti sú tvoja opora.'
                          : 'Energy flows healthily here. No need to change anything — these areas are your support.'}
                      </p>
                    </div>
                  );
                })()}

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
                  <p className="text-xs text-slate-300">
                    {language === 'sk'
                      ? 'Začni od blokovaných čakier — tam je najväčší potenciál zmeny. Klikni na „Etická príčina a cnosť" pri blokovanej čakre nižšie — nájdeš tam konkrétne otázky a praktickú cestu. Jedna čakra naraz stačí.'
                      : 'Start with blocked chakras — that is where the greatest potential for change lies. Click "Ethical cause and virtue" on a blocked chakra below — you will find specific questions and a practical path. One chakra at a time is enough.'}
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
                        <h4 className="font-medium text-white">{displayName(CHAKRA_NAME_DISPLAY, state.chakra.name, language)}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-400" title={language === 'sk' ? 'Energetické skóre čakry (0–100)' : 'Chakra energy score (0–100)'}>
                            {state.score}/100
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            state.status === 'balanced' ? 'bg-green-500/20 text-green-400' :
                            state.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {state.status === 'balanced' ? t('chakras.balanced') : state.status === 'blocked' ? t('chakras.blocked') : t('chakras.hyperactive')}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{state.chakra.sanskrit} | {displayName(CHAKRA_LOCATION_DISPLAY, state.chakra.location, language)}</p>

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
                        <span>0 {language === 'sk' ? 'blokovaná' : 'blocked'}</span>
                        <span>50 {language === 'sk' ? 'vyvážená' : 'balanced'}</span>
                        <span>80 {language === 'sk' ? 'hyperaktívna' : 'hyperactive'}</span>
                      </div>

                      <p className="text-sm text-slate-300 mt-2">
                        {CHAKRA_STATUS_TEXT[state.chakra.number]?.[state.status][language] ??
                          (state.status === 'balanced' ? state.chakra.balanced :
                           state.status === 'blocked' ? state.chakra.blocked : state.chakra.hyperactive)}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {state.chakra.themes.map(theme => (
                          <span key={theme} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{displayName(CHAKRA_THEME_DISPLAY, theme, language)}</span>
                        ))}
                      </div>

                      {/* Detail výpočtu */}
                      <details className="mt-3">
                        <summary className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800 select-none">
                          {t('chakras.scoreExplanation')} ({state.score})
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                          <p>{language === 'sk' ? 'Východiskové skóre' : 'Starting score'}: <strong>50</strong></p>
                          <p>{language === 'sk' ? `Korešpondencia s číslami ${state.chakra.numerologyNumbers.join(' a ')} v mriežke:` : `Correspondence with numbers ${state.chakra.numerologyNumbers.join(' and ')} in the grid:`}</p>
                          <ul className="list-disc list-inside ml-2 text-slate-500">
                            <li>0× → −15 {language === 'sk' ? 'bodov (chýbajúca energia)' : 'points (missing energy)'}</li>
                            <li>1× → +5 {language === 'sk' ? 'bodov' : 'points'}</li>
                            <li>2× → +10 {language === 'sk' ? 'bodov' : 'points'}</li>
                            <li>3+× → +20 {language === 'sk' ? 'bodov' : 'points'}</li>
                            <li>{language === 'sk' ? 'izolované číslo → −10 bodov' : 'isolated number → −10 points'}</li>
                          </ul>
                          <p>{language === 'sk' ? 'Definované HD centrum zodpovedajúce tejto čakre' : 'Defined HD center corresponding to this chakra'}: <strong>+10</strong></p>
                          <p>{language === 'sk' ? `Dominantný element zhodný s ${state.chakra.element}` : `Dominant element matching ${displayName(CHAKRA_ELEMENT_DISPLAY, state.chakra.element, 'en')}`}: <strong>+10</strong></p>
                          <p>{language === 'sk' ? `Životné číslo = ${state.chakra.number}` : `Life path number = ${state.chakra.number}`}: <strong>+15</strong></p>
                          <p className="pt-1 border-t border-slate-200 mt-1">{language === 'sk' ? 'Vyhodnotenie:' : 'Evaluation:'}</p>
                          <ul className="list-disc list-inside ml-2 text-slate-500">
                            <li>&lt; 50 → {language === 'sk' ? 'blokovaná (málo podpory)' : 'blocked (low support)'}</li>
                            <li>50–79 → {language === 'sk' ? 'vyvážená (zdravá)' : 'balanced (healthy)'}</li>
                            <li>≥ 80 {language === 'sk' ? 'alebo' : 'or'} 4+× {language === 'sk' ? 'rovnaké číslo → hyperaktívna' : 'same number → hyperactive'}</li>
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
                            {language === 'sk'
                              ? (state.chakra.number === 1 ? 'Ayurvéda: Koreňová čakra súvisí s Vata dósou — strach a nestabilita. Uzemni sa teplom, rutinou a koreňovou zeleninou.' :
                                 state.chakra.number === 2 ? 'Ayurvéda: Sakrálna čakra súvisí s Kapha dósou — stagnácia a emocionálne bloky. Pohyb a kreativita uvoľňujú.' :
                                 state.chakra.number === 3 ? 'Ayurvéda: Solar plexus súvisí s Pitta dósou — hnev a kontrola. Chladiace jedlá a púšťanie kontroly pomáhajú.' :
                                 state.chakra.number === 4 ? 'Ayurvéda: Srdcová čakra — všetky tri dóše sa tu stretávajú. Láska a odpustenie je univerzálny liek.' :
                                 state.chakra.number === 5 ? 'Ayurvéda: Krčná čakra súvisí s Vata dósou — suchosť a nevyjadrenie. Spev, teplé nápoje, oleje na krk.' :
                                 state.chakra.number === 6 ? 'Ayurvéda: Tretie oko — Vata/Pitta. Príliš myslenia = Vata, príliš analýzy = Pitta. Meditácia a ghee.' :
                                 'Ayurvéda: Korunná čakra — presahuje dóše. Ticho, pôst, meditácia.')
                              : (state.chakra.number === 1 ? 'Ayurveda: Root chakra relates to Vata dosha — fear and instability. Ground yourself with warmth, routine, and root vegetables.' :
                                 state.chakra.number === 2 ? 'Ayurveda: Sacral chakra relates to Kapha dosha — stagnation and emotional blocks. Movement and creativity release them.' :
                                 state.chakra.number === 3 ? 'Ayurveda: Solar plexus relates to Pitta dosha — anger and control. Cooling foods and letting go of control help.' :
                                 state.chakra.number === 4 ? 'Ayurveda: Heart chakra — all three doshas meet here. Love and forgiveness are the universal remedy.' :
                                 state.chakra.number === 5 ? 'Ayurveda: Throat chakra relates to Vata dosha — dryness and unexpression. Singing, warm drinks, oils on the throat.' :
                                 state.chakra.number === 6 ? 'Ayurveda: Third eye — Vata/Pitta. Too much thinking = Vata, too much analysis = Pitta. Meditation and ghee.' :
                                 'Ayurveda: Crown chakra — transcends doshas. Silence, fasting, meditation.')}
                          </p>
                        </div>
                      )}

                      {/* Etikoterapia — etická príčina + cnosť (Vogeltanz, Bezděk) */}
                      {(() => {
                        const eth = getEtikoterapiaForChakra(state.chakra.number, language);
                        if (!eth) return null;
                        const isBlocked = state.status === 'blocked';
                        return (
                          <details className="mt-3" open={isBlocked}>
                            <summary className="text-xs text-rose-600 cursor-pointer hover:text-rose-800 select-none flex items-center gap-1">
                              <span>✦ {t('chakras.etikoterapia')}</span>
                              {isBlocked && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                  {language === 'sk' ? 'Pri blokáde najpotrebnejšie' : 'Most needed when blocked'}
                                </span>
                              )}
                            </summary>
                            <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-slate-700 space-y-2">
                              <div>
                                <p className="font-medium text-rose-900">{language === 'sk' ? 'Etická téma' : 'Ethical theme'}</p>
                                <p className="text-slate-600">{eth.ethicalTheme}</p>
                              </div>
                              <div>
                                <p className="font-medium text-rose-900">{language === 'sk' ? 'Blokujúce emócie / postoje' : 'Blocking emotions / attitudes'}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {eth.blockingEmotions.map(e => (
                                    <span key={e} className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px]">
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-emerald-900">{language === 'sk' ? 'Oslobodzujúca cnosť' : 'Liberating virtue'}: {eth.liberatingVirtue}</p>
                                <p className="text-slate-600 leading-relaxed">{eth.virtueDescription}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">{language === 'sk' ? 'Súvisiace orgány a systémy' : 'Related organs and systems'}</p>
                                <p className="text-slate-600">{eth.relatedOrgans.join(', ')}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">{language === 'sk' ? 'Typické indikátory bloku' : 'Typical block indicators'}</p>
                                <ul className="list-disc list-inside ml-1 text-slate-600 space-y-0.5">
                                  {eth.symptomsHints.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-indigo-900">{language === 'sk' ? 'Otázky pre sebareflexiu' : 'Questions for self-reflection'}</p>
                                <ul className="list-disc list-inside ml-1 text-slate-700 space-y-0.5">
                                  {eth.reflectionQuestions.map((q, i) => (
                                    <li key={i} className="italic">{q}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-emerald-900">{language === 'sk' ? 'Praktická cesta' : 'Practical path'}</p>
                                <p className="text-slate-700 leading-relaxed">{eth.practicalPath}</p>
                              </div>
                              <p className="pt-2 border-t border-rose-200 text-[10px] text-slate-500 italic">
                                {language === 'sk'
                                  ? 'Etikoterapia (V. Vogeltanz, C. Bezděk) — reflexný nástroj, nie medicínska diagnostika. Pri fyzických ťažkostiach navštívte lekára.'
                                  : 'Etikoterapia (V. Vogeltanz, C. Bezděk) — a reflective tool, not medical diagnostics. For physical issues, consult a physician.'}
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
              {t('common.newCalculation')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
