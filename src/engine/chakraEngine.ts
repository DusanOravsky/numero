import type { Language } from '../store/useStore';

const CHAKRA_COLOR_EN: Record<string, string> = {
  'Červená': 'Red', 'Oranžová': 'Orange', 'Žltá': 'Yellow',
  'Zelená': 'Green', 'Modrá': 'Blue', 'Indigo': 'Indigo', 'Fialová': 'Violet'
};

const CHAKRA_NAME_EN: Record<string, string> = {
  'Koreňová čakra': 'Root Chakra',
  'Sakrálna čakra': 'Sacral Chakra',
  'Čakra solárneho plexu': 'Solar Plexus Chakra',
  'Srdcová čakra': 'Heart Chakra',
  'Krčná čakra': 'Throat Chakra',
  'Čakra tretieho oka': 'Third Eye Chakra',
  'Korunná čakra': 'Crown Chakra',
};

const CHAKRA_THEME_EN: Record<string, string> = {
  'Bezpečie': 'Security', 'Prežitie': 'Survival', 'Stabilita': 'Stability', 'Zakorenenie': 'Grounding',
  'Kreativita': 'Creativity', 'Emócie': 'Emotions', 'Sexualita': 'Sexuality', 'Radosť': 'Joy',
  'Sila vôle': 'Willpower', 'Sebavedomie': 'Self-confidence', 'Osobná moc': 'Personal power', 'Hranice': 'Boundaries',
  'Láska': 'Love', 'Súcit': 'Compassion', 'Odpustenie': 'Forgiveness', 'Prijatie': 'Acceptance',
  'Komunikácia': 'Communication', 'Pravda': 'Truth', 'Sebavyjadrenie': 'Self-expression', 'Autenticita': 'Authenticity',
  'Intuícia': 'Intuition', 'Vízia': 'Vision', 'Múdrosť': 'Wisdom', 'Vnútorné vedenie': 'Inner guidance',
  'Spojenie': 'Connection', 'Transcendencia': 'Transcendence', 'Duchovno': 'Spirituality', 'Vedomie': 'Consciousness',
};

export interface Chakra {
  number: number;
  name: string;
  sanskrit: string;
  color: string;
  colorHex: string;
  element: string;
  location: string;
  mantra: string;
  themes: string[];
  balanced: string;
  blocked: string;
  hyperactive: string;
  numerologyNumbers: number[];
  planets: string[];
  sefira: string;
}

export interface ChakraState {
  chakra: Chakra;
  status: 'balanced' | 'blocked' | 'hyperactive';
  score: number;
  recommendations: string[];
}

export const CHAKRAS: Chakra[] = [
  {
    number: 1,
    name: 'Koreňová čakra',
    sanskrit: 'Muladhara',
    color: 'Červená',
    colorHex: '#ef4444',
    element: 'Zem',
    location: 'Báza chrbtice',
    mantra: 'LAM',
    themes: ['Bezpečie', 'Prežitie', 'Stabilita', 'Zakorenenie'],
    balanced: 'Pocit bezpečia, stability, dôvery v život',
    blocked: 'Strach, úzkosť, nestabilita, finančné problémy',
    hyperactive: 'Materializmus, chamtivosť, rigidita',
    numerologyNumbers: [1, 4],
    planets: ['Saturn', 'Mars'],
    sefira: 'Malchut',
  },
  {
    number: 2,
    name: 'Sakrálna čakra',
    sanskrit: 'Svadhisthana',
    color: 'Oranžová',
    colorHex: '#f97316',
    element: 'Voda',
    location: 'Pod pupkom',
    mantra: 'VAM',
    themes: ['Kreativita', 'Emócie', 'Sexualita', 'Radosť'],
    balanced: 'Kreativita, zdravé vzťahy, radosť zo života',
    blocked: 'Vina, strata kreativity, emocionálna necitlivosť',
    hyperactive: 'Emocionálna závislosť, manipulácia',
    numerologyNumbers: [2, 6],
    planets: ['Mesiac', 'Venuša'],
    sefira: 'Jesod',
  },
  {
    number: 3,
    name: 'Čakra solárneho plexu',
    sanskrit: 'Manipura',
    color: 'Žltá',
    colorHex: '#eab308',
    element: 'Oheň',
    location: 'Solárny plexus',
    mantra: 'RAM',
    themes: ['Sila vôle', 'Sebavedomie', 'Osobná moc', 'Hranice'],
    balanced: 'Sebadôvera, motivácia, zdravé hranice',
    blocked: 'Nízke sebavedomie, nerozhodnosť, obeť',
    hyperactive: 'Kontrola, agresia, perfekcionizmus',
    numerologyNumbers: [3, 5],
    planets: ['Slnko', 'Mars'],
    sefira: 'Hod + Necach',
  },
  {
    number: 4,
    name: 'Srdcová čakra',
    sanskrit: 'Anahata',
    color: 'Zelená',
    colorHex: '#22c55e',
    element: 'Vzduch',
    location: 'Stred hrudníka',
    mantra: 'YAM',
    themes: ['Láska', 'Súcit', 'Odpustenie', 'Prijatie'],
    balanced: 'Bezpodmienečná láska, súcit, odpustenie',
    blocked: 'Uzavretosť, strach z intimity, žiarlivosť',
    hyperactive: 'Obetovanie sa, závislosť od lásky',
    numerologyNumbers: [6, 9],
    planets: ['Venuša', 'Neptún'],
    sefira: 'Tiferet',
  },
  {
    number: 5,
    name: 'Krčná čakra',
    sanskrit: 'Vishuddha',
    color: 'Modrá',
    colorHex: '#3b82f6',
    element: 'Éter',
    location: 'Hrdlo',
    mantra: 'HAM',
    themes: ['Komunikácia', 'Pravda', 'Sebavyjadrenie', 'Autenticita'],
    balanced: 'Jasná komunikácia, autentické vyjadrenie',
    blocked: 'Strach z vyjadrenia, klamstvo, tichosť',
    hyperactive: 'Klebety, dominancia v konverzácii',
    numerologyNumbers: [5, 3],
    planets: ['Merkúr', 'Jupiter'],
    sefira: 'Geburah + Chesed',
  },
  {
    number: 6,
    name: 'Čakra tretieho oka',
    sanskrit: 'Ajna',
    color: 'Indigo',
    colorHex: '#6366f1',
    element: 'Svetlo',
    location: 'Stred čela',
    mantra: 'OM',
    themes: ['Intuícia', 'Vízia', 'Múdrosť', 'Vnútorné vedenie'],
    balanced: 'Jasná intuícia, vnútorné vedenie, múdrosť',
    blocked: 'Zmätenosť, nedôvera intuícii, ilúzie',
    hyperactive: 'Odpojenie od reality, halucinácie',
    numerologyNumbers: [7, 11],
    planets: ['Jupiter', 'Neptún'],
    sefira: 'Binah + Chokmah',
  },
  {
    number: 7,
    name: 'Korunná čakra',
    sanskrit: 'Sahasrara',
    color: 'Fialová',
    colorHex: '#a855f7',
    element: 'Myšlienka',
    location: 'Temeno hlavy',
    mantra: 'AUM',
    themes: ['Duchovnosť', 'Prepojenie', 'Jednota', 'Osvietenie'],
    balanced: 'Duchovné prepojenie, vnútorný mier, jednota',
    blocked: 'Oddelenie od duchovna, cynizmus, prázdnota',
    hyperactive: 'Duchovná posadnutosť, odpojenie od tela',
    numerologyNumbers: [9, 7],
    planets: ['Urán', 'Neptún'],
    sefira: 'Keter',
  },
];

export function evaluateChakras(
  lifePathNumber: number,
  gridCounts: Map<number, number>,
  isolatedNumbers: number[],
  definedHDCenters: string[],
  dominantElement: string,
  lang: Language = 'sk'
): ChakraState[] {
  return CHAKRAS.map(chakra => {
    let score = 50;

    chakra.numerologyNumbers.forEach(n => {
      const count = gridCounts.get(n) || 0;
      if (count === 0) score -= 15;
      else if (count === 1) score += 5;
      else if (count === 2) score += 10;
      else if (count >= 3) score += 20;

      if (isolatedNumbers.includes(n)) score -= 10;
    });

    if (chakra.number === 1 && definedHDCenters.includes('Koreň')) score += 10;
    if (chakra.number === 2 && definedHDCenters.includes('Sakrálne')) score += 10;
    if (chakra.number === 3 && definedHDCenters.includes('Solárny plexus')) score += 10;
    if (chakra.number === 4 && definedHDCenters.includes('Srdce/Ego')) score += 10;
    if (chakra.number === 5 && definedHDCenters.includes('Hrdlo')) score += 10;
    if (chakra.number === 6 && definedHDCenters.includes('Ajna')) score += 10;
    if (chakra.number === 7 && definedHDCenters.includes('Hlava')) score += 10;

    if (chakra.element === 'Oheň' && dominantElement === 'Oheň') score += 10;
    if (chakra.element === 'Voda' && dominantElement === 'Voda') score += 10;
    if (chakra.element === 'Zem' && dominantElement === 'Zem') score += 10;
    if (chakra.element === 'Vzduch' && dominantElement === 'Vzduch') score += 10;

    if (lifePathNumber === chakra.number) score += 15;

    score = Math.max(0, Math.min(100, score));

    // Hyperaktívna: extrémne dominantná energia (veľa duplicít čísla v mriežke)
    // alebo veľmi vysoké skóre. Blokovaná: nízke skóre (chýbajúce/izolované čísla).
    // Vyvážená: stredný rozsah.
    //
    // Prahy nastavené tak, aby skutočne chýbajúce čísla boli "blokovaná",
    // a aby silná korešpondencia (3+ čísla, definované HD centrum, dominantný
    // element, ŽČ match) vyšla ako "hyperaktívna". Stredné pásmo "vyvážená"
    // je zámerne užšie, aby výsledky boli odlišné a smerodatné.
    const hasOverdominance = chakra.numerologyNumbers.some(n => (gridCounts.get(n) || 0) >= 4);

    let status: 'balanced' | 'blocked' | 'hyperactive';
    if (score < 50) status = 'blocked';
    else if (score >= 80 || hasOverdominance) status = 'hyperactive';
    else status = 'balanced';

    const recommendations: string[] = [];
    const nameLocalized = lang === 'sk' ? chakra.name.toLowerCase() : (CHAKRA_NAME_EN[chakra.name] || chakra.name).toLowerCase();
    const colorLocalized = lang === 'sk' ? chakra.color : (CHAKRA_COLOR_EN[chakra.color] || chakra.color);
    const themesLocalized = lang === 'sk' ? chakra.themes : chakra.themes.map(t => CHAKRA_THEME_EN[t] || t);
    if (status === 'blocked') {
      recommendations.push(lang === 'sk'
        ? `Venujte pozornosť oblasti: ${themesLocalized.join(', ')}`
        : `Focus on areas: ${themesLocalized.join(', ')}`);
      recommendations.push(lang === 'sk'
        ? `Meditácia na farbu: ${colorLocalized}`
        : `Color meditation: ${colorLocalized}`);
      recommendations.push(lang === 'sk'
        ? `Afirmácia: "Otváram sa energii ${nameLocalized}."`
        : `Affirmation: "I open myself to the energy of ${nameLocalized}."`);
    } else if (status === 'hyperactive') {
      recommendations.push(lang === 'sk'
        ? `Uzemňovacia prax pre ${nameLocalized}`
        : `Grounding practice for ${nameLocalized}`);
      recommendations.push(lang === 'sk'
        ? 'Rovnováha medzi dávaním a prijímaním'
        : 'Balance between giving and receiving');
    }

    return { chakra, status, score, recommendations };
  });
}
