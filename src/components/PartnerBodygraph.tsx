import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { CHANNEL_DEFINITIONS } from '../engine/humanDesignEngine';

interface PartnerBodygraphProps {
  result1: HumanDesignResult;
  result2: HumanDesignResult;
  name1: string;
  name2: string;
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
  top: string;
  left: string;
}

const CENTERS: Record<string, CenterInfo> = {
  'Hlava':    { label: 'Hlava', fullName: 'Inspiracia', top: '2%', left: '50%' },
  'Ajna':     { label: 'Ajna', fullName: 'Myslenie', top: '15%', left: '50%' },
  'Hrdlo':    { label: 'Hrdlo', fullName: 'Prejav', top: '28%', left: '50%' },
  'G':        { label: 'G', fullName: 'Identita', top: '42%', left: '50%' },
  'Ego':      { label: 'Ego', fullName: 'Vola', top: '36%', left: '80%' },
  'Sakrálne': { label: 'Sakral', fullName: 'Sila', top: '58%', left: '50%' },
  'SP':       { label: 'SP', fullName: 'Emocie', top: '53%', left: '80%' },
  'Slezina':  { label: 'Slezina', fullName: 'Intuicia', top: '53%', left: '20%' },
  'Koreň':    { label: 'Koren', fullName: 'Tlak', top: '72%', left: '50%' },
};

// Map engine center names to our local keys
const nameToKey: Record<string, string> = {
  'Hlava': 'Hlava', 'Ajna': 'Ajna', 'Hrdlo': 'Hrdlo', 'G': 'G',
  'Srdce/Ego': 'Ego', 'Sakrálne': 'Sakrálne', 'Solárny plexus': 'SP',
  'Slezina': 'Slezina', 'Koreň': 'Koreň',
};

interface ChannelAnalysis {
  electromagnetic: { gates: [number, number]; name: string }[];
  compromise: { gates: [number, number]; name: string }[];
  dominant1: { gates: [number, number]; name: string }[];
  dominant2: { gates: [number, number]; name: string }[];
}

function analyzeChannels(result1: HumanDesignResult, result2: HumanDesignResult): ChannelAnalysis {
  const gates1 = new Set(result1.allActivatedGates);
  const gates2 = new Set(result2.allActivatedGates);

  const electromagnetic: { gates: [number, number]; name: string }[] = [];
  const compromise: { gates: [number, number]; name: string }[] = [];
  const dominant1: { gates: [number, number]; name: string }[] = [];
  const dominant2: { gates: [number, number]; name: string }[] = [];

  CHANNEL_DEFINITIONS.forEach(ch => {
    const [gA, gB] = ch.gates;
    const p1HasA = gates1.has(gA);
    const p1HasB = gates1.has(gB);
    const p2HasA = gates2.has(gA);
    const p2HasB = gates2.has(gB);

    const p1Complete = p1HasA && p1HasB;
    const p2Complete = p2HasA && p2HasB;

    if (p1Complete && p2Complete) {
      // Both have the full channel
      compromise.push({ gates: ch.gates, name: ch.name });
    } else if (p1Complete && !p2Complete) {
      // Only person1 has the channel complete
      dominant1.push({ gates: ch.gates, name: ch.name });
    } else if (p2Complete && !p1Complete) {
      // Only person2 has the channel complete
      dominant2.push({ gates: ch.gates, name: ch.name });
    } else {
      // Check for electromagnetic: one has gate A, other has gate B (completing the channel together)
      const electro = (p1HasA && p2HasB && !p1HasB && !p2HasA) ||
                      (p1HasB && p2HasA && !p1HasA && !p2HasB);
      if (electro) {
        electromagnetic.push({ gates: ch.gates, name: ch.name });
      }
    }
  });

  return { electromagnetic, compromise, dominant1, dominant2 };
}

function getConditioningAnalysis(result1: HumanDesignResult, result2: HumanDesignResult, name1: string, name2: string) {
  const defined1 = new Set(result1.definedCenters.map(n => nameToKey[n] || n));
  const defined2 = new Set(result2.definedCenters.map(n => nameToKey[n] || n));

  // Centers person1 defines that person2 doesn't = person1 conditions person2 there
  const p1ConditionsP2: string[] = [];
  const p2ConditionsP1: string[] = [];

  defined1.forEach(c => {
    if (!defined2.has(c)) p1ConditionsP2.push(c);
  });
  defined2.forEach(c => {
    if (!defined1.has(c)) p2ConditionsP1.push(c);
  });

  return { p1ConditionsP2, p2ConditionsP1 };
}

export function PartnerBodygraph({ result1, result2, name1, name2 }: PartnerBodygraphProps) {
  const definedKeys1 = new Set(result1.definedCenters.map(n => nameToKey[n] || n));
  const definedKeys2 = new Set(result2.definedCenters.map(n => nameToKey[n] || n));

  const channelAnalysis = analyzeChannels(result1, result2);
  const conditioning = getConditioningAnalysis(result1, result2, name1, name2);

  // Determine channel line colors for the composite
  const getChannelColor = (channelKey: string): string => {
    const ch = CHANNEL_DEFINITIONS.find(c => {
      const key = `${Math.min(c.gates[0], c.gates[1])}-${Math.max(c.gates[0], c.gates[1])}`;
      return key === channelKey;
    });
    if (!ch) return '#e2e8f0';

    const gates1 = new Set(result1.allActivatedGates);
    const gates2 = new Set(result2.allActivatedGates);
    const p1Complete = gates1.has(ch.gates[0]) && gates1.has(ch.gates[1]);
    const p2Complete = gates2.has(ch.gates[0]) && gates2.has(ch.gates[1]);

    if (p1Complete && p2Complete) return '#a855f7'; // purple - compromise
    if (p1Complete) return '#f43f5e'; // rose - dominant person1
    if (p2Complete) return '#6366f1'; // indigo - dominant person2

    // Check electromagnetic
    const p1HasA = gates1.has(ch.gates[0]);
    const p1HasB = gates1.has(ch.gates[1]);
    const p2HasA = gates2.has(ch.gates[0]);
    const p2HasB = gates2.has(ch.gates[1]);
    const electro = (p1HasA && p2HasB && !p1HasB && !p2HasA) ||
                    (p1HasB && p2HasA && !p1HasA && !p2HasB);
    if (electro) return '#f59e0b'; // amber - electromagnetic

    return '#e2e8f0';
  };

  // Determine center colors
  const getCenterColor = (key: string): { bg: string; border: string; text: string } => {
    const d1 = definedKeys1.has(key);
    const d2 = definedKeys2.has(key);

    if (d1 && d2) return { bg: '#7c3aed', border: '#7c3aed', text: 'text-white' }; // purple - both
    if (d1 && !d2) return { bg: '#f43f5e', border: '#f43f5e', text: 'text-white' }; // rose - person1
    if (!d1 && d2) return { bg: '#6366f1', border: '#6366f1', text: 'text-white' }; // indigo - person2
    return { bg: '#ffffff', border: '#e2e8f0', text: 'text-slate-400' }; // white - neither
  };

  return (
    <div className="space-y-6">
      {/* Composite Bodygraph */}
      <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '3/4' }}>
        {/* Channel lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
          {Object.entries(CHANNEL_TO_CENTERS).map(([channelKey, [c1, c2]]) => {
            const p1 = CENTERS[c1];
            const p2 = CENTERS[c2];
            if (!p1 || !p2) return null;
            const x1 = parseFloat(p1.left) * 3;
            const y1 = parseFloat(p1.top) * 4;
            const x2 = parseFloat(p2.left) * 3;
            const y2 = parseFloat(p2.top) * 4;
            const color = getChannelColor(channelKey);
            const isActive = color !== '#e2e8f0';
            return (
              <line key={channelKey} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 1 : 0.4}
              />
            );
          })}
        </svg>

        {/* Centers */}
        {Object.entries(CENTERS).map(([key, cfg]) => {
          const colors = getCenterColor(key);
          return (
            <div
              key={key}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ top: cfg.top, left: cfg.left }}
            >
              <div
                className={`w-9 h-9 rounded-md flex items-center justify-center text-[9px] font-bold border-2 transition-all ${colors.text} ${colors.bg !== '#ffffff' ? 'shadow-md' : ''}`}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  boxShadow: colors.bg !== '#ffffff' ? `0 2px 8px ${colors.bg}30` : 'none',
                }}
                title={`${cfg.label} - ${cfg.fullName}`}
              >
                {cfg.label.length > 4 ? cfg.label.slice(0, 3) : cfg.label}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 text-[8px] text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#f43f5e' }}></span> {name1}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#6366f1' }}></span> {name2}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }}></span> Obaja
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border border-slate-300 bg-white"></span> Nikto
          </span>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="space-y-4">
        {/* Electromagnetic channels */}
        {channelAnalysis.electromagnetic.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <h4 className="text-sm font-medium text-amber-300 mb-2">Elektromagnetické kanály – vzájomná príťažlivosť</h4>
            <p className="text-xs text-slate-500 mb-3">Každý z vás má jednu bránu kanála a druhý má tú druhú. Keď ste spolu, vytvárate energiu, ktorú sám nemá nikto z vás. Preto sa k sebe priťahujete – dopĺňate sa na energetickej úrovni. Tieto kanály sú najsilnejším magnetom vo vzťahu.</p>
            {channelAnalysis.electromagnetic.map((ch, i) => (
              <div key={i} className="p-2 rounded-lg bg-amber-50 border border-amber-200 mb-2">
                <p className="text-sm font-medium text-slate-800">{ch.name} (brány {ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500 mt-1">
                  {name1} prináša bránu {ch.gates[0]}, {name2} prináša bránu {ch.gates[1]}. Spolu aktivujete energiu {ch.name} – oblasť, kde ste najsilnejší AKO PÁR.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Compromise channels */}
        {channelAnalysis.compromise.length > 0 && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-sm font-medium text-purple-300 mb-2">Kompromisné kanály – spoločná energia</h4>
            <p className="text-xs text-slate-500 mb-3">Obaja máte rovnaký kompletný kanál. To znamená, že v tejto oblasti máte obe konzistentnú energiu. Môže to byť veľká sila (rozumiete si bez slov), ale aj trecie plocha (obaja chcete dominovať rovnakým spôsobom). Kľúčom je vzájomný rešpekt.</p>
            {channelAnalysis.compromise.map((ch, i) => (
              <div key={i} className="p-2 rounded-lg bg-purple-50 border border-purple-200 mb-2">
                <p className="text-sm font-medium text-slate-800">{ch.name} (brány {ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500 mt-1">Obaja máte energiu "{ch.name}" – zdieľate rovnakú silu, čo môže vytvárať harmóniu AJ súťaž.</p>
              </div>
            ))}
          </div>
        )}

        {/* Dominant channels */}
        {(channelAnalysis.dominant1.length > 0 || channelAnalysis.dominant2.length > 0) && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <h4 className="text-sm font-medium text-rose-300 mb-2">Dominantné kanály – kto vedie v akej oblasti</h4>
            <p className="text-xs text-slate-500 mb-3">Len jeden z vás má kompletný kanál – tá osoba má v tejto oblasti konzistentnú energiu a prirodzene v nej dominuje. Partner ju v tejto oblasti nasleduje alebo sa od nej učí. Nie je to nerovnováha – je to prirodzené rozdelenie "zodpovedností" vo vzťahu.</p>
            {channelAnalysis.dominant1.map((ch, i) => (
              <div key={i} className="p-2 rounded-lg bg-rose-50 border border-rose-200 mb-2">
                <p className="text-sm text-slate-800"><strong className="text-rose-600">{name1}</strong> dominuje: {ch.name} ({ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500">{name1} má konzistentnú energiu v oblasti "{ch.name}" a prirodzene túto oblasť vo vzťahu riadi.</p>
              </div>
            ))}
            {channelAnalysis.dominant2.map((ch, i) => (
              <div key={i} className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 mb-2">
                <p className="text-sm text-slate-800"><strong className="text-indigo-600">{name2}</strong> dominuje: {ch.name} ({ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500">{name2} má konzistentnú energiu v oblasti "{ch.name}" a prirodzene túto oblasť vo vzťahu riadi.</p>
              </div>
            ))}
          </div>
        )}

        {/* Conditioning */}
        <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Podmieňovanie – vzájomný vplyv</h4>
          <p className="text-xs text-slate-500 mb-3">Keď je vaše centrum definované a partnerove je otvorené, váš partner "absorbuje" vašu energiu v tejto oblasti. Vy ho v nej podmieňujete – ovplyvňujete, ako sa cíti, myslí alebo koná. Nie je to zlé – ale je dôležité to rozpoznať, aby partner mohol rozlíšiť čo je JEHO a čo je VAŠE.</p>
          {conditioning.p1ConditionsP2.length > 0 && (
            <div className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200">
              <p className="text-xs text-rose-600 font-medium mb-1">{name1} podmieňuje {name2} v oblastiach:</p>
              <p className="text-xs text-slate-600">{conditioning.p1ConditionsP2.join(', ')}</p>
              <p className="text-[10px] text-slate-400 mt-1">{name2} v týchto oblastiach absorbuje energiu od {name1}. Musí rozlišovať čo je skutočne jeho/jej a čo preberá od partnera.</p>
            </div>
          )}
          {conditioning.p2ConditionsP1.length > 0 && (
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
              <p className="text-xs text-indigo-600 font-medium mb-1">{name2} podmieňuje {name1} v oblastiach:</p>
              <p className="text-xs text-slate-600">{conditioning.p2ConditionsP1.join(', ')}</p>
              <p className="text-[10px] text-slate-400 mt-1">{name1} v týchto oblastiach absorbuje energiu od {name2}. Musí rozlišovať čo je skutočne jeho/jej a čo preberá od partnera.</p>
            </div>
          )}
          {conditioning.p1ConditionsP2.length === 0 && conditioning.p2ConditionsP1.length === 0 && (
            <p className="text-xs text-slate-400">Ziadne vzajomne podmienovanie - oba partneri maju rovnake definovane centra.</p>
          )}
        </div>
      </div>
    </div>
  );
}
