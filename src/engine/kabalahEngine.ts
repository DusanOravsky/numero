import type { Language } from '../store/useStore';

export interface Sefira {
  number: number;
  name: string;
  hebrewName: string;
  meaning: string;
  planet: string;
  chakra: number;
  pillar: 'Prísnosť' | 'Milosrdenstvo' | 'Stred' | 'Severity' | 'Mercy' | 'Middle';
  color: string;
  themes: string[];
  shadow: string;
  gift: string;
  action: string;
}

export interface KabalahResult {
  primarySefira: Sefira;
  secondarySefira: Sefira;
  path: string;
  lifeLessons: string[];
  integration: string;
  malchutAction: string;
}

export const SEFIROT: Sefira[] = [
  {
    number: 1,
    name: 'Keter',
    hebrewName: 'כתר',
    meaning: 'Koruna',
    planet: 'Neptún',
    chakra: 7,
    pillar: 'Stred',
    color: '#ffffff',
    themes: ['Jednota', 'Božská vôľa', 'Nekonečno', 'Čisté bytie'],
    shadow: 'Odpojenie od reality, duchovná pýcha',
    gift: 'Prepojenie s vyšším účelom, jednota',
    action: 'Meditácia v tichu – 5 minút bez akéhokoľvek podnetia',
  },
  {
    number: 2,
    name: 'Chokmah',
    hebrewName: 'חכמה',
    meaning: 'Múdrosť',
    planet: 'Urán',
    chakra: 6,
    pillar: 'Milosrdenstvo',
    color: '#6366f1',
    themes: ['Inšpirácia', 'Vízia', 'Impulz', 'Tvorivá sila'],
    shadow: 'Chaos, impulzívnosť, roztržitosť',
    gift: 'Kreatívna iskra, vízia bez limitov',
    action: 'Zapíšte si jednu novú myšlienku bez posudzovania',
  },
  {
    number: 3,
    name: 'Binah',
    hebrewName: 'בינה',
    meaning: 'Porozumenie',
    planet: 'Saturn',
    chakra: 6,
    pillar: 'Prísnosť',
    color: '#1e1b4b',
    themes: ['Štruktúra', 'Forma', 'Hranice', 'Materstvo'],
    shadow: 'Rigidita, prehnaná kontrola, smútok',
    gift: 'Schopnosť dať forme myšlienke, hlboké porozumenie',
    action: 'Vytvorte si jednoduchý plán na zajtra – 3 kroky',
  },
  {
    number: 4,
    name: 'Chesed',
    hebrewName: 'חסד',
    meaning: 'Milosrdenstvo',
    planet: 'Jupiter',
    chakra: 5,
    pillar: 'Milosrdenstvo',
    color: '#3b82f6',
    themes: ['Štedrosť', 'Expanzia', 'Láskavosť', 'Hojnosť'],
    shadow: 'Naivita, prehnaná štedrosť, strata hraníc',
    gift: 'Veľkorysosť ducha, schopnosť dávať',
    action: 'Urobte jeden akt láskavosti bez očakávania návratu',
  },
  {
    number: 5,
    name: 'Geburah',
    hebrewName: 'גבורה',
    meaning: 'Sila',
    planet: 'Mars',
    chakra: 5,
    pillar: 'Prísnosť',
    color: '#ef4444',
    themes: ['Disciplína', 'Hranice', 'Odvaha', 'Spravodlivosť'],
    shadow: 'Krutosť, prísnosť, hnev',
    gift: 'Sila povedať nie, zdravé hranice',
    action: 'Povedzte dnes jedno jasné "nie" tam, kde treba',
  },
  {
    number: 6,
    name: 'Tiferet',
    hebrewName: 'תפארת',
    meaning: 'Krása',
    planet: 'Slnko',
    chakra: 4,
    pillar: 'Stred',
    color: '#f59e0b',
    themes: ['Harmónia', 'Srdce', 'Rovnováha', 'Súcit'],
    shadow: 'Narcizmus, povrchnosť, emocionálna nestabilita',
    gift: 'Autentická krása duše, harmónia protikladov',
    action: 'Nájdite krásu v jednej bežnej veci dnes',
  },
  {
    number: 7,
    name: 'Necach',
    hebrewName: 'נצח',
    meaning: 'Víťazstvo',
    planet: 'Venuša',
    chakra: 3,
    pillar: 'Milosrdenstvo',
    color: '#22c55e',
    themes: ['Vytrvalosť', 'Triumf', 'Vášeň', 'Kreativita'],
    shadow: 'Závislosť, posadnutosť, prehnaná túžba',
    gift: 'Neúnavná vášeň pre život, kreativita',
    action: 'Venujte 10 minút niečomu, čo vás naozaj baví',
  },
  {
    number: 8,
    name: 'Hod',
    hebrewName: 'הוד',
    meaning: 'Sláva',
    planet: 'Merkúr',
    chakra: 3,
    pillar: 'Prísnosť',
    color: '#f97316',
    themes: ['Intelekt', 'Komunikácia', 'Analýza', 'Pokora'],
    shadow: 'Prehnané analyzovanie, cynizmus, chladnosť',
    gift: 'Jasná myseľ, schopnosť komunikovať pravdu',
    action: 'Napíšte si tri veci, za ktoré ste vďační',
  },
  {
    number: 9,
    name: 'Jesod',
    hebrewName: 'יסוד',
    meaning: 'Základ',
    planet: 'Mesiac',
    chakra: 2,
    pillar: 'Stred',
    color: '#a855f7',
    themes: ['Podvedomie', 'Sny', 'Emócie', 'Plodnosť'],
    shadow: 'Ilúzie, nestabilita, sexuálna závislosť',
    gift: 'Hlboké prepojenie s podvedomím, intuícia',
    action: 'Pred spaním si zapíšte jeden sen alebo pocit',
  },
  {
    number: 10,
    name: 'Malchut',
    hebrewName: 'מלכות',
    meaning: 'Kráľovstvo',
    planet: 'Zem',
    chakra: 1,
    pillar: 'Stred',
    color: '#78716c',
    themes: ['Hmota', 'Telo', 'Realita', 'Manifestácia'],
    shadow: 'Materializmus, odpojenie od duchovna, závislosť',
    gift: 'Schopnosť manifestovať, uzemnenosť',
    action: 'Urobte jeden konkrétny krok smerom k vášmu cieľu',
  },
];

export const SEFIROT_EN: Sefira[] = [
  {
    number: 1,
    name: 'Keter',
    hebrewName: 'כתר',
    meaning: 'Crown',
    planet: 'Neptune',
    chakra: 7,
    pillar: 'Middle',
    color: '#ffffff',
    themes: ['Unity', 'Divine Will', 'Infinity', 'Pure Being'],
    shadow: 'Disconnection from reality, spiritual pride',
    gift: 'Connection with higher purpose, unity',
    action: 'Meditation in silence – 5 minutes without any stimulus',
  },
  {
    number: 2,
    name: 'Chokmah',
    hebrewName: 'חכמה',
    meaning: 'Wisdom',
    planet: 'Uranus',
    chakra: 6,
    pillar: 'Mercy',
    color: '#6366f1',
    themes: ['Inspiration', 'Vision', 'Impulse', 'Creative Force'],
    shadow: 'Chaos, impulsivity, scatter',
    gift: 'Creative spark, vision without limits',
    action: 'Write down one new thought without judgment',
  },
  {
    number: 3,
    name: 'Binah',
    hebrewName: 'בינה',
    meaning: 'Understanding',
    planet: 'Saturn',
    chakra: 6,
    pillar: 'Severity',
    color: '#1e1b4b',
    themes: ['Structure', 'Form', 'Boundaries', 'Motherhood'],
    shadow: 'Rigidity, excessive control, grief',
    gift: 'Ability to shape thought, deep understanding',
    action: 'Create a simple plan for tomorrow – 3 steps',
  },
  {
    number: 4,
    name: 'Chesed',
    hebrewName: 'חסד',
    meaning: 'Mercy',
    planet: 'Jupiter',
    chakra: 5,
    pillar: 'Mercy',
    color: '#3b82f6',
    themes: ['Generosity', 'Expansion', 'Kindness', 'Abundance'],
    shadow: 'Naivety, excessive generosity, loss of boundaries',
    gift: 'Generosity of spirit, ability to give',
    action: 'Do one act of kindness without expecting anything in return',
  },
  {
    number: 5,
    name: 'Geburah',
    hebrewName: 'גבורה',
    meaning: 'Strength',
    planet: 'Mars',
    chakra: 5,
    pillar: 'Severity',
    color: '#ef4444',
    themes: ['Discipline', 'Boundaries', 'Courage', 'Justice'],
    shadow: 'Cruelty, harshness, anger',
    gift: 'Strength to say no, healthy boundaries',
    action: 'Say one clear "no" today where needed',
  },
  {
    number: 6,
    name: 'Tiferet',
    hebrewName: 'תפארת',
    meaning: 'Beauty',
    planet: 'Sun',
    chakra: 4,
    pillar: 'Middle',
    color: '#f59e0b',
    themes: ['Harmony', 'Heart', 'Balance', 'Compassion'],
    shadow: 'Narcissism, superficiality, emotional instability',
    gift: 'Authentic beauty of the soul, harmony of opposites',
    action: 'Find beauty in one ordinary thing today',
  },
  {
    number: 7,
    name: 'Necach',
    hebrewName: 'נצח',
    meaning: 'Victory',
    planet: 'Venus',
    chakra: 3,
    pillar: 'Mercy',
    color: '#22c55e',
    themes: ['Persistence', 'Triumph', 'Passion', 'Creativity'],
    shadow: 'Addiction, obsession, excessive desire',
    gift: 'Tireless passion for life, creativity',
    action: 'Spend 10 minutes on something you truly enjoy',
  },
  {
    number: 8,
    name: 'Hod',
    hebrewName: 'הוד',
    meaning: 'Glory',
    planet: 'Mercury',
    chakra: 3,
    pillar: 'Severity',
    color: '#f97316',
    themes: ['Intellect', 'Communication', 'Analysis', 'Humility'],
    shadow: 'Over-analysis, cynicism, coldness',
    gift: 'Clear mind, ability to communicate truth',
    action: 'Write three things you are grateful for',
  },
  {
    number: 9,
    name: 'Jesod',
    hebrewName: 'יסוד',
    meaning: 'Foundation',
    planet: 'Moon',
    chakra: 2,
    pillar: 'Middle',
    color: '#a855f7',
    themes: ['Subconscious', 'Dreams', 'Emotions', 'Fertility'],
    shadow: 'Illusions, instability, sexual addiction',
    gift: 'Deep connection with the subconscious, intuition',
    action: 'Before sleep, write down one dream or feeling',
  },
  {
    number: 10,
    name: 'Malchut',
    hebrewName: 'מלכות',
    meaning: 'Kingdom',
    planet: 'Earth',
    chakra: 1,
    pillar: 'Middle',
    color: '#78716c',
    themes: ['Matter', 'Body', 'Reality', 'Manifestation'],
    shadow: 'Materialism, disconnection from spirituality, addiction',
    gift: 'Ability to manifest, groundedness',
    action: 'Take one concrete step toward your goal',
  },
];

function reduceForSefira(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return Math.min(n, 9);
}

export function calculateKabalah(lifePathNumber: number, dayNumber: number, lang: Language = 'sk'): KabalahResult {
  const primaryIndex = reduceForSefira(lifePathNumber);
  const secondaryIndex = reduceForSefira(dayNumber);

  const sefirot = lang === 'sk' ? SEFIROT : SEFIROT_EN;
  const primarySefira = sefirot[primaryIndex - 1] || sefirot[0];
  const secondarySefira = sefirot[secondaryIndex - 1] || sefirot[0];

  let path: string;
  let lifeLessons: string[];
  let integration: string;

  if (lang === 'sk') {
    path = `Cesta z ${primarySefira.name} cez ${secondarySefira.name} do Malchut`;

    lifeLessons = [
      `Integrácia ${primarySefira.meaning} – ${primarySefira.themes[0]}`,
      `Práca s tieňom: ${primarySefira.shadow}`,
      `Rozvoj daru: ${primarySefira.gift}`,
      `Sekundárna lekcia: ${secondarySefira.themes[1] || secondarySefira.themes[0]}`,
    ];

    integration = `Vaša duša sa učí spájať energiu ${primarySefira.name} (${primarySefira.meaning}) s praktickým prejavom v ${SEFIROT[9].name} (${SEFIROT[9].meaning}). Kľúčom je rovnováha medzi ${primarySefira.pillar === 'Prísnosť' ? 'disciplínou a milosrdenstvom' : primarySefira.pillar === 'Milosrdenstvo' ? 'štedrosťou a hranicami' : 'vyšším a nižším'}.`;
  } else {
    path = `Path from ${primarySefira.name} through ${secondarySefira.name} to Malchut`;

    lifeLessons = [
      `Integration of ${primarySefira.meaning} – ${primarySefira.themes[0]}`,
      `Working with shadow: ${primarySefira.shadow}`,
      `Developing gift: ${primarySefira.gift}`,
      `Secondary lesson: ${secondarySefira.themes[1] || secondarySefira.themes[0]}`,
    ];

    integration = `Your soul is learning to connect the energy of ${primarySefira.name} (${primarySefira.meaning}) with practical manifestation in ${SEFIROT_EN[9].name} (${SEFIROT_EN[9].meaning}). The key is balance between ${primarySefira.pillar === 'Severity' ? 'discipline and mercy' : primarySefira.pillar === 'Mercy' ? 'generosity and boundaries' : 'higher and lower'}.`;
  }

  const malchutAction = primarySefira.action;

  return {
    primarySefira,
    secondarySefira,
    path,
    lifeLessons,
    integration,
    malchutAction,
  };
}
