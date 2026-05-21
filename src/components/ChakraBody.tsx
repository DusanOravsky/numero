import { motion } from 'framer-motion';
import type { ChakraState } from '../engine/chakraEngine';

interface ChakraBodyProps {
  chakras: ChakraState[];
}

const STATUS_LABEL: Record<string, string> = {
  balanced: 'Vyvážená',
  blocked: 'Blokovaná',
  hyperactive: 'Hyperaktívna',
};

// Y positions for chakras on the figure (viewBox 0 0 200 320)
const CHAKRA_Y = [272, 245, 215, 182, 152, 125, 95];

export function ChakraBody({ chakras }: ChakraBodyProps) {
  const sorted = [...chakras].sort((a, b) => a.chakra.number - b.chakra.number);

  return (
    <div className="flex flex-col items-center">
      {/* SVG visualization */}
      <div className="relative w-full max-w-xs mx-auto">
        <svg
          viewBox="0 0 200 320"
          className="w-full h-auto"
          aria-label="Čakrový systém na postave"
        >
          {/* Dark gradient background */}
          <defs>
            <radialGradient id="bg-glow" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="70%" stopColor="#0f0a2e" />
              <stop offset="100%" stopColor="#050210" />
            </radialGradient>
            <linearGradient id="aura-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
            {sorted.map((state) => (
              <radialGradient key={`g-${state.chakra.number}`} id={`cg-${state.chakra.number}`}>
                <stop offset="0%" stopColor={state.chakra.colorHex} stopOpacity={state.status === 'blocked' ? 0.4 : 1} />
                <stop offset="40%" stopColor={state.chakra.colorHex} stopOpacity={state.status === 'blocked' ? 0.15 : 0.6} />
                <stop offset="100%" stopColor={state.chakra.colorHex} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="200" height="320" rx="16" fill="url(#bg-glow)" />

          {/* Aura glow behind figure */}
          <ellipse cx="100" cy="175" rx="55" ry="90" fill="url(#aura-gradient)" />

          {/* Meditating figure - lotus position silhouette */}
          <g opacity="0.85">
            {/* Head */}
            <ellipse cx="100" cy="98" rx="16" ry="18" fill="#1a1640" stroke="#4338ca" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Neck */}
            <rect x="95" y="115" width="10" height="12" rx="5" fill="#1a1640" />
            {/* Torso */}
            <path
              d="M80,127 Q78,130 76,145 Q74,165 73,185 Q72,200 74,215 Q76,230 80,240 L120,240 Q124,230 126,215 Q128,200 127,185 Q126,165 124,145 Q122,130 120,127 Z"
              fill="#1a1640"
              stroke="#4338ca"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            {/* Left arm */}
            <path
              d="M76,135 Q65,145 55,160 Q48,172 45,185 Q43,195 48,200 Q55,205 62,200 Q68,195 72,188 Q75,180 74,170"
              fill="#1a1640"
              stroke="#4338ca"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            {/* Right arm */}
            <path
              d="M124,135 Q135,145 145,160 Q152,172 155,185 Q157,195 152,200 Q145,205 138,200 Q132,195 128,188 Q125,180 126,170"
              fill="#1a1640"
              stroke="#4338ca"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            {/* Left leg (lotus) */}
            <path
              d="M74,235 Q68,245 60,252 Q52,258 48,262 Q44,267 50,272 Q58,276 68,275 Q78,273 85,268 Q90,263 92,258 Q94,252 92,245"
              fill="#1a1640"
              stroke="#4338ca"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            {/* Right leg (lotus) */}
            <path
              d="M126,235 Q132,245 140,252 Q148,258 152,262 Q156,267 150,272 Q142,276 132,275 Q122,273 115,268 Q110,263 108,258 Q106,252 108,245"
              fill="#1a1640"
              stroke="#4338ca"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          </g>

          {/* Central energy channel (sushumna) */}
          <line
            x1="100" y1="90" x2="100" y2="278"
            stroke="#6366f1"
            strokeWidth="1"
            strokeOpacity="0.2"
            strokeDasharray="3 2"
          />

          {/* Chakra orbs */}
          {sorted.map((state, i) => {
            const cy = CHAKRA_Y[i];
            const isBlocked = state.status === 'blocked';
            const isHyper = state.status === 'hyperactive';
            const baseR = 12;

            return (
              <g key={state.chakra.number}>
                {/* Outer glow */}
                <motion.circle
                  cx={100}
                  cy={cy}
                  r={isHyper ? baseR + 6 : baseR + 2}
                  fill={`url(#cg-${state.chakra.number})`}
                  initial={{ opacity: 0 }}
                  animate={isHyper
                    ? { opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }
                    : { opacity: isBlocked ? 0.3 : 0.8 }
                  }
                  transition={isHyper
                    ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                    : { delay: i * 0.1, duration: 0.6 }
                  }
                />
                {/* Core bright dot */}
                <motion.circle
                  cx={100}
                  cy={cy}
                  r={5}
                  fill={state.chakra.colorHex}
                  opacity={isBlocked ? 0.3 : 0.9}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                />
                {/* Inner white highlight */}
                {!isBlocked && (
                  <circle
                    cx={98}
                    cy={cy - 2}
                    r={1.5}
                    fill="white"
                    opacity={0.5}
                  />
                )}
              </g>
            );
          })}

          {/* Crown rays */}
          {!sorted[6] || sorted[6].status !== 'blocked' ? (
            <g opacity="0.4">
              {[0, 30, 60, 90, 120, 150].map((angle) => (
                <line
                  key={angle}
                  x1={100 + Math.cos((angle * Math.PI) / 180) * 8}
                  y1={CHAKRA_Y[6] - Math.sin((angle * Math.PI) / 180) * 8}
                  x2={100 + Math.cos((angle * Math.PI) / 180) * 18}
                  y2={CHAKRA_Y[6] - Math.sin((angle * Math.PI) / 180) * 18}
                  stroke="#a855f7"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ) : null}
        </svg>
      </div>

      {/* Chakra legend below */}
      <div className="w-full max-w-md mt-4 space-y-2 px-2">
        {[...sorted].reverse().map((state, idx) => {
          const cfg = STATUS_LABEL[state.status];
          const statusColor = state.status === 'balanced' ? '#10b981' :
                              state.status === 'blocked' ? '#ef4444' : '#f59e0b';
          return (
            <motion.div
              key={state.chakra.number}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 + 0.5 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: state.chakra.colorHex,
                  opacity: state.status === 'blocked' ? 0.4 : 1,
                  boxShadow: state.status !== 'blocked' ? `0 0 6px ${state.chakra.colorHex}80` : 'none',
                }}
              />
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-slate-800">{state.chakra.name}</span>
                  <span className="text-[10px] text-slate-400 italic">{state.chakra.mantra}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: statusColor }}>
                  {cfg} · {state.score}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
