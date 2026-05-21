export interface Sefira {
  number: number;
  name: string;
  hebrewName: string;
  meaning: string;
  planet: string;
  chakra: number;
  pillar: 'Prísnosť' | 'Milosrdenstvo' | 'Stred';
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

function reduceForSefira(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return Math.min(n, 9);
}

export function calculateKabalah(lifePathNumber: number, dayNumber: number): KabalahResult {
  const primaryIndex = reduceForSefira(lifePathNumber);
  const secondaryIndex = reduceForSefira(dayNumber);

  const primarySefira = SEFIROT[primaryIndex - 1] || SEFIROT[0];
  const secondarySefira = SEFIROT[secondaryIndex - 1] || SEFIROT[0];

  const path = `Cesta z ${primarySefira.name} cez ${secondarySefira.name} do Malchut`;

  const lifeLessons = [
    `Integrácia ${primarySefira.meaning} – ${primarySefira.themes[0]}`,
    `Práca s tieňom: ${primarySefira.shadow}`,
    `Rozvoj daru: ${primarySefira.gift}`,
    `Sekundárna lekcia: ${secondarySefira.themes[1] || secondarySefira.themes[0]}`,
  ];

  const integration = `Vaša duša sa učí spájať energiu ${primarySefira.name} (${primarySefira.meaning}) s praktickým prejavom v ${SEFIROT[9].name} (${SEFIROT[9].meaning}). Kľúčom je rovnováha medzi ${primarySefira.pillar === 'Prísnosť' ? 'disciplínou a milosrdenstvom' : primarySefira.pillar === 'Milosrdenstvo' ? 'štedrosťou a hranicami' : 'vyšším a nižším'}.`;

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
