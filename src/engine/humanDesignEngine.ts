export type HDType = 'Manifestor' | 'Generátor' | 'Manifestujúci Generátor' | 'Projektor' | 'Reflektor';
export type HDAuthority = 'Emocionálna' | 'Sakrálna' | 'Slezinová' | 'Ego/Srdce' | 'Sebaprojektovaná' | 'Mentálna/Environmentálna' | 'Lunárna';
export type HDStrategy = 'Informovať' | 'Reagovať' | 'Reagovať a informovať' | 'Čakať na pozvanie' | 'Čakať 28 dní';
export type HDNotSelfTheme = 'Hnev' | 'Frustrácia' | 'Frustrácia a hnev' | 'Horkosť' | 'Sklamanie';

export interface HDCenter {
  name: string;
  defined: boolean;
  gates: number[];
  theme: string;
}

export interface HDGate {
  number: number;
  name: string;
  center: string;
  line: number;
}

export interface HDChannel {
  gates: [number, number];
  name: string;
  type: string;
}

export interface HDProfile {
  line1: number;
  line2: number;
  name: string;
  description: string;
}

export interface HumanDesignResult {
  type: HDType;
  authority: HDAuthority;
  strategy: HDStrategy;
  notSelfTheme: HDNotSelfTheme;
  profile: HDProfile;
  definedCenters: string[];
  openCenters: string[];
  channels: HDChannel[];
  gates: HDGate[];
  incarnationCross: string;
  variables: string[];
}

const CENTERS = [
  'Head', 'Ajna', 'Throat', 'G/Self', 'Heart/Ego', 'Sacral', 'Solar Plexus', 'Spleen', 'Root'
];

const CENTER_NAMES_SK: Record<string, string> = {
  'Head': 'Hlava',
  'Ajna': 'Ajna',
  'Throat': 'Hrdlo',
  'G/Self': 'G centrum',
  'Heart/Ego': 'Srdce/Ego',
  'Sacral': 'Sakrálne',
  'Solar Plexus': 'Solárny plexus',
  'Spleen': 'Slezina',
  'Root': 'Koreň',
};

const CENTER_THEMES: Record<string, string> = {
  'Head': 'Inšpirácia a otázky',
  'Ajna': 'Myslenie a konceptualizácia',
  'Throat': 'Komunikácia a manifestácia',
  'G/Self': 'Identita, smer a láska',
  'Heart/Ego': 'Vôľa a hodnota',
  'Sacral': 'Životná sila a plodnosť',
  'Solar Plexus': 'Emócie a pocity',
  'Spleen': 'Intuícia, zdravie a čas',
  'Root': 'Tlak a adrenalín',
};

const GATES_BY_CENTER: Record<string, number[]> = {
  'Head': [64, 61, 63],
  'Ajna': [47, 24, 4, 17, 43, 11],
  'Throat': [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  'G/Self': [7, 1, 13, 25, 46, 2, 15, 10],
  'Heart/Ego': [21, 26, 51, 40],
  'Sacral': [5, 14, 29, 59, 9, 3, 42, 27, 34],
  'Solar Plexus': [36, 22, 37, 6, 49, 55, 30],
  'Spleen': [48, 57, 44, 50, 32, 28, 18],
  'Root': [53, 60, 52, 19, 39, 41, 58, 38, 54],
};

const CHANNELS: { gates: [number, number]; name: string; type: string }[] = [
  { gates: [64, 47], name: 'Abstracia', type: 'Generujúci' },
  { gates: [61, 24], name: 'Uvedomenie', type: 'Individuálny' },
  { gates: [63, 4], name: 'Logika', type: 'Logický' },
  { gates: [17, 62], name: 'Prijatie', type: 'Logický' },
  { gates: [43, 23], name: 'Štruktúrovanie', type: 'Individuálny' },
  { gates: [11, 56], name: 'Zvedavosť', type: 'Abstraktný' },
  { gates: [35, 36], name: 'Pominuteľnosť', type: 'Abstraktný' },
  { gates: [12, 22], name: 'Otvorenosť', type: 'Individuálny' },
  { gates: [45, 21], name: 'Peňažný kanál', type: 'Ego' },
  { gates: [33, 13], name: 'Márnotratník', type: 'Abstraktný' },
  { gates: [8, 1], name: 'Inšpirácia', type: 'Individuálny' },
  { gates: [31, 7], name: 'Alfa', type: 'Logický' },
  { gates: [20, 34], name: 'Charizma', type: 'Individuálny' },
  { gates: [20, 57], name: 'Mozgová vlna', type: 'Individuálny' },
  { gates: [20, 10], name: 'Prebudenie', type: 'Individuálny' },
  { gates: [16, 48], name: 'Talent', type: 'Logický' },
  { gates: [25, 51], name: 'Zasvätenie', type: 'Ego' },
  { gates: [46, 29], name: 'Objavovanie', type: 'Abstraktný' },
  { gates: [2, 14], name: 'Bubeník', type: 'Sakrálny' },
  { gates: [15, 5], name: 'Rytmus', type: 'Logický' },
  { gates: [10, 57], name: 'Dokonalosť formy', type: 'Individuálny' },
  { gates: [26, 44], name: 'Odovzdanie', type: 'Ego' },
  { gates: [40, 37], name: 'Komunita', type: 'Kmeňový' },
  { gates: [59, 6], name: 'Intimita', type: 'Kmeňový' },
  { gates: [27, 50], name: 'Zachovanie', type: 'Kmeňový' },
  { gates: [34, 57], name: 'Sila', type: 'Individuálny' },
  { gates: [9, 52], name: 'Sústredenie', type: 'Logický' },
  { gates: [3, 60], name: 'Mutácia', type: 'Individuálny' },
  { gates: [42, 53], name: 'Dozrievanie', type: 'Abstraktný' },
  { gates: [32, 54], name: 'Transformácia', type: 'Kmeňový' },
  { gates: [28, 38], name: 'Bojovnosť', type: 'Individuálny' },
  { gates: [18, 58], name: 'Súd', type: 'Logický' },
  { gates: [39, 55], name: 'Emocionalita', type: 'Individuálny' },
  { gates: [41, 30], name: 'Uznanie', type: 'Abstraktný' },
  { gates: [19, 49], name: 'Syntéza', type: 'Kmeňový' },
];

const PROFILES: Record<string, { name: string; description: string }> = {
  '1/3': { name: 'Skúmajúci Mučeník', description: 'Objavuje cez výskum a skúsenosť' },
  '1/4': { name: 'Skúmajúci Oportunista', description: 'Buduje siete na pevnom základe' },
  '2/4': { name: 'Pustovník Oportunista', description: 'Prirodzený talent volaný von' },
  '2/5': { name: 'Pustovník Heretik', description: 'Volaný riešiť problémy iných' },
  '3/5': { name: 'Mučeník Heretik', description: 'Učí sa z chýb a ponúka riešenia' },
  '3/6': { name: 'Mučeník Vzor', description: 'Od chaosu k múdrosti' },
  '4/6': { name: 'Oportunista Vzor', description: 'Sieťujúci mudrc' },
  '4/1': { name: 'Oportunista Skúmajúci', description: 'Pevné siete, pevné základy' },
  '5/1': { name: 'Heretik Skúmajúci', description: 'Univerzálny riešiteľ' },
  '5/2': { name: 'Heretik Pustovník', description: 'Praktický génius' },
  '6/2': { name: 'Vzor Pustovník', description: 'Múdry pozorovateľ' },
  '6/3': { name: 'Vzor Mučeník', description: 'Optimistický experimentátor' },
};

const INCARNATION_CROSSES = [
  'Kríž Sfingu', 'Kríž Plánovania', 'Kríž Služby', 'Kríž Vysvetlenia',
  'Kríž Neočakávaného', 'Kríž Správneho uhla', 'Kríž Vedomia', 'Kríž Konania',
  'Kríž Zázrakov', 'Kríž Dedičstva', 'Kríž Prenikania', 'Kríž Napätia',
  'Kríž Sprievodcu', 'Kríž Odpútanosti', 'Kríž Mágie', 'Kríž Konfrontácie',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function calculateHumanDesign(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0
): HumanDesignResult {
  const seed = day * 1000000 + month * 10000 + year + hour * 100 + minute;
  const rng = seededRandom(seed);

  const definedCount = Math.floor(rng() * 4) + 3;
  const shuffledCenters = [...CENTERS].sort(() => rng() - 0.5);
  const definedCenterNames = shuffledCenters.slice(0, definedCount);
  const openCenterNames = shuffledCenters.slice(definedCount);

  const hasSacral = definedCenterNames.includes('Sacral');
  const hasThroatAndMotor = definedCenterNames.includes('Throat') &&
    (definedCenterNames.includes('Root') || definedCenterNames.includes('Solar Plexus') || definedCenterNames.includes('Heart/Ego') || definedCenterNames.includes('Sacral'));
  const allOpen = definedCount <= 0;

  let type: HDType;
  let strategy: HDStrategy;
  let notSelfTheme: HDNotSelfTheme;

  if (allOpen) {
    type = 'Reflektor';
    strategy = 'Čakať 28 dní';
    notSelfTheme = 'Sklamanie';
  } else if (hasSacral && hasThroatAndMotor) {
    type = 'Manifestujúci Generátor';
    strategy = 'Reagovať a informovať';
    notSelfTheme = 'Frustrácia a hnev';
  } else if (hasSacral) {
    type = 'Generátor';
    strategy = 'Reagovať';
    notSelfTheme = 'Frustrácia';
  } else if (hasThroatAndMotor) {
    type = 'Manifestor';
    strategy = 'Informovať';
    notSelfTheme = 'Hnev';
  } else {
    type = 'Projektor';
    strategy = 'Čakať na pozvanie';
    notSelfTheme = 'Horkosť';
  }

  let authority: HDAuthority;
  if (definedCenterNames.includes('Solar Plexus')) {
    authority = 'Emocionálna';
  } else if (definedCenterNames.includes('Sacral')) {
    authority = 'Sakrálna';
  } else if (definedCenterNames.includes('Spleen')) {
    authority = 'Slezinová';
  } else if (definedCenterNames.includes('Heart/Ego')) {
    authority = 'Ego/Srdce';
  } else if (definedCenterNames.includes('G/Self')) {
    authority = 'Sebaprojektovaná';
  } else if (type === 'Reflektor') {
    authority = 'Lunárna';
  } else {
    authority = 'Mentálna/Environmentálna';
  }

  const line1 = (Math.floor(rng() * 6) + 1);
  const line2Options = [1, 2, 3, 4, 5, 6].filter(l => {
    const key = `${line1}/${l}`;
    return PROFILES[key];
  });
  const line2 = line2Options.length > 0 ? line2Options[Math.floor(rng() * line2Options.length)] : ((line1 % 6) + 1);
  const profileKey = `${line1}/${line2}`;
  const profileData = PROFILES[profileKey] || { name: 'Individuálny', description: 'Unikátna kombinácia' };

  const profile: HDProfile = {
    line1,
    line2,
    name: profileData.name,
    description: profileData.description,
  };

  const activeGates: HDGate[] = [];
  definedCenterNames.forEach(center => {
    const centerGates = GATES_BY_CENTER[center] || [];
    const numGates = Math.floor(rng() * 3) + 1;
    const selectedGates = centerGates.sort(() => rng() - 0.5).slice(0, numGates);
    selectedGates.forEach(g => {
      activeGates.push({
        number: g,
        name: `Brána ${g}`,
        center: CENTER_NAMES_SK[center] || center,
        line: Math.floor(rng() * 6) + 1,
      });
    });
  });

  const activeChannels: HDChannel[] = [];
  const activeGateNumbers = new Set(activeGates.map(g => g.number));
  CHANNELS.forEach(ch => {
    if (activeGateNumbers.has(ch.gates[0]) && activeGateNumbers.has(ch.gates[1])) {
      activeChannels.push(ch);
    }
  });

  const crossIndex = Math.floor(rng() * INCARNATION_CROSSES.length);
  const incarnationCross = INCARNATION_CROSSES[crossIndex];

  return {
    type,
    authority,
    strategy,
    notSelfTheme,
    profile,
    definedCenters: definedCenterNames.map(c => CENTER_NAMES_SK[c] || c),
    openCenters: openCenterNames.map(c => CENTER_NAMES_SK[c] || c),
    channels: activeChannels,
    gates: activeGates,
    incarnationCross,
    variables: [],
  };
}

export { CENTER_NAMES_SK, CENTER_THEMES };
