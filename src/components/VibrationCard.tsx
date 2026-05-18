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
    indigo: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/20',
    gold: 'from-amber-500/20 to-yellow-500/20 border-amber-500/20',
    purple: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/20',
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
          <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-serif font-bold mt-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
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
            className="absolute left-0 right-0 top-full mt-2 z-[100] p-4 rounded-xl bg-[#1a1545] border border-indigo-500/30 shadow-2xl shadow-indigo-900/50"
            style={{ minWidth: '280px' }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-[#1a1545] border-l border-t border-indigo-500/30 rotate-45"></div>
            <p className="text-xs text-indigo-300 font-medium mb-2">Výpočet:</p>
            <p className="text-sm text-white font-mono mb-3 break-all">{formula}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
