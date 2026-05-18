import { useState } from 'react';
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

export function VibrationCard({ title, value, subtitle, icon, color, formula, description, delay = 0 }: VibrationCardProps) {
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
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-[100] p-4 rounded-xl bg-white border border-slate-200 shadow-xl"
            style={{ minWidth: '280px' }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45"></div>
            <p className="text-xs text-indigo-600 font-medium mb-2">Výpočet:</p>
            <p className="text-sm text-slate-800 font-mono mb-3 break-all">{formula}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
