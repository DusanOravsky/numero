import { GlassCard } from './GlassCard';
import type { AstrologyResult } from '../engine/astrologyEngine';
import { ZODIAC_SIGNS } from '../engine/astrologyEngine';

interface Props {
  result: AstrologyResult;
}

const ELEMENT_FILL: Record<string, string> = {
  'Oheň': 'rgb(248 113 113 / 0.15)',
  'Zem': 'rgb(34 197 94 / 0.15)',
  'Vzduch': 'rgb(56 189 248 / 0.15)',
  'Voda': 'rgb(96 165 250 / 0.15)',
};

const ELEMENT_STROKE: Record<string, string> = {
  'Oheň': 'rgb(248 113 113 / 0.4)',
  'Zem': 'rgb(34 197 94 / 0.4)',
  'Vzduch': 'rgb(56 189 248 / 0.4)',
  'Voda': 'rgb(96 165 250 / 0.4)',
};

const PLANET_COLORS: Record<string, string> = {
  'Slnko': '#fbbf24',
  'Mesiac': '#c4b5fd',
  'Merkúr': '#67e8f9',
  'Venuša': '#f9a8d4',
  'Mars': '#f87171',
  'Jupiter': '#a78bfa',
  'Saturn': '#94a3b8',
  'Urán': '#2dd4bf',
  'Neptún': '#818cf8',
  'Pluto': '#e879f9',
  'Lilith': '#6b7280',
  'Chiron': '#fb923c',
};

function polar(cx: number, cy: number, angle: number, r: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polar(cx, cy, startAngle, r);
  const end = polar(cx, cy, endAngle, r);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = endAngle > startAngle ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function sectorPath(cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number): string {
  const outerStart = polar(cx, cy, startAngle, outerR);
  const outerEnd = polar(cx, cy, endAngle, outerR);
  const innerEnd = polar(cx, cy, endAngle, innerR);
  const innerStart = polar(cx, cy, startAngle, innerR);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

/**
 * SVG natálne koliesko s korektnou arc matematikou.
 * Ascendent vľavo (9h), MC hore. Whole-Sign domy.
 * Planéty s anti-collision offset.
 */
export function NatalWheel({ result }: Props) {
  const size = 440;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 195;
  const signInnerR = 155;
  const houseR = 120;
  const planetR = 95;

  const ascIndex = ZODIAC_SIGNS.findIndex(s => s.name === result.ascendant.name);
  const ascLon = ascIndex * 30 + result.ascendantDegree;

  // Ecliptic longitude → SVG angle (Asc at 180° = left, counterclockwise)
  function lonToAngle(lon: number): number {
    return ((ascLon - lon + 540) % 360);
  }

  // Sign sectors
  const signSectors = ZODIAC_SIGNS.map((sign, i) => {
    const startLon = i * 30;
    const endLon = startLon + 30;
    const startAng = lonToAngle(startLon);
    const endAng = lonToAngle(endLon);
    const midAng = lonToAngle(startLon + 15);
    return { sign, startAng, endAng, midAng };
  });

  // MC angle — MC is at the top (90° in SVG terms)
  // Calculate MC longitude from 10th house
  const mcHouse = result.houses.find(h => h.number === 10);
  const mcLon = mcHouse ? ZODIAC_SIGNS.findIndex(s => s.name === mcHouse.sign.name) * 30 : (ascLon + 270) % 360;

  // Planet positions with collision avoidance
  const planetAngles = result.planets.map(p => ({
    planet: p,
    angle: lonToAngle(p.longitude),
  }));

  // Sort and spread overlapping planets
  const sorted = [...planetAngles].sort((a, b) => a.angle - b.angle);
  const MIN_SEP = 12;
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i].angle - sorted[i - 1].angle;
      if (Math.abs(diff) < MIN_SEP) {
        sorted[i - 1].angle -= (MIN_SEP - Math.abs(diff)) / 2;
        sorted[i].angle += (MIN_SEP - Math.abs(diff)) / 2;
      }
    }
  }

  const planetPositions = result.planets.map(p => {
    const adjusted = sorted.find(s => s.planet === p);
    return { planet: p, angle: adjusted?.angle ?? lonToAngle(p.longitude) };
  });

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Natálne koliesko</h3>
      <p className="text-xs text-slate-500 mb-3">
        Ascendent vľavo (9h), MC hore. Whole-Sign domy: každý dom = jedno celé znamenie. Planéty umiestnené v správnej longitúde.
      </p>
      <div className="flex justify-center overflow-x-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="min-w-[320px]" role="img" aria-label="Natálne koliesko — pozície planét v znameniach zodiaku">
          {/* Sign sectors */}
          {signSectors.map(s => (
            <path
              key={s.sign.name}
              d={sectorPath(cx, cy, signInnerR, outerR, s.endAng, s.startAng)}
              fill={ELEMENT_FILL[s.sign.element]}
              stroke={ELEMENT_STROKE[s.sign.element]}
              strokeWidth={0.5}
            />
          ))}

          {/* Circles */}
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgb(99 102 241 / 0.5)" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={signInnerR} fill="none" stroke="rgb(99 102 241 / 0.4)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={houseR} fill="none" stroke="rgb(99 102 241 / 0.2)" strokeWidth={0.5} />

          {/* Sign dividers */}
          {signSectors.map(s => {
            const inner = polar(cx, cy, s.startAng, signInnerR);
            const outer = polar(cx, cy, s.startAng, outerR);
            return (
              <line
                key={`div-${s.sign.name}`}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="rgb(99 102 241 / 0.3)" strokeWidth={0.5}
              />
            );
          })}

          {/* House dividers (from center to signInnerR) */}
          {result.houses.map((_, i) => {
            const houseAng = lonToAngle((ascIndex * 30 + i * 30) % 360);
            const inner = polar(cx, cy, houseAng, 30);
            const outer = polar(cx, cy, houseAng, signInnerR);
            return (
              <line
                key={`house-div-${i}`}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="rgb(99 102 241 / 0.15)" strokeWidth={0.5}
              />
            );
          })}

          {/* House numbers */}
          {result.houses.map((h, i) => {
            const houseAng = lonToAngle((ascIndex * 30 + i * 30 + 15) % 360);
            const pos = polar(cx, cy, houseAng, houseR + 15);
            return (
              <text
                key={`h-${h.number}`}
                x={pos.x} y={pos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize={9} fontWeight="bold"
                fill="rgb(252 211 77 / 0.7)"
              >
                {h.number}
              </text>
            );
          })}

          {/* Zodiac symbols */}
          {signSectors.map(s => {
            const pos = polar(cx, cy, s.midAng, (signInnerR + outerR) / 2);
            return (
              <text
                key={`sym-${s.sign.name}`}
                x={pos.x} y={pos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize={18}
                fill="rgb(165 180 252)"
              >
                {s.sign.symbol}
              </text>
            );
          })}

          {/* ASC line + label */}
          {(() => {
            const ascAng = 180; // always left
            const ascOuter = polar(cx, cy, ascAng, outerR + 5);
            const ascInner = polar(cx, cy, ascAng, 25);
            return (
              <g>
                <line x1={ascInner.x} y1={ascInner.y} x2={ascOuter.x} y2={ascOuter.y}
                  stroke="rgb(252 165 165)" strokeWidth={1.5} strokeDasharray="4,2" />
                <text x={ascOuter.x - 22} y={ascOuter.y + 4}
                  fontSize={10} fontWeight="bold" fill="rgb(252 165 165)">
                  ASC
                </text>
              </g>
            );
          })()}

          {/* MC line + label */}
          {(() => {
            const mcAng = lonToAngle(mcLon);
            const mcOuter = polar(cx, cy, mcAng, outerR + 5);
            const mcInner = polar(cx, cy, mcAng, 25);
            return (
              <g>
                <line x1={mcInner.x} y1={mcInner.y} x2={mcOuter.x} y2={mcOuter.y}
                  stroke="rgb(196 181 253)" strokeWidth={1.5} strokeDasharray="4,2" />
                <text x={mcOuter.x - 8} y={mcOuter.y - 8}
                  fontSize={10} fontWeight="bold" fill="rgb(196 181 253)">
                  MC
                </text>
              </g>
            );
          })()}

          {/* Planets */}
          {planetPositions.map(({ planet, angle }) => {
            const originalAngle = lonToAngle(planet.longitude);
            const dotPos = polar(cx, cy, originalAngle, signInnerR - 6);
            const planetPos = polar(cx, cy, angle, planetR);
            const color = PLANET_COLORS[planet.name] || '#ffffff';
            return (
              <g key={planet.name}>
                {/* Tick on sign ring */}
                <circle cx={dotPos.x} cy={dotPos.y} r={2.5}
                  fill={color} opacity={0.8} />
                {/* Connecting line */}
                <line x1={dotPos.x} y1={dotPos.y} x2={planetPos.x} y2={planetPos.y}
                  stroke={color} strokeWidth={0.5} opacity={0.4} />
                {/* Planet symbol */}
                <text
                  x={planetPos.x} y={planetPos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={16} fontWeight="bold"
                  fill={planet.retrograde ? '#f87171' : color}
                >
                  {planet.symbol}
                </text>
                {/* Retrograde indicator */}
                {planet.retrograde && (
                  <text
                    x={planetPos.x + 10} y={planetPos.y - 6}
                    fontSize={8} fill="#f87171"
                  >
                    ℞
                  </text>
                )}
              </g>
            );
          })}

          {/* Degree arc for ascendant degree indicator */}
          {result.ascendantDegree > 0 && (
            <path
              d={arcPath(cx, cy, outerR + 2, 180, 180)}
              fill="none" stroke="rgb(252 165 165)" strokeWidth={3}
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {result.planets.map(p => (
          <span key={p.name} className={`text-[11px] px-2 py-0.5 rounded-full ${p.retrograde ? 'bg-rose-500/15 text-rose-300' : 'bg-indigo-500/15 text-indigo-300'}`}>
            {p.symbol} {p.name} {p.sign.symbol} {Math.floor(p.degree)}°{p.retrograde ? ' ℞' : ''}
          </span>
        ))}
      </div>

      {/* Element legend */}
      <div className="mt-2 flex gap-3 justify-center text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgb(248 113 113 / 0.3)' }}></span>Oheň</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgb(34 197 94 / 0.3)' }}></span>Zem</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgb(56 189 248 / 0.3)' }}></span>Vzduch</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: 'rgb(96 165 250 / 0.3)' }}></span>Voda</span>
      </div>
    </GlassCard>
  );
}
