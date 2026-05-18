import type { HumanDesignResult } from '../engine/humanDesignEngine';

interface BodygraphProps {
  result: HumanDesignResult;
}

const CHANNEL_TO_CENTERS: Record<string, [string, string]> = {
  '1-8': ['G', 'Hrdlo'], '2-14': ['G', 'Sakrálne'], '3-60': ['Sakrálne', 'Koreň'],
  '4-63': ['Ajna', 'Hlava'], '5-15': ['Sakrálne', 'G'], '6-59': ['Sakrálne', 'SP'],
  '7-31': ['G', 'Hrdlo'], '9-52': ['Sakrálne', 'Koreň'], '10-20': ['G', 'Hrdlo'],
  '10-34': ['G', 'Sakrálne'], '10-57': ['G', 'Slezina'], '11-56': ['Ajna', 'Hrdlo'],
  '12-22': ['Hrdlo', 'SP'], '13-33': ['G', 'Hrdlo'], '16-48': ['Hrdlo', 'Slezina'],
  '17-62': ['Ajna', 'Hrdlo'], '18-58': ['Slezina', 'Koreň'], '19-49': ['Koreň', 'SP'],
  '20-34': ['Hrdlo', 'Sakrálne'], '20-57': ['Hrdlo', 'Slezina'], '21-45': ['Ego', 'Hrdlo'],
  '23-43': ['Ajna', 'Hrdlo'], '24-61': ['Ajna', 'Hlava'], '25-51': ['G', 'Ego'],
  '26-44': ['Ego', 'Slezina'], '27-50': ['Sakrálne', 'Slezina'], '28-38': ['Slezina', 'Koreň'],
  '29-46': ['Sakrálne', 'G'], '30-41': ['SP', 'Koreň'], '32-54': ['Slezina', 'Koreň'],
  '34-57': ['Sakrálne', 'Slezina'], '35-36': ['Hrdlo', 'SP'], '37-40': ['SP', 'Ego'],
  '39-55': ['Koreň', 'SP'], '42-53': ['Sakrálne', 'Koreň'], '47-64': ['Ajna', 'Hlava'],
};

// Compact layout - centers positioned like real HD bodygraph
const C: Record<string, { x: number; y: number }> = {
  'Hlava':    { x: 150, y: 20 },
  'Ajna':     { x: 150, y: 65 },
  'Hrdlo':    { x: 150, y: 115 },
  'G':        { x: 150, y: 175 },
  'Ego':      { x: 210, y: 152 },
  'Sakrálne': { x: 150, y: 235 },
  'SP':       { x: 210, y: 218 },
  'Slezina':  { x: 90, y: 218 },
  'Koreň':    { x: 150, y: 290 },
};

const CENTER_COLORS: Record<string, string> = {
  'Hlava': '#f5c542', 'Ajna': '#4ade80', 'Hrdlo': '#a78bfa',
  'G': '#facc15', 'Ego': '#f87171', 'Sakrálne': '#ef4444',
  'SP': '#fb923c', 'Slezina': '#fbbf24', 'Koreň': '#ef4444',
};

export function Bodygraph({ result }: BodygraphProps) {
  const definedSet = new Set(result.definedCenters);
  // Map HD center names to our short keys
  const nameToKey: Record<string, string> = {
    'Hlava': 'Hlava', 'Ajna': 'Ajna', 'Hrdlo': 'Hrdlo', 'G': 'G',
    'Srdce/Ego': 'Ego', 'Sakrálne': 'Sakrálne', 'Solárny plexus': 'SP',
    'Slezina': 'Slezina', 'Koreň': 'Koreň',
  };

  const definedKeys = new Set(result.definedCenters.map(n => nameToKey[n] || n));

  const activeConnections = new Set<string>();
  result.channels.forEach(ch => {
    const key = `${Math.min(ch.gates[0], ch.gates[1])}-${Math.max(ch.gates[0], ch.gates[1])}`;
    const centers = CHANNEL_TO_CENTERS[key];
    if (centers) {
      activeConnections.add(`${centers[0]}|${centers[1]}`);
      activeConnections.add(`${centers[1]}|${centers[0]}`);
    }
  });

  // Get unique connection pairs
  const drawnPairs = new Set<string>();
  const connections: { c1: string; c2: string; active: boolean }[] = [];
  Object.values(CHANNEL_TO_CENTERS).forEach(([c1, c2]) => {
    const pk = [c1, c2].sort().join('|');
    if (drawnPairs.has(pk)) return;
    drawnPairs.add(pk);
    connections.push({ c1, c2, active: activeConnections.has(`${c1}|${c2}`) });
  });

  const size = 18;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 300 320" className="w-full max-w-xs">
        <defs>
          <filter id="ch-glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map(({ c1, c2, active }, i) => {
          const p1 = C[c1]; const p2 = C[c2];
          if (!p1 || !p2) return null;
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={active ? '#818cf8' : '#1e293b'}
              strokeWidth={active ? 3 : 1}
              strokeLinecap="round"
              opacity={active ? 1 : 0.3}
              filter={active ? 'url(#ch-glow)' : undefined}
            />
          );
        })}

        {/* Centers */}
        {Object.entries(C).map(([name, pos]) => {
          const defined = definedKeys.has(name);
          const color = CENTER_COLORS[name] || '#6366f1';
          const fill = defined ? color : '#0f0a2e';
          const stroke = defined ? color : '#334155';

          const isTriangle = ['Hlava', 'Ajna', 'Ego', 'SP', 'Slezina'].includes(name);
          const isDiamond = name === 'G';

          return (
            <g key={name}>
              {isTriangle ? (
                <polygon
                  points={name === 'Hlava'
                    ? `${pos.x},${pos.y + size * 0.8} ${pos.x - size},${pos.y - size * 0.5} ${pos.x + size},${pos.y - size * 0.5}`
                    : `${pos.x},${pos.y - size * 0.8} ${pos.x - size},${pos.y + size * 0.5} ${pos.x + size},${pos.y + size * 0.5}`}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2 : 1}
                />
              ) : isDiamond ? (
                <polygon
                  points={`${pos.x},${pos.y - size} ${pos.x + size},${pos.y} ${pos.x},${pos.y + size} ${pos.x - size},${pos.y}`}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2 : 1}
                />
              ) : (
                <rect x={pos.x - size} y={pos.y - size} width={size * 2} height={size * 2} rx={5}
                  fill={fill} stroke={stroke} strokeWidth={defined ? 2 : 1}
                />
              )}
              <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                fill={defined ? '#000' : '#64748b'} fontSize="8" fontWeight="700">
                {name === 'Sakrálne' ? 'SAK' : name === 'Slezina' ? 'SLZ' : name}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10, 310)">
          <circle cx={5} cy={0} r={4} fill="#f5c542" />
          <text x={13} y={3} fill="#64748b" fontSize="7">Definované</text>
          <circle cx={80} cy={0} r={4} fill="#0f0a2e" stroke="#334155" strokeWidth={1} />
          <text x={88} y={3} fill="#64748b" fontSize="7">Otvorené</text>
          <line x1={150} y1={0} x2={168} y2={0} stroke="#818cf8" strokeWidth={3} strokeLinecap="round" />
          <text x={173} y={3} fill="#64748b" fontSize="7">Kanál</text>
        </g>
      </svg>
    </div>
  );
}
