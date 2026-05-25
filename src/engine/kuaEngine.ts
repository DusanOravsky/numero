import type { Language } from '../store/useStore';

export interface KuaResult {
  kuaNumber: number;
  group: 'east' | 'west';
  element: string;
  favorable: Direction[];
  unfavorable: Direction[];
  bestForSleep: string;
  bestForWork: string;
  bestForEntrance: string;
}

export interface Direction {
  direction: string;
  meaning: string;
  use: string;
}


const KUA_ELEMENTS: Record<number, string> = {
  1: 'Voda', 2: 'Zem', 3: 'Drevo', 4: 'Drevo',
  5: 'Zem', 6: 'Kov', 7: 'Kov', 8: 'Zem', 9: 'Oheň',
};

const KUA_ELEMENTS_EN: Record<number, string> = {
  1: 'Water', 2: 'Earth', 3: 'Wood', 4: 'Wood',
  5: 'Earth', 6: 'Metal', 7: 'Metal', 8: 'Earth', 9: 'Fire',
};

const KUA_FAVORABLE: Record<number, string[]> = {
  1: ['Sever', 'Juh', 'Východ', 'Juhovýchod'],
  2: ['Severovýchod', 'Západ', 'Severozápad', 'Juhozápad'],
  3: ['Juh', 'Sever', 'Juhovýchod', 'Východ'],
  4: ['Sever', 'Juh', 'Východ', 'Juhovýchod'],
  6: ['Západ', 'Severovýchod', 'Juhozápad', 'Severozápad'],
  7: ['Severozápad', 'Juhozápad', 'Severovýchod', 'Západ'],
  8: ['Juhozápad', 'Severozápad', 'Západ', 'Severovýchod'],
  9: ['Východ', 'Juhovýchod', 'Sever', 'Juh'],
};

const KUA_FAVORABLE_EN: Record<number, string[]> = {
  1: ['North', 'South', 'East', 'Southeast'],
  2: ['Northeast', 'West', 'Northwest', 'Southwest'],
  3: ['South', 'North', 'Southeast', 'East'],
  4: ['North', 'South', 'East', 'Southeast'],
  6: ['West', 'Northeast', 'Southwest', 'Northwest'],
  7: ['Northwest', 'Southwest', 'Northeast', 'West'],
  8: ['Southwest', 'Northwest', 'West', 'Northeast'],
  9: ['East', 'Southeast', 'North', 'South'],
};

const DIRECTION_MEANINGS: Record<string, { meaning: string; use: string }> = {
  'Sever': { meaning: 'Osobný rast a kariéra', use: 'Pracovný stôl pre kariérny rozvoj' },
  'Juh': { meaning: 'Uznanie a reputácia', use: 'Obývačka, prezentačný priestor' },
  'Východ': { meaning: 'Zdravie a rodina', use: 'Jedáleň, rodinný priestor' },
  'Západ': { meaning: 'Kreativita a potomstvo', use: 'Ateliér, detská izba' },
  'Severovýchod': { meaning: 'Múdrosť a vzdelanie', use: 'Študovňa, knižnica' },
  'Severozápad': { meaning: 'Pomocníci a cestovanie', use: 'Vchod, chodba' },
  'Juhovýchod': { meaning: 'Hojnosť a prosperita', use: 'Pracovňa, kancelária' },
  'Juhozápad': { meaning: 'Láska a partnerstvo', use: 'Spálňa, romantický kút' },
};

const DIRECTION_MEANINGS_EN: Record<string, { meaning: string; use: string }> = {
  'North': { meaning: 'Personal growth and career', use: 'Desk for career development' },
  'South': { meaning: 'Recognition and reputation', use: 'Living room, presentation space' },
  'East': { meaning: 'Health and family', use: 'Dining room, family space' },
  'West': { meaning: 'Creativity and offspring', use: 'Studio, children\'s room' },
  'Northeast': { meaning: 'Wisdom and education', use: 'Study, library' },
  'Northwest': { meaning: 'Helpful people and travel', use: 'Entrance, hallway' },
  'Southeast': { meaning: 'Abundance and prosperity', use: 'Office, workspace' },
  'Southwest': { meaning: 'Love and partnership', use: 'Bedroom, romantic corner' },
};

const ALL_DIRS = ['Sever', 'Juh', 'Východ', 'Západ', 'Severovýchod', 'Severozápad', 'Juhovýchod', 'Juhozápad'];
const ALL_DIRS_EN = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];

export function calculateKua(birthYear: number, gender: 'male' | 'female', lang: Language = 'sk'): KuaResult {
  // Štandardná Kua formula: posledné 2 cifry roka
  const lastTwo = birthYear % 100;
  let sum = Math.floor(lastTwo / 10) + (lastTwo % 10);
  while (sum > 9) sum = Math.floor(sum / 10) + (sum % 10);

  let kua: number;
  if (birthYear < 2000) {
    kua = gender === 'male' ? 11 - sum : sum + 4;
  } else {
    kua = gender === 'male' ? 9 - sum : sum + 6;
  }
  if (kua <= 0) kua += 9;
  if (kua > 9) kua -= 9;

  // Kua 5 neexistuje — muži → 2, ženy → 8
  if (kua === 5) kua = gender === 'male' ? 2 : 8;

  const isEast = [1, 3, 4, 9].includes(kua);

  const favorableDirsSource = lang === 'sk' ? KUA_FAVORABLE : KUA_FAVORABLE_EN;
  const dirMeanings = lang === 'sk' ? DIRECTION_MEANINGS : DIRECTION_MEANINGS_EN;
  const allDirs = lang === 'sk' ? ALL_DIRS : ALL_DIRS_EN;
  const elements = lang === 'sk' ? KUA_ELEMENTS : KUA_ELEMENTS_EN;

  const favorableDirs = favorableDirsSource[kua] || favorableDirsSource[1];
  const unfavorableDirs = allDirs.filter(d => !favorableDirs.includes(d));

  const unfavorableMeaning = lang === 'sk'
    ? 'Nepriaznivý smer — vyhýbajte sa dlhodobému orientovaniu'
    : 'Unfavorable direction — avoid long-term orientation';
  const unfavorableUse = lang === 'sk'
    ? 'Skúste presunúť kľúčové aktivity inam'
    : 'Try to move key activities elsewhere';

  const favorable: Direction[] = favorableDirs.map(d => ({
    direction: d,
    meaning: dirMeanings[d]?.meaning || '',
    use: dirMeanings[d]?.use || '',
  }));

  const unfavorable: Direction[] = unfavorableDirs.map(d => ({
    direction: d,
    meaning: unfavorableMeaning,
    use: unfavorableUse,
  }));

  return {
    kuaNumber: kua,
    group: isEast ? 'east' : 'west',
    element: elements[kua] || (lang === 'sk' ? 'Zem' : 'Earth'),
    favorable,
    unfavorable,
    bestForSleep: favorable[3]?.direction || favorable[0]?.direction,
    bestForWork: favorable[0]?.direction,
    bestForEntrance: favorable[1]?.direction,
  };
}
