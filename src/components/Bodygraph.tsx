import type { HumanDesignResult } from '../engine/humanDesignEngine';

interface BodygraphProps {
  result: HumanDesignResult;
}

const CENTER_CONFIG: Record<string, { x: number; y: number; shape: 'triangle' | 'square' | 'diamond'; color: string; label: string }> = {
  'Hlava': { x: 200, y: 40, shape: 'triangle', color: '#f59e0b', label: 'Hlava' },
  'Ajna': { x: 200, y: 120, shape: 'triangle', color: '#22c55e', label: 'Ajna' },
  'Hrdlo': { x: 200, y: 205, shape: 'square', color: '#8b5cf6', label: 'Hrdlo' },
  'G': { x: 200, y: 300, shape: 'diamond', color: '#f59e0b', label: 'G' },
  'Srdce/Ego': { x: 290, y: 270, shape: 'triangle', color: '#ef4444', label: 'Ego' },
  'Sakrálne': { x: 200, y: 390, shape: 'square', color: '#ef4444', label: 'Sakrál' },
  'Solárny plexus': { x: 295, y: 370, shape: 'triangle', color: '#f97316', label: 'SP' },
  'Slezina': { x: 105, y: 370, shape: 'triangle', color: '#f97316', label: 'Slezina' },
  'Koreň': { x: 200, y: 475, shape: 'square', color: '#ef4444', label: 'Koreň' },
};

const CHANNEL_LINES: [string, string][] = [
  ['Hlava', 'Ajna'],
  ['Ajna', 'Hrdlo'],
  ['Hrdlo', 'G'],
  ['Hrdlo', 'Srdce/Ego'],
  ['Hrdlo', 'Slezina'],
  ['Hrdlo', 'Sakrálne'],
  ['Hrdlo', 'Solárny plexus'],
  ['G', 'Srdce/Ego'],
  ['G', 'Sakrálne'],
  ['G', 'Slezina'],
  ['Srdce/Ego', 'Slezina'],
  ['Srdce/Ego', 'Solárny plexus'],
  ['Sakrálne', 'Koreň'],
  ['Sakrálne', 'Slezina'],
  ['Sakrálne', 'Solárny plexus'],
  ['Slezina', 'Koreň'],
  ['Solárny plexus', 'Koreň'],
  ['Koreň', 'Solárny plexus'],
];

function getChannelKey(ch: { gates: [number, number] }): string {
  return `${Math.min(ch.gates[0], ch.gates[1])}-${Math.max(ch.gates[0], ch.gates[1])}`;
}

const CHANNEL_TO_CENTERS: Record<string, [string, string]> = {
  '1-8': ['G', 'Hrdlo'], '2-14': ['G', 'Sakrálne'], '3-60': ['Sakrálne', 'Koreň'],
  '4-63': ['Ajna', 'Hlava'], '5-15': ['Sakrálne', 'G'], '6-59': ['Sakrálne', 'Solárny plexus'],
  '7-31': ['G', 'Hrdlo'], '9-52': ['Sakrálne', 'Koreň'], '10-20': ['G', 'Hrdlo'],
  '10-34': ['G', 'Sakrálne'], '10-57': ['G', 'Slezina'], '11-56': ['Ajna', 'Hrdlo'],
  '12-22': ['Hrdlo', 'Solárny plexus'], '13-33': ['G', 'Hrdlo'], '16-48': ['Hrdlo', 'Slezina'],
  '17-62': ['Ajna', 'Hrdlo'], '18-58': ['Slezina', 'Koreň'], '19-49': ['Koreň', 'Solárny plexus'],
  '20-34': ['Hrdlo', 'Sakrálne'], '20-57': ['Hrdlo', 'Slezina'], '21-45': ['Srdce/Ego', 'Hrdlo'],
  '23-43': ['Ajna', 'Hrdlo'], '24-61': ['Ajna', 'Hlava'], '25-51': ['G', 'Srdce/Ego'],
  '26-44': ['Srdce/Ego', 'Slezina'], '27-50': ['Sakrálne', 'Slezina'], '28-38': ['Slezina', 'Koreň'],
  '29-46': ['Sakrálne', 'G'], '30-41': ['Solárny plexus', 'Koreň'], '32-54': ['Slezina', 'Koreň'],
  '34-57': ['Sakrálne', 'Slezina'], '35-36': ['Hrdlo', 'Solárny plexus'], '37-40': ['Solárny plexus', 'Srdce/Ego'],
  '39-55': ['Koreň', 'Solárny plexus'], '42-53': ['Sakrálne', 'Koreň'], '47-64': ['Ajna', 'Hlava'],
};

export function Bodygraph({ result }: BodygraphProps) {
  const definedSet = new Set(result.definedCenters);
  const activeChannelPairs = new Set<string>();

  result.channels.forEach(ch => {
    const key = getChannelKey(ch);
    const centers = CHANNEL_TO_CENTERS[key];
    if (centers) {
      activeChannelPairs.add(`${centers[0]}|${centers[1]}`);
      activeChannelPairs.add(`${centers[1]}|${centers[0]}`);
    }
  });

  function isChannelActive(c1: string, c2: string): boolean {
    return activeChannelPairs.has(`${c1}|${c2}`);
  }

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 400 530" className="w-full max-w-md" style={{ aspectRatio: '400/530' }}>
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="channel-active" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Background subtle body outline */}
        <ellipse cx="200" cy="265" rx="120" ry="230" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="1" />

        {/* Channel lines */}
        {CHANNEL_LINES.map(([c1, c2], idx) => {
          const p1 = CENTER_CONFIG[c1];
          const p2 = CENTER_CONFIG[c2];
          if (!p1 || !p2) return null;
          const active = isChannelActive(c1, c2);
          return (
            <line
              key={idx}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={active ? 'url(#channel-active)' : 'rgba(51,51,80,0.4)'}
              strokeWidth={active ? 3.5 : 1.5}
              strokeLinecap="round"
              filter={active ? 'url(#glow-filter)' : undefined}
            />
          );
        })}

        {/* Centers */}
        {Object.entries(CENTER_CONFIG).map(([name, cfg]) => {
          const defined = definedSet.has(name);
          const fill = defined ? cfg.color : 'rgba(20,15,50,0.8)';
          const stroke = defined ? cfg.color : 'rgba(100,116,139,0.5)';
          const size = 28;
          const glow = defined ? `0 0 12px ${cfg.color}60` : 'none';

          return (
            <g key={name} style={{ filter: defined ? `drop-shadow(${glow})` : 'none' }}>
              {cfg.shape === 'triangle' && (
                <polygon
                  points={`${cfg.x},${cfg.y - size} ${cfg.x - size * 0.9},${cfg.y + size * 0.55} ${cfg.x + size * 0.9},${cfg.y + size * 0.55}`}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2.5 : 1.5}
                  opacity={defined ? 0.9 : 0.6}
                />
              )}
              {cfg.shape === 'square' && (
                <rect
                  x={cfg.x - size} y={cfg.y - size}
                  width={size * 2} height={size * 2} rx={8}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2.5 : 1.5}
                  opacity={defined ? 0.9 : 0.6}
                />
              )}
              {cfg.shape === 'diamond' && (
                <polygon
                  points={`${cfg.x},${cfg.y - size} ${cfg.x + size},${cfg.y} ${cfg.x},${cfg.y + size} ${cfg.x - size},${cfg.y}`}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2.5 : 1.5}
                  opacity={defined ? 0.9 : 0.6}
                />
              )}
              <text
                x={cfg.x} y={cfg.y + 4}
                textAnchor="middle"
                fill={defined ? '#ffffff' : '#64748b'}
                fontSize="10"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {cfg.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(20, 510)">
          <circle cx={8} cy={0} r={6} fill="#6366f1" opacity={0.9} />
          <text x={20} y={4} fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Definované (stále)</text>
          <circle cx={148} cy={0} r={6} fill="rgba(20,15,50,0.8)" stroke="#64748b" strokeWidth={1} />
          <text x={160} y={4} fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Otvorené (premenlivé)</text>
          <line x1={290} y1={0} x2={320} y2={0} stroke="url(#channel-active)" strokeWidth={3} strokeLinecap="round" />
          <text x={326} y={4} fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Kanál</text>
        </g>
      </svg>
    </div>
  );
}
