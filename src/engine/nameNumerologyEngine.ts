import { reduceToSingle } from './numerologyEngine';

// Pythagorean letter-to-number mapping
const LETTER_VALUES: Record<string, number> = {
  a: 1, á: 1, ä: 1, b: 2, c: 3, č: 3, d: 4, ď: 4, e: 5, é: 5, ě: 5,
  f: 6, g: 7, h: 8, ch: 8, i: 9, í: 9, j: 1, k: 2, l: 3, ľ: 3, ĺ: 3,
  m: 4, n: 5, ň: 5, o: 6, ó: 6, ô: 6, p: 7, q: 8, r: 9, ŕ: 9, ř: 9,
  s: 1, š: 1, t: 2, ť: 2, u: 3, ú: 3, ů: 3, v: 4, w: 5, x: 6,
  y: 7, ý: 7, z: 8, ž: 8,
};

const VOWELS = new Set(['a', 'á', 'ä', 'e', 'é', 'ě', 'i', 'í', 'o', 'ó', 'ô', 'u', 'ú', 'ů', 'y', 'ý']);

export interface NameNumerologyResult {
  fullName: string;
  expressionNumber: number;
  soulNumber: number;
  personalityNumber: number;
  letters: { letter: string; value: number; isVowel: boolean }[];
  expressionDescription: string;
  soulDescription: string;
  personalityDescription: string;
}

function getLetterValue(letter: string): number {
  const lower = letter.toLowerCase();
  return LETTER_VALUES[lower] || 0;
}

function isVowel(letter: string): boolean {
  return VOWELS.has(letter.toLowerCase());
}

const EXPRESSION_DESCRIPTIONS: Record<number, string> = {
  1: 'Číslo výrazu 1: Nezávislosť, vodcovstvo, originalita. Ste tu aby ste išli vlastnou cestou a inšpirovali ostatných. Vaše meno nesie energiu priekopníka.',
  2: 'Číslo výrazu 2: Spolupráca, diplomacia, citlivosť. Vaše meno vyjadruje schopnosť vytvárať harmóniu a prepojenie medzi ľuďmi.',
  3: 'Číslo výrazu 3: Kreativita, sebavyjadrenie, radosť. Vaše meno nesie energiu tvorivosti a komunikácie. Ste tu aby ste tvorili a inšpirovali.',
  4: 'Číslo výrazu 4: Stabilita, práca, spoľahlivosť. Vaše meno vyjadruje schopnosť budovať pevné základy a prinášať poriadok.',
  5: 'Číslo výrazu 5: Sloboda, zmena, dobrodružstvo. Vaše meno nesie energiu adaptability a túžby po skúsenostiach.',
  6: 'Číslo výrazu 6: Láska, zodpovednosť, harmónia. Vaše meno vyjadruje starostlivosť, krásu a službu blízkym.',
  7: 'Číslo výrazu 7: Múdrosť, introspekcia, duchovno. Vaše meno nesie energiu hľadania pravdy a hlbokého pochopenia.',
  8: 'Číslo výrazu 8: Sila, hojnosť, autorita. Vaše meno vyjadruje schopnosť manifestovať a viesť s mocou.',
  9: 'Číslo výrazu 9: Múdrosť, súcit, služba. Vaše meno nesie energiu univerzálnej lásky a dovŕšenia.',
};

const SOUL_DESCRIPTIONS: Record<number, string> = {
  1: 'Číslo duše 1: Vnútorne túžite po nezávislosti a uznaní. Vaša duša chce viesť a byť originálna.',
  2: 'Číslo duše 2: Vnútorne túžite po harmónii, láske a prepojení. Vaša duša hľadá mier a partnera.',
  3: 'Číslo duše 3: Vnútorne túžite po sebavyjadrení a radosti. Vaša duša chce tvoriť a byť videná.',
  4: 'Číslo duše 4: Vnútorne túžite po bezpečí a stabilite. Vaša duša hľadá pevnú pôdu pod nohami.',
  5: 'Číslo duše 5: Vnútorne túžite po slobode a novom. Vaša duša nechce byť obmedzovaná.',
  6: 'Číslo duše 6: Vnútorne túžite po láske a harmónii domova. Vaša duša chce milovať a byť milovaná.',
  7: 'Číslo duše 7: Vnútorne túžite po pochopení a pravde. Vaša duša hľadá zmysel za povrchom.',
  8: 'Číslo duše 8: Vnútorne túžite po uznaní a hojnosti. Vaša duša chce dosiahnuť veľké veci.',
  9: 'Číslo duše 9: Vnútorne túžite po zmysluplnosti a službe. Vaša duša chce pomáhať a inšpirovať.',
};

const PERSONALITY_DESCRIPTIONS: Record<number, string> = {
  1: 'Číslo osobnosti 1: Navonok pôsobíte nezávisle, sebaisto a rozhodne. Ľudia vás vnímajú ako lídra.',
  2: 'Číslo osobnosti 2: Navonok pôsobíte jemne, láskavo a diplomaticky. Ľudia pri vás cítia pokoj.',
  3: 'Číslo osobnosti 3: Navonok pôsobíte živo, kreatívne a spoločensky. Ľudia vás vnímajú ako zábavného.',
  4: 'Číslo osobnosti 4: Navonok pôsobíte spoľahlivo, seriózne a prakticky. Ľudia vám dôverujú.',
  5: 'Číslo osobnosti 5: Navonok pôsobíte dynamicky, atraktívne a slobodne. Ľudia vás vnímajú ako dobrodruha.',
  6: 'Číslo osobnosti 6: Navonok pôsobíte starostlivo, harmonicky a príťažlivo. Ľudia pri vás hľadajú oporu.',
  7: 'Číslo osobnosti 7: Navonok pôsobíte tajomne, múdro a rezervovane. Ľudia vás vnímajú ako hlbokého.',
  8: 'Číslo osobnosti 8: Navonok pôsobíte silne, úspešne a kompetentne. Ľudia vás rešpektujú.',
  9: 'Číslo osobnosti 9: Navonok pôsobíte múdro, láskyplne a inšpiratívne. Ľudia vás vnímajú ako poradcu.',
};

export function calculateNameNumerology(fullName: string): NameNumerologyResult {
  const cleanName = fullName.trim().toLowerCase();
  const letters: { letter: string; value: number; isVowel: boolean }[] = [];

  let vowelSum = 0;
  let consonantSum = 0;
  let totalSum = 0;

  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    if (char === ' ' || char === '-') continue;

    // Handle 'ch' digraph
    let letter = char;
    if (char === 'c' && i + 1 < cleanName.length && cleanName[i + 1] === 'h') {
      letter = 'ch';
      i++;
    }

    const value = getLetterValue(letter);
    if (value === 0) continue;

    const vowel = isVowel(letter);
    letters.push({ letter, value, isVowel: vowel });
    totalSum += value;
    if (vowel) vowelSum += value;
    else consonantSum += value;
  }

  const expressionNumber = reduceToSingle(totalSum, true);
  const soulNumber = reduceToSingle(vowelSum, true);
  const personalityNumber = reduceToSingle(consonantSum, true);

  const exprBase = expressionNumber > 9 ? reduceToSingle(expressionNumber) : expressionNumber;
  const soulBase = soulNumber > 9 ? reduceToSingle(soulNumber) : soulNumber;
  const persBase = personalityNumber > 9 ? reduceToSingle(personalityNumber) : personalityNumber;

  return {
    fullName,
    expressionNumber,
    soulNumber,
    personalityNumber,
    letters,
    expressionDescription: EXPRESSION_DESCRIPTIONS[exprBase] || '',
    soulDescription: SOUL_DESCRIPTIONS[soulBase] || '',
    personalityDescription: PERSONALITY_DESCRIPTIONS[persBase] || '',
  };
}
