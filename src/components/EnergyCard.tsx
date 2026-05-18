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
    indigo: 'from-indigo-50 to-violet-50 border-indigo-200',
    gold: 'from-amber-50 to-yellow-50 border-amber-200',
    rose: 'from-rose-50 to-pink-50 border-rose-200',
    cyan: 'from-cyan-50 to-teal-50 border-cyan-200',
    purple: 'from-purple-50 to-fuchsia-50 border-purple-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.indigo} border rounded-2xl p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-serif font-bold mt-1 text-slate-800">
            {value}
          </p>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl opacity-40">{icon}</span>}
      </div>
    </motion.div>
  );
}
