import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateThetaHealing, getLevelName } from '../engine/thetaHealingEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { motion } from 'framer-motion';

export function ThetaHealingPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<ThetaHealingResult | null>(null);
  const [activeDigging, setActiveDigging] = useState<number | null>(null);

  const handleCalculate = (day: number, month: number, year: number) => {
    const lifePath = reduceToSingle(day + month + year);
    setResult(calculateThetaHealing(lifePath));
  };

  useEffect(() => {
    if (profile && !result) {
      const lifePath = reduceToSingle(profile.birthDay + profile.birthMonth + profile.birthYear);
      setResult(calculateThetaHealing(lifePath));
    }
  }, [profile, result]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Theta Healing</h1>
        <p className="text-slate-400 mt-1">Transformácia limitujúcich presvedčení</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Dátum narodenia" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm text-slate-400">
              <strong className="text-white">Theta Healing</strong> je technika energetického liečenia, ktorá pracuje s mozgovými vlnami v théta stave (4-7 Hz). Na základe životného čísla analyzovanej osoby identifikujeme podvedomé limitujúce presvedčenia, ktoré jej bránia žiť naplno. Táto analýza je o <strong className="text-indigo-300">vás</strong> -- ukazuje vaše koreňové presvedčenia, ich pôvod a cestu k transformácii.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-1">Ako to funguje:</p>
              <p className="text-xs text-slate-300">Každé životné číslo nesie špecifické vzorce a lekcie. Na základe toho identifikujeme limitujúce presvedčenia uložené na 4 úrovniach: Jadro (vedomá myseľ), Genetická (zdedené po predkoch), Historická (minulé životy), Duševná (hlboká duša). Kliknutím na presvedčenie zobrazíte digging (kopanie) a healing proces.</p>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="font-medium text-white mb-2">Limitujúce presvedčenia</h3>
            <p className="text-xs text-slate-400 mb-4">Toto sú podvedomé presvedčenia, ktoré sú typické pre vaše životné číslo. Kliknite na presvedčenie pre zobrazenie healing procesu.</p>
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
                      <p className="text-xs text-slate-400 mt-2">Pôvod: {belief.origin}</p>
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
                        <p className="text-xs text-slate-400 uppercase mb-2">Kopacie otázky</p>
                        <div className="space-y-1">
                          {result.diggingResults[idx].chain.map((q, i) => (
                            <p key={i} className="text-xs text-slate-300">{q}</p>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-xs text-green-400 uppercase mb-1">Nové presvedčenie</p>
                        <p className="text-sm font-medium text-white">"{result.diggingResults[idx].newBelief.belief}"</p>
                        <p className="text-xs text-slate-300 mt-1">Afirmácia: {result.diggingResults[idx].newBelief.affirmation}</p>
                        <p className="text-xs text-green-300 mt-1">Pocit: {result.diggingResults[idx].newBelief.feeling}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 uppercase mb-2">Healing kroky</p>
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
            <h3 className="font-medium text-white mb-4">Healing Workflow</h3>
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
            <h3 className="font-medium text-white mb-3">Odporúčania</h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">→</span>
                  <span className="text-sm text-slate-300">{rec}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
