import type { Language } from '../store/useStore';

export interface DoshaProfile {
  primary: 'vata' | 'pitta' | 'kapha';
  secondary: 'vata' | 'pitta' | 'kapha' | null;
  balance: number; // 0-100, koľko je primárna dominantná
}

export interface DoshaInfo {
  name: string;
  element: string;
  qualities: string[];
  strengths: string[];
  imbalanceSigns: string[];
  balanceTips: string[];
  bodyType: string;
  mind: string;
  season: string;
}

const sk: Record<'vata' | 'pitta' | 'kapha', DoshaInfo> = {
  vata: {
    name: 'Vata',
    element: 'Éter + Vzduch',
    qualities: ['ľahký', 'suchý', 'chladný', 'pohyblivý', 'jemný', 'drsný'],
    strengths: [
      'Kreatívny a inšpiratívny',
      'Rýchle myslenie a učenie',
      'Nadšený a vitálny keď je v rovnováhe',
      'Flexibilný a prispôsobivý',
      'Prirodzený umelec a vizionár',
    ],
    imbalanceSigns: [
      'Úzkosť a nervozita',
      'Nespavosť a nepokojný spánok',
      'Suchá koža a vlasy',
      'Zápcha a nadúvanie',
      'Roztržitosť a zábudlivosť',
      'Chladné končatiny',
    ],
    balanceTips: [
      'Pravidelný denný režim — jedz a spávaj v rovnakom čase',
      'Teplé jedlá a nápoje, vyhýbaj sa studenému a surovému',
      'Olejovania tela (abhyanga) sezamovým olejom',
      'Pomalá a uzemňujúca jóga, nie príliš dynamická',
      'Meditácia a hlboké dýchanie na upokojenie mysle',
      'Vyhýbaj sa stimulantom (kofeín, cukor)',
    ],
    bodyType: 'Štíhly, ľahký, úzke kosti, suchá koža',
    mind: 'Rýchly, kreatívny, nestabilný, skáče medzi nápadmi',
    season: 'Jeseň a začiatok zimy (suchá, chladná, veterná)',
  },
  pitta: {
    name: 'Pitta',
    element: 'Oheň + Voda',
    qualities: ['horúci', 'ostrý', 'ľahký', 'olejovitý', 'tekutý', 'kyslý'],
    strengths: [
      'Prirodzený líder a organizátor',
      'Silný intelekt a sústredenie',
      'Odvážny a rozhodný',
      'Výborné trávenie a metabolizmus',
      'Charizmatický a motivujúci pre ostatných',
    ],
    imbalanceSigns: [
      'Podráždenosť a hnev',
      'Zápal a kyslý žalúdok',
      'Kožné problémy (akné, ekzém)',
      'Prehriatie a nadmerné potenie',
      'Perfekcionizmus a kritickosť',
      'Pálenie záhy a hnačka',
    ],
    balanceTips: [
      'Chladivé potraviny — uhorky, kokos, mäta, koriander',
      'Vyhýbaj sa príliš korenistému, kyslému a slanému',
      'Prechádzky v prírode, pri vode',
      'Naučiť sa pustiť kontrolu — delegovať',
      'Kreatívne hobby bez súťaženia',
      'Mesačné svetlo a chladivá meditácia',
    ],
    bodyType: 'Stredná postava, atletický, teplá koža, jemné vlasy',
    mind: 'Ostrý, analytický, cieľavedomý, náchylný na kritiku',
    season: 'Leto (horúca, intenzívna)',
  },
  kapha: {
    name: 'Kapha',
    element: 'Zem + Voda',
    qualities: ['ťažký', 'pomalý', 'stabilný', 'vlhký', 'hladký', 'mäkký'],
    strengths: [
      'Stabilný a spoľahlivý',
      'Silná pamäť a vytrvalosť',
      'Starostlivý a lojálny',
      'Fyzická sila a odolnosť',
      'Trpezlivý a pokojný',
    ],
    imbalanceSigns: [
      'Lenivosť a apatia',
      'Nadváha a pomalý metabolizmus',
      'Nadmerný spánok',
      'Hlieny a kongescia',
      'Pripútanosť a majetníctvo',
      'Depresia a ťažoba',
    ],
    balanceTips: [
      'Dynamický pohyb — beh, tanec, HIIT',
      'Ľahké a teplé jedlá, pikantné korenie',
      'Vstávaj skoro ráno (pred 6:00)',
      'Nové výzvy a zmeny v rutine',
      'Suchý kefkový masáž tela',
      'Obmedzenie sladkého, ťažkého a mastného',
    ],
    bodyType: 'Robustný, silný, zaoblený, hydratovaná koža',
    mind: 'Pokojný, trpezlivý, pomalý ale dôkladný, lojálny',
    season: 'Koniec zimy a jar (vlhká, chladná, ťažká)',
  },
};

const en: Record<'vata' | 'pitta' | 'kapha', DoshaInfo> = {
  vata: {
    name: 'Vata',
    element: 'Ether + Air',
    qualities: ['light', 'dry', 'cold', 'mobile', 'subtle', 'rough'],
    strengths: [
      'Creative and inspirational',
      'Quick thinking and learning',
      'Enthusiastic and vital when in balance',
      'Flexible and adaptable',
      'Natural artist and visionary',
    ],
    imbalanceSigns: [
      'Anxiety and nervousness',
      'Insomnia and restless sleep',
      'Dry skin and hair',
      'Constipation and bloating',
      'Absent-mindedness and forgetfulness',
      'Cold extremities',
    ],
    balanceTips: [
      'Regular daily routine — eat and sleep at the same time',
      'Warm foods and drinks, avoid cold and raw',
      'Body oil massage (abhyanga) with sesame oil',
      'Slow and grounding yoga, not too dynamic',
      'Meditation and deep breathing to calm the mind',
      'Avoid stimulants (caffeine, sugar)',
    ],
    bodyType: 'Slim, light, narrow bones, dry skin',
    mind: 'Quick, creative, unstable, jumps between ideas',
    season: 'Autumn and early winter (dry, cold, windy)',
  },
  pitta: {
    name: 'Pitta',
    element: 'Fire + Water',
    qualities: ['hot', 'sharp', 'light', 'oily', 'liquid', 'sour'],
    strengths: [
      'Natural leader and organizer',
      'Strong intellect and focus',
      'Courageous and decisive',
      'Excellent digestion and metabolism',
      'Charismatic and motivating for others',
    ],
    imbalanceSigns: [
      'Irritability and anger',
      'Inflammation and acid stomach',
      'Skin problems (acne, eczema)',
      'Overheating and excessive sweating',
      'Perfectionism and being critical',
      'Heartburn and diarrhea',
    ],
    balanceTips: [
      'Cooling foods — cucumbers, coconut, mint, coriander',
      'Avoid overly spicy, sour, and salty',
      'Walks in nature, by the water',
      'Learn to let go of control — delegate',
      'Creative hobbies without competition',
      'Moonlight and cooling meditation',
    ],
    bodyType: 'Medium build, athletic, warm skin, fine hair',
    mind: 'Sharp, analytical, goal-oriented, prone to criticism',
    season: 'Summer (hot, intense)',
  },
  kapha: {
    name: 'Kapha',
    element: 'Earth + Water',
    qualities: ['heavy', 'slow', 'stable', 'moist', 'smooth', 'soft'],
    strengths: [
      'Stable and reliable',
      'Strong memory and endurance',
      'Caring and loyal',
      'Physical strength and resilience',
      'Patient and calm',
    ],
    imbalanceSigns: [
      'Laziness and apathy',
      'Weight gain and slow metabolism',
      'Excessive sleep',
      'Mucus and congestion',
      'Attachment and possessiveness',
      'Depression and heaviness',
    ],
    balanceTips: [
      'Dynamic movement — running, dancing, HIIT',
      'Light and warm foods, pungent spices',
      'Wake up early in the morning (before 6:00)',
      'New challenges and changes in routine',
      'Dry body brushing',
      'Reduce sweets, heavy, and oily foods',
    ],
    bodyType: 'Robust, strong, rounded, hydrated skin',
    mind: 'Calm, patient, slow but thorough, loyal',
    season: 'Late winter and spring (moist, cold, heavy)',
  },
};

export const DOSHA_INFO: Record<'vata' | 'pitta' | 'kapha', DoshaInfo> = sk;

export function getDoshaInfo(dosha: 'vata' | 'pitta' | 'kapha', lang: Language = 'sk'): DoshaInfo {
  return lang === 'en' ? en[dosha] : sk[dosha];
}
