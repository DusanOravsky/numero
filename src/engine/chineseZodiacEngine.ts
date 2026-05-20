export interface ChineseZodiacResult {
  animal: string;
  element: string;
  polarity: 'Yin' | 'Yang';
  animalEmoji: string;
  elementEmoji: string;
  nextYear: number;
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

export function calculateChineseZodiac(birthYear: number): ChineseZodiacResult {
  const animalIdx = birthYear % 12;
  const elementIdx = birthYear % 10;
  const animal = ANIMALS[animalIdx];
  const element = ELEMENTS_CYCLE[elementIdx];
  const polarity: 'Yin' | 'Yang' = birthYear % 2 === 0 ? 'Yang' : 'Yin';

  const currentYear = new Date().getFullYear();
  let nextYear = currentYear;
  while (ANIMALS[nextYear % 12] !== animal) nextYear++;
  if (nextYear === currentYear) nextYear += 12;

  return {
    animal,
    element,
    polarity,
    animalEmoji: ANIMAL_EMOJIS[animal] || '',
    elementEmoji: ELEMENT_EMOJIS[element] || '',
    nextYear,
  };
}
