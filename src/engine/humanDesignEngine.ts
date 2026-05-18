import * as Astronomy from 'astronomy-engine';

export type HDType = 'Manifestor' | 'Generátor' | 'Manifestujúci Generátor' | 'Projektor' | 'Reflektor';
export type HDAuthority = 'Emocionálna' | 'Sakrálna' | 'Slezinová' | 'Ego' | 'Sebaprojektovaná' | 'Mentálna/Environmentálna' | 'Lunárna';
export type HDStrategy = 'Informovať' | 'Reagovať' | 'Reagovať a informovať' | 'Čakať na pozvanie' | 'Čakať 28 dní';
export type HDNotSelfTheme = 'Hnev' | 'Frustrácia' | 'Frustrácia a hnev' | 'Horkosť' | 'Sklamanie';

export interface GateActivation {
  gate: number;
  line: number;
  planet: string;
  type: 'personality' | 'design';
}

export interface HDChannel {
  gates: [number, number];
  name: string;
  centers: [string, string];
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
  personalityGates: GateActivation[];
  designGates: GateActivation[];
  allActivatedGates: number[];
  incarnationCross: string;
}

const GATE_ORDER: number[] = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23,
  8, 20, 16, 35, 45, 12, 15, 52, 39, 53,
  62, 56, 31, 33, 7, 4, 29, 59, 40, 64,
  47, 6, 46, 18, 48, 57, 32, 50, 28, 44,
  1, 43, 14, 34, 9, 5, 26, 11, 10, 58,
  38, 54, 61, 60
];

const HD_WHEEL_START = 302.0;
const GATE_SIZE = 5.625;
const LINE_SIZE = 0.9375;

const CHANNEL_DEFINITIONS: { gates: [number, number]; centers: [string, string]; name: string }[] = [
  { gates: [1, 8], centers: ['G', 'Hrdlo'], name: 'Inšpirácia' },
  { gates: [2, 14], centers: ['G', 'Sakrálne'], name: 'Bubeník' },
  { gates: [3, 60], centers: ['Sakrálne', 'Koreň'], name: 'Mutácia' },
  { gates: [4, 63], centers: ['Ajna', 'Hlava'], name: 'Logika' },
  { gates: [5, 15], centers: ['Sakrálne', 'G'], name: 'Rytmus' },
  { gates: [6, 59], centers: ['Sakrálne', 'Solárny plexus'], name: 'Intimita' },
  { gates: [7, 31], centers: ['G', 'Hrdlo'], name: 'Alfa' },
  { gates: [9, 52], centers: ['Sakrálne', 'Koreň'], name: 'Sústredenie' },
  { gates: [10, 20], centers: ['G', 'Hrdlo'], name: 'Prebudenie' },
  { gates: [10, 34], centers: ['G', 'Sakrálne'], name: 'Prieskum' },
  { gates: [10, 57], centers: ['G', 'Slezina'], name: 'Dokonalosť formy' },
  { gates: [11, 56], centers: ['Ajna', 'Hrdlo'], name: 'Zvedavosť' },
  { gates: [12, 22], centers: ['Hrdlo', 'Solárny plexus'], name: 'Otvorenosť' },
  { gates: [13, 33], centers: ['G', 'Hrdlo'], name: 'Márnotratník' },
  { gates: [16, 48], centers: ['Hrdlo', 'Slezina'], name: 'Talent' },
  { gates: [17, 62], centers: ['Ajna', 'Hrdlo'], name: 'Prijatie' },
  { gates: [18, 58], centers: ['Slezina', 'Koreň'], name: 'Súd' },
  { gates: [19, 49], centers: ['Koreň', 'Solárny plexus'], name: 'Syntéza' },
  { gates: [20, 34], centers: ['Hrdlo', 'Sakrálne'], name: 'Charizma' },
  { gates: [20, 57], centers: ['Hrdlo', 'Slezina'], name: 'Mozgová vlna' },
  { gates: [21, 45], centers: ['Srdce/Ego', 'Hrdlo'], name: 'Peňažný kanál' },
  { gates: [23, 43], centers: ['Ajna', 'Hrdlo'], name: 'Štruktúrovanie' },
  { gates: [24, 61], centers: ['Ajna', 'Hlava'], name: 'Uvedomenie' },
  { gates: [25, 51], centers: ['G', 'Srdce/Ego'], name: 'Zasvätenie' },
  { gates: [26, 44], centers: ['Srdce/Ego', 'Slezina'], name: 'Odovzdanie' },
  { gates: [27, 50], centers: ['Sakrálne', 'Slezina'], name: 'Zachovanie' },
  { gates: [28, 38], centers: ['Slezina', 'Koreň'], name: 'Bojovnosť' },
  { gates: [29, 46], centers: ['Sakrálne', 'G'], name: 'Objavovanie' },
  { gates: [30, 41], centers: ['Solárny plexus', 'Koreň'], name: 'Uznanie' },
  { gates: [32, 54], centers: ['Slezina', 'Koreň'], name: 'Transformácia' },
  { gates: [34, 57], centers: ['Sakrálne', 'Slezina'], name: 'Sila' },
  { gates: [35, 36], centers: ['Hrdlo', 'Solárny plexus'], name: 'Pominuteľnosť' },
  { gates: [37, 40], centers: ['Solárny plexus', 'Srdce/Ego'], name: 'Komunita' },
  { gates: [39, 55], centers: ['Koreň', 'Solárny plexus'], name: 'Emocionalita' },
  { gates: [42, 53], centers: ['Sakrálne', 'Koreň'], name: 'Dozrievanie' },
  { gates: [47, 64], centers: ['Ajna', 'Hlava'], name: 'Abstracia' },
];

const GATES_BY_CENTER: Record<string, number[]> = {
  'Hlava': [61, 63, 64],
  'Ajna': [4, 11, 17, 24, 43, 47],
  'Hrdlo': [8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62],
  'G': [1, 2, 7, 10, 13, 15, 25, 46],
  'Srdce/Ego': [21, 26, 40, 51],
  'Sakrálne': [3, 5, 9, 14, 27, 29, 34, 42, 59],
  'Solárny plexus': [6, 22, 30, 36, 37, 49, 55],
  'Slezina': [18, 28, 32, 44, 48, 50, 57],
  'Koreň': [19, 38, 39, 41, 52, 53, 54, 58, 60],
};

const CENTER_THEMES: Record<string, string> = {
  'Hlava': 'Inšpirácia a otázky',
  'Ajna': 'Myslenie a konceptualizácia',
  'Hrdlo': 'Komunikácia a manifestácia',
  'G': 'Identita, smer a láska',
  'Srdce/Ego': 'Vôľa a hodnota',
  'Sakrálne': 'Životná sila a plodnosť',
  'Solárny plexus': 'Emócie a pocity',
  'Slezina': 'Intuícia, zdravie a čas',
  'Koreň': 'Tlak a adrenalín',
};

const ALL_CENTERS = ['Hlava', 'Ajna', 'Hrdlo', 'G', 'Srdce/Ego', 'Sakrálne', 'Solárny plexus', 'Slezina', 'Koreň'];

const PROFILES: Record<string, { name: string; description: string }> = {
  '1/3': { name: 'Skúmajúci Mučeník', description: 'Objavuje cez výskum a vlastnú skúsenosť. Potrebuje pevné základy.' },
  '1/4': { name: 'Skúmajúci Oportunista', description: 'Buduje pevné siete na základe hlbokého poznania.' },
  '2/4': { name: 'Pustovník Oportunista', description: 'Prirodzený talent, volaný von zo samoty cez siete.' },
  '2/5': { name: 'Pustovník Heretik', description: 'Volaný riešiť problémy iných praktickými riešeniami.' },
  '3/5': { name: 'Mučeník Heretik', description: 'Učí sa z chýb a ponúka univerzálne riešenia.' },
  '3/6': { name: 'Mučeník Vzor', description: 'Od chaosu mladosti k múdrosti a autentickému príkladu.' },
  '4/6': { name: 'Oportunista Vzor', description: 'Sieťuje s múdrosťou, stáva sa autentickým vzorom.' },
  '4/1': { name: 'Oportunista Skúmajúci', description: 'Pevné siete založené na hlbokom výskume.' },
  '5/1': { name: 'Heretik Skúmajúci', description: 'Univerzálny riešiteľ problémov s pevnými základmi.' },
  '5/2': { name: 'Heretik Pustovník', description: 'Praktický génius volaný do akcie.' },
  '6/2': { name: 'Vzor Pustovník', description: 'Múdry pozorovateľ s prirodzeným talentom.' },
  '6/3': { name: 'Vzor Mučeník', description: 'Optimistický experimentátor hľadajúci autenticitu.' },
};

const INCARNATION_CROSSES: Record<string, string> = {
  '1': 'Kríž Sfingu',
  '2': 'Kríž Vodiča',
  '3': 'Kríž Zákonov',
  '4': 'Kríž Vysvetlenia',
  '5': 'Kríž Rytmu',
  '7': 'Kríž Interakcie',
  '8': 'Kríž Prínosu',
  '9': 'Kríž Plánovania',
  '10': 'Kríž Lásky',
  '13': 'Kríž Sfingu',
  '14': 'Kríž Bubeníka',
  '15': 'Kríž Extrémov',
  '16': 'Kríž Experimentovania',
  '17': 'Kríž Služby',
  '19': 'Kríž Potreby',
  '20': 'Kríž Spania',
  '21': 'Kríž Kontroly',
  '22': 'Kríž Vládnutia',
  '23': 'Kríž Vysvetlenia',
  '24': 'Kríž Neočakávaného',
  '25': 'Kríž Ducha',
  '26': 'Kríž Prefíkanosti',
  '27': 'Kríž Neočakávaného',
  '28': 'Kríž Rizika',
  '29': 'Kríž Oddanosti',
  '30': 'Kríž Zázrakov',
};

function degreeToGateLine(eclipticLongitude: number): { gate: number; line: number } {
  const adjusted = ((eclipticLongitude - HD_WHEEL_START) % 360 + 360) % 360;
  const index = Math.floor(adjusted / GATE_SIZE);
  const line = Math.floor((adjusted % GATE_SIZE) / LINE_SIZE) + 1;
  return { gate: GATE_ORDER[Math.min(index, 63)], line: Math.min(line, 6) };
}

function getSunLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const ecl = Astronomy.SunPosition(time);
  return ecl.elon;
}

function getPlanetLongitude(body: Astronomy.Body, date: Date): number {
  const time = Astronomy.MakeTime(date);
  if (body === Astronomy.Body.Sun) return getSunLongitude(date);
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return ecl.elon;
}

function getMoonLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const vec = Astronomy.GeoMoon(time);
  const ecl = Astronomy.Ecliptic(vec);
  return ecl.elon;
}

function getMeanNodeLongitude(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

function findDesignDate(birthDate: Date): Date {
  const natalSunLon = getSunLongitude(birthDate);
  const targetLon = ((natalSunLon - 88) % 360 + 360) % 360;

  const searchStart = Astronomy.MakeTime(new Date(birthDate.getTime() - 100 * 24 * 60 * 60 * 1000));
  const result = Astronomy.SearchSunLongitude(targetLon, searchStart, 30);

  if (result) {
    return result.date;
  }

  return new Date(birthDate.getTime() - 88 * 24 * 60 * 60 * 1000);
}

function getActivations(date: Date, type: 'personality' | 'design'): GateActivation[] {
  const activations: GateActivation[] = [];

  const planets: { name: string; body: Astronomy.Body | 'Moon' | 'Earth' | 'NorthNode' | 'SouthNode' }[] = [
    { name: 'Slnko', body: Astronomy.Body.Sun },
    { name: 'Zem', body: 'Earth' },
    { name: 'Mesiac', body: 'Moon' },
    { name: 'Severný uzol', body: 'NorthNode' },
    { name: 'Južný uzol', body: 'SouthNode' },
    { name: 'Merkúr', body: Astronomy.Body.Mercury },
    { name: 'Venuša', body: Astronomy.Body.Venus },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', body: Astronomy.Body.Saturn },
    { name: 'Urán', body: Astronomy.Body.Uranus },
    { name: 'Neptún', body: Astronomy.Body.Neptune },
    { name: 'Pluto', body: Astronomy.Body.Pluto },
  ];

  const sunLon = getSunLongitude(date);
  const nodeLon = getMeanNodeLongitude(date);

  planets.forEach(p => {
    let lon: number;
    if (p.body === 'Earth') {
      lon = (sunLon + 180) % 360;
    } else if (p.body === 'Moon') {
      lon = getMoonLongitude(date);
    } else if (p.body === 'NorthNode') {
      lon = nodeLon;
    } else if (p.body === 'SouthNode') {
      lon = (nodeLon + 180) % 360;
    } else if (p.body === Astronomy.Body.Sun) {
      lon = sunLon;
    } else {
      lon = getPlanetLongitude(p.body as Astronomy.Body, date);
    }

    const { gate, line } = degreeToGateLine(lon);
    activations.push({ gate, line, planet: p.name, type });
  });

  return activations;
}

function getDefinedCentersAndChannels(allGates: Set<number>): { defined: Set<string>; channels: HDChannel[] } {
  const defined = new Set<string>();
  const channels: HDChannel[] = [];

  CHANNEL_DEFINITIONS.forEach(ch => {
    if (allGates.has(ch.gates[0]) && allGates.has(ch.gates[1])) {
      defined.add(ch.centers[0]);
      defined.add(ch.centers[1]);
      channels.push({ gates: ch.gates, name: ch.name, centers: ch.centers });
    }
  });

  return { defined, channels };
}

function buildCenterGraph(channels: HDChannel[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  channels.forEach(ch => {
    if (!graph.has(ch.centers[0])) graph.set(ch.centers[0], new Set());
    if (!graph.has(ch.centers[1])) graph.set(ch.centers[1], new Set());
    graph.get(ch.centers[0])!.add(ch.centers[1]);
    graph.get(ch.centers[1])!.add(ch.centers[0]);
  });
  return graph;
}

function isMotorConnectedToThroat(graph: Map<string, Set<string>>): boolean {
  const motors = new Set(['Koreň', 'Sakrálne', 'Solárny plexus', 'Srdce/Ego']);
  if (!graph.has('Hrdlo')) return false;

  const visited = new Set<string>();
  const queue = ['Hrdlo'];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    if (motors.has(current)) return true;
    const neighbors = graph.get(current);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }
  return false;
}

function determineType(definedCenters: Set<string>, channels: HDChannel[]): HDType {
  if (definedCenters.size === 0) return 'Reflektor';

  const hasSacral = definedCenters.has('Sakrálne');
  const graph = buildCenterGraph(channels);
  const motorToThroat = isMotorConnectedToThroat(graph);

  if (hasSacral && motorToThroat) return 'Manifestujúci Generátor';
  if (hasSacral) return 'Generátor';
  if (motorToThroat) return 'Manifestor';
  return 'Projektor';
}

function determineAuthority(definedCenters: Set<string>, type: HDType): HDAuthority {
  if (type === 'Reflektor') return 'Lunárna';
  if (definedCenters.has('Solárny plexus')) return 'Emocionálna';
  if (definedCenters.has('Sakrálne')) return 'Sakrálna';
  if (definedCenters.has('Slezina')) return 'Slezinová';
  if (definedCenters.has('Srdce/Ego')) return 'Ego';
  if (definedCenters.has('G')) return 'Sebaprojektovaná';
  return 'Mentálna/Environmentálna';
}

function getStrategy(type: HDType): HDStrategy {
  switch (type) {
    case 'Manifestor': return 'Informovať';
    case 'Generátor': return 'Reagovať';
    case 'Manifestujúci Generátor': return 'Reagovať a informovať';
    case 'Projektor': return 'Čakať na pozvanie';
    case 'Reflektor': return 'Čakať 28 dní';
  }
}

function getNotSelfTheme(type: HDType): HDNotSelfTheme {
  switch (type) {
    case 'Manifestor': return 'Hnev';
    case 'Generátor': return 'Frustrácia';
    case 'Manifestujúci Generátor': return 'Frustrácia a hnev';
    case 'Projektor': return 'Horkosť';
    case 'Reflektor': return 'Sklamanie';
  }
}

export function calculateHumanDesign(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0
): HumanDesignResult {
  const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const designDate = findDesignDate(birthDate);

  const personalityActivations = getActivations(birthDate, 'personality');
  const designActivations = getActivations(designDate, 'design');

  const allGates = new Set<number>();
  personalityActivations.forEach(a => allGates.add(a.gate));
  designActivations.forEach(a => allGates.add(a.gate));

  const { defined, channels } = getDefinedCentersAndChannels(allGates);
  const type = determineType(defined, channels);
  const authority = determineAuthority(defined, type);

  const pSunLine = personalityActivations.find(a => a.planet === 'Slnko')!.line;
  const dSunLine = designActivations.find(a => a.planet === 'Slnko')!.line;
  const profileKey = `${pSunLine}/${dSunLine}`;
  const profileData = PROFILES[profileKey] || { name: `${pSunLine}/${dSunLine}`, description: 'Unikátna kombinácia línií' };
  const profile: HDProfile = { line1: pSunLine, line2: dSunLine, name: profileData.name, description: profileData.description };

  const openCenters = ALL_CENTERS.filter(c => !defined.has(c));

  const pSunGate = personalityActivations.find(a => a.planet === 'Slnko')!.gate;
  const cross = INCARNATION_CROSSES[String(pSunGate)] || `Kríž Brány ${pSunGate}`;

  return {
    type,
    authority,
    strategy: getStrategy(type),
    notSelfTheme: getNotSelfTheme(type),
    profile,
    definedCenters: Array.from(defined),
    openCenters,
    channels,
    personalityGates: personalityActivations,
    designGates: designActivations,
    allActivatedGates: Array.from(allGates),
    incarnationCross: cross,
  };
}

export { CENTER_THEMES, GATES_BY_CENTER };
