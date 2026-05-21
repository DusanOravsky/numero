import { motion } from 'framer-motion';
import type { ChakraState } from '../engine/chakraEngine';

interface ChakraBodyProps {
  chakras: ChakraState[];
}

const CHAKRA_POSITIONS = [
  { cy: 92, label: 'right' },   // 1 - Root
  { cy: 80, label: 'left' },    // 2 - Sacral
  { cy: 68, label: 'right' },   // 3 - Solar Plexus
  { cy: 55, label: 'left' },    // 4 - Heart
  { cy: 43, label: 'right' },   // 5 - Throat
  { cy: 30, label: 'left' },    // 6 - Third Eye
  { cy: 17, label: 'right' },   // 7 - Crown
];

const STATUS_LABEL: Record<string, string> = {
  balanced: 'Vyvážená',
  blocked: 'Blokovaná',
  hyperactive: 'Hyperaktívna',
};

export function ChakraBody({ chakras }: ChakraBodyProps) {
  const sorted = [...chakras].sort((a, b) => a.chakra.number - b.chakra.number);

  return (
    <div className="relative w-full max-w-sm mx-auto py-6">
      <svg
        viewBox="0 0 200 100"
        className="w-full h-auto"
        style={{ minHeight: 360 }}
        aria-label="Čakrový systém na postave"
      >
        <defs>
          {sorted.map((state) => (
            <radialGradient key={`glow-${state.chakra.number}`} id={`chakra-glow-${state.chakra.number}`}>
              <stop offset="0%" stopColor={state.chakra.colorHex} stopOpacity={state.status === 'blocked' ? 0.2 : 0.8} />
              <stop offset="60%" stopColor={state.chakra.colorHex} stopOpacity={state.status === 'blocked' ? 0.05 : 0.3} />
              <stop offset="100%" stopColor={state.chakra.colorHex} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id="body-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
          </linearGradient>
          <filter id="body-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dy="0.5" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>

        {/* Meditating figure silhouette */}
        <g filter="url(#body-shadow)">
          <path
            d="M100,12
               C104,12 107,14 107,18 C107,22 104,25 100,25 C96,25 93,22 93,18 C93,14 96,12 100,12
               M100,26
               C96,26 94,28 93,30 L90,36 L87,42 L85,48 L84,52 L83,58
               C82,62 80,66 78,70 L74,76 L70,82 L68,86 L67,90 L69,92 L72,92 L76,88 L80,84 L84,80 L88,76 L92,73
               L92,73 L96,72 L100,71 L104,72 L108,73
               L112,76 L116,80 L120,84 L124,88 L128,92 L131,92 L133,90 L132,86 L130,82 L126,76 L122,70
               C120,66 118,62 117,58 L116,52 L115,48 L113,42 L110,36 L107,30
               C106,28 104,26 100,26 Z"
            fill="url(#body-gradient)"
            stroke="#6366f1"
            strokeWidth="0.3"
            strokeOpacity="0.3"
          />
        </g>

        {/* Spine / energy channel */}
        <line
          x1="100" y1="20" x2="100" y2="93"
          stroke="url(#body-gradient)"
          strokeWidth="0.8"
          strokeOpacity="0.4"
          strokeDasharray="1.5 1"
        />

        {/* Chakra points */}
        {sorted.map((state, i) => {
          const pos = CHAKRA_POSITIONS[i];
          const isBlocked = state.status === 'blocked';
          const isHyper = state.status === 'hyperactive';

          return (
            <g key={state.chakra.number}>
              {/* Glow */}
              <motion.circle
                cx={100}
                cy={pos.cy}
                r={isHyper ? 7 : 5}
                fill={`url(#chakra-glow-${state.chakra.number})`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: isHyper ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  delay: i * 0.1,
                  duration: isHyper ? 2 : 0.5,
                  repeat: isHyper ? Infinity : 0,
                }}
              />
              {/* Core dot */}
              <motion.circle
                cx={100}
                cy={pos.cy}
                r={2.2}
                fill={state.chakra.colorHex}
                opacity={isBlocked ? 0.4 : 1}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.1, type: 'spring' }}
              />
              {/* Ring for balanced */}
              {state.status === 'balanced' && (
                <motion.circle
                  cx={100}
                  cy={pos.cy}
                  r={3.5}
                  fill="none"
                  stroke={state.chakra.colorHex}
                  strokeWidth="0.4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                />
              )}
              {/* X mark for blocked */}
              {isBlocked && (
                <g opacity="0.5">
                  <line x1={98.5} y1={pos.cy - 1.5} x2={101.5} y2={pos.cy + 1.5} stroke="#ef4444" strokeWidth="0.5" />
                  <line x1={101.5} y1={pos.cy - 1.5} x2={98.5} y2={pos.cy + 1.5} stroke="#ef4444" strokeWidth="0.5" />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Labels overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ minHeight: 360 }}>
        {sorted.map((state, i) => {
          const pos = CHAKRA_POSITIONS[i];
          const isLeft = pos.label === 'left';
          const topPercent = pos.cy;

          return (
            <motion.div
              key={state.chakra.number}
              className={`absolute flex items-center gap-1.5 ${isLeft ? 'left-2' : 'right-2'}`}
              style={{ top: `${topPercent}%`, transform: 'translateY(-50%)' }}
              initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2 }}
            >
              {!isLeft && <div className="w-6 h-px opacity-20" style={{ backgroundColor: state.chakra.colorHex }} />}
              <div className={`text-xs ${isLeft ? 'text-right' : 'text-left'}`}>
                <div className="font-medium text-slate-700 leading-tight">{state.chakra.name}</div>
                <div
                  className="text-[10px] font-medium leading-tight mt-0.5"
                  style={{
                    color: state.status === 'balanced' ? '#10b981' :
                           state.status === 'blocked' ? '#ef4444' : '#f59e0b'
                  }}
                >
                  {STATUS_LABEL[state.status]} · {state.score}%
                </div>
                <div className="text-[10px] text-slate-400 italic leading-tight mt-0.5">
                  {state.chakra.mantra}
                </div>
              </div>
              {isLeft && <div className="w-6 h-px opacity-20" style={{ backgroundColor: state.chakra.colorHex }} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
