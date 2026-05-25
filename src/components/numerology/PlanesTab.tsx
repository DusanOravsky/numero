import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import { getFullPlane, getEmptyPlane, getPlaneName } from '../../data/planes';
import { useTranslation } from '../../i18n/useTranslation';

interface PlanesTabProps {
  result: NumerologyResult;
}

export function PlanesTab({ result }: PlanesTabProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-6">
      <GlassCard>
        <p className="text-sm text-slate-400">
          <strong className="text-white">{t('numerology.tabPlanes')}</strong> sú zoskupenia troch čísel v mriežke (riadok, stĺpec alebo uhlopriečka). <strong className="text-green-300">{t('numerology.fullPlanes')}</strong> vyjadrujú schopnosti, ktoré človek dostal do vienka. <strong className="text-amber-300">{t('numerology.emptyPlanes')}</strong> naznačujú smer, ktorým sa má osoba uberať v ďalšom rozvoji.
        </p>
        <p className="text-[11px] text-slate-500 italic mt-2">
          Zdroj: Robin Steinová – Numerológia: Čísla Lásky
        </p>
      </GlassCard>

      {result.fullPlanes.length > 0 && (
        <GlassCard>
          <h3 className="font-medium text-white mb-4">{t('numerology.fullPlanesHeading')}</h3>
          <div className="space-y-3">
            {result.fullPlanes.map(plane => {
              const info = getFullPlane(plane, language);
              return (
                <motion.div
                  key={plane}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <p className="font-medium text-green-300 mb-1">{getPlaneName(plane, language)}</p>
                  {info && (
                    <>
                      <p className="text-sm text-slate-300">{info.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <p className="text-[10px] text-green-400 uppercase">{t('summary.gift')}</p>
                          <p className="text-xs text-slate-300">{info.gift}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                          <p className="text-[10px] text-indigo-400 uppercase">{t('numerology.recommendation')}</p>
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
          <h3 className="font-medium text-white mb-4">{t('numerology.emptyPlanesHeading')}</h3>
          <div className="space-y-3">
            {result.emptyPlanes.map(plane => {
              const info = getEmptyPlane(plane, language);
              return (
                <motion.div
                  key={plane}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <p className="font-medium text-amber-300 mb-1">{getPlaneName(plane, language)}</p>
                  {info && (
                    <>
                      <p className="text-sm text-slate-300">{info.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <p className="text-[10px] text-amber-400 uppercase">{t('numerology.lesson')}</p>
                          <p className="text-xs text-slate-300">{info.lesson}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                          <p className="text-[10px] text-indigo-400 uppercase">{t('numerology.recommendation')}</p>
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
