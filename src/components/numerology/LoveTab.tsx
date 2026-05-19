import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import { loveLanguageDescriptions, loveLanguageScoringExplanation } from '../../data/orvDescriptions';

interface LoveTabProps {
  result: NumerologyResult;
}

export function LoveTab({ result }: LoveTabProps) {
  return (
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
  );
}
