import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
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
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
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
        <h1 className="font-serif text-3xl font-bold text-white">Čakry</h1>
        <p className="text-slate-400 mt-1">Energetická analýza čakrového systému</p>
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
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setManualChakras(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
