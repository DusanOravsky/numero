import { NEIGHBORS } from './numerologyEngine';

// Vývojová numerológia (podľa knihy "Duchovná numerológia" – Lívia)
// Zdroj výpočtu: prednáška Červenáka + kniha Lívie Mičkovej (Duchovná numerológia,
// Duchovná numerológia pre deti). Postup:
//
//   1. Spočítaj číslice DŇA + MESIACA spolu (D+M)
//   2. Spočítaj číslice ROKU (R) – pozor, pre roky 2000+ rok rozdeľ na "20" + zvyšok
//      a sčítaj tieto dve čísla (napr. 2011 → 20+11 = 31)
//   3. 1. zakrúžkované = (D+M) + R
//   4. 2. zakrúžkované = redukcia 1. zakrúžkovaného (ak je dvojciferné)
//   5. 3. zakrúžkované = 1. zakrúžkované − 2× (prvá cifra dňa)
//   6. 4. zakrúžkované = redukcia 3. zakrúžkovaného (ak je dvojciferné)
//
// Do mriežky idú VŠETKY číslice dátumu (deň, mesiac, rok – pre rok 2000+ ako "20"+zvyšok)
// + cifry všetkých 4 zakrúžkovaných čísel. Nuly sa nezapisujú.
//
// Politika krúžkovania: aj jednociferné medzivýsledky sa "zakružkúvajú" (zapisujú do mriežky)
// pre konzistenciu s lektorom – ak 1. zakrúžkované je už jednociferné, 2. = 1.
// (čiže do mriežky sa zapíše tá istá cifra dvakrát).

export interface DevelopmentalCircled {
  label: string;
  value: number;
  formula: string;
}

export interface DevelopmentalGridCell {
  digit: number;
  source: 'date' | 'circled';
  circledIndex?: number; // 1..4 pre zakrúžkované
}

export type EgoPolarity = 'masculine' | 'feminine' | 'none';

export interface DevelopmentalNumerologyResult {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  isPost2000: boolean;
  dayMonthSum: number;
  yearSum: number;
  circled: DevelopmentalCircled[];
  dateDigits: number[];
  // mriežka: pole 1..9 → zoznam buniek (každá bunka = jeden zápis čísla)
  grid: DevelopmentalGridCell[][];
  counts: Record<number, number>;
  /** počet jednotiek v mriežke */
  oneCount: number;
  /** mužské (nepárny počet jednotiek) / ženské (párny) / žiadne (0) */
  egoPolarity: EgoPolarity;
  isolatedNumbers: number[];
}

function reduceTwoDigit(n: number): number {
  const abs = Math.abs(n);
  if (abs < 10) return abs;
  return String(abs).split('').reduce((s, d) => s + parseInt(d, 10), 0);
}

function digitsOf(n: number): number[] {
  return String(Math.abs(n)).split('').map(d => parseInt(d, 10));
}

function sumDigits(n: number): number {
  return digitsOf(n).reduce((s, d) => s + d, 0);
}

/**
 * Špeciálne pravidlo pre rok podľa Lívie:
 *  - rok < 2000: sčítaj všetky číslice (1979 → 1+9+7+9 = 26)
 *  - rok >= 2000: rozdeľ na "20" + zvyšok a sčítaj (2011 → 20 + 11 = 31)
 */
export function calculateYearSumLivia(year: number): number {
  if (year >= 2000) {
    const rest = year - 2000;
    return 20 + rest;
  }
  return sumDigits(year);
}

/**
 * Pre mriežku potrebujeme cifry roku. V Lívia metóde pre roky 2000+
 * používame zápis "20" + zvyšok (napr. 2011 → cifry 2,0,1,1; nuly potom odfiltrujeme).
 * Pre porovnanie: rok 1979 → cifry 1,9,7,9; rok 2011 → cifry 2,0,1,1.
 * Cifrový obraz roku 2000+ teda zostáva rovnaký – vidieť to len v sume.
 */
function digitsOfYearLivia(year: number): number[] {
  return digitsOf(year);
}

export function calculateDevelopmentalNumerology(
  day: number,
  month: number,
  year: number
): DevelopmentalNumerologyResult {
  const isPost2000 = year >= 2000;

  // Krok 1: D+M (cifry dňa a mesiaca spolu)
  const dayDigits = digitsOf(day);
  const monthDigits = digitsOf(month);
  const dayMonthSum = [...dayDigits, ...monthDigits].reduce((s, d) => s + d, 0);

  // Krok 2: R (Lívia pravidlo pre rok)
  const yearSum = calculateYearSumLivia(year);

  // Krok 3: 1. zakrúžkované = (D+M) + R
  const c1 = dayMonthSum + yearSum;
  // Krok 4: 2. zakrúžkované = redukcia 1.
  const c2 = reduceTwoDigit(c1);

  // Krok 5: 3. zakrúžkované = 1. − 2× (prvá cifra dňa)
  const firstDayDigit = dayDigits[0];
  const c3 = c1 - 2 * firstDayDigit;
  // Krok 6: 4. zakrúžkované = redukcia 3.
  const c4 = reduceTwoDigit(c3);

  const circled: DevelopmentalCircled[] = [
    { label: '1. zakrúžkované', value: c1, formula: `(D+M=${dayMonthSum}) + (R=${yearSum}) = ${c1}` },
    { label: '2. zakrúžkované', value: c2, formula: c1 >= 10 ? `${digitsOf(c1).join('+')} = ${c2}` : `${c1}` },
    { label: '3. zakrúžkované', value: c3, formula: `${c1} − 2×${firstDayDigit} = ${c3}` },
    { label: '4. zakrúžkované', value: c4, formula: c3 >= 10 ? `${digitsOf(c3).join('+')} = ${c4}` : `${c3}` },
  ];

  // Cifry dátumu (deň + mesiac + rok podľa pravidla)
  const yearDigits = digitsOfYearLivia(year);
  const dateDigits = [...dayDigits, ...monthDigits, ...yearDigits];

  // Mriežka 1..9
  const grid: DevelopmentalGridCell[][] = Array.from({ length: 10 }, () => []);

  // Cifry dátumu
  dateDigits.forEach(d => {
    if (d >= 1 && d <= 9) grid[d].push({ digit: d, source: 'date' });
  });

  // Cifry zakrúžkovaných
  circled.forEach((c, idx) => {
    digitsOf(c.value).forEach(d => {
      if (d >= 1 && d <= 9) grid[d].push({ digit: d, source: 'circled', circledIndex: idx + 1 });
    });
  });

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = grid[i].length;

  const oneCount = counts[1] || 0;
  const egoPolarity: EgoPolarity =
    oneCount === 0 ? 'none' : oneCount % 2 === 0 ? 'feminine' : 'masculine';

  // Izolované čísla — rovnaká logika ako v charakterovej (susedia na 3×3 mriežke)
  const isolatedNumbers: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if ((counts[i] || 0) > 0) {
      const hasNeighbor = NEIGHBORS[i].some(n => (counts[n] || 0) > 0);
      if (!hasNeighbor) isolatedNumbers.push(i);
    }
  }

  return {
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    isPost2000,
    dayMonthSum,
    yearSum,
    circled,
    dateDigits,
    grid,
    counts,
    oneCount,
    egoPolarity,
    isolatedNumbers,
  };
}
