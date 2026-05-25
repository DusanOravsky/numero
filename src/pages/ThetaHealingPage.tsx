import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { MeditationTimer } from '../components/MeditationTimer';
import { calculateThetaHealing, getLevelName } from '../engine/thetaHealingEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { motion } from 'framer-motion';

export function ThetaHealingPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useSubject();
  // Pre manuálny výpočet (DateInput bez profilu) — držíme override.
  const [manualResult, setManualResult] = useState<ThetaHealingResult | null>(null);
  const [activeDigging, setActiveDigging] = useState<number | null>(null);

  // Auto-result odvodený od profilu cez useMemo. Pri DateInput-e prepneme cez manualResult.
  const profileResult = useMemo<ThetaHealingResult | null>(() => {
    if (!profile) return null;
    const lifePath = reduceToSingle(profile.birthDay + profile.birthMonth + profile.birthYear);
    return calculateThetaHealing(lifePath);
  }, [profile]);

  const result = manualResult ?? profileResult;

  const handleCalculate = (day: number, month: number, year: number) => {
    const lifePath = reduceToSingle(day + month + year);
    setManualResult(calculateThetaHealing(lifePath));
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
          <h1 className="font-serif text-3xl font-bold text-white">{t('theta.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient ? (language === 'sk' ? `Theta Healing pre klienta ${profile.name}` : `Theta Healing for client ${profile.name}`) : t('theta.subtitle')}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label={t('profile.birthDate')} />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm text-slate-400">
              {language === 'sk'
                ? <><strong className="text-white">Theta Healing</strong> je technika energetického liečenia, ktorá pracuje s mozgovými vlnami v théta stave (4-7 Hz). Na základe životného čísla analyzovanej osoby identifikujeme podvedomé limitujúce presvedčenia, ktoré jej bránia žiť naplno. Táto analýza je o <strong className="text-indigo-300">vás</strong> -- ukazuje vaše koreňové presvedčenia, ich pôvod a cestu k transformácii.</>
                : <><strong className="text-white">Theta Healing</strong> is an energy healing technique that works with brain waves in the theta state (4-7 Hz). Based on the life path number of the analyzed person, we identify subconscious limiting beliefs that prevent them from living fully. This analysis is about <strong className="text-indigo-300">you</strong> — it shows your root beliefs, their origin, and the path to transformation.</>
              }
            </p>
            <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-1">{language === 'sk' ? 'Ako to funguje:' : 'How it works:'}</p>
              <p className="text-xs text-slate-300">{language === 'sk' ? 'Každé životné číslo nesie špecifické vzorce a lekcie. Na základe toho identifikujeme limitujúce presvedčenia uložené na 4 úrovniach: Jadro (vedomá myseľ), Genetická (zdedené po predkoch), Historická (minulé životy), Duševná (hlboká duša). Kliknutím na presvedčenie zobrazíte digging (kopanie) a healing proces.' : 'Each life path number carries specific patterns and lessons. Based on this, we identify limiting beliefs stored at 4 levels: Core (conscious mind), Genetic (inherited from ancestors), Historical (past lives), Soul (deep soul). Click on a belief to see the digging and healing process.'}</p>
            </div>
          </GlassCard>

          {/* Tvoje čítanie */}
          <GlassCard glow>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Tvoje čítanie — tvoje koreňové presvedčenia' : 'Your reading — your root beliefs'}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                {language === 'sk'
                  ? <>Theta Healing ukazuje <strong className="text-white">podvedomé presvedčenia</strong>, ktoré ti bránia — veci, ktoré si hovoríš sám sebe bez toho, aby si si to uvedomoval. Na základe tvojho životného čísla boli identifikované tieto hlavné vzorce:</>
                  : <>Theta Healing reveals <strong className="text-white">subconscious beliefs</strong> that hold you back — things you tell yourself without realizing it. Based on your life path number, these main patterns have been identified:</>
                }
              </p>
              <div className="space-y-2">
                {result.primaryBeliefs.slice(0, 3).map((b, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <p className="text-xs font-medium text-rose-300">„{b.belief}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'sk' ? 'Úroveň' : 'Level'}: {b.level} | {language === 'sk' ? 'Emócia' : 'Emotion'}: {b.emotion} | {language === 'sk' ? 'Telo' : 'Body'}: {b.bodyArea}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic">
                {language === 'sk'
                  ? 'Vyber si to, pri ktorom cítiš najväčší odpor — tam je najväčší potenciál rastu. Klikni naň nižšie pre „kopacie" cvičenie a nahrádzajúce presvedčenie.'
                  : 'Choose the one where you feel the most resistance — that is where the greatest growth potential lies. Click on it below for the digging exercise and replacement belief.'}
              </p>
            </div>
          </GlassCard>

          {/* 4 úrovne vysvetlené */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? '4 úrovne presvedčení' : '4 levels of beliefs'}</h3>
            <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Presvedčenia sa ukladajú na rôznych úrovniach — každá vyžaduje iný prístup:' : 'Beliefs are stored at different levels — each requires a different approach:'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs text-indigo-300 font-semibold">{language === 'sk' ? 'Koreňová (Core)' : 'Core'}</p>
                <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Vznikla v tomto živote (detstvo, trauma). Najrýchlejšie sa mení — stačí uvedomenie + nové presvedčenie.' : 'Formed in this lifetime (childhood, trauma). Changes the fastest — awareness + a new belief is enough.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-300 font-semibold">{language === 'sk' ? 'Genetická' : 'Genetic'}</p>
                <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Zdedená po predkoch (rodová línia). Nesieš vzorce rodičov/starých rodičov. Lieči sa cez odpustenie rodu.' : 'Inherited from ancestors (family lineage). You carry patterns of parents/grandparents. Healed through forgiving the lineage.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-300 font-semibold">{language === 'sk' ? 'Historická' : 'Historical'}</p>
                <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Z minulých životov alebo kolektívnej pamäte. Prejavuje sa ako iracionálne strachy bez zjavnej príčiny.' : 'From past lives or collective memory. Manifests as irrational fears without an apparent cause.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-300 font-semibold">{language === 'sk' ? 'Duševná (Soul)' : 'Soul'}</p>
                <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Najhlbšia — duševné kontrakty a dohody. Mení sa cez vedomé zrušenie starého kontraktu a vytvorenie nového.' : 'The deepest — soul contracts and agreements. Changed through consciously canceling the old contract and creating a new one.'}</p>
              </div>
            </div>
          </GlassCard>

          {/* Nahrádzajúce presvedčenia — čo namiesto starého */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Tvoje nové presvedčenia' : 'Your new beliefs'}</h3>
            <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Ku každému limitujúcemu presvedčeniu existuje nahrádzajúce — toto je to, čím ho vedome nahradíš:' : 'For each limiting belief there is a replacement — this is what you consciously replace it with:'}</p>
            <div className="space-y-3">
              {result.diggingResults.map((dr, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-rose-300 line-through mb-1">„{dr.rootBelief.belief}"</p>
                  <p className="text-sm text-emerald-300 font-medium">→ „{dr.newBelief.belief}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">{language === 'sk' ? 'Afirmácia' : 'Affirmation'}: <em>„{dr.newBelief.affirmation}"</em></p>
                  <p className="text-[11px] text-slate-500">{language === 'sk' ? 'Pocit' : 'Feeling'}: {dr.newBelief.feeling}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Telesné prepojenie + cvičenia */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Kde to telo drží' : 'Where the body holds it'}</h3>
            <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Každé presvedčenie sa ukladá v konkrétnej časti tela. Keď cítiš napätie v danej oblasti, môže to byť signál:' : 'Each belief is stored in a specific part of the body. When you feel tension in that area, it may be a signal:'}</p>
            <div className="space-y-2">
              {result.primaryBeliefs.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-500/5 border border-slate-500/10">
                  <span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 shrink-0">{b.bodyArea}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300">„{b.belief}"</p>
                    <p className="text-[11px] text-slate-500">{language === 'sk' ? 'Emócia' : 'Emotion'}: {b.emotion} | {language === 'sk' ? 'Pôvod' : 'Origin'}: {b.origin}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-1">{language === 'sk' ? 'Praktické uvoľnenie:' : 'Practical release:'}</p>
              <p className="text-[11px] text-slate-300">
                {language === 'sk'
                  ? 'Polož ruku na miesto kde cítiš napätie. Dýchaj hlboko do tej oblasti. Povedz nahlas: „Vidím ťa. Ďakujem za ochranu. Púšťam ťa." Opakuj 3× denne, 2 minúty.'
                  : 'Place your hand on the area where you feel tension. Breathe deeply into that area. Say aloud: "I see you. Thank you for protecting me. I release you." Repeat 3 times daily, 2 minutes.'}
              </p>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Limitujúce presvedčenia' : 'Limiting beliefs'}</h3>
            <p className="text-xs text-slate-400 mb-4">{language === 'sk' ? 'Toto sú podvedomé presvedčenia, ktoré sú typické pre vaše životné číslo. Kliknite na presvedčenie pre zobrazenie healing procesu.' : 'These are subconscious beliefs typical for your life path number. Click on a belief to display the healing process.'}</p>
            <div className="space-y-4">
              {result.primaryBeliefs.map((belief, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 cursor-pointer hover:bg-red-500/15 transition-colors"
                  onClick={() => setActiveDigging(activeDigging === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">"{belief.belief}"</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{getLevelName(belief.level)}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{belief.emotion}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{belief.bodyArea}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{language === 'sk' ? 'Pôvod' : 'Origin'}: {belief.origin}</p>
                    </div>
                    <span className="text-slate-500">{activeDigging === idx ? '▼' : '▶'}</span>
                  </div>

                  {activeDigging === idx && result.diggingResults[idx] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-red-500/20 space-y-4"
                    >
                      <div>
                        <p className="text-xs text-slate-400 uppercase mb-2">{language === 'sk' ? 'Kopacie otázky' : 'Digging questions'}</p>
                        <div className="space-y-1">
                          {result.diggingResults[idx].chain.map((q, i) => (
                            <p key={i} className="text-xs text-slate-300">{q}</p>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-xs text-green-400 uppercase mb-1">{language === 'sk' ? 'Nové presvedčenie' : 'New belief'}</p>
                        <p className="text-sm font-medium text-white">"{result.diggingResults[idx].newBelief.belief}"</p>
                        <p className="text-xs text-slate-300 mt-1">{language === 'sk' ? 'Afirmácia' : 'Affirmation'}: {result.diggingResults[idx].newBelief.affirmation}</p>
                        <p className="text-xs text-green-300 mt-1">{language === 'sk' ? 'Pocit' : 'Feeling'}: {result.diggingResults[idx].newBelief.feeling}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 uppercase mb-2">{language === 'sk' ? 'Healing kroky' : 'Healing steps'}</p>
                        <div className="space-y-1">
                          {result.diggingResults[idx].healingSteps.map((step, i) => (
                            <p key={i} className="text-xs text-indigo-300">
                              {i + 1}. {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4">{language === 'sk' ? 'Healing Workflow' : 'Healing Workflow'}</h3>
            <div className="space-y-3">
              {result.healingWorkflow.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <span className="text-xs text-indigo-300">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-300">{step.replace(/^\d+\.\s*/, '')}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Odporúčania' : 'Recommendations'}</h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">→</span>
                  <span className="text-sm text-slate-300">{rec}</span>
                </div>
              ))}
            </div>
          </GlassCard>


          {manualResult && (
            <button
              onClick={() => setManualResult(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
            >
              {t('common.newCalculation')}
            </button>
          )}
        </div>
      )}

      <MeditationTimer />
    </div>
  );
}
