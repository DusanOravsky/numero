export interface NumerologyResult {
  lifePathNumber: number;
  lifePathFrom: number;
  isMasterNumber: boolean;
  formula: string;
  grid: { value: number; isBase: boolean }[][];
  gridNumbers: { value: number; isBase: boolean }[];
  supplementaryNumbers: number[];
  fullPlanes: string[];
  emptyPlanes: string[];
  isolatedNumbers: number[];
  orv: number;
  omv: number;
  odv: number;
  vdd: number;
  oddPeriod: number;
  sigmaT: number;
  age: 'pisces' | 'aquarius';
  loveLanguages: { language: string; score: number }[];
  karmicTriangles: KarmicTriangle[];
  pinnacles: Pinnacle[];
  challenges: Challenge[];
  dayReduction: number;
  monthReduction: number;
  yearReduction: number;
  /** Karmic debts 13/14/16/19 detected in the calculation process. */
  karmicDebts: KarmicDebt[];
  /** Maturity number = lifePath + expression (or lifePath + dayReduction if name unknown). */
  maturityNumber: number;
  /** Birthday (day) number — characterizes innate gifts. */
  birthdayNumber: number;
}

export interface KarmicDebt {
  number: 13 | 14 | 16 | 19;
  source: 'lifePath' | 'birthDay' | 'pinnacle';
  reducesTo: number;
  theme: string;
  description: string;
  lesson: string;
}

const MASTER_NUMBERS = [11, 22, 33];

export function reduceToSingle(n: number, preserveMaster = false): number {
  if (n < 0) return 1;
  if (n === 0) return 0;
  while (n > 9) {
    if (preserveMaster && MASTER_NUMBERS.includes(n)) return n;
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

export function reduceDigits(n: number): number {
  if (n <= 9) return n;
  return String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
}

export function calculateLifePath(day: number, month: number, year: number): { number: number; from: number; formula: string; isMaster: boolean } {
  // Podľa PDF Numero: sčítame číslice dňa, mesiaca a roku OSOBITNE (ale rok neredukujeme na jednociferné)
  const daySum = String(day).split('').reduce((s, d) => s + parseInt(d, 10), 0);
  const monthSum = String(month).split('').reduce((s, d) => s + parseInt(d, 10), 0);
  const yearSum = String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0);

  const total = daySum + monthSum + yearSum;
  const formula = `(${day}→${daySum}) + (${month}→${monthSum}) + (${year}→${yearSum}) = ${total}`;

  if (MASTER_NUMBERS.includes(total)) {
    return { number: total, from: total, formula, isMaster: true };
  }

  let current = total;
  while (current > 9) {
    if (MASTER_NUMBERS.includes(current)) {
      return { number: current, from: total, formula, isMaster: true };
    }
    current = reduceDigits(current);
  }

  return { number: current, from: total, formula, isMaster: false };
}

export function buildGrid(day: number, month: number, year: number): { value: number; isBase: boolean }[][] {
  const dateStr = `${day}${month}${year}`;
  const baseDigits = dateStr.split('').map(Number).filter(d => d !== 0);

  const dayRed = reduceToSingle(day);
  const monthRed = reduceToSingle(month);
  const yearRed = reduceToSingle(year);

  const supplementary: number[] = [];
  if (day > 9) supplementary.push(dayRed);
  if (month > 9) supplementary.push(monthRed);
  if (year > 9) supplementary.push(yearRed);

  const grid: { value: number; isBase: boolean }[][] = Array.from({ length: 10 }, () => []);

  baseDigits.forEach(d => {
    if (d >= 1 && d <= 9) grid[d].push({ value: d, isBase: true });
  });

  supplementary.forEach(d => {
    if (d >= 1 && d <= 9) {
      grid[d].push({ value: d, isBase: false });
    }
  });

  return grid;
}

export function getGridCount(grid: { value: number; isBase: boolean }[][]): Map<number, number> {
  const counts = new Map<number, number>();
  for (let i = 1; i <= 9; i++) {
    counts.set(i, grid[i]?.length || 0);
  }
  return counts;
}

const FULL_PLANES: { numbers: number[]; name: string }[] = [
  { numbers: [1, 2, 3], name: 'Myslenie' },
  { numbers: [4, 5, 6], name: 'Vytrvalosť' },
  { numbers: [7, 8, 9], name: 'Energia' },
  { numbers: [1, 4, 7], name: 'Zručnosti' },
  { numbers: [2, 5, 8], name: 'Vášeň' },
  { numbers: [3, 6, 9], name: 'Empatia' },
  { numbers: [1, 5, 9], name: 'Odhodlanie' },
  { numbers: [3, 5, 7], name: 'Pochopenie' },
];

const EMPTY_PLANES: { numbers: number[]; name: string }[] = [
  { numbers: [1, 4, 7], name: 'Postreh' },
  { numbers: [2, 5, 8], name: 'Senzitivita' },
  { numbers: [3, 6, 9], name: 'Inšpirácia' },
  { numbers: [4, 5, 6], name: 'Saturn' },
  { numbers: [7, 8, 9], name: 'Oddanosť veci' },
  { numbers: [1, 5, 9], name: 'Rozvoj' },
  { numbers: [3, 5, 7], name: 'Vízia' },
];

export function calculatePlanes(grid: { value: number; isBase: boolean }[][]): { full: string[]; empty: string[] } {
  const counts = getGridCount(grid);
  const full: string[] = [];
  const empty: string[] = [];

  FULL_PLANES.forEach(plane => {
    if (plane.numbers.every(n => (counts.get(n) || 0) > 0)) {
      full.push(`${plane.numbers.join('-')} ${plane.name}`);
    }
  });

  EMPTY_PLANES.forEach(plane => {
    if (plane.numbers.every(n => (counts.get(n) || 0) === 0)) {
      empty.push(`${plane.numbers.join('-')} ${plane.name}`);
    }
  });

  return { full, empty };
}

export const NEIGHBORS: Record<number, number[]> = {
  1: [2, 4, 5],
  2: [1, 3, 4, 5, 6],
  3: [2, 5, 6],
  4: [1, 2, 5, 7, 8],
  5: [1, 2, 3, 4, 6, 7, 8, 9],
  6: [2, 3, 5, 8, 9],
  7: [4, 5, 8],
  8: [4, 5, 6, 7, 9],
  9: [5, 6, 8],
};

export function findIsolatedNumbers(grid: { value: number; isBase: boolean }[][]): number[] {
  const counts = getGridCount(grid);
  const isolated: number[] = [];

  for (let i = 1; i <= 9; i++) {
    if ((counts.get(i) || 0) > 0) {
      const hasNeighbor = NEIGHBORS[i].some(n => (counts.get(n) || 0) > 0);
      if (!hasNeighbor) {
        isolated.push(i);
      }
    }
  }

  return isolated;
}

export function calculateORV(birthDay: number, birthMonth: number, currentYear: number, currentMonth?: number, currentDay?: number): number {
  // ORV sa počíta od narodenín do narodenín
  // Ak dnešný dátum je pred narodeninami v aktuálnom roku, použijeme predchádzajúci rok
  let year = currentYear;
  if (currentMonth !== undefined && currentDay !== undefined) {
    const beforeBirthday = currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay);
    if (beforeBirthday) year = currentYear - 1;
  }
  const sum = reduceToSingle(birthDay) + reduceToSingle(birthMonth) +
    reduceToSingle(String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0));
  return reduceToSingle(sum);
}

export function calculateOMV(orv: number, currentMonth: number): number {
  return reduceToSingle(currentMonth + orv);
}

export function calculateODV(orv: number, currentDay: number, currentMonth: number): number {
  return reduceToSingle(currentDay + currentMonth + orv);
}

export function calculateVDD(lifePathNumber: number): { vdd: number; oddPeriod: number } {
  const lpBase = lifePathNumber > 9 ? reduceToSingle(lifePathNumber) : lifePathNumber;
  const vdd = 36 - lpBase;
  const oddPeriod = Math.round(vdd / 3);
  return { vdd, oddPeriod };
}

export function calculateSigmaT(day: number, month: number, year: number): { value: number; age: 'pisces' | 'aquarius' } {
  const value = day + month + year;
  return { value, age: value >= 2000 ? 'aquarius' : 'pisces' };
}

export interface KarmicTriangle {
  cycle: number;
  label: string;
  fromAge: number;
  toAge: number | null;
  vibration: number;
  influence: string;
  description: string;
}

export interface Pinnacle {
  number: number;
  fromAge: number;
  toAge: number | null;
  formula: string;
  theme: string;
  description: string;
}

export interface Challenge {
  number: number;
  fromAge: number;
  toAge: number | null;
  formula: string;
  theme: string;
  description: string;
}

const PINNACLE_DESCRIPTIONS: Record<number, { theme: string; description: string }> = {
  1: { theme: 'Nezávislosť, vodcovstvo', description: 'Obdobie samostatnosti, iniciatívy a budovania vlastnej cesty. Učíte sa rozhodovať sami za seba.' },
  2: { theme: 'Spolupráca, trpezlivosť', description: 'Obdobie partnerstiev, diplomacie a citlivosti. Učíte sa byť v jemnom toku s inými.' },
  3: { theme: 'Tvorivosť, sebavyjadrenie', description: 'Obdobie, keď sa otvára kreatívny kanál. Učíte sa zdieľať svoje dary so svetom.' },
  4: { theme: 'Práca, štruktúra', description: 'Obdobie budovania pevných základov, disciplíny a systematickej práce. Pôda pre dlhodobé výsledky.' },
  5: { theme: 'Zmena, sloboda', description: 'Obdobie pohybu, ciest a nových skúseností. Učíte sa adaptabilite a flexibilite.' },
  6: { theme: 'Zodpovednosť, rodina', description: 'Obdobie domova, vzťahov a starostlivosti. Učíte sa služobnej láske a tvoreniu harmónie.' },
  7: { theme: 'Múdrosť, introspekcia', description: 'Obdobie vnútorného prehlbovania, štúdia a duchovného hľadania. Mení sa pohľad na realitu.' },
  8: { theme: 'Sila, hojnosť', description: 'Obdobie manifestácie, autority a materiálnej zrelosti. Žatva za predchádzajúce úsilie.' },
  9: { theme: 'Dovŕšenie, súcit', description: 'Obdobie uzatvárania, odpúšťania a univerzálnej lásky. Pripravuje sa pôda pre nový cyklus.' },
  11: { theme: 'Inšpirácia, intuícia (master)', description: 'Vysoké obdobie spirituálneho vhľadu a inšpirácie iných.' },
  22: { theme: 'Hlavný staviteľ (master)', description: 'Mimoriadne obdobie pre veľké stavby s dlhodobým dopadom.' },
  33: { theme: 'Hlavný učiteľ (master)', description: 'Obdobie hlbokej služby a mentorstva.' },
};

const CHALLENGE_DESCRIPTIONS: Record<number, { theme: string; description: string }> = {
  0: { theme: 'Univerzálna výzva', description: 'Žiadna konkrétna oblasť výzvy — máte slobodu, ale aj plnú zodpovednosť za vlastné voľby.' },
  1: { theme: 'Sebavedomie', description: 'Výzva: nájsť vlastný hlas, postaviť sa za seba, neskloniť sa pred dominantnými ľuďmi.' },
  2: { theme: 'Rozhodnosť', description: 'Výzva: prekonať nerozhodnosť a precitlivenosť, naučiť sa hovoriť „nie".' },
  3: { theme: 'Sebavyjadrenie', description: 'Výzva: odvážiť sa byť videný/á, nevzdávať sa kreativity zo strachu z kritiky.' },
  4: { theme: 'Disciplína', description: 'Výzva: dokončovať veci, vyhnúť sa lenivosti aj workoholizmu, nájsť zdravú prácu.' },
  5: { theme: 'Sloboda', description: 'Výzva: nepodliehať vrtkavosti a útekom, nájsť vnútornú slobodu aj v záväzkoch.' },
  6: { theme: 'Zodpovednosť', description: 'Výzva: vyhnúť sa idealizmu a nadmernej zodpovednosti, prijať realitu blízkych.' },
  7: { theme: 'Dôvera', description: 'Výzva: prekonať skepsu a izoláciu, otvoriť sa duchovným zážitkom aj dôvere v ľudí.' },
  8: { theme: 'Materiálna rovnováha', description: 'Výzva: nezveličovať materiálne ciele ani ich nepotláčať. Naučiť sa správne zaobchádzať s peniazmi a mocou — bez chamtivosti a bez strachu z hojnosti.' },
};

/**
 * Pinnacles (Pythagorean): 4 životné vrcholy
 * 1. Pinnacle: deň + mesiac, do veku 36 - ŽČ
 * 2. Pinnacle: deň + rok, ďalších 9 rokov
 * 3. Pinnacle: 1. + 2. Pinnacle, ďalších 9 rokov
 * 4. Pinnacle: mesiac + rok, do konca života
 */
export function calculatePinnacles(day: number, month: number, year: number, lifePathNumber: number): Pinnacle[] {
  const dayRed = reduceToSingle(day, true);
  const monthRed = reduceToSingle(month, true);
  const yearRed = reduceToSingle(String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0), true);

  const lpBase = lifePathNumber > 9 && !MASTER_NUMBERS.includes(lifePathNumber)
    ? reduceToSingle(lifePathNumber)
    : (MASTER_NUMBERS.includes(lifePathNumber) ? reduceToSingle(lifePathNumber) : lifePathNumber);
  const firstEnd = 36 - lpBase;

  const p1 = reduceToSingle(monthRed + dayRed, true);
  const p2 = reduceToSingle(dayRed + yearRed, true);
  const p3 = reduceToSingle(p1 + p2, true);
  const p4 = reduceToSingle(monthRed + yearRed, true);

  return [
    {
      number: p1,
      fromAge: 0,
      toAge: firstEnd,
      formula: `M(${monthRed}) + D(${dayRed}) = ${monthRed + dayRed} → ${p1}`,
      theme: PINNACLE_DESCRIPTIONS[p1]?.theme || 'Unikátna téma',
      description: PINNACLE_DESCRIPTIONS[p1]?.description || '',
    },
    {
      number: p2,
      fromAge: firstEnd,
      toAge: firstEnd + 9,
      formula: `D(${dayRed}) + R(${yearRed}) = ${dayRed + yearRed} → ${p2}`,
      theme: PINNACLE_DESCRIPTIONS[p2]?.theme || 'Unikátna téma',
      description: PINNACLE_DESCRIPTIONS[p2]?.description || '',
    },
    {
      number: p3,
      fromAge: firstEnd + 9,
      toAge: firstEnd + 18,
      formula: `P1(${p1}) + P2(${p2}) = ${p1 + p2} → ${p3}`,
      theme: PINNACLE_DESCRIPTIONS[p3]?.theme || 'Unikátna téma',
      description: PINNACLE_DESCRIPTIONS[p3]?.description || '',
    },
    {
      number: p4,
      fromAge: firstEnd + 18,
      toAge: null,
      formula: `M(${monthRed}) + R(${yearRed}) = ${monthRed + yearRed} → ${p4}`,
      theme: PINNACLE_DESCRIPTIONS[p4]?.theme || 'Unikátna téma',
      description: PINNACLE_DESCRIPTIONS[p4]?.description || '',
    },
  ];
}

/**
 * Challenges (Pythagorean): 4 životné výzvy
 * 1. Challenge: |mesiac - deň|
 * 2. Challenge: |deň - rok|
 * 3. Challenge: |1. - 2. Challenge| (hlavná, celý život)
 * 4. Challenge: |mesiac - rok|
 * Vekové intervaly zodpovedajú Pinnacles.
 */
export function calculateChallenges(day: number, month: number, year: number, lifePathNumber: number): Challenge[] {
  const dayRed = reduceToSingle(day);
  const monthRed = reduceToSingle(month);
  const yearRed = reduceToSingle(String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0));

  const lpBase = lifePathNumber > 9 ? reduceToSingle(lifePathNumber) : lifePathNumber;
  const firstEnd = 36 - lpBase;

  const c1 = Math.abs(monthRed - dayRed);
  const c2 = Math.abs(dayRed - yearRed);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(monthRed - yearRed);

  return [
    {
      number: c1,
      fromAge: 0,
      toAge: firstEnd,
      formula: `|M(${monthRed}) − D(${dayRed})| = ${c1}`,
      theme: CHALLENGE_DESCRIPTIONS[c1]?.theme || 'Unikátna výzva',
      description: CHALLENGE_DESCRIPTIONS[c1]?.description || '',
    },
    {
      number: c2,
      fromAge: firstEnd,
      toAge: firstEnd + 9,
      formula: `|D(${dayRed}) − R(${yearRed})| = ${c2}`,
      theme: CHALLENGE_DESCRIPTIONS[c2]?.theme || 'Unikátna výzva',
      description: CHALLENGE_DESCRIPTIONS[c2]?.description || '',
    },
    {
      number: c3,
      fromAge: 0,
      toAge: null,
      formula: `|C1(${c1}) − C2(${c2})| = ${c3}  (hlavná výzva, celoživotná)`,
      theme: CHALLENGE_DESCRIPTIONS[c3]?.theme || 'Unikátna výzva',
      description: CHALLENGE_DESCRIPTIONS[c3]?.description || '',
    },
    {
      number: c4,
      fromAge: firstEnd + 18,
      toAge: null,
      formula: `|M(${monthRed}) − R(${yearRed})| = ${c4}`,
      theme: CHALLENGE_DESCRIPTIONS[c4]?.theme || 'Unikátna výzva',
      description: CHALLENGE_DESCRIPTIONS[c4]?.description || '',
    },
  ];
}

export function calculateKarmicTriangles(day: number, month: number, year: number, lifePathNumber: number): KarmicTriangle[] {
  const dayRed = reduceToSingle(day);
  const monthRed = reduceToSingle(month);
  const yearRed = reduceToSingle(String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0));

  const lpBase = lifePathNumber > 9 ? reduceToSingle(lifePathNumber) : lifePathNumber;
  const vdd = 36 - lpBase;
  const odd = Math.round(vdd / 3);

  const k1Vibration = reduceToSingle(monthRed + dayRed, true);
  const k2Vibration = reduceToSingle(dayRed + yearRed, true);
  const k3Vibration = reduceToSingle(k1Vibration + k2Vibration, true);
  const k4Vibration = reduceToSingle(monthRed + yearRed, true);

  const triangles: KarmicTriangle[] = [
    { cycle: 1, label: '1. cyklus – Matka', fromAge: 0, toAge: odd, vibration: monthRed, influence: 'M (mesiac)', description: 'Vplyv vibrácie mesiaca. Obdobie pod vplyvom matky a jej očakávaní.' },
    { cycle: 2, label: '2. cyklus – Otec', fromAge: odd, toAge: odd * 2, vibration: dayRed, influence: 'D (deň)', description: 'Vplyv vibrácie dňa. Obdobie pod vplyvom otca a formovanie identity.' },
    { cycle: 3, label: '3. cyklus – Spoločnosť', fromAge: odd * 2, toAge: vdd, vibration: yearRed, influence: 'R (rok)', description: 'Vplyv vibrácie roka. Obdobie socializácie a vplyvu spoločnosti.' },
    { cycle: 4, label: 'K1 – Psychická stabilita', fromAge: vdd, toAge: vdd + 9, vibration: k1Vibration, influence: 'M + D', description: 'Tvorba psychickej stability človeka. Vplyv mesiaca a dňa.' },
    { cycle: 5, label: 'K2 – Materiálna stabilita', fromAge: vdd + 9, toAge: vdd + 18, vibration: k2Vibration, influence: 'D + R', description: 'Vytváranie materiálnej stability. Vplyv dňa a roka.' },
    { cycle: 6, label: 'K3 – Životné poslanie', fromAge: vdd + 18, toAge: vdd + 27, vibration: k3Vibration, influence: 'K1 + K2', description: 'Plnenie životného poslania. Súčet predchádzajúcich karmických cyklov.' },
    { cycle: 7, label: 'K4 – Detské sny', fromAge: vdd + 27, toAge: null, vibration: k4Vibration, influence: 'M + R', description: 'Plníme si svoje detské sny. Vplyv mesiaca a roka až do konca života.' },
  ];

  return triangles;
}

const LOVE_LANGUAGE_PLANES: { language: string; planes: number[][] }[] = [
  { language: 'Slová uistenia', planes: [[3, 6, 9]] },
  { language: 'Kvalitný čas', planes: [[2, 5, 8]] },
  { language: 'Obdarovávanie', planes: [[2, 6, 8]] },
  { language: 'Skutky služby', planes: [[1, 4, 7], [4, 5, 6]] },
  { language: 'Fyzický dotyk', planes: [[7, 8, 9]] },
];

export function calculateLoveLanguages(
  grid: { value: number; isBase: boolean }[][],
  day: number,
  month: number,
  lifePathNumber: number,
  isolatedNumbers: number[]
): { language: string; score: number }[] {
  const counts = getGridCount(grid);
  const dayDigits = String(day).split('').map(Number).filter(d => d > 0);
  const monthDigits = String(month).split('').map(Number).filter(d => d > 0);
  const lpBase = lifePathNumber > 9 ? reduceToSingle(lifePathNumber) : lifePathNumber;

  return LOVE_LANGUAGE_PLANES.map(({ language, planes }) => {
    let totalScore = 0;

    planes.forEach(plane => {
      const allPresent = plane.every(n => (counts.get(n) || 0) > 0);
      const nonePresent = plane.every(n => (counts.get(n) || 0) === 0);
      const twoPresent = plane.filter(n => (counts.get(n) || 0) > 0).length >= 2;

      if (allPresent) totalScore += 3;
      else if (twoPresent) totalScore += 1;
      if (nonePresent) totalScore -= 2;

      plane.forEach(n => {
        if ((counts.get(n) || 0) > 2) totalScore += 1;
        if (dayDigits.includes(n)) totalScore += 1;
        if (monthDigits.includes(n)) totalScore += 1;
        if (n === lpBase) totalScore += 1;
        if (isolatedNumbers.includes(n)) totalScore -= 1;
      });
    });

    const score = planes.length > 1 ? Math.round(totalScore / planes.length) : totalScore;
    return { language, score };
  }).sort((a, b) => b.score - a.score);
}

export function isValidDate(day: number, month: number, year: number): boolean {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

const KARMIC_DEBT_INFO: Record<13 | 14 | 16 | 19, { theme: string; description: string; lesson: string; reducesTo: number }> = {
  13: {
    reducesTo: 4,
    theme: 'Práca a transformácia',
    description: 'Karmický dlh 13 sa redukuje na 4. Z minulých životov nesiete tendenciu obchádzať ťažkú prácu, hľadať skratky alebo prenechávať zodpovednosť iným.',
    lesson: 'Naučte sa systematickej, vytrvalej práci. Nedokončené úlohy z minulosti si vyžadujú dôkladnosť teraz. Stabilita vznikne len cez disciplínu.',
  },
  14: {
    reducesTo: 5,
    theme: 'Sloboda a sebakontrola',
    description: 'Karmický dlh 14 sa redukuje na 5. Z minulých životov nesiete tendenciu k zneužívaniu slobody — extrémnym pôžitkom, závislostiam, nestálosti.',
    lesson: 'Naučte sa stredne cestu medzi slobodou a zodpovednosťou. Adaptabilita áno, ale s vnútornou disciplínou. Nepodliehajte vrtkavosti.',
  },
  16: {
    reducesTo: 7,
    theme: 'Pokora a duchovné prebudenie',
    description: 'Karmický dlh 16 sa redukuje na 7. Z minulých životov nesiete tendenciu zneužívať lásku, ego alebo duchovné poznanie. Hrozí "veža" — náhle pády.',
    lesson: 'Naučte sa pokore a hlbokej introspekcii. Egoistický pohľad na vzťahy a duchovnosť musí byť opustený. Pravda prichádza skrz pád starého Ja.',
  },
  19: {
    reducesTo: 1,
    theme: 'Zodpovednosť a samostatnosť',
    description: 'Karmický dlh 19 sa redukuje na 1. Z minulých životov nesiete tendenciu zneužívania moci alebo izolácie — nedokázali ste pomôcť iným keď to mohli.',
    lesson: 'Naučte sa byť nezávislý ale nie izolovaný. Vodcovstvo musí slúžiť, nie ovládať. "Si to ty kto musí" — nie iní za teba.',
  },
};

const KARMIC_DEBTS: ReadonlySet<number> = new Set([13, 14, 16, 19]);

function detectKarmicDebts(day: number, month: number, year: number, lifePathFrom: number): KarmicDebt[] {
  const debts: KarmicDebt[] = [];

  // 1. ŽČ from-sum: ak je medzisúčet (pred redukciou) jedno z 13/14/16/19
  // Pri jednomístnom dni môžu byť dlhy len ak from > 9
  if (KARMIC_DEBTS.has(lifePathFrom)) {
    const info = KARMIC_DEBT_INFO[lifePathFrom as 13 | 14 | 16 | 19];
    debts.push({ number: lifePathFrom as 13 | 14 | 16 | 19, source: 'lifePath', ...info });
  }

  // 2. Birthday: ak je deň narodenia 13/14/16/19
  if (KARMIC_DEBTS.has(day)) {
    const info = KARMIC_DEBT_INFO[day as 13 | 14 | 16 | 19];
    debts.push({ number: day as 13 | 14 | 16 | 19, source: 'birthDay', ...info });
  }

  // 3. Pinnacle/Challenge mid-sums: pinnacles počítame z monthRed+dayRed atď. — neredukujeme dvojcifery,
  //    no možný "skrytý dlh" je ak (M+D), (D+R), (M+R) je 13/14/16/19 PRED redukciou.
  const dayRed = reduceToSingle(day);
  const monthRed = reduceToSingle(month);
  const yearRed = reduceToSingle(String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0));
  const pinnacleMidSums = [
    { src: 'pinnacle' as const, sum: monthRed + dayRed },
    { src: 'pinnacle' as const, sum: dayRed + yearRed },
    { src: 'pinnacle' as const, sum: monthRed + yearRed },
  ];
  pinnacleMidSums.forEach(({ src, sum }) => {
    if (KARMIC_DEBTS.has(sum) && !debts.some(d => d.number === sum && d.source === src)) {
      const info = KARMIC_DEBT_INFO[sum as 13 | 14 | 16 | 19];
      debts.push({ number: sum as 13 | 14 | 16 | 19, source: src, ...info });
    }
  });

  return debts;
}

export function calculateFullNumerology(day: number, month: number, year: number): NumerologyResult {
  const lifePath = calculateLifePath(day, month, year);
  const grid = buildGrid(day, month, year);
  const planes = calculatePlanes(grid);
  const isolated = findIsolatedNumbers(grid);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const orv = calculateORV(day, month, currentYear, currentMonth, currentDay);
  const omv = calculateOMV(orv, currentMonth);
  const odv = calculateODV(orv, currentDay, currentMonth);
  const { vdd, oddPeriod } = calculateVDD(lifePath.number);
  const sigmaT = calculateSigmaT(day, month, year);
  const loveLanguages = calculateLoveLanguages(grid, day, month, lifePath.number, isolated);
  const karmicTriangles = calculateKarmicTriangles(day, month, year, lifePath.number);
  const pinnacles = calculatePinnacles(day, month, year, lifePath.number);
  const challenges = calculateChallenges(day, month, year, lifePath.number);

  return {
    lifePathNumber: lifePath.number,
    lifePathFrom: lifePath.from,
    isMasterNumber: lifePath.isMaster,
    formula: lifePath.formula,
    grid,
    gridNumbers: grid.flat(),
    supplementaryNumbers: [reduceToSingle(day), reduceToSingle(month), reduceToSingle(year)],
    fullPlanes: planes.full,
    emptyPlanes: planes.empty,
    isolatedNumbers: isolated,
    orv,
    omv,
    odv,
    vdd,
    oddPeriod,
    sigmaT: sigmaT.value,
    age: sigmaT.age,
    loveLanguages,
    karmicTriangles,
    pinnacles,
    challenges,
    dayReduction: reduceToSingle(day),
    monthReduction: reduceToSingle(month),
    yearReduction: reduceToSingle(year),
    karmicDebts: detectKarmicDebts(day, month, year, lifePath.from),
    // Maturity = ŽČ + birthday-day reduction (klasická pythag. formula bez mena);
    // úplnú maturitu s expression ratíme v NameNumerology.
    maturityNumber: reduceToSingle(
      (lifePath.number > 9 && !MASTER_NUMBERS.includes(lifePath.number) ? reduceToSingle(lifePath.number) : lifePath.number)
      + reduceToSingle(day),
      true
    ),
    birthdayNumber: day,
  };
}
