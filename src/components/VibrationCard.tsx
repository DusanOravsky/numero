import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibrationCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  formula: string;
  description: string;
  delay?: number;
}

export const VibrationCard = memo(function VibrationCard({ title, value, subtitle, icon, color, formula, description, delay = 0 }: VibrationCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-50 to-violet-50 border-indigo-200',
    gold: 'from-amber-50 to-yellow-50 border-amber-200',
    purple: 'from-purple-50 to-fuchsia-50 border-purple-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative bg-gradient-to-br ${colorClasses[color] || colorClasses.indigo} border rounded-2xl p-5 backdrop-blur-sm cursor-pointer ${showTooltip ? 'z-50' : 'z-0'}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-serif font-bold mt-1 text-slate-800">
            {value}
          </p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <span className="text-2xl opacity-60">{icon}</span>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <>
            <div className="fixed inset-0 z-[99]" onClick={() => setShowTooltip(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[100] p-5 rounded-2xl bg-white border border-slate-200 shadow-2xl max-w-sm mx-auto"
            >
              <p className="text-xs text-indigo-600 font-medium mb-2">Výpočet:</p>
              <p className="text-sm text-slate-800 font-mono mb-3 break-all">{formula}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
              <button onClick={() => setShowTooltip(false)} className="mt-3 text-xs text-slate-400 hover:text-slate-600">Zavrieť</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
