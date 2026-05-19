import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface Props {
  /** Počty čísel 1..9 v mriežke (Map alebo Record). */
  counts: Record<number, number> | Map<number, number>;
  title?: string;
  subtitle?: string;
}

const LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const LABEL_HINTS: Record<number, string> = {
  1: 'Ja, nezávislosť',
  2: 'Intuícia, partnerstvo',
  3: 'Kreativita',
  4: 'Stabilita',
  5: 'Sloboda',
  6: 'Láska, harmónia',
  7: 'Múdrosť',
  8: 'Sila, moc',
  9: 'Súcit, dovŕšenie',
};

/**
 * SVG radar chart pre 9 numerologických energií.
 * Polygón zobrazuje koľkokrát sa každé číslo nachádza v mriežke.
 */
export function RadarChart9({ counts, title = 'Radar 9 energií', subtitle }: Props) {
  const cnt = (n: number) => (counts instanceof Map ? counts.get(n) || 0 : counts[n] || 0);
  const maxValue = Math.max(3, ...LABELS.map((_, i) => cnt(i + 1)));

  const size = 320;
  const center = size / 2;
  const maxRadius = center - 40;
  const numAxes = 9;

  // Bod pre osi: rozdelíme 360° na 9 častí, štart na hornom bode (-90°).
  const axisPoint = (i: number, factor: number) => {
    const angle = (-90 + i * (360 / numAxes)) * Math.PI / 180;
    const r = maxRadius * factor;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  // Polygón hodnôt
  const dataPoints = LABELS.map((_, i) => {
    const v = cnt(i + 1);
    return axisPoint(i, v / maxValue);
  });
  const polygonPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Pozadie — koncentrické polygóny pre 25%, 50%, 75%, 100%
  const ringPaths = [0.25, 0.5, 0.75, 1].map(f => {
    return LABELS.map((_, i) => {
      const p = axisPoint(i, f);
      return `${p.x},${p.y}`;
    }).join(' ');
  });

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}

      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Pozadie */}
          {ringPaths.map((path, i) => (
            <polygon
              key={i}
              points={path}
              fill="none"
              stroke="rgb(99 102 241 / 0.15)"
              strokeWidth={1}
            />
          ))}
          {/* Osi */}
          {LABELS.map((_, i) => {
            const end = axisPoint(i, 1);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="rgb(99 102 241 / 0.2)"
                strokeWidth={1}
              />
            );
          })}
          {/* Polygón hodnôt */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            points={polygonPath}
            fill="rgb(99 102 241 / 0.3)"
            stroke="rgb(99 102 241)"
            strokeWidth={2}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
          {/* Body s hodnotami */}
          {dataPoints.map((p, i) => {
            const v = cnt(i + 1);
            return (
              <g key={i}>
                <motion.circle
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  cx={p.x}
                  cy={p.y}
                  r={v > 0 ? 5 : 3}
                  fill={v > 0 ? 'rgb(129 140 248)' : 'rgb(148 163 184)'}
                />
                {v > 0 && (
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-white"
                  >
                    {v}
                  </text>
                )}
              </g>
            );
          })}
          {/* Labely čísel mimo polygónu */}
          {LABELS.map((label, i) => {
            const p = axisPoint(i, 1.15);
            return (
              <text
                key={label}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-indigo-300"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legenda hodnôt */}
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-9 gap-1">
        {LABELS.map((label, i) => {
          const v = cnt(i + 1);
          return (
            <div
              key={label}
              className={`text-center p-1 rounded ${v > 0 ? 'bg-indigo-500/20' : 'bg-slate-500/10'}`}
              title={LABEL_HINTS[i + 1]}
            >
              <p className={`text-xs font-bold ${v > 0 ? 'text-indigo-300' : 'text-slate-500'}`}>{label}</p>
              <p className={`text-[10px] ${v > 0 ? 'text-white' : 'text-slate-500'}`}>×{v}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
