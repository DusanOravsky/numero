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
  /** Najčastejšie sa opakujúce číslo v mene — vrodená vášeň. */
  hiddenPassion: { number: number; count: number; description: string };
  /** Čísla 1-9 ktoré v mene nie sú zastúpené ani raz — karmické lekcie. */
  karmicLessons: { number: number; description: string }[];
  /** Prvé písmeno celého mena — uhol pohľadu na začiatky. */
  cornerstone: { letter: string; value: number; description: string } | null;
  /** Posledné písmeno celého mena — postoj k dokončeniu. */
  capstone: { letter: string; value: number; description: string } | null;
  /** Prvá samohláska — okamžitá emocionálna reakcia. */
  firstVowel: { letter: string; value: number; description: string } | null;
  /** Balance number — súčet iniciál (prvých písmen každého slova mena). */
  balanceNumber: { value: number; initials: string; description: string };
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

const BALANCE_DESCRIPTIONS: Record<number, string> = {
  1: 'Balance 1: Pri strese sa stávate samostatnejším a iniciatívnejším. Nájdite rovnováhu cez jednanie a rozhodovanie.',
  2: 'Balance 2: Pri strese hľadáte spoluprácu a podporu. Nájdite rovnováhu cez tichu trpezlivosť a partnerstvo.',
  3: 'Balance 3: Pri strese sa potrebujete vyjadriť, tvoriť alebo zabaviť. Nájdite rovnováhu cez kreativitu a optimizmus.',
  4: 'Balance 4: Pri strese hľadáte poriadok, rutinu a praktické riešenia. Nájdite rovnováhu cez disciplínu a prácu.',
  5: 'Balance 5: Pri strese potrebujete pohyb, zmenu, slobodu. Nájdite rovnováhu cez nové skúsenosti a flexibilitu.',
  6: 'Balance 6: Pri strese sa obraciate ku rodine, domovu a blízkym. Nájdite rovnováhu cez starostlivosť a harmóniu.',
  7: 'Balance 7: Pri strese potrebujete samotu, ticho, introspekciu. Nájdite rovnováhu cez meditáciu a štúdium.',
  8: 'Balance 8: Pri strese chcete kontrolu a manifestáciu. Nájdite rovnováhu cez praktické rozhodnutia a hojnosť.',
  9: 'Balance 9: Pri strese sa obraciate k službe iným a väčšiemu zmyslu. Nájdite rovnováhu cez súcit a univerzálnu lásku.',
};

const HIDDEN_PASSION_DESCRIPTIONS: Record<number, string> = {
  1: 'Hidden Passion 1: Vrodená potreba viesť, byť prvý a originálny. V mene najsilnejšie vibruje energia nezávislosti.',
  2: 'Hidden Passion 2: Vrodená potreba spolupráce, harmónie a citlivosti. V mene dominuje energia partnerstva.',
  3: 'Hidden Passion 3: Vrodená potreba vyjadriť sa, tvoriť a komunikovať. V mene dominuje energia kreativity.',
  4: 'Hidden Passion 4: Vrodená potreba budovať, organizovať a vytvárať poriadok. V mene dominuje energia stability.',
  5: 'Hidden Passion 5: Vrodená potreba slobody, zmeny a pohybu. V mene dominuje energia dobrodružstva.',
  6: 'Hidden Passion 6: Vrodená potreba milovať, slúžiť a starať sa. V mene dominuje energia rodiny a harmónie.',
  7: 'Hidden Passion 7: Vrodená potreba hĺbky, štúdia a osamotenia. V mene dominuje energia múdrosti a introspekcie.',
  8: 'Hidden Passion 8: Vrodená potreba úspechu, autority a hojnosti. V mene dominuje energia moci.',
  9: 'Hidden Passion 9: Vrodená potreba slúžiť ľudstvu, byť humanista. V mene dominuje energia univerzálnej lásky.',
};

const KARMIC_LESSON_DESCRIPTIONS: Record<number, string> = {
  1: 'Karmická lekcia 1: V mene chýba 1 — naučte sa byť nezávislí, postaviť sa za seba a iniciovať. Tendencia spoliehať sa na druhých.',
  2: 'Karmická lekcia 2: V mene chýba 2 — naučte sa spolupracovať, byť trpezlivý a citlivý k druhým. Tendencia konať príliš sólovo.',
  3: 'Karmická lekcia 3: V mene chýba 3 — naučte sa vyjadriť sa, byť kreatívny a optimistický. Tendencia k pesimizmu a uzavretosti.',
  4: 'Karmická lekcia 4: V mene chýba 4 — naučte sa disciplíne, organizácii a vytrvalosti. Tendencia k chaosu a nedokončovaniu.',
  5: 'Karmická lekcia 5: V mene chýba 5 — naučte sa byť flexibilný, prijať zmenu a slobodu. Tendencia k rigidite.',
  6: 'Karmická lekcia 6: V mene chýba 6 — naučte sa zodpovednosti za vzťahy, domov a rodinu. Tendencia uniknúť záväzkom.',
  7: 'Karmická lekcia 7: V mene chýba 7 — naučte sa hľadať vnútornú múdrosť, dôverovať intuícii. Tendencia k povrchnosti.',
  8: 'Karmická lekcia 8: V mene chýba 8 — naučte sa narábať s mocou, peniazmi a autoritou. Tendencia k podceňovaniu vlastnej hodnoty.',
  9: 'Karmická lekcia 9: V mene chýba 9 — naučte sa nezištnosti, súcitu a univerzálnej lásky. Tendencia byť sebecký.',
};

const CORNERSTONE_DESCRIPTIONS: Record<string, string> = {
  a: 'A — sebadôvera, líder, nezávislosť. Začínate veci s istotou.',
  b: 'B — citlivosť, intuícia, vnútorný svet. Začiatky zvažujete v tichu.',
  c: 'C — komunikácia, optimizmus, kreativita. Začínate s nadšením.',
  d: 'D — praktickosť, zodpovednosť, disciplína. Začínate metodicky.',
  e: 'E — sloboda, dobrodružstvo, mnohostrannosť. Začiatky sú dynamické.',
  f: 'F — zodpovednosť, starostlivosť, harmónia. Začínate s láskou.',
  g: 'G — introspekcia, hĺbka, perfekcionizmus. Začínate analyticky.',
  h: 'H — ambícia, hojnosť, sila. Začínate s víziou úspechu.',
  i: 'I — citlivosť, intuícia, idealizmus. Začiatky sú emocionálne.',
  j: 'J — sebadôvera, vodcovstvo. Začínate odhodlane.',
  k: 'K — vízia, intuícia, charizma (master 11). Začínate inšpiratívne.',
  l: 'L — vyjadrenie, kreativita, optimizmus. Začínate hovorením.',
  m: 'M — práca, štruktúra, vytrvalosť. Začínate dôkladne.',
  n: 'N — kreativita, sebavyjadrenie. Začínate tvorivo.',
  o: 'O — emocionálnosť, hĺbka, mystérium. Začiatky majú silu.',
  p: 'P — múdrosť, introspekcia, štúdium. Začínate s analýzou.',
  q: 'Q — autorita, originálnosť. Začínate nekonvenčne.',
  r: 'R — humanizmus, súcit, intenzita. Začínate so silným cítením.',
  s: 'S — emocionálnosť, dramatickosť. Začiatky sú intenzívne.',
  t: 'T — partnerstvo, spolupráca. Začiatky závisia od druhých.',
  u: 'U — tvorivosť, slobodyživost. Začiatky sú často improvizované.',
  v: 'V — vízia, master energia (master 22). Začiatky majú veľký potenciál.',
  w: 'W — komunikácia, kreativita, sociálnosť. Začínate v skupine.',
  x: 'X — tajomnosť, sila. Začiatky sú nečakané.',
  y: 'y — intuícia, váhanie. Začiatky sú reflektívne.',
  z: 'Z — múdrosť, optimizmus, plnosť. Začínate s celistvosťou.',
};

const CAPSTONE_DESCRIPTIONS: Record<string, string> = {
  a: 'A — končíte s istotou a líderstvom.',
  b: 'B — končíte v ústraní, sústredene.',
  c: 'C — končíte s nadšením a optimizmom.',
  d: 'D — končíte zodpovedne a dôkladne.',
  e: 'E — končíte slobodne, často hľadáte ďalšiu cestu.',
  f: 'F — končíte starostlivo a s ohľadom na ostatných.',
  g: 'G — končíte introspektívne a s hĺbkou.',
  h: 'H — končíte s ambíciou ďalej rásť.',
  i: 'I — končíte emocionálne, s citom.',
  j: 'J — končíte odhodlane.',
  k: 'K — končíte inšpiratívne.',
  l: 'L — končíte vyjadrením a komunikáciou.',
  m: 'M — končíte stabilne, vybudované.',
  n: 'N — končíte tvorivo.',
  o: 'O — končíte emocionálne hlboko.',
  p: 'P — končíte múdro a uvážlivo.',
  q: 'Q — končíte unikátne, autoritatívne.',
  r: 'R — končíte súcitne a humanisticky.',
  s: 'S — končíte intenzívne, dramaticky.',
  t: 'T — končíte v partnerstve.',
  u: 'U — končíte uvoľnene, otvorene.',
  v: 'V — končíte s veľkou víziou (master 22).',
  w: 'W — končíte spoločensky.',
  x: 'X — končíte nečakane.',
  y: 'y — končíte reflektívne, váhavo.',
  z: 'Z — končíte s múdrosťou a celistvosťou.',
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
  if (!cleanName) {
    return { expressionNumber: 0, soulNumber: 0, personalityNumber: 0, letters: [], hiddenPassion: null, karmicLessons: [1,2,3,4,5,6,7,8,9], maturityNumber: 0, cornerstone: '', capstone: '', expressionDescription: '', soulDescription: '', personalityDescription: '', cornerstoneDescription: '', capstoneDescription: '' };
  }
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

  // Hidden Passion: najfrekventovanejšie číslo 1-9 z hodnôt písmen.
  // Karmic Lessons: čísla 1-9 ktoré v mene nie sú zastúpené ani raz.
  const numberCounts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) numberCounts[i] = 0;
  letters.forEach(l => { numberCounts[l.value] = (numberCounts[l.value] || 0) + 1; });
  const maxCount = Math.max(...Object.values(numberCounts));
  // Ak je maxCount === 0 (prázdne meno), Hidden Passion = 0 — fallback.
  let hiddenPassionNum = 0;
  for (let i = 1; i <= 9; i++) {
    if (numberCounts[i] === maxCount && maxCount > 0) { hiddenPassionNum = i; break; }
  }
  const karmicLessons = [];
  for (let i = 1; i <= 9; i++) {
    if (numberCounts[i] === 0) {
      karmicLessons.push({ number: i, description: KARMIC_LESSON_DESCRIPTIONS[i] });
    }
  }

  // Cornerstone (prvé písmeno) a Capstone (posledné) celého mena.
  const firstLetter = letters[0]?.letter || '';
  const lastLetter = letters[letters.length - 1]?.letter || '';
  const firstVowelEntry = letters.find(l => l.isVowel);

  // Balance number — súčet iniciál (prvých písmen každého slova mena oddelených medzerou alebo pomlčkou).
  const words = cleanName.split(/[\s-]+/).filter(Boolean);
  const initialLetters: string[] = [];
  let balanceSum = 0;
  for (const word of words) {
    // pre prvý znak skontrolujeme aj 'ch' digraf
    let init = word[0];
    if (init === 'c' && word[1] === 'h') init = 'ch';
    const v = getLetterValue(init);
    if (v > 0) {
      initialLetters.push(init);
      balanceSum += v;
    }
  }
  const balanceReduced = balanceSum > 0 ? reduceToSingle(balanceSum) : 0;

  return {
    fullName,
    expressionNumber,
    soulNumber,
    personalityNumber,
    letters,
    expressionDescription: EXPRESSION_DESCRIPTIONS[exprBase] || '',
    soulDescription: SOUL_DESCRIPTIONS[soulBase] || '',
    personalityDescription: PERSONALITY_DESCRIPTIONS[persBase] || '',
    hiddenPassion: {
      number: hiddenPassionNum,
      count: maxCount,
      description: hiddenPassionNum > 0 ? HIDDEN_PASSION_DESCRIPTIONS[hiddenPassionNum] : '',
    },
    karmicLessons,
    cornerstone: firstLetter
      ? {
          letter: firstLetter,
          value: getLetterValue(firstLetter),
          description: CORNERSTONE_DESCRIPTIONS[firstLetter] || `${firstLetter.toUpperCase()} — unikátna začiatočná energia.`,
        }
      : null,
    capstone: lastLetter
      ? {
          letter: lastLetter,
          value: getLetterValue(lastLetter),
          description: CAPSTONE_DESCRIPTIONS[lastLetter] || `${lastLetter.toUpperCase()} — unikátna končiaca energia.`,
        }
      : null,
    firstVowel: firstVowelEntry
      ? {
          letter: firstVowelEntry.letter,
          value: firstVowelEntry.value,
          description: `Prvá samohláska "${firstVowelEntry.letter.toUpperCase()}" (hodnota ${firstVowelEntry.value}) — okamžitá emocionálna reakcia: ${SOUL_DESCRIPTIONS[firstVowelEntry.value > 9 ? reduceToSingle(firstVowelEntry.value) : firstVowelEntry.value] || ''}`,
        }
      : null,
    balanceNumber: {
      value: balanceReduced,
      initials: initialLetters.map(l => l.toUpperCase()).join('. '),
      description: balanceReduced > 0 ? BALANCE_DESCRIPTIONS[balanceReduced] || '' : '',
    },
  };
}
