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

export function calculateKua(birthYear: number, gender: 'male' | 'female'): KuaResult {
  const digits = String(birthYear).split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);

  let kua: number;
  if (gender === 'male') {
    kua = 11 - sum;
    if (kua > 9) kua = kua - 9;
  } else {
    kua = sum + 4;
    if (kua > 9) kua = kua - 9;
  }

  // Kua 5 neexistuje — muži → 2, ženy → 8
  if (kua === 5) kua = gender === 'male' ? 2 : 8;

  const isEast = [1, 3, 4, 9].includes(kua);
  const favorableDirs = KUA_FAVORABLE[kua] || KUA_FAVORABLE[1];
  const allDirs = ['Sever', 'Juh', 'Východ', 'Západ', 'Severovýchod', 'Severozápad', 'Juhovýchod', 'Juhozápad'];
  const unfavorableDirs = allDirs.filter(d => !favorableDirs.includes(d));

  const favorable: Direction[] = favorableDirs.map(d => ({
    direction: d,
    meaning: DIRECTION_MEANINGS[d]?.meaning || '',
    use: DIRECTION_MEANINGS[d]?.use || '',
  }));

  const unfavorable: Direction[] = unfavorableDirs.map(d => ({
    direction: d,
    meaning: 'Nepriaznivý smer — vyhýbajte sa dlhodobému orientovaniu',
    use: 'Skúste presunúť kľúčové aktivity inam',
  }));

  return {
    kuaNumber: kua,
    group: isEast ? 'east' : 'west',
    element: KUA_ELEMENTS[kua] || 'Zem',
    favorable,
    unfavorable,
    bestForSleep: favorable[3]?.direction || favorable[0]?.direction,
    bestForWork: favorable[0]?.direction,
    bestForEntrance: favorable[1]?.direction,
  };
}
