import type { HumanDesignResult } from '../engine/humanDesignEngine';

interface BodygraphProps {
  result: HumanDesignResult;
}

const CENTER_POSITIONS: Record<string, { x: number; y: number; shape: 'triangle' | 'square' | 'diamond' }> = {
  'Hlava': { x: 200, y: 30, shape: 'triangle' },
  'Ajna': { x: 200, y: 100, shape: 'triangle' },
  'Hrdlo': { x: 200, y: 175, shape: 'square' },
  'G': { x: 200, y: 265, shape: 'diamond' },
  'Srdce/Ego': { x: 280, y: 240, shape: 'triangle' },
  'Sakrálne': { x: 200, y: 355, shape: 'square' },
  'Solárny plexus': { x: 285, y: 330, shape: 'triangle' },
  'Slezina': { x: 115, y: 330, shape: 'triangle' },
  'Koreň': { x: 200, y: 440, shape: 'square' },
};

const CHANNEL_PATHS: Record<string, [string, string]> = {
  '1-8': ['G', 'Hrdlo'],
  '2-14': ['G', 'Sakrálne'],
  '3-60': ['Sakrálne', 'Koreň'],
  '4-63': ['Ajna', 'Hlava'],
  '5-15': ['Sakrálne', 'G'],
  '6-59': ['Sakrálne', 'Solárny plexus'],
  '7-31': ['G', 'Hrdlo'],
  '9-52': ['Sakrálne', 'Koreň'],
  '10-20': ['G', 'Hrdlo'],
  '10-34': ['G', 'Sakrálne'],
  '10-57': ['G', 'Slezina'],
  '11-56': ['Ajna', 'Hrdlo'],
  '12-22': ['Hrdlo', 'Solárny plexus'],
  '13-33': ['G', 'Hrdlo'],
  '16-48': ['Hrdlo', 'Slezina'],
  '17-62': ['Ajna', 'Hrdlo'],
  '18-58': ['Slezina', 'Koreň'],
  '19-49': ['Koreň', 'Solárny plexus'],
  '20-34': ['Hrdlo', 'Sakrálne'],
  '20-57': ['Hrdlo', 'Slezina'],
  '21-45': ['Srdce/Ego', 'Hrdlo'],
  '23-43': ['Ajna', 'Hrdlo'],
  '24-61': ['Ajna', 'Hlava'],
  '25-51': ['G', 'Srdce/Ego'],
  '26-44': ['Srdce/Ego', 'Slezina'],
  '27-50': ['Sakrálne', 'Slezina'],
  '28-38': ['Slezina', 'Koreň'],
  '29-46': ['Sakrálne', 'G'],
  '30-41': ['Solárny plexus', 'Koreň'],
  '32-54': ['Slezina', 'Koreň'],
  '34-57': ['Sakrálne', 'Slezina'],
  '35-36': ['Hrdlo', 'Solárny plexus'],
  '37-40': ['Solárny plexus', 'Srdce/Ego'],
  '39-55': ['Koreň', 'Solárny plexus'],
  '42-53': ['Sakrálne', 'Koreň'],
  '47-64': ['Ajna', 'Hlava'],
};

function CenterShape({ x, y, shape, defined, label }: { x: number; y: number; shape: string; defined: boolean; label: string }) {
  const fill = defined ? 'rgba(99, 102, 241, 0.4)' : 'rgba(30, 27, 75, 0.6)';
  const stroke = defined ? '#6366f1' : '#475569';
  const size = 32;

  return (
    <g>
      {shape === 'triangle' && (
        <polygon
          points={`${x},${y - size} ${x - size},${y + size * 0.6} ${x + size},${y + size * 0.6}`}
          fill={fill} stroke={stroke} strokeWidth="2"
        />
      )}
      {shape === 'square' && (
        <rect x={x - size} y={y - size} width={size * 2} height={size * 2} rx="6"
          fill={fill} stroke={stroke} strokeWidth="2"
        />
      )}
      {shape === 'diamond' && (
        <polygon
          points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
          fill={fill} stroke={stroke} strokeWidth="2"
        />
      )}
      <text x={x} y={y + 4} textAnchor="middle" fill={defined ? '#e2e8f0' : '#64748b'} fontSize="9" fontWeight="bold">
        {label}
      </text>
    </g>
  );
}

export function Bodygraph({ result }: BodygraphProps) {
  const definedSet = new Set(result.definedCenters);
  const activeChannelKeys = new Set(result.channels.map(ch => `${ch.gates[0]}-${ch.gates[1]}`));

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 400 490" className="w-full max-w-sm" style={{ aspectRatio: '400/490' }}>
        {/* Channels */}
        {Object.entries(CHANNEL_PATHS).map(([key, [c1, c2]]) => {
          const pos1 = CENTER_POSITIONS[c1];
          const pos2 = CENTER_POSITIONS[c2];
          if (!pos1 || !pos2) return null;
          const isActive = activeChannelKeys.has(key);
          return (
            <line
              key={key}
              x1={pos1.x} y1={pos1.y}
              x2={pos2.x} y2={pos2.y}
              stroke={isActive ? '#6366f1' : '#1e293b'}
              strokeWidth={isActive ? 3 : 1}
              opacity={isActive ? 1 : 0.3}
            />
          );
        })}

        {/* Centers */}
        {Object.entries(CENTER_POSITIONS).map(([name, pos]) => (
          <CenterShape
            key={name}
            x={pos.x} y={pos.y}
            shape={pos.shape}
            defined={definedSet.has(name)}
            label={name === 'Solárny plexus' ? 'SP' : name === 'Srdce/Ego' ? 'Ego' : name === 'Sakrálne' ? 'Sakr' : name}
          />
        ))}

        {/* Legend */}
        <rect x={10} y={470} width={12} height={12} rx={2} fill="rgba(99,102,241,0.4)" stroke="#6366f1" strokeWidth="1" />
        <text x={28} y={480} fill="#94a3b8" fontSize="9">Definované</text>
        <rect x={120} y={470} width={12} height={12} rx={2} fill="rgba(30,27,75,0.6)" stroke="#475569" strokeWidth="1" />
        <text x={138} y={480} fill="#94a3b8" fontSize="9">Otvorené</text>
        <line x1={230} y1={476} x2={260} y2={476} stroke="#6366f1" strokeWidth="3" />
        <text x={266} y={480} fill="#94a3b8" fontSize="9">Aktívny kanál</text>
      </svg>
    </div>
  );
}
