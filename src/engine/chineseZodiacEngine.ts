export interface ChineseZodiacResult {
  animal: string;
  animalGenitive: string;
  element: string;
  polarity: 'Yin' | 'Yang';
  animalEmoji: string;
  elementEmoji: string;
  nextYear: number;
  approximate?: boolean;
}

const ANIMALS = [
  'Opica', 'Kohút', 'Pes', 'Prasa', 'Potkan', 'Byvol',
  'Tiger', 'Zajac', 'Drak', 'Had', 'Kôň', 'Koza',
] as const;

const ANIMAL_EMOJIS: Record<string, string> = {
  'Potkan': '🐀', 'Byvol': '🐂', 'Tiger': '🐅', 'Zajac': '🐇',
  'Drak': '🐉', 'Had': '🐍', 'Kôň': '🐴', 'Koza': '🐐',
  'Opica': '🐵', 'Kohút': '🐓', 'Pes': '🐕', 'Prasa': '🐷',
};

const ELEMENTS_CYCLE = ['Kov', 'Kov', 'Voda', 'Voda', 'Drevo', 'Drevo', 'Oheň', 'Oheň', 'Zem', 'Zem'] as const;

const ELEMENT_EMOJIS: Record<string, string> = {
  'Kov': '🪙', 'Voda': '💧', 'Drevo': '🌳', 'Oheň': '🔥', 'Zem': '🏔',
};

const ANIMAL_GENITIVE: Record<string, string> = {
  'Potkan': 'Potkana', 'Byvol': 'Byvola', 'Tiger': 'Tigra', 'Zajac': 'Zajaca',
  'Drak': 'Draka', 'Had': 'Hada', 'Kôň': 'Koňa', 'Koza': 'Kozy',
  'Opica': 'Opice', 'Kohút': 'Kohúta', 'Pes': 'Psa', 'Prasa': 'Prasaťa',
};

// Lunárny nový rok — [mesiac, deň] pre roky 1940-2030.
// Zdroj: Hong Kong Observatory / timeanddate.com
const LUNAR_NEW_YEAR: Record<number, [number, number]> = {
  1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
  1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3],
};

function getChineseYear(birthYear: number, birthMonth: number, birthDay: number): number {
  const lny = LUNAR_NEW_YEAR[birthYear];
  if (!lny) return birthYear;
  const [lnyMonth, lnyDay] = lny;
  if (birthMonth < lnyMonth || (birthMonth === lnyMonth && birthDay < lnyDay)) {
    return birthYear - 1;
  }
  return birthYear;
}

export function calculateChineseZodiac(birthYear: number, birthMonth?: number, birthDay?: number): ChineseZodiacResult {
  const hasLunarCorrection = birthYear in LUNAR_NEW_YEAR;
  const effectiveYear = (birthMonth !== undefined && birthDay !== undefined)
    ? getChineseYear(birthYear, birthMonth, birthDay)
    : birthYear;

  const animalIdx = effectiveYear % 12;
  const elementIdx = effectiveYear % 10;
  const animal = ANIMALS[animalIdx];
  const element = ELEMENTS_CYCLE[elementIdx];
  const polarity: 'Yin' | 'Yang' = effectiveYear % 2 === 0 ? 'Yang' : 'Yin';

  const currentYear = new Date().getFullYear();
  let nextYear = currentYear + 1;
  while (ANIMALS[nextYear % 12] !== animal) nextYear++;

  return {
    animal,
    animalGenitive: ANIMAL_GENITIVE[animal] || animal,
    element,
    polarity,
    animalEmoji: ANIMAL_EMOJIS[animal] || '',
    elementEmoji: ELEMENT_EMOJIS[element] || '',
    nextYear,
    ...((!hasLunarCorrection && birthMonth !== undefined) ? { approximate: true } : {}),
  };
}
