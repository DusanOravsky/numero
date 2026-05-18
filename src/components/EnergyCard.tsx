import { motion } from 'framer-motion';

interface EnergyCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  delay?: number;
}

export function EnergyCard({ title, value, subtitle, icon, color = 'indigo', delay = 0 }: EnergyCardProps) {
  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/20',
    gold: 'from-amber-500/20 to-yellow-500/20 border-amber-500/20',
    rose: 'from-rose-500/20 to-pink-500/20 border-rose-500/20',
    cyan: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/20',
    purple: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.indigo} border rounded-2xl p-5 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-serif font-bold mt-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
    </motion.div>
  );
}
