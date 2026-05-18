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
  dayReduction: number;
  monthReduction: number;
  yearReduction: number;
}

const MASTER_NUMBERS = [11, 22, 33];

export function reduceToSingle(n: number, preserveMaster = false): number {
  if (n <= 0) return 1;
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
  const daySum = reduceToSingle(day, true);
  const monthSum = reduceToSingle(month, true);
  const yearSum = reduceToSingle(
    String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0),
    true
  );

  const total = daySum + monthSum + yearSum;
  const formula = `(${day}→${daySum}) + (${month}→${monthSum}) + (${year}→${yearSum}) = ${total}`;

  if (MASTER_NUMBERS.includes(total)) {
    return { number: total, from: total, formula, isMaster: true };
  }

  let current = total;
  let prev = total;
  while (current > 9) {
    prev = current;
    current = reduceDigits(current);
    if (MASTER_NUMBERS.includes(current)) {
      return { number: current, from: prev, formula, isMaster: true };
    }
  }

  return { number: current, from: prev, formula, isMaster: false };
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

const NEIGHBORS: Record<number, number[]> = {
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

export function calculateORV(day: number, month: number, currentYear: number): number {
  const sum = reduceToSingle(day) + reduceToSingle(month) +
    reduceToSingle(String(currentYear).split('').reduce((s, d) => s + parseInt(d, 10), 0));
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
  return { value, age: year >= 2000 ? 'aquarius' : 'pisces' };
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
    let score = 0;

    planes.forEach(plane => {
      const allPresent = plane.every(n => (counts.get(n) || 0) > 0);
      const nonePresent = plane.every(n => (counts.get(n) || 0) === 0);
      const twoPresent = plane.filter(n => (counts.get(n) || 0) > 0).length >= 2;

      if (allPresent) score += 3;
      else if (twoPresent) score += 1;
      if (nonePresent) score -= 2;

      plane.forEach(n => {
        if ((counts.get(n) || 0) > 2) score += 1;
        if (dayDigits.includes(n)) score += 1;
        if (monthDigits.includes(n)) score += 1;
        if (n === lpBase) score += 1;
        if (isolatedNumbers.includes(n)) score -= 1;
      });
    });

    return { language, score };
  }).sort((a, b) => b.score - a.score);
}

export function isValidDate(day: number, month: number, year: number): boolean {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
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

  const orv = calculateORV(day, month, currentYear);
  const omv = calculateOMV(orv, currentMonth);
  const odv = calculateODV(orv, currentDay, currentMonth);
  const { vdd, oddPeriod } = calculateVDD(lifePath.number);
  const sigmaT = calculateSigmaT(day, month, year);
  const loveLanguages = calculateLoveLanguages(grid, day, month, lifePath.number, isolated);

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
    dayReduction: reduceToSingle(day),
    monthReduction: reduceToSingle(month),
    yearReduction: reduceToSingle(year),
  };
}
