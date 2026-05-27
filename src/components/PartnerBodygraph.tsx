import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { CHANNEL_DEFINITIONS, CENTER_THEMES } from '../engine/humanDesignEngine';
import { getGeneKeyByGate } from '../data/geneKeys';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, HD_CHANNEL_DISPLAY } from '../i18n/entityNames';

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

// Pozície zarovnané s Bodygraph.tsx — Hlava posunutá z 2% na 8% kvôli
// prekrývaniu hlavičky stránky.
const CENTERS: Record<string, CenterInfo> = {
  'Hlava':    { label: 'Hlava', fullName: 'Inspiracia', top: '8%', left: '50%' },
  'Ajna':     { label: 'Ajna', fullName: 'Myslenie', top: '20%', left: '50%' },
  'Hrdlo':    { label: 'Hrdlo', fullName: 'Prejav', top: '32%', left: '50%' },
  'G':        { label: 'G', fullName: 'Identita', top: '46%', left: '50%' },
  'Ego':      { label: 'Ego', fullName: 'Vola', top: '40%', left: '80%' },
  'Sakrálne': { label: 'Sakral', fullName: 'Sila', top: '62%', left: '50%' },
  'SP':       { label: 'SP', fullName: 'Emocie', top: '57%', left: '80%' },
  'Slezina':  { label: 'Slezina', fullName: 'Intuicia', top: '57%', left: '20%' },
  'Koreň':    { label: 'Koren', fullName: 'Tlak', top: '78%', left: '50%' },
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

function getConditioningAnalysis(result1: HumanDesignResult, result2: HumanDesignResult) {
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

const CENTER_THEMES_EN: Record<string, string> = {
  'Hlava': 'Inspiration and questions',
  'Ajna': 'Thinking and conceptualization',
  'Hrdlo': 'Communication and manifestation',
  'G': 'Identity, direction and love',
  'Srdce/Ego': 'Willpower and value',
  'Sakrálne': 'Life force and fertility',
  'Solárny plexus': 'Emotions and feelings',
  'Slezina': 'Intuition, health and time',
  'Koreň': 'Pressure and adrenaline',
};

export function PartnerBodygraph({ result1, result2, name1, name2 }: PartnerBodygraphProps) {
  const { language } = useTranslation();
  const definedKeys1 = new Set(result1.definedCenters.map(n => nameToKey[n] || n));
  const definedKeys2 = new Set(result2.definedCenters.map(n => nameToKey[n] || n));

  const channelAnalysis = analyzeChannels(result1, result2);
  const conditioning = getConditioningAnalysis(result1, result2);

  // Determine channel line colors for the composite
  const getChannelColor = (channelKey: string): string => {
    const ch = CHANNEL_DEFINITIONS.find(c => {
      const key = `${Math.min(c.gates[0], c.gates[1])}-${Math.max(c.gates[0], c.gates[1])}`;
      return key === channelKey;
    });
    if (!ch) return 'rgba(148,163,184,0.3)';

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

    return 'rgba(148,163,184,0.3)';
  };

  // Determine center colors
  const getCenterColor = (key: string): { bg: string; border: string; text: string } => {
    const d1 = definedKeys1.has(key);
    const d2 = definedKeys2.has(key);

    if (d1 && d2) return { bg: '#7c3aed', border: '#7c3aed', text: 'text-white' }; // purple - both
    if (d1 && !d2) return { bg: '#f43f5e', border: '#f43f5e', text: 'text-white' }; // rose - person1
    if (!d1 && d2) return { bg: '#6366f1', border: '#6366f1', text: 'text-white' }; // indigo - person2
    return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: 'text-slate-400' };
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
            const isActive = !color.startsWith('rgba(148');
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
                className={`w-9 h-9 rounded-md flex items-center justify-center text-[9px] font-bold border-2 transition-all ${colors.text} ${!colors.bg.startsWith('rgba(148') ? 'shadow-md' : ''}`}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  boxShadow: !colors.bg.startsWith('rgba(148') ? `0 2px 8px ${colors.bg}30` : 'none',
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
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }}></span> {language === 'sk' ? 'Obaja' : 'Both'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border border-slate-300 bg-white"></span> {language === 'sk' ? 'Nikto' : 'Neither'}
          </span>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="space-y-4">
        {/* Electromagnetic channels */}
        {channelAnalysis.electromagnetic.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <h4 className="text-sm font-medium text-amber-300 mb-2">{language === 'sk' ? 'Elektromagnetické kanály – vzájomná príťažlivosť' : 'Electromagnetic channels – mutual attraction'}</h4>
            <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Každý z vás má jednu bránu kanála a druhý má tú druhú. Keď ste spolu, vytvárate energiu, ktorú sám nemá nikto z vás. Preto sa k sebe priťahujete – dopĺňate sa na energetickej úrovni. Tieto kanály sú najsilnejším magnetom vo vzťahu.' : 'Each of you has one gate of the channel and the other has the second one. When together, you create energy that neither of you has alone. That is why you are attracted to each other – you complement on an energetic level. These channels are the strongest magnet in the relationship.'}</p>
            {channelAnalysis.electromagnetic.map((ch, i) => {
              const gk1 = getGeneKeyByGate(ch.gates[0], language);
              const gk2 = getGeneKeyByGate(ch.gates[1], language);
              return (
              <div key={i} className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-2 space-y-2">
                <p className="text-sm font-medium text-slate-800">{displayName(HD_CHANNEL_DISPLAY, ch.name, language)} ({language === 'sk' ? 'brány' : 'gates'} {ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500">
                  {language === 'sk' ? `${name1} prináša bránu ${ch.gates[0]}, ${name2} prináša bránu ${ch.gates[1]}. Spolu aktivujete energiu ${displayName(HD_CHANNEL_DISPLAY, ch.name, language)} – oblasť, kde ste najsilnejší AKO PÁR.` : `${name1} brings gate ${ch.gates[0]}, ${name2} brings gate ${ch.gates[1]}. Together you activate the energy of ${displayName(HD_CHANNEL_DISPLAY, ch.name, language)} – the area where you are strongest AS A COUPLE.`}
                </p>
                {gk1 && (
                  <div className="pl-2 border-l-2 border-amber-300">
                    <p className="text-[11px] text-slate-700"><strong>{language === 'sk' ? 'Brána' : 'Gate'} {ch.gates[0]}</strong> ({name1}): <span className="text-rose-600">{gk1.shadow}</span> → <span className="text-amber-600">{gk1.gift}</span> → <span className="text-emerald-600">{gk1.siddhi}</span></p>
                    <p className="text-[10px] text-slate-500">{gk1.giftDescription}</p>
                  </div>
                )}
                {gk2 && (
                  <div className="pl-2 border-l-2 border-amber-300">
                    <p className="text-[11px] text-slate-700"><strong>{language === 'sk' ? 'Brána' : 'Gate'} {ch.gates[1]}</strong> ({name2}): <span className="text-rose-600">{gk2.shadow}</span> → <span className="text-amber-600">{gk2.gift}</span> → <span className="text-emerald-600">{gk2.siddhi}</span></p>
                    <p className="text-[10px] text-slate-500">{gk2.giftDescription}</p>
                  </div>
                )}
                {gk1 && gk2 && (
                  <p className="text-[10px] text-amber-700 italic">
                    {language === 'sk' ? `Spoločný príbeh: ${name1} prináša „${gk1.gift.toLowerCase()}" a ${name2} „${gk2.gift.toLowerCase()}". Spolu vytvárate energiu kanálu ${displayName(HD_CHANNEL_DISPLAY, ch.name, language)}.` : `Shared story: ${name1} brings "${gk1.gift.toLowerCase()}" and ${name2} "${gk2.gift.toLowerCase()}". Together you create the energy of channel ${displayName(HD_CHANNEL_DISPLAY, ch.name, language)}.`}
                  </p>
                )}
              </div>
              );
            })}
          </div>
        )}

        {/* Compromise channels */}
        {channelAnalysis.compromise.length > 0 && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-sm font-medium text-purple-300 mb-2">{language === 'sk' ? 'Kompromisné kanály – spoločná energia' : 'Compromise channels – shared energy'}</h4>
            <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Obaja máte rovnaký kompletný kanál. To znamená, že v tejto oblasti máte obe konzistentnú energiu. Môže to byť veľká sila (rozumiete si bez slov), ale aj trecie plocha (obaja chcete dominovať rovnakým spôsobom). Kľúčom je vzájomný rešpekt.' : 'You both have the same complete channel. This means you both have consistent energy in this area. It can be a great strength (understanding without words), but also friction (both wanting to dominate the same way). The key is mutual respect.'}</p>
            {channelAnalysis.compromise.map((ch, i) => {
              const gk1 = getGeneKeyByGate(ch.gates[0], language);
              const gk2 = getGeneKeyByGate(ch.gates[1], language);
              return (
              <div key={i} className="p-3 rounded-lg bg-purple-50 border border-purple-200 mb-2 space-y-1">
                <p className="text-sm font-medium text-slate-800">{displayName(HD_CHANNEL_DISPLAY, ch.name, language)} ({language === 'sk' ? 'brány' : 'gates'} {ch.gates[0]}-{ch.gates[1]})</p>
                <p className="text-xs text-slate-500">{language === 'sk' ? `Obaja máte energiu "${displayName(HD_CHANNEL_DISPLAY, ch.name, language)}" – zdieľate rovnakú silu, čo môže vytvárať harmóniu AJ súťaž.` : `You both have the energy of "${displayName(HD_CHANNEL_DISPLAY, ch.name, language)}" – you share the same power, which can create harmony AND competition.`}</p>
                {gk1 && <p className="text-[10px] text-slate-600">{language === 'sk' ? 'Brána' : 'Gate'} {ch.gates[0]}: {gk1.gift} — {gk1.giftDescription}</p>}
                {gk2 && <p className="text-[10px] text-slate-600">{language === 'sk' ? 'Brána' : 'Gate'} {ch.gates[1]}: {gk2.gift} — {gk2.giftDescription}</p>}
              </div>
              );
            })}
          </div>
        )}

        {/* Dominant channels */}
        {(channelAnalysis.dominant1.length > 0 || channelAnalysis.dominant2.length > 0) && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <h4 className="text-sm font-medium text-rose-300 mb-2">{language === 'sk' ? 'Dominantné kanály – kto vedie v akej oblasti' : 'Dominant channels – who leads in which area'}</h4>
            <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Len jeden z vás má kompletný kanál – tá osoba má v tejto oblasti konzistentnú energiu a prirodzene v nej dominuje. Partner ju v tejto oblasti nasleduje alebo sa od nej učí. Nie je to nerovnováha – je to prirodzené rozdelenie "zodpovedností" vo vzťahu.' : 'Only one of you has the complete channel – that person has consistent energy in this area and naturally dominates. The partner follows or learns from them here. This is not imbalance – it is natural division of "responsibilities" in the relationship.'}</p>
            {channelAnalysis.dominant1.map((ch, i) => {
              const gk = getGeneKeyByGate(ch.gates[0], language);
              return (
              <div key={i} className="p-2 rounded-lg bg-rose-50 border border-rose-200 mb-2">
                <p className="text-sm text-slate-800"><strong className="text-rose-600">{name1}</strong> {language === 'sk' ? 'vedie oblasť' : 'leads area'}: {displayName(HD_CHANNEL_DISPLAY, ch.name, language)}</p>
                <p className="text-xs text-slate-500">{language === 'sk' ? `${name1} má v tejto oblasti stabilnú energiu — prirodzene ju vo vzťahu riadi. ${name2} sa tu od neho/nej učí.` : `${name1} has stable energy in this area — naturally leads in the relationship. ${name2} learns from them here.`}</p>
                {gk && <p className="text-[10px] text-slate-600">{language === 'sk' ? 'Dar' : 'Gift'}: {gk.gift} — {gk.giftDescription}</p>}
              </div>
              );
            })}
            {channelAnalysis.dominant2.map((ch, i) => {
              const gk = getGeneKeyByGate(ch.gates[0], language);
              return (
              <div key={i} className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 mb-2">
                <p className="text-sm text-slate-800"><strong className="text-indigo-600">{name2}</strong> {language === 'sk' ? 'vedie oblasť' : 'leads area'}: {displayName(HD_CHANNEL_DISPLAY, ch.name, language)}</p>
                <p className="text-xs text-slate-500">{language === 'sk' ? `${name2} má v tejto oblasti stabilnú energiu — prirodzene ju vo vzťahu riadi. ${name1} sa tu od neho/nej učí.` : `${name2} has stable energy in this area — naturally leads in the relationship. ${name1} learns from them here.`}</p>
                {gk && <p className="text-[10px] text-slate-600">{language === 'sk' ? 'Dar' : 'Gift'}: {gk.gift} — {gk.giftDescription}</p>}
              </div>
              );
            })}
          </div>
        )}

        {/* Conditioning */}
        <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <h4 className="text-sm font-medium text-slate-300 mb-2">{language === 'sk' ? 'Podmieňovanie – vzájomný vplyv' : 'Conditioning – mutual influence'}</h4>
          <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Keď je vaše centrum definované a partnerove je otvorené, váš partner "absorbuje" vašu energiu v tejto oblasti. Vy ho v nej podmieňujete – ovplyvňujete, ako sa cíti, myslí alebo koná. Nie je to zlé – ale je dôležité to rozpoznať, aby partner mohol rozlíšiť čo je JEHO a čo je VAŠE.' : 'When your center is defined and your partner\'s is open, your partner "absorbs" your energy in that area. You condition them – you influence how they feel, think or act. It is not bad – but it is important to recognize it so the partner can distinguish what is THEIRS and what is YOURS.'}</p>
          {conditioning.p1ConditionsP2.length > 0 && (
            <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
              <p className="text-xs text-rose-600 font-medium">{language === 'sk' ? `${name1} podmieňuje ${name2} v oblastiach:` : `${name1} conditions ${name2} in areas:`}</p>
              {conditioning.p1ConditionsP2.map(center => (
                <div key={center} className="pl-3 border-l-2 border-rose-200">
                  <p className="text-xs font-medium text-slate-700">{center} {(language === 'en' ? CENTER_THEMES_EN[center] : CENTER_THEMES[center]) ? `— ${language === 'en' ? CENTER_THEMES_EN[center] : CENTER_THEMES[center]}` : ''}</p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'sk'
                      ? (center === 'Sakrálne' ? `${name2} môže cítiť falošnú energiu a nadšenie od ${name1}. Otázka: "Je toto moja energia alebo partnerova?"` :
                         center === 'Solárny plexus' ? `${name2} absorbuje emócie od ${name1} a zosilňuje ich. Môže si zamieňať partnerove nálady za vlastné.` :
                         center === 'Srdce/Ego' ? `${name2} môže cítiť tlak dokazovať svoju hodnotu podľa štandardov ${name1}.` :
                         center === 'G' ? `${name2} môže stratiť vlastný smer a identitu v prítomnosti ${name1}. Otázka: "Kam chcem JÁ, nie kam ma ťahá partner?"` :
                         center === 'Hrdlo' ? `${name2} môže hovoriť a konať pod vplyvom ${name1} — nie vlastným hlasom.` :
                         center === 'Ajna' ? `${name2} preberá spôsob myslenia od ${name1}. Otázka: "Je toto MÔJ názor?"` :
                         center === 'Hlava' ? `${name2} môže byť zaplavený otázkami a inšpiráciami od ${name1} — nie vlastnými.` :
                         center === 'Slezina' ? `${name2} môže cítiť falošný pocit bezpečia v prítomnosti ${name1}. Pozor na ignorovanie vlastnej intuície.` :
                         center === 'Koreň' ? `${name2} môže cítiť konštantný tlak a stres od ${name1} — akoby vždy niečo "musí".` :
                         `${name2} v tejto oblasti absorbuje energiu od ${name1}.`)
                      : (center === 'Sakrálne' ? `${name2} may feel false energy and enthusiasm from ${name1}. Question: "Is this my energy or my partner's?"` :
                         center === 'Solárny plexus' ? `${name2} absorbs emotions from ${name1} and amplifies them. They may mistake their partner's moods for their own.` :
                         center === 'Srdce/Ego' ? `${name2} may feel pressure to prove their worth by ${name1}'s standards.` :
                         center === 'G' ? `${name2} may lose their own direction and identity in the presence of ${name1}. Question: "Where do I want to go, not where my partner pulls me?"` :
                         center === 'Hrdlo' ? `${name2} may speak and act under the influence of ${name1} — not with their own voice.` :
                         center === 'Ajna' ? `${name2} adopts the way of thinking from ${name1}. Question: "Is this MY opinion?"` :
                         center === 'Hlava' ? `${name2} may be flooded with questions and inspirations from ${name1} — not their own.` :
                         center === 'Slezina' ? `${name2} may feel a false sense of security in the presence of ${name1}. Be careful about ignoring your own intuition.` :
                         center === 'Koreň' ? `${name2} may feel constant pressure and stress from ${name1} — as if they always "must" do something.` :
                         `${name2} absorbs energy from ${name1} in this area.`)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {conditioning.p2ConditionsP1.length > 0 && (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 space-y-2">
              <p className="text-xs text-indigo-600 font-medium">{language === 'sk' ? `${name2} podmieňuje ${name1} v oblastiach:` : `${name2} conditions ${name1} in areas:`}</p>
              {conditioning.p2ConditionsP1.map(center => (
                <div key={center} className="pl-3 border-l-2 border-indigo-200">
                  <p className="text-xs font-medium text-slate-700">{center} {(language === 'en' ? CENTER_THEMES_EN[center] : CENTER_THEMES[center]) ? `— ${language === 'en' ? CENTER_THEMES_EN[center] : CENTER_THEMES[center]}` : ''}</p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'sk'
                      ? (center === 'Sakrálne' ? `${name1} môže cítiť falošnú energiu od ${name2}. Pozor na preberanie cudzieho nadšenia.` :
                         center === 'Solárny plexus' ? `${name1} absorbuje emócie od ${name2}. Otázka: "Je to čo cítim MOJE, alebo partnerove?"` :
                         center === 'Srdce/Ego' ? `${name1} môže cítiť tlak na výkon podľa štandardov ${name2}.` :
                         center === 'G' ? `${name1} môže stratiť vlastný smer identity v blízkosti ${name2}.` :
                         center === 'Hrdlo' ? `${name1} môže hovoriť pod vplyvom ${name2} — nie vlastným hlasom.` :
                         center === 'Ajna' ? `${name1} preberá spôsob myslenia od ${name2}.` :
                         center === 'Hlava' ? `${name1} môže byť zaplavený mentálnou energiou od ${name2}.` :
                         center === 'Slezina' ? `${name1} môže cítiť falošné bezpečie od ${name2}. Pozor na vlastnú intuíciu.` :
                         center === 'Koreň' ? `${name1} cíti konštantný tlak od ${name2} — potreba spomaľovať.` :
                         `${name1} v tejto oblasti absorbuje energiu od ${name2}.`)
                      : (center === 'Sakrálne' ? `${name1} may feel false energy from ${name2}. Be careful about adopting someone else's enthusiasm.` :
                         center === 'Solárny plexus' ? `${name1} absorbs emotions from ${name2}. Question: "Is what I feel MINE, or my partner's?"` :
                         center === 'Srdce/Ego' ? `${name1} may feel pressure to perform by ${name2}'s standards.` :
                         center === 'G' ? `${name1} may lose their own direction and identity near ${name2}.` :
                         center === 'Hrdlo' ? `${name1} may speak under the influence of ${name2} — not with their own voice.` :
                         center === 'Ajna' ? `${name1} adopts the way of thinking from ${name2}.` :
                         center === 'Hlava' ? `${name1} may be flooded with mental energy from ${name2}.` :
                         center === 'Slezina' ? `${name1} may feel a false sense of security from ${name2}. Be careful about your own intuition.` :
                         center === 'Koreň' ? `${name1} feels constant pressure from ${name2} — a need to slow down.` :
                         `${name1} absorbs energy from ${name2} in this area.`)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {conditioning.p1ConditionsP2.length === 0 && conditioning.p2ConditionsP1.length === 0 && (
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Žiadne vzájomné podmieňovanie — oba partneri majú rovnaké definované centrá. To je vzácne a znamená že sa navzájom energeticky "nezahlcujete".' : 'No mutual conditioning — both partners have the same defined centers. This is rare and means you don\'t energetically "overwhelm" each other.'}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-3 italic">
            {language === 'sk' ? 'Podmieňovanie nie je zlé — je to spôsob, akým sa od partnera učíme. Problém nastáva len keď si myslíme, že absorbovaná energia je naša vlastná a rozhodujeme sa podľa nej.' : 'Conditioning is not bad — it is how we learn from our partner. The problem arises only when we think the absorbed energy is our own and make decisions based on it.'}
          </p>
        </div>

        {/* Spoločné Génové kľúče */}
        {channelAnalysis.electromagnetic.length > 0 && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <h4 className="text-sm font-medium text-green-600 mb-2">{language === 'sk' ? 'Spoločné Génové kľúče – transformačná cesta páru' : 'Shared Gene Keys – transformation path of the couple'}</h4>
            <p className="text-xs text-slate-500 mb-2">{language === 'sk' ? 'Elektromagnetické kanály ukazujú, kde sa vaše energie spájajú do jedného prúdu. Každý partner prináša jednu bránu — spolu vytvárate celistvý kanál, ktorý neexistuje bez druhého.' : 'Electromagnetic channels show where your energies merge into one stream. Each partner brings one gate — together you create a complete channel that doesn\'t exist without the other.'}</p>
            <p className="text-xs text-slate-500 mb-3 italic">{language === 'sk' ? 'Génové kľúče pre tieto brány odhaľujú spoločný príbeh: aký tieň spolu transformujete, aký dar spolu vytvárate, a čo je najvyšší potenciál vášho spojenia.' : 'Gene Keys for these gates reveal a shared story: what shadow you transform together, what gift you create together, and what is the highest potential of your union.'}</p>
            {channelAnalysis.electromagnetic.map((ch, i) => {
              const gk1 = getGeneKeyByGate(ch.gates[0], language);
              const gk2 = getGeneKeyByGate(ch.gates[1], language);
              return (
                <div key={i} className="p-3 rounded-lg bg-white border border-green-200 mb-3 space-y-3">
                  <p className="text-sm font-medium text-slate-800">{language === 'sk' ? 'Kanál' : 'Channel'} {displayName(HD_CHANNEL_DISPLAY, ch.name, language)} ({ch.gates[0]}-{ch.gates[1]})</p>
                  {gk1 && (
                    <div className="pl-3 border-l-2 border-rose-200 space-y-1">
                      <p className="text-xs text-slate-700">
                        <strong>{language === 'sk' ? 'Brána' : 'Gate'} {gk1.gate} ({name1})</strong>: <span className="text-red-600">{gk1.shadow}</span> → <span className="text-amber-600">{gk1.gift}</span> → <span className="text-green-600">{gk1.siddhi}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{gk1.shadowDescription}</p>
                      <p className="text-[11px] text-emerald-700">{language === 'sk' ? 'Dar' : 'Gift'}: {gk1.giftDescription}</p>
                      {gk1.nlpTechnique && <p className="text-[10px] text-indigo-600">{language === 'sk' ? 'Technika' : 'Technique'}: {gk1.nlpTechnique} — {gk1.nlpDescription}</p>}
                    </div>
                  )}
                  {gk2 && (
                    <div className="pl-3 border-l-2 border-indigo-200 space-y-1">
                      <p className="text-xs text-slate-700">
                        <strong>{language === 'sk' ? 'Brána' : 'Gate'} {gk2.gate} ({name2})</strong>: <span className="text-red-600">{gk2.shadow}</span> → <span className="text-amber-600">{gk2.gift}</span> → <span className="text-green-600">{gk2.siddhi}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{gk2.shadowDescription}</p>
                      <p className="text-[11px] text-emerald-700">{language === 'sk' ? 'Dar' : 'Gift'}: {gk2.giftDescription}</p>
                      {gk2.nlpTechnique && <p className="text-[10px] text-indigo-600">{language === 'sk' ? 'Technika' : 'Technique'}: {gk2.nlpTechnique} — {gk2.nlpDescription}</p>}
                    </div>
                  )}
                  {gk1 && gk2 && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-2">
                      <p className="text-xs text-green-800 font-medium">{language === 'sk' ? 'Spoločný príbeh tohto kanálu:' : 'Shared story of this channel:'}</p>
                      <p className="text-xs text-slate-700">
                        {language === 'sk' ? `Vo vzťahu sa stretnete cez spoločný tieň: ${name1} prináša „${gk1.shadow.toLowerCase()}" a ${name2} „${gk2.shadow.toLowerCase()}". Tieto tiene sa navzájom spúšťajú — partner je vaše zrkadlo.` : `In the relationship you meet through shared shadow: ${name1} brings "${gk1.shadow.toLowerCase()}" and ${name2} "${gk2.shadow.toLowerCase()}". These shadows trigger each other — partner is your mirror.`}
                      </p>
                      <p className="text-xs text-slate-700">
                        {language === 'sk' ? `Keď obaja vedome pracujete na transformácii, kanál sa premení na spoločný dar: ${name1} žije „${gk1.gift.toLowerCase()}" a ${name2} „${gk2.gift.toLowerCase()}". Spolu vytvárate energiu ${displayName(HD_CHANNEL_DISPLAY, ch.name, language).toLowerCase()}.` : `When both consciously work on transformation, the channel becomes a shared gift: ${name1} lives "${gk1.gift.toLowerCase()}" and ${name2} "${gk2.gift.toLowerCase()}". Together you create the energy of ${displayName(HD_CHANNEL_DISPLAY, ch.name, language).toLowerCase()}.`}
                      </p>
                      <p className="text-xs text-green-700 italic">
                        {language === 'sk' ? `Najvyšší potenciál: ${gk1.siddhi} + ${gk2.siddhi} — to je to, čo váš vzťah prináša do sveta keď ste obaja v najvyššej frekvencii.` : `Highest potential: ${gk1.siddhi} + ${gk2.siddhi} — this is what your relationship brings to the world when you are both at the highest frequency.`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
