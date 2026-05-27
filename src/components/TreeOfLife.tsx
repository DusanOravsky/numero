import { GlassCard } from './GlassCard';
import { SEFIROT } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  result: KabalahResult;
}

// Pozície sefír v štandardnom kabalistickom strome (x, y v %).
// 3 stĺpce: Prísnosť (vľavo), Stred, Milosrdenstvo (vpravo).
const SEFIRA_POS: Record<number, { x: number; y: number }> = {
  1: { x: 50, y: 8 },     // Keter
  2: { x: 75, y: 22 },    // Chokmah
  3: { x: 25, y: 22 },    // Binah
  4: { x: 75, y: 42 },    // Chesed
  5: { x: 25, y: 42 },    // Geburah
  6: { x: 50, y: 50 },    // Tiferet
  7: { x: 75, y: 68 },    // Necach
  8: { x: 25, y: 68 },    // Hod
  9: { x: 50, y: 78 },    // Jesod
  10: { x: 50, y: 92 },   // Malchut
};

// 22 ciest stromu života (Hebrew letter paths)
const PATHS: [number, number][] = [
  [1, 2], [1, 3], [1, 6],
  [2, 3], [2, 4], [2, 6],
  [3, 5], [3, 6],
  [4, 5], [4, 6], [4, 7],
  [5, 6], [5, 8],
  [6, 7], [6, 8], [6, 9],
  [7, 8], [7, 9], [7, 10],
  [8, 9], [8, 10],
  [9, 10],
];

export function TreeOfLife({ result }: Props) {
  const { language } = useTranslation();
  const size = 320;
  const primaryNum = result.primarySefira.number;
  const secondaryNum = result.secondarySefira.number;

  const xy = (n: number) => {
    const p = SEFIRA_POS[n];
    return { x: (p.x / 100) * size, y: (p.y / 100) * size };
  };

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">{language === 'sk' ? 'Strom života' : 'Tree of Life'}</h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk'
          ? `Kabalistický strom s 10 sefírami a 22 cestami. Vaša primárna sefira (${result.primarySefira.name}) a sekundárna sefira (${result.secondarySefira.name}) sú zvýraznené, cesta z nich do Malchut je vyznačená.`
          : `Kabbalistic tree with 10 sefirot and 22 paths. Your primary sefira (${result.primarySefira.name}) and secondary sefira (${result.secondarySefira.name}) are highlighted, the path from them to Malchut is marked.`}
      </p>
      <div className="flex justify-center">
        <svg width={size} height={size * 1.05} viewBox={`0 0 ${size} ${size * 1.05}`} role="img" aria-label={language === 'sk' ? 'Kabalistický strom života — 10 sefír a 22 ciest' : 'Kabbalistic Tree of Life — 10 sefirot and 22 paths'}>
          {/* 22 paths */}
          {PATHS.map(([a, b], i) => {
            const pa = xy(a);
            const pb = xy(b);
            const isPrimary = a === primaryNum || b === primaryNum;
            const isSecondary = a === secondaryNum || b === secondaryNum;
            const onMalchut = a === 10 || b === 10;
            const highlight = onMalchut && (isPrimary || isSecondary);
            return (
              <line
                key={i}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={highlight ? 'rgb(252 211 77)' : 'rgb(99 102 241 / 0.3)'}
                strokeWidth={highlight ? 2.5 : 1}
              />
            );
          })}

          {/* 10 sefirot */}
          {SEFIROT.map(s => {
            const p = xy(s.number);
            const isPrimary = s.number === primaryNum;
            const isSecondary = s.number === secondaryNum;
            const isMalchut = s.number === 10;
            const r = isPrimary ? 22 : isSecondary ? 18 : 14;
            return (
              <g key={s.number}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={s.color}
                  stroke={isPrimary ? 'rgb(252 211 77)' : isSecondary ? 'rgb(165 180 252)' : isMalchut ? 'rgb(74 222 128)' : 'rgb(99 102 241)'}
                  strokeWidth={isPrimary ? 3 : 2}
                />
                <text
                  x={p.x}
                  y={p.y - 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[8px] font-bold"
                  style={{ fill: ['#ffffff', '#fbbf24', '#facc15', '#f5c542', '#bbf7d0'].includes(s.color) ? '#1e293b' : '#ffffff' }}
                >
                  {s.number}
                </text>
                <text
                  x={p.x}
                  y={p.y + r + 10}
                  textAnchor="middle"
                  className="text-[10px]"
                  style={{ fill: isPrimary ? 'rgb(252 211 77)' : isSecondary ? 'rgb(165 180 252)' : 'rgb(148 163 184)' }}
                >
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Pillar labels */}
          <text x={75 / 100 * size} y={size * 1.03} textAnchor="middle" className="text-[9px]" style={{ fill: 'rgb(148 163 184)' }}>
            Stĺp Milosrdenstva
          </text>
          <text x={50 / 100 * size} y={size * 1.03} textAnchor="middle" className="text-[9px]" style={{ fill: 'rgb(148 163 184)' }}>
            Stĺp Stredu
          </text>
          <text x={25 / 100 * size} y={size * 1.03} textAnchor="middle" className="text-[9px]" style={{ fill: 'rgb(148 163 184)' }}>
            Stĺp Prísnosti
          </text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-300 font-medium">Primárna: {result.primarySefira.name}</p>
          <p className="text-slate-400">{result.primarySefira.meaning} · {result.primarySefira.pillar}</p>
        </div>
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
          <p className="text-indigo-300 font-medium">Sekundárna: {result.secondarySefira.name}</p>
          <p className="text-slate-400">{result.secondarySefira.meaning} · {result.secondarySefira.pillar}</p>
        </div>
      </div>
    </GlassCard>
  );
}
