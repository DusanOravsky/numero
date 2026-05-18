import { useState } from 'react';
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

export function ChakrasPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [chakras, setChakras] = useState<ChakraState[] | null>(null);

  const handleCalculate = (day: number, month: number, year: number) => {
    const numerology = calculateFullNumerology(day, month, year);
    const hd = calculateHumanDesign(day, month, year);
    const astro = calculateAstrology(day, month, year);
    const gridCounts = getGridCount(numerology.grid);
    const result = evaluateChakras(
      numerology.lifePathNumber,
      gridCounts,
      numerology.isolatedNumbers,
      hd.definedCenters,
      astro.dominantElement
    );
    setChakras(result);
  };

  if (profile && !chakras) {
    handleCalculate(profile.birthDay, profile.birthMonth, profile.birthYear);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Čakry</h1>
        <p className="text-slate-400 mt-1">Energetická analýza čakrového systému</p>
      </div>

      {!chakras && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Dátum narodenia" />
        </GlassCard>
      )}

      {chakras && (
        <div className="space-y-6">
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
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{state.chakra.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          state.status === 'balanced' ? 'bg-green-500/20 text-green-400' :
                          state.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {state.status === 'balanced' ? 'Vyvážená' : state.status === 'blocked' ? 'Blokovaná' : 'Hyperaktívna'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{state.chakra.sanskrit} | {state.chakra.location}</p>
                      <p className="text-sm text-slate-300 mt-2">
                        {state.status === 'balanced' ? state.chakra.balanced :
                         state.status === 'blocked' ? state.chakra.blocked : state.chakra.hyperactive}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {state.chakra.themes.map(theme => (
                          <span key={theme} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{theme}</span>
                        ))}
                      </div>
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
            onClick={() => setChakras(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
