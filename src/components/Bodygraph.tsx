import type { HumanDesignResult } from '../engine/humanDesignEngine';

interface BodygraphProps {
  result: HumanDesignResult;
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

interface CenterDef {
  x: number;
  y: number;
  definedColor: string;
  undefinedFill: string;
  label: string;
  sublabel: string;
}

const CENTERS: Record<string, CenterDef> = {
  'Hlava':          { x: 250, y: 52,  definedColor: '#f5c542', undefinedFill: '#1c1835', label: 'Hlava', sublabel: 'Inšpirácia' },
  'Ajna':           { x: 250, y: 142, definedColor: '#4ade80', undefinedFill: '#1c1835', label: 'Ajna', sublabel: 'Myslenie' },
  'Hrdlo':          { x: 250, y: 238, definedColor: '#a78bfa', undefinedFill: '#1c1835', label: 'Hrdlo', sublabel: 'Prejav' },
  'G':              { x: 250, y: 345, definedColor: '#f5c542', undefinedFill: '#1c1835', label: 'G', sublabel: 'Identita' },
  'Srdce/Ego':      { x: 345, y: 305, definedColor: '#f87171', undefinedFill: '#1c1835', label: 'Ego', sublabel: 'Vôľa' },
  'Sakrálne':       { x: 250, y: 445, definedColor: '#f87171', undefinedFill: '#1c1835', label: 'Sakrál', sublabel: 'Životná sila' },
  'Solárny plexus': { x: 345, y: 420, definedColor: '#fb923c', undefinedFill: '#1c1835', label: 'SP', sublabel: 'Emócie' },
  'Slezina':        { x: 155, y: 420, definedColor: '#fb923c', undefinedFill: '#1c1835', label: 'Slezina', sublabel: 'Intuícia' },
  'Koreň':          { x: 250, y: 545, definedColor: '#f87171', undefinedFill: '#1c1835', label: 'Koreň', sublabel: 'Tlak' },
};

function drawCenter(name: string, cfg: CenterDef, defined: boolean) {
  const size = 34;
  const fill = defined ? cfg.definedColor : cfg.undefinedFill;
  const strokeColor = defined ? cfg.definedColor : '#334155';
  const strokeWidth = defined ? 2.5 : 1.2;
  const textColor = defined ? '#1a1a2e' : '#64748b';
  const opacity = defined ? 1 : 0.7;

  const triangleCenters = ['Hlava', 'Ajna', 'Srdce/Ego', 'Solárny plexus', 'Slezina'];
  const isTriangle = triangleCenters.includes(name);
  const isDiamond = name === 'G';

  let shape;
  if (isTriangle) {
    const flip = name === 'Hlava' ? 1 : -1;
    if (name === 'Hlava') {
      shape = <polygon points={`${cfg.x},${cfg.y + size} ${cfg.x - size},${cfg.y - size * 0.5} ${cfg.x + size},${cfg.y - size * 0.5}`} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} />;
    } else {
      shape = <polygon points={`${cfg.x},${cfg.y - size} ${cfg.x - size},${cfg.y + size * 0.5} ${cfg.x + size},${cfg.y + size * 0.5}`} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} />;
    }
  } else if (isDiamond) {
    shape = <polygon points={`${cfg.x},${cfg.y - size} ${cfg.x + size},${cfg.y} ${cfg.x},${cfg.y + size} ${cfg.x - size},${cfg.y}`} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} />;
  } else {
    shape = <rect x={cfg.x - size} y={cfg.y - size} width={size * 2} height={size * 2} rx={10} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} />;
  }

  return (
    <g key={name}>
      {defined && (
        <circle cx={cfg.x} cy={cfg.y} r={size + 8} fill="none" stroke={cfg.definedColor} strokeWidth="0.5" opacity="0.3" />
      )}
      {shape}
      <text x={cfg.x} y={cfg.y - 2} textAnchor="middle" fill={textColor} fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
        {cfg.label}
      </text>
      <text x={cfg.x} y={cfg.y + 12} textAnchor="middle" fill={defined ? cfg.definedColor + '99' : '#475569'} fontSize="8" fontFamily="system-ui, sans-serif">
        {cfg.sublabel}
      </text>
    </g>
  );
}

export function Bodygraph({ result }: BodygraphProps) {
  const definedSet = new Set(result.definedCenters);

  const activeConnections = new Set<string>();
  result.channels.forEach(ch => {
    const key = `${Math.min(ch.gates[0], ch.gates[1])}-${Math.max(ch.gates[0], ch.gates[1])}`;
    const centers = CHANNEL_TO_CENTERS[key];
    if (centers) {
      activeConnections.add(`${centers[0]}→${centers[1]}`);
      activeConnections.add(`${centers[1]}→${centers[0]}`);
    }
  });

  const allConnections: [string, string, boolean][] = [];
  const drawnPairs = new Set<string>();

  Object.values(CHANNEL_TO_CENTERS).forEach(([c1, c2]) => {
    const pairKey = [c1, c2].sort().join('|');
    if (drawnPairs.has(pairKey)) return;
    drawnPairs.add(pairKey);
    const active = activeConnections.has(`${c1}→${c2}`);
    allConnections.push([c1, c2, active]);
  });

  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 500 610" className="w-full max-w-sm" style={{ aspectRatio: '500/610' }}>
        <defs>
          <filter id="bodygraph-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="active-channel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.03)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="500" height="610" fill="url(#bg-gradient)" />

        {/* Connection lines */}
        {allConnections.map(([c1, c2, active], idx) => {
          const p1 = CENTERS[c1];
          const p2 = CENTERS[c2];
          if (!p1 || !p2) return null;

          if (active) {
            return (
              <g key={idx}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="url(#active-channel)" strokeWidth="4.5" strokeLinecap="round"
                  filter="url(#bodygraph-glow)" />
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
              </g>
            );
          }
          return (
            <line key={idx} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4" />
          );
        })}

        {/* Centers - draw undefined first, then defined on top */}
        {Object.entries(CENTERS)
          .filter(([name]) => !definedSet.has(name))
          .map(([name, cfg]) => drawCenter(name, cfg, false))}
        {Object.entries(CENTERS)
          .filter(([name]) => definedSet.has(name))
          .map(([name, cfg]) => drawCenter(name, cfg, true))}

        {/* Info */}
        <g transform="translate(30, 590)">
          <circle cx={6} cy={0} r={5} fill="#f5c542" />
          <text x={16} y={4} fill="#94a3b8" fontSize="9">Definované</text>
          <rect x={100} y={-5} width={10} height={10} rx={3} fill="#1c1835" stroke="#334155" strokeWidth={1} />
          <text x={116} y={4} fill="#94a3b8" fontSize="9">Otvorené</text>
          <line x1={200} y1={0} x2={230} y2={0} stroke="url(#active-channel)" strokeWidth={3.5} strokeLinecap="round" />
          <text x={236} y={4} fill="#94a3b8" fontSize="9">Aktívny kanál</text>
          <line x1={340} y1={0} x2={370} y2={0} stroke="#1e293b" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
          <text x={376} y={4} fill="#94a3b8" fontSize="9">Neaktívny</text>
        </g>
      </svg>
    </div>
  );
}
