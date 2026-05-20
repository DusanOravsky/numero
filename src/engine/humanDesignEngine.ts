import * as Astronomy from 'astronomy-engine';
import { memoize, birthKey } from './engineCache';

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

export type HDDefinition = 'No Definition' | 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split';

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
  /** Typ definície: koľko izolovaných oblastí spojených centier máme v grafe. */
  definition: HDDefinition;
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

// Gate 41 starts at 2°00'00" Aquarius = 302.0° tropical Sun longitude (Jovian Archive
// official convention). A previous "audit fix" set this to 302.625° based on an incorrect
// online source; that broke known reference profiles (e.g. 30.8.1979 02:40 Bratislava → 1/3).
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
  { gates: [47, 64], centers: ['Ajna', 'Hlava'], name: 'Abstrakcia' },
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

// Klasifikácia inkarnačného kríža podľa profilu:
// Right Angle (osobný osud): profily 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3
//   Reálne RA profily: 1/3, 1/4, 2/4, 4/6 (konvenčne zúžené – tu používame zjednodušenú klasifikáciu)
// Juxtaposition (fixovaný osud): 3/5
// Left Angle (transpersonálny): 4/1, 5/1, 5/2, 6/2, 6/3
function getCrossAngle(line1: number, line2: number): 'Right Angle' | 'Juxtaposition' | 'Left Angle' {
  // Kanonická HD klasifikácia podľa Jovian Archive.
  // Right Angle = osobný kríž — 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6
  // Juxtaposition = fixovaný kríž — 3/5 (jediné Juxta profile)
  // Left Angle = transpersonálny kríž — 4/1, 5/1, 5/2, 6/2, 6/3
  const profile = `${line1}/${line2}`;
  const LEFT_ANGLE = new Set(['4/1', '5/1', '5/2', '6/2', '6/3']);
  if (LEFT_ANGLE.has(profile)) return 'Left Angle';
  if (profile === '3/5') return 'Juxtaposition';
  return 'Right Angle';
}

// Mapovanie kombinácie 4 brán na názov kríža (zjednodušený výber najznámejších krížov).
// Kľúč: "pSun-pEarth-dSun-dEarth"
const NAMED_CROSSES: Record<string, string> = {
  // Najbežnejšie krížy podľa Sun/Earth osi (osobnosť/dizajn)
  '1-2-7-13': 'Kríž Sfingy',
  '13-7-1-2': 'Kríž Sfingy',
  '2-1-13-7': 'Kríž Sfingy',
  '7-13-2-1': 'Kríž Sfingy',
  '3-50-60-56': 'Kríž Zákonov',
  '4-49-23-43': 'Kríž Vysvetlenia',
  '5-35-15-10': 'Kríž Rytmu',
  '8-14-55-59': 'Kríž Prínosu',
  '9-16-64-63': 'Kríž Plánovania',
  '10-15-25-46': 'Kríž Lásky',
  '11-12-46-25': 'Kríž Edenu',
  '14-8-59-55': 'Kríž Bubeníka',
  '15-10-46-25': 'Kríž Extrémov',
  '16-9-63-64': 'Kríž Experimentovania',
  '17-18-58-52': 'Kríž Služby',
  '19-33-49-44': 'Kríž Potreby',
  '20-34-37-40': 'Kríž Spania',
  '21-48-38-39': 'Kríž Kontroly',
  '22-47-26-45': 'Kríž Vládnutia',
  '23-43-49-4': 'Kríž Pohlcovania',
  '24-44-19-33': 'Kríž Neočakávaného',
  '25-46-58-52': 'Kríž Ducha',
  '26-45-22-47': 'Kríž Prefíkanosti',
  '27-28-19-33': 'Kríž Výživy',
  '28-27-33-19': 'Kríž Rizika',
  '29-30-20-34': 'Kríž Oddanosti',
  '30-29-34-20': 'Kríž Zázrakov',
};

// Left Angle varianty — kde sa LA líši od RA názvu (Jovian Archive)
const LA_CROSS_NAME_BY_SUN: Record<number, string> = {
  1: 'Kríž Konfrontácie', 2: 'Kríž Vzdorovania', 3: 'Kríž Želaní', 4: 'Kríž Revolúcie',
  5: 'Kríž Oddelenia', 6: 'Kríž Roviny', 7: 'Kríž Masiek', 8: 'Kríž Neistoty',
  9: 'Kríž Identifikácie', 10: 'Kríž Správania', 11: 'Kríž Vzdelania', 12: 'Kríž Vzdelávania',
  13: 'Kríž Masiek', 14: 'Kríž Neistoty', 15: 'Kríž Prevencie', 16: 'Kríž Identifikácie',
  17: 'Kríž Zasvätenia', 18: 'Kríž Zasvätenia', 19: 'Kríž Jemnosti', 20: 'Kríž Duality',
  21: 'Kríž Snahy', 22: 'Kríž Informovania', 23: 'Kríž Zasvätenia', 24: 'Kríž Plánovania',
  25: 'Kríž Liečenia', 26: 'Kríž Konfrontácie', 27: 'Kríž Zarovnania', 28: 'Kríž Zarovnania',
  29: 'Kríž Priemyslu', 30: 'Kríž Priemyslu', 31: 'Kríž Zarovnania', 32: 'Kríž Zarovnania',
  33: 'Kríž Duality', 34: 'Kríž Duality', 35: 'Kríž Oddelenia', 36: 'Kríž Roviny',
  37: 'Kríž Revolúcie', 38: 'Kríž Zasvätenia', 39: 'Kríž Individualizmu', 40: 'Kríž Migrácie',
  41: 'Kríž Alfa', 42: 'Kríž Omega', 43: 'Kríž Zasvätenia', 44: 'Kríž Prebudenia',
  45: 'Kríž Konfrontácie', 46: 'Kríž Prevencie', 47: 'Kríž Informovania', 48: 'Kríž Zasvätenia',
  49: 'Kríž Revolúcie', 50: 'Kríž Želaní', 51: 'Kríž Zasvätenia', 52: 'Kríž Požiadaviek',
  53: 'Kríž Cyklov', 54: 'Kríž Cyklov', 55: 'Kríž Ducha', 56: 'Kríž Rozptýlenia',
  57: 'Kríž Zasvätenia', 58: 'Kríž Požiadaviek', 59: 'Kríž Ducha', 60: 'Kríž Závratu',
  61: 'Kríž Zasvätenia', 62: 'Kríž Zasvätenia', 63: 'Kríž Dominancie', 64: 'Kríž Dominancie',
};

// Záložné názvy podľa osobnostnej brány Slnka (pre prípad, že presná kombinácia nie je v NAMED_CROSSES)
const CROSS_NAME_BY_SUN: Record<number, string> = {
  1: 'Kríž Sfingy', 2: 'Kríž Vodiča', 3: 'Kríž Zákonov', 4: 'Kríž Vysvetlenia',
  5: 'Kríž Rytmu', 6: 'Kríž Edenu', 7: 'Kríž Sfingy', 8: 'Kríž Prínosu',
  9: 'Kríž Plánovania', 10: 'Kríž Lásky', 11: 'Kríž Edenu', 12: 'Kríž Vyhýbania',
  13: 'Kríž Sfingy', 14: 'Kríž Bubeníka', 15: 'Kríž Extrémov', 16: 'Kríž Experimentovania',
  17: 'Kríž Služby', 18: 'Kríž Služby', 19: 'Kríž Potreby', 20: 'Kríž Spania',
  21: 'Kríž Kontroly', 22: 'Kríž Vládnutia', 23: 'Kríž Vysvetlenia', 24: 'Kríž Neočakávaného',
  25: 'Kríž Ducha', 26: 'Kríž Prefíkanosti', 27: 'Kríž Výživy', 28: 'Kríž Rizika',
  29: 'Kríž Oddanosti', 30: 'Kríž Zázrakov', 31: 'Kríž Vplyvu', 32: 'Kríž Naplnenia',
  33: 'Kríž Ústupu', 34: 'Kríž Sily', 35: 'Kríž Vedomia', 36: 'Kríž Krízy',
  37: 'Kríž Plánov', 38: 'Kríž Napätia', 39: 'Kríž Provokácie', 40: 'Kríž Dovŕšenia',
  41: 'Kríž Predstáv', 42: 'Kríž Maja', 43: 'Kríž Vysvetlenia', 44: 'Kríž Prebudenia',
  45: 'Kríž Vládnutia', 46: 'Kríž Tela', 47: 'Kríž Útlaku', 48: 'Kríž Hĺbky',
  49: 'Kríž Vysvetlenia', 50: 'Kríž Hodnôt', 51: 'Kríž Šoku', 52: 'Kríž Sústredenia',
  53: 'Kríž Začiatkov', 54: 'Kríž Ambícií', 55: 'Kríž Ducha', 56: 'Kríž Stimulácie',
  57: 'Kríž Prenikavosti', 58: 'Kríž Služby', 59: 'Kríž Stratégie', 60: 'Kríž Limitov',
  61: 'Kríž Tajomstva', 62: 'Kríž Detailov', 63: 'Kríž Pochybností', 64: 'Kríž Zmätku',
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

function getTrueNodeLongitude(date: Date): number {
  // True Node so periodickými korekciami (presnejšie ako Mean Node)
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const meanOmega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.2720950 + 483202.0175233 * T;
  const deg = Math.PI / 180;
  const correction =
    -1.4979 * Math.sin((2 * D - 2 * F) * deg) +
    -0.1500 * Math.sin(M * deg) +
    -0.1226 * Math.sin((2 * D) * deg) +
    0.1176 * Math.sin((2 * F) * deg) +
    -0.0801 * Math.sin((2 * Mp - 2 * F) * deg);
  return (((meanOmega + correction) % 360) + 360) % 360;
}

function findDesignDate(birthDate: Date): Date {
  const natalSunLon = getSunLongitude(birthDate);
  const targetLon = ((natalSunLon - 88) % 360 + 360) % 360;

  // Search in wider window to ensure we find the design date
  const searchStart = Astronomy.MakeTime(new Date(birthDate.getTime() - 120 * 24 * 60 * 60 * 1000));
  const result = Astronomy.SearchSunLongitude(targetLon, searchStart, 60);

  if (result) {
    return result.date;
  }

  // Fallback: approximate (less accurate but won't crash)
  const approxDaysPerDegree = 365.25 / 360;
  return new Date(birthDate.getTime() - Math.round(88 * approxDaysPerDegree) * 24 * 60 * 60 * 1000);
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
  const nodeLon = getTrueNodeLongitude(date);

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

function determineDefinition(definedCenters: Set<string>, channels: HDChannel[]): HDDefinition {
  if (definedCenters.size === 0) return 'No Definition';
  // Build undirected graph of defined centers connected by channels.
  const adj = new Map<string, Set<string>>();
  definedCenters.forEach(c => adj.set(c, new Set()));
  channels.forEach(ch => {
    if (definedCenters.has(ch.centers[0]) && definedCenters.has(ch.centers[1])) {
      adj.get(ch.centers[0])!.add(ch.centers[1]);
      adj.get(ch.centers[1])!.add(ch.centers[0]);
    }
  });
  // Count connected components.
  const visited = new Set<string>();
  let components = 0;
  for (const node of definedCenters) {
    if (visited.has(node)) continue;
    components++;
    const queue = [node];
    while (queue.length) {
      const cur = queue.shift()!;
      if (visited.has(cur)) continue;
      visited.add(cur);
      adj.get(cur)?.forEach(n => { if (!visited.has(n)) queue.push(n); });
    }
  }
  if (components === 1) return 'Single';
  if (components === 2) return 'Split';
  if (components === 3) return 'Triple Split';
  return 'Quadruple Split';
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

function getTimezoneOffsetHD(day: number, month: number, year: number, baseOffset: number): number {
  // CET/CEST: letný čas od poslednej nedele marca do poslednej nedele októbra
  if (baseOffset === 1 || baseOffset === 2) {
    const marchLast = new Date(year, 2, 31);
    const marchSunday = 31 - marchLast.getDay();
    const octLast = new Date(year, 9, 31);
    const octSunday = 31 - octLast.getDay();
    const dayOfYear = Math.floor((new Date(year, month - 1, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const marchSundayDOY = Math.floor((new Date(year, 2, marchSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const octSundayDOY = Math.floor((new Date(year, 9, octSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    if (dayOfYear >= marchSundayDOY && dayOfYear < octSundayDOY) return 2; // CEST
    return 1; // CET
  }
  return baseOffset;
}

function _calculateHumanDesignImpl(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  timezoneOffsetHours: number = 1
): HumanDesignResult {
  const tz = getTimezoneOffsetHD(day, month, year, timezoneOffsetHours);
  const utcHour = hour - tz;
  const birthDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute));
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
  const pEarthGate = personalityActivations.find(a => a.planet === 'Zem')!.gate;
  const dSunGate = designActivations.find(a => a.planet === 'Slnko')!.gate;
  const dEarthGate = designActivations.find(a => a.planet === 'Zem')!.gate;

  const crossKey = `${pSunGate}-${pEarthGate}-${dSunGate}-${dEarthGate}`;
  const angle = getCrossAngle(pSunLine, dSunLine);
  const baseName = angle === 'Left Angle'
    ? (LA_CROSS_NAME_BY_SUN[pSunGate] || NAMED_CROSSES[crossKey] || CROSS_NAME_BY_SUN[pSunGate] || `Kríž Brány ${pSunGate}`)
    : (NAMED_CROSSES[crossKey] || CROSS_NAME_BY_SUN[pSunGate] || `Kríž Brány ${pSunGate}`);
  const cross = `${angle} – ${baseName} (${pSunGate}/${pEarthGate} | ${dSunGate}/${dEarthGate})`;

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
    definition: determineDefinition(defined, channels),
  };
}

const _memoHD = memoize(
  _calculateHumanDesignImpl,
  (day, month, year, hour, minute, tz) =>
    `hd:${birthKey(day, month, year, hour, minute, undefined, undefined, tz)}`
);

export function calculateHumanDesign(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  timezoneOffsetHours: number = 1
): HumanDesignResult {
  return _memoHD(day, month, year, hour, minute, timezoneOffsetHours);
}

export { CENTER_THEMES, GATES_BY_CENTER, CHANNEL_DEFINITIONS };
