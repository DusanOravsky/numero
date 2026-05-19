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

/**
 * SVG natálne koliesko: 12 znamení v kruhu okolo planétárnych pozícií,
 * Asc na ľavej strane (9 hodín), MC na vrchole.
 * Whole-Sign domy — celé znamenie je dom začínajúci od ascendentu.
 */
export function NatalWheel({ result }: Props) {
  const size = 420;
  const center = size / 2;
  const outerR = center - 20;
  const signR = center - 50;
  const houseR = center - 100;
  const planetR = center - 130;

  // Ascendent na 180° (ľavá strana = 9 hodín v astro grafickej konvencii)
  const ascLong = ZODIAC_SIGNS.indexOf(result.ascendant) * 30;

  // Mapovanie ekliptickej longitúdy → uhol v SVG (ascendent na 180°, ľavo)
  // Pohyb proti smeru hodinových ručičiek (=astro konvencia)
  function lonToAngle(lon: number): number {
    return (180 - (lon - ascLong) + 360) % 360;
  }

  function polar(angle: number, r: number): { x: number; y: number } {
    const rad = (angle * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  }

  // Sektory znamení — 12× 30°
  const signSectors = ZODIAC_SIGNS.map(sign => {
    const startLon = sign.startDeg;
    const endLon = startLon + 30;
    const startAng = lonToAngle(startLon);
    const endAng = lonToAngle(endLon);
    // pre arc cez 0 musíme uvažovať smerovanie; používame midpoint pre label
    const midLon = startLon + 15;
    const midAng = lonToAngle(midLon);
    const labelPos = polar(midAng, (signR + outerR) / 2);
    return { sign, startAng, endAng, midAng, labelPos };
  });

  // Domy — Whole Sign: každý dom = jedno znamenie začínajúce od Asc
  const houses = result.houses;

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Natálne koliesko</h3>
      <p className="text-xs text-slate-500 mb-3">
        Ascendent vľavo (9h), MC hore. Whole-Sign domy: každý dom = jedno celé znamenie. Planéty s ich symbolmi sú umiestnené v správnej longitúde.
      </p>
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Sektory znamení (vyfarbené podľa elementu) */}
          {signSectors.map(s => {
            // Generujeme arc segment ako pie slice z innerR po outerR.
            // Použijeme line po line aproximáciu cez 12 polygónov.
            const a1 = (s.startAng * Math.PI) / 180;
            const a2 = (s.endAng * Math.PI) / 180;
            const r1 = signR;
            const r2 = outerR;
            // Anti-clockwise short arc with 30° span. Use mid step for smoothness.
            const mid = ((s.startAng + (s.endAng < s.startAng ? s.endAng + 360 : s.endAng)) / 2) * Math.PI / 180;
            const p1 = { x: center + r1 * Math.cos(a1), y: center + r1 * Math.sin(a1) };
            const p2 = { x: center + r2 * Math.cos(a1), y: center + r2 * Math.sin(a1) };
            const p3 = { x: center + r2 * Math.cos(mid), y: center + r2 * Math.sin(mid) };
            const p4 = { x: center + r2 * Math.cos(a2), y: center + r2 * Math.sin(a2) };
            const p5 = { x: center + r1 * Math.cos(a2), y: center + r1 * Math.sin(a2) };
            const p6 = { x: center + r1 * Math.cos(mid), y: center + r1 * Math.sin(mid) };
            const path = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Q ${p3.x} ${p3.y} ${p4.x} ${p4.y} L ${p5.x} ${p5.y} Q ${p6.x} ${p6.y} Z`;
            return (
              <path
                key={s.sign.name}
                d={path}
                fill={ELEMENT_FILL[s.sign.element]}
                stroke="rgb(99 102 241 / 0.3)"
                strokeWidth={1}
              />
            );
          })}

          {/* Vonkajšia kružnica */}
          <circle cx={center} cy={center} r={outerR} fill="none" stroke="rgb(99 102 241 / 0.4)" strokeWidth={1.5} />
          {/* Vnútorná kružnica znamení */}
          <circle cx={center} cy={center} r={signR} fill="none" stroke="rgb(99 102 241 / 0.4)" strokeWidth={1} />
          {/* Vnútorná kružnica domov */}
          <circle cx={center} cy={center} r={houseR} fill="none" stroke="rgb(99 102 241 / 0.2)" strokeWidth={1} />

          {/* Symboly znamení */}
          {signSectors.map(s => (
            <text
              key={s.sign.name}
              x={s.labelPos.x}
              y={s.labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-2xl"
              style={{ fill: 'rgb(165 180 252)' }}
            >
              {s.sign.symbol}
            </text>
          ))}

          {/* Čísla domov (Whole Sign — začínajú od Asc) */}
          {houses.map((h, i) => {
            const houseStartLon = (ascLong + i * 30 + 15) % 360;
            const ang = lonToAngle(houseStartLon);
            const pos = polar(ang, houseR - 25);
            return (
              <text
                key={h.number}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-bold"
                style={{ fill: 'rgb(252 211 77)' }}
              >
                {h.number}
              </text>
            );
          })}

          {/* Asc / MC indikátory */}
          {(() => {
            const ascPos = polar(180, outerR);
            const mcPos = polar(270, outerR);
            return (
              <g>
                <line x1={center} y1={center} x2={ascPos.x} y2={ascPos.y} stroke="rgb(252 165 165)" strokeWidth={1.5} strokeDasharray="3,3" />
                <text x={ascPos.x - 18} y={ascPos.y + 4} className="text-xs font-bold" style={{ fill: 'rgb(252 165 165)' }}>ASC</text>
                <line x1={center} y1={center} x2={mcPos.x} y2={mcPos.y} stroke="rgb(196 181 253)" strokeWidth={1.5} strokeDasharray="3,3" />
                <text x={mcPos.x - 12} y={mcPos.y - 8} className="text-xs font-bold" style={{ fill: 'rgb(196 181 253)' }}>MC</text>
              </g>
            );
          })()}

          {/* Planéty */}
          {result.planets.map((p, i) => {
            const ang = lonToAngle(p.longitude);
            // Mierne odsadenie v r aby sa neprekrývali — väčšie planety bližšie centru
            const r = planetR + (i % 2) * 18;
            const pos = polar(ang, r);
            const dotPos = polar(ang, signR - 10);
            return (
              <g key={p.name}>
                {/* Spojnica do hrany sign ringu pre presnejšie čítanie */}
                <line
                  x1={dotPos.x}
                  y1={dotPos.y}
                  x2={pos.x + 10 * Math.cos((ang * Math.PI) / 180)}
                  y2={pos.y + 10 * Math.sin((ang * Math.PI) / 180)}
                  stroke="rgb(99 102 241 / 0.3)"
                  strokeWidth={0.5}
                />
                <circle cx={dotPos.x} cy={dotPos.y} r={2} fill="rgb(165 180 252)" />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-lg font-bold"
                  style={{ fill: p.retrograde ? 'rgb(248 113 113)' : 'rgb(255 255 255)' }}
                >
                  {p.symbol}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legenda planét */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {result.planets.map(p => (
          <span key={p.name} className={`text-[11px] px-2 py-0.5 rounded-full ${p.retrograde ? 'bg-rose-500/15 text-rose-300' : 'bg-indigo-500/15 text-indigo-300'}`}>
            {p.symbol} {p.name} {p.sign.symbol}{p.retrograde ? ' ℞' : ''}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
