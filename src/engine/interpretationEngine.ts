import type { NumerologyResult } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';
import type { HumanDesignResult } from './humanDesignEngine';
import type { ChakraState } from './chakraEngine';
import type { KabalahResult } from './kabalahEngine';
import type { ThetaHealingResult } from './thetaHealingEngine';

export interface InterpretationTheme {
  theme: string;
  weight: number;
  sources: string[];
  description: string;
}

export interface DailyGuidance {
  mainTheme: string;
  affirmation: string;
  question: string;
  consciousStep: string;
  bodyRecommendation: string;
  relationshipTip: string;
  ritual: string;
}

export interface FullInterpretation {
  mainLifeTheme: string;
  currentLesson: string;
  emotionalFocus: string;
  relationshipDynamic: string;
  todayRecommendation: string;
  themes: InterpretationTheme[];
  dailyGuidance: DailyGuidance;
  gift: string;
  shadow: string;
  question: string;
  miniStep: string;
}

interface PatternMatch {
  condition: boolean;
  theme: string;
  weight: number;
  source: string;
  description: string;
}

export function generateInterpretation(
  numerology: NumerologyResult,
  astrology?: AstrologyResult,
  humanDesign?: HumanDesignResult,
  chakras?: ChakraState[],
  kabalah?: KabalahResult,
  theta?: ThetaHealingResult
): FullInterpretation {
  const themes: InterpretationTheme[] = [];

  const patterns: PatternMatch[] = [
    {
      condition: numerology.lifePathNumber === 7 && humanDesign?.type === 'Projektor',
      theme: 'Hlboké vnútorné vedenie',
      weight: 8,
      source: 'Numerológia + HD',
      description: 'Kombinácia introspektívneho životného čísla 7 s typom Projektor naznačuje, že vaša sila spočíva v hlbokom pozorovaní a vedení cez múdrosť, nie akciu.',
    },
    {
      condition: numerology.lifePathNumber === 1 && humanDesign?.type === 'Manifestor',
      theme: 'Prirodzený líder',
      weight: 9,
      source: 'Numerológia + HD',
      description: 'Životné číslo 1 a typ Manifestor vytvárajú silnú energiu priekopníka a iniciátora.',
    },
    {
      condition: numerology.isolatedNumbers.length > 0,
      theme: 'Integrácia izolovaných energií',
      weight: 6,
      source: 'Numerológia',
      description: `Izolované čísla (${numerology.isolatedNumbers.join(', ')}) naznačujú oblasti, kde potrebujete vedomú pozornosť a integráciu.`,
    },
    {
      condition: numerology.emptyPlanes.length > 2,
      theme: 'Viacero prázdnych rovín',
      weight: 7,
      source: 'Numerológia',
      description: 'Prázdne roviny nie sú slabosťou – sú priestorom pre rast a učenie. Venujte im pozornosť.',
    },
    {
      condition: astrology?.dominantElement === 'Voda',
      theme: 'Emočná hĺbka',
      weight: 6,
      source: 'Astrológia',
      description: 'Dominantný vodný živel prináša hlbokú emocionalitu, intuíciu a empatiu.',
    },
    {
      condition: astrology?.dominantElement === 'Oheň',
      theme: 'Tvorivá sila',
      weight: 6,
      source: 'Astrológia',
      description: 'Dominantný ohnivý živel prináša vášeň, energiu a tvorivú silu.',
    },
    {
      condition: astrology?.dominantElement === 'Zem',
      theme: 'Praktická stabilita',
      weight: 6,
      source: 'Astrológia',
      description: 'Dominantný zemský živel prináša stabilitu, pragmatizmus a spoľahlivosť.',
    },
    {
      condition: astrology?.dominantElement === 'Vzduch',
      theme: 'Intelektuálna sloboda',
      weight: 6,
      source: 'Astrológia',
      description: 'Dominantný vzdušný živel prináša intelektuálnu hĺbku, komunikačný talent a slobodomyseľnosť.',
    },
    {
      condition: humanDesign?.openCenters.includes('G centrum'),
      theme: 'Hľadanie identity',
      weight: 7,
      source: 'Human Design',
      description: 'Otvorené G centrum naznačuje flexibilnú identitu – vaša cesta je o objavovaní, kto naozaj ste.',
    },
    {
      condition: humanDesign?.openCenters.includes('Solárny plexus'),
      theme: 'Emočná citlivosť k okoliu',
      weight: 5,
      source: 'Human Design',
      description: 'Otvorený Solárny plexus znamená, že absorbujete emócie okolia. Učte sa rozlišovať, čo je vaše.',
    },
    {
      condition: humanDesign?.openCenters.includes('Sakrálne'),
      theme: 'Práca s energiou',
      weight: 6,
      source: 'Human Design',
      description: 'Otvorené Sakrálne centrum vás učí poznať, kedy máte dosť energie a kedy odpočívať.',
    },
    {
      condition: (chakras?.filter(c => c.status === 'blocked').length || 0) >= 3,
      theme: 'Energetická blokáda',
      weight: 7,
      source: 'Čakry',
      description: 'Viacero blokovaných čakier naznačuje potrebu celostného uvoľnenia a sebapéče.',
    },
    {
      condition: numerology.lifePathNumber === 4 && astrology?.dominantPlanet === 'Saturn',
      theme: 'Disciplína a štruktúra',
      weight: 8,
      source: 'Numerológia + Astrológia',
      description: 'Životné číslo 4 so Saturnom ako dominantnou planétou zdôrazňuje lekcie o disciplíne, hraniciach a trpezlivosti.',
    },
    {
      condition: numerology.orv >= 7,
      theme: 'Rok introspekcie',
      weight: 5,
      source: 'Vibrácie',
      description: 'Vysoká osobná ročná vibrácia naznačuje rok vnútorného rastu a reflexie.',
    },
    {
      condition: numerology.orv <= 3,
      theme: 'Rok nových začiatkov',
      weight: 5,
      source: 'Vibrácie',
      description: 'Nízka ORV naznačuje rok nových príležitostí a aktívneho budovania.',
    },
  ];

  patterns.forEach(p => {
    if (p.condition) {
      themes.push({
        theme: p.theme,
        weight: p.weight,
        sources: [p.source],
        description: p.description,
      });
    }
  });

  themes.sort((a, b) => b.weight - a.weight);

  const mainLifeTheme = themes.length > 0 ? themes[0].theme : getDefaultLifeTheme(numerology.lifePathNumber);
  const currentLesson = getCurrentLesson(numerology.orv);
  const emotionalFocus = getEmotionalFocus(numerology, chakras);
  const relationshipDynamic = getRelationshipDynamic(numerology);
  const todayRecommendation = getTodayRecommendation(numerology.odv);

  const dailyGuidance = generateDailyGuidance(numerology, astrology, humanDesign);

  const { gift, shadow } = getGiftAndShadow(numerology.lifePathNumber);

  return {
    mainLifeTheme,
    currentLesson,
    emotionalFocus,
    relationshipDynamic,
    todayRecommendation,
    themes,
    dailyGuidance,
    gift,
    shadow,
    question: getReflectionQuestion(numerology.lifePathNumber),
    miniStep: getMiniStep(numerology.odv),
  };
}

function generateDailyGuidance(
  numerology: NumerologyResult,
  astrology?: AstrologyResult,
  humanDesign?: HumanDesignResult
): DailyGuidance {
  const odv = numerology.odv;

  const affirmations: Record<number, string> = {
    1: 'Dnes vedem s odvahou a jasnosťou.',
    2: 'Dnes som otvorený/á prepojeniu a spolupráci.',
    3: 'Dnes sa slobodne vyjadrujem a tvorím.',
    4: 'Dnes budujem pevné základy s trpezlivosťou.',
    5: 'Dnes vítam zmeny s dôverou.',
    6: 'Dnes milujem a starám sa – aj o seba.',
    7: 'Dnes počúvam svoju vnútornú múdrosť.',
    8: 'Dnes som v súlade so svojou silou.',
    9: 'Dnes som súčasťou väčšieho celku.',
  };

  const questions: Record<number, string> = {
    1: 'Kde dnes môžem prevziať zodpovednosť za svoj smer?',
    2: 'Komu dnes môžem naozaj načúvať?',
    3: 'Čo si dnes zaslúži byť vyjadrené?',
    4: 'Aký jeden krok dnes posilní moje základy?',
    5: 'Čoho sa môžem dnes oslobodiť?',
    6: 'Kde dnes potrebujem rovnováhu medzi dávaním a prijímaním?',
    7: 'Čo mi dnes hovorí moje ticho?',
    8: 'Kde dnes môžem použiť svoju silu pre dobro?',
    9: 'Čo dnes môžem dokončiť alebo pustiť?',
  };

  const bodyRecs: Record<number, string> = {
    1: 'Ranné cvičenie – aktivujte telo a myseľ',
    2: 'Jemné strečovanie a hlboké dýchanie',
    3: 'Tanec alebo akýkoľvek pohyb s radosťou',
    4: 'Prechádzka v prírode, kontakt so zemou',
    5: 'Nová forma pohybu – skúste niečo nové',
    6: 'Jóga alebo relaxačná masáž',
    7: 'Meditácia a oddych pre myseľ',
    8: 'Silový tréning alebo plávanie',
    9: 'Vedomé dýchanie a chôdza v prírode',
  };

  return {
    mainTheme: getODVTheme(odv),
    affirmation: affirmations[odv] || affirmations[1],
    question: questions[odv] || questions[1],
    consciousStep: getMiniStep(odv),
    bodyRecommendation: bodyRecs[odv] || bodyRecs[1],
    relationshipTip: getRelationshipTip(odv),
    ritual: getDailyRitual(odv, astrology, humanDesign),
  };
}

function getDefaultLifeTheme(lp: number): string {
  const themes: Record<number, string> = {
    1: 'Vodcovstvo a nezávislosť',
    2: 'Spolupráca a harmónia',
    3: 'Tvorivosť a sebavyjadrenie',
    4: 'Stabilita a budovanie',
    5: 'Sloboda a zmena',
    6: 'Láska a zodpovednosť',
    7: 'Múdrosť a introspekcia',
    8: 'Sila a hojnosť',
    9: 'Služba a dovŕšenie',
  };
  return themes[lp] || 'Osobný rast';
}

function getCurrentLesson(orv: number): string {
  const lessons: Record<number, string> = {
    1: 'Nové začiatky – čas zasievať semienka',
    2: 'Trpezlivosť – čas budovať vzťahy',
    3: 'Sebavyjadrenie – čas tvoriť',
    4: 'Stabilita – čas pracovať na základoch',
    5: 'Zmena – čas pustiť staré',
    6: 'Zodpovednosť – čas starať sa',
    7: 'Introspekcia – čas ísť dovnútra',
    8: 'Manifestácia – čas zbierať plody',
    9: 'Dokončenie – čas uzatvárať cykly',
  };
  return lessons[orv] || 'Osobný rast';
}

function getEmotionalFocus(numerology: NumerologyResult, chakras?: ChakraState[]): string {
  if (chakras) {
    const blocked = chakras.filter(c => c.status === 'blocked');
    if (blocked.length > 0) {
      return `Pozornosť na: ${blocked[0].chakra.themes[0]}`;
    }
  }
  if (numerology.isolatedNumbers.length > 0) {
    return `Integrácia izolovanej energie čísla ${numerology.isolatedNumbers[0]}`;
  }
  return 'Vnútorná harmónia a prítomnosť';
}

function getRelationshipDynamic(numerology: NumerologyResult): string {
  const topLang = numerology.loveLanguages[0];
  return topLang ? `Primárny jazyk lásky: ${topLang.language}` : 'Rovnováha dávania a prijímania';
}

function getTodayRecommendation(odv: number): string {
  const recs: Record<number, string> = {
    1: 'Začnite niečo nové – aj malý krok sa počíta',
    2: 'Prepojte sa s niekým blízkym',
    3: 'Vyjadrite sa – píšte, maľujte, hovorte',
    4: 'Dokončite jednu rozrobenú vec',
    5: 'Urobte niečo mimo rutiny',
    6: 'Venujte čas blízkym – vrátane seba',
    7: 'Nájdite ticho a počúvajte',
    8: 'Urobte rozhodnutie, ktoré ste odkladali',
    9: 'Pustite niečo, čo už neslúži',
  };
  return recs[odv] || 'Buďte prítomní v tomto momente';
}

function getODVTheme(odv: number): string {
  const themes: Record<number, string> = {
    1: 'Nová energia a iniciatíva',
    2: 'Spolupráca a diplomacia',
    3: 'Kreativita a radosť',
    4: 'Práca a organizácia',
    5: 'Sloboda a dobrodružstvo',
    6: 'Domov a harmónia',
    7: 'Reflexia a múdrosť',
    8: 'Sila a rozhodnosť',
    9: 'Zavŕšenie a súcit',
  };
  return themes[odv] || 'Prítomnosť';
}

function getRelationshipTip(odv: number): string {
  const tips: Record<number, string> = {
    1: 'Buďte jasní v tom, čo potrebujete',
    2: 'Počúvajte viac, než hovoríte',
    3: 'Zdieľajte radosť s partnerom/priateľmi',
    4: 'Vytvorte spoločný plán alebo rutinu',
    5: 'Dovoľte slobodu – sebe aj druhým',
    6: 'Ukážte lásku konkrétnym skutkom',
    7: 'Dajte priestor – sebe aj blízkym',
    8: 'Buďte veľkorysí a zároveň čestní',
    9: 'Odpustite – sebe alebo niekomu inému',
  };
  return tips[odv] || 'Buďte autentickí';
}

function getDailyRitual(odv: number, _astrology?: AstrologyResult, _humanDesign?: HumanDesignResult): string {
  const rituals: Record<number, string> = {
    1: '5 minút vizualizácie: Predstavte si, ako vyzerá váš ideálny deň',
    2: 'Napíšte správu niekomu blízkemu – len tak',
    3: '10 minút voľného písania alebo kreslenia',
    4: 'Upracte jeden priestor – fyzický alebo mentálny',
    5: 'Urobte niečo spontánne – choďte inou cestou',
    6: 'Pripravte si niečo dobré – jedlo, čaj, kúpeľ',
    7: '7 minút meditácie v tichu',
    8: 'Zapíšte si 3 úspechy z posledného týždňa',
    9: 'Napíšte, za čo ste vďační, a pusťte jednu vec',
  };
  return rituals[odv] || 'Dýchajte vedome po 3 minúty';
}

function getMiniStep(odv: number): string {
  const steps: Record<number, string> = {
    1: 'Urobte prvý krok k niečomu novému',
    2: 'Opýtajte sa niekoho: "Ako sa máš?"',
    3: 'Stvorte niečo – hoci len jednu vetu',
    4: 'Dokončite jednu malú úlohu',
    5: 'Povedzte áno niečomu nezvyčajnému',
    6: 'Urobte jeden láskavý skutok',
    7: 'Posaďte sa na 5 minút v tichu',
    8: 'Rozhodnite sa o jednej veci',
    9: 'Pustite jednu vec, ktorá vám už neslúži',
  };
  return steps[odv] || 'Jednoducho dýchajte';
}

function getGiftAndShadow(lp: number): { gift: string; shadow: string } {
  const data: Record<number, { gift: string; shadow: string }> = {
    1: { gift: 'Odvaha ísť vlastnou cestou, schopnosť viesť a inšpirovať', shadow: 'Izolácia, nadmerná kontrola, strach zo závislosti' },
    2: { gift: 'Empatia, diplomacia, schopnosť vytvárať harmóniu', shadow: 'Strata seba v iných, nerozhodnosť, závislosť' },
    3: { gift: 'Kreativita, radosť, schopnosť inšpirovať a zabávať', shadow: 'Povrchnosť, rozptýlenosť, strach z hĺbky' },
    4: { gift: 'Spoľahlivosť, systematickosť, schopnosť budovať', shadow: 'Rigidita, strach zo zmeny, workoholizmus' },
    5: { gift: 'Adaptabilita, sloboda, schopnosť inšpirovať zmeny', shadow: 'Nestálosť, závislosť, útek pred zodpovednosťou' },
    6: { gift: 'Bezpodmienečná láska, starostlivosť, zmysel pre krásu', shadow: 'Kontrola cez starostlivosť, perfekcionizmus, obetovanie' },
    7: { gift: 'Múdrosť, intuícia, hlboké pochopenie reality', shadow: 'Izolácia, cynizmus, nedôvera, intelektualizácia emócií' },
    8: { gift: 'Sila, hojnosť, schopnosť manifestovať víziu', shadow: 'Manipulácia, posadnutosť mocou, materializmus' },
    9: { gift: 'Súcit, múdrosť, schopnosť vidieť celok', shadow: 'Nadradennosť, únik z reality, neschopnosť pustiť' },
  };
  return data[lp] || { gift: 'Unikátne dary', shadow: 'Oblasti rastu' };
}

function getReflectionQuestion(lp: number): string {
  const questions: Record<number, string> = {
    1: 'Čo by som urobil/a, keby som sa nebál/a?',
    2: 'Kde dnes potrebujem rovnováhu?',
    3: 'Čo by som stvoril/a, keby nikto neposudzoval?',
    4: 'Aký základ dnes budujem pre zajtrajšok?',
    5: 'Čo ma volá za hranice môjho komfortu?',
    6: 'Komu dnes môžem dať lásku – vrátane seba?',
    7: 'Čo mi hovorí moje ticho, keď naozaj počúvam?',
    8: 'Kde môžem svoju silu použiť pre najväčšie dobro?',
    9: 'Čo je čas pustiť, aby mohlo prísť nové?',
  };
  return questions[lp] || 'Kto som, keď odložím všetky masky?';
}
