import { motion } from 'framer-motion';
import type { ChakraState } from '../engine/chakraEngine';

interface ChakraBodyProps {
  chakras: ChakraState[];
}

const STATUS_CONFIG = {
  balanced: { label: 'Vyvážená', color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-700' },
  blocked: { label: 'Blokovaná', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-700' },
  hyperactive: { label: 'Hyperaktívna', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-700' },
};

export function ChakraBody({ chakras }: ChakraBodyProps) {
  const sorted = [...chakras].reverse();

  return (
    <div className="relative flex flex-col items-center gap-0 py-4">
      {/* Vertical energy channel behind */}
      <div className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-gradient-to-b from-violet-300/0 via-indigo-400/30 to-red-400/0" />

      {sorted.map((state, idx) => {
        const cfg = STATUS_CONFIG[state.status];
        const isBlocked = state.status === 'blocked';
        const isHyper = state.status === 'hyperactive';

        return (
          <motion.div
            key={state.chakra.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="relative flex items-center gap-4 w-full max-w-md py-2.5 px-2"
          >
            {/* Chakra orb */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${state.chakra.colorHex}${isBlocked ? '15' : '30'} 0%, transparent 70%)`,
                }}
                animate={isHyper ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : {}}
                transition={isHyper ? { duration: 2, repeat: Infinity } : {}}
              />
              {/* Core circle */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isBlocked ? 'opacity-50' : ''
                }`}
                style={{
                  borderColor: state.chakra.colorHex,
                  background: `radial-gradient(circle at 30% 30%, ${state.chakra.colorHex}40, ${state.chakra.colorHex}15)`,
                  boxShadow: isBlocked ? 'none' : `0 0 12px ${state.chakra.colorHex}40, inset 0 0 8px ${state.chakra.colorHex}20`,
                }}
              >
                <span className="text-xs font-bold" style={{ color: state.chakra.colorHex }}>
                  {state.chakra.mantra}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-slate-800">{state.chakra.name}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">{state.chakra.sanskrit}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-1.5 h-2 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={state.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${state.chakra.name}: ${state.score}%`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.score}%` }}
                  transition={{ delay: idx * 0.07 + 0.3, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${state.chakra.colorHex}90, ${state.chakra.colorHex})`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-400">{state.chakra.element} · {state.chakra.location}</span>
                <span className="text-[10px] font-medium" style={{ color: cfg.color }}>{state.score}%</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
