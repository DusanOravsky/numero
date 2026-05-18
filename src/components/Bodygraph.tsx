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

interface CenterInfo {
  label: string;
  fullName: string;
  color: string;
  top: string;
  left: string;
}

const CENTERS: Record<string, CenterInfo> = {
  'Hlava':    { label: 'Hlava', fullName: 'Inšpirácia', color: '#f5c542', top: '0%', left: '50%' },
  'Ajna':     { label: 'Ajna', fullName: 'Myslenie', color: '#4ade80', top: '14%', left: '50%' },
  'Hrdlo':    { label: 'Hrdlo', fullName: 'Prejav', color: '#a78bfa', top: '28%', left: '50%' },
  'G':        { label: 'G', fullName: 'Identita', color: '#facc15', top: '44%', left: '50%' },
  'Ego':      { label: 'Ego', fullName: 'Vôľa', color: '#f87171', top: '37%', left: '78%' },
  'Sakrálne': { label: 'Sakrál', fullName: 'Sila', color: '#ef4444', top: '60%', left: '50%' },
  'SP':       { label: 'SP', fullName: 'Emócie', color: '#fb923c', top: '55%', left: '78%' },
  'Slezina':  { label: 'Slezina', fullName: 'Intuícia', color: '#fbbf24', top: '55%', left: '22%' },
  'Koreň':    { label: 'Koreň', fullName: 'Tlak', color: '#ef4444', top: '76%', left: '50%' },
};

export function Bodygraph({ result }: BodygraphProps) {
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

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '3/4' }}>
      {/* Channels as absolute lines using CSS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
        {Object.values(CHANNEL_TO_CENTERS).map(([c1, c2], i) => {
          const p1 = CENTERS[c1];
          const p2 = CENTERS[c2];
          if (!p1 || !p2) return null;
          const x1 = parseFloat(p1.left) * 3;
          const y1 = parseFloat(p1.top) * 4;
          const x2 = parseFloat(p2.left) * 3;
          const y2 = parseFloat(p2.top) * 4;
          const active = activeConnections.has(`${c1}|${c2}`);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={active ? '#6366f1' : '#e2e8f0'}
              strokeWidth={active ? 3 : 1.5}
              opacity={active ? 1 : 0.8}
            />
          );
        })}
      </svg>

      {/* Centers as positioned divs */}
      {Object.entries(CENTERS).map(([key, cfg]) => {
        const defined = definedKeys.has(key);
        return (
          <div
            key={key}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ top: cfg.top, left: cfg.left }}
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                defined ? 'text-white shadow-md' : 'text-slate-400'
              }`}
              style={{
                backgroundColor: defined ? cfg.color : '#ffffff',
                borderColor: defined ? cfg.color : '#e2e8f0',
                boxShadow: defined ? `0 2px 8px ${cfg.color}30` : 'none',
              }}
            >
              {cfg.label}
            </div>
            <span className="text-[8px] text-slate-500 mt-0.5">{cfg.fullName}</span>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 text-[9px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-500"></span> Definované
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-slate-600 bg-cosmic-900"></span> Otvorené
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-indigo-400 rounded"></span> Kanál
        </span>
      </div>
    </div>
  );
}
