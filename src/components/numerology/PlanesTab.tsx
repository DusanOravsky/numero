import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import planesData from '../../data/planes.json';

const planesInfo = planesData as { full: Record<string, { description: string; gift: string; recommendation: string }>; empty: Record<string, { description: string; lesson: string; recommendation: string }> };

interface PlanesTabProps {
  result: NumerologyResult;
}

export function PlanesTab({ result }: PlanesTabProps) {
  return (
    <div className="space-y-6">
      <GlassCard>
        <p className="text-sm text-slate-400">
          <strong className="text-white">Roviny</strong> sú zoskupenia troch čísel v mriežke (riadok, stĺpec alebo uhlopriečka). <strong className="text-green-300">Plné roviny</strong> vyjadrujú schopnosti, ktoré človek dostal do vienka. <strong className="text-amber-300">Prázdne roviny</strong> naznačujú smer, ktorým sa má osoba uberať v ďalšom rozvoji.
        </p>
        <p className="text-[11px] text-slate-500 italic mt-2">
          Zdroj: Robin Steinová – Numerológia: Čísla Lásky
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
  );
}
