import type { Language } from '../store/useStore';

export interface ArchetypeResult {
  primary: Archetype;
  secondary: Archetype;
  shadow: Archetype;
}

export interface Archetype {
  id: number;
  name: string;
  motto: string;
  coreDesire: string;
  gift: string;
  shadow: string;
  strategy: string;
}

const ARCHETYPES: Archetype[] = [
  { id: 1, name: 'Nevinný', motto: 'Sloboda byť sebou', coreDesire: 'Bezpečie a šťastie', gift: 'Optimizmus a dôvera', shadow: 'Naivita a popieranie reality', strategy: 'Dôveruj životu a rob veci správne.' },
  { id: 2, name: 'Mudrc', motto: 'Pravda ťa oslobodí', coreDesire: 'Pochopenie sveta', gift: 'Múdrosť a jasnosť', shadow: 'Paralýza z analýzy a odtrhnutosť', strategy: 'Hľadaj poznanie a zdieľaj ho s inými.' },
  { id: 3, name: 'Prieskumník', motto: 'Neohraničuj ma', coreDesire: 'Sloboda objaviť seba', gift: 'Autonómia a ambícia', shadow: 'Neviazanosť a večné blúdenie', strategy: 'Choď vlastnou cestou a skúšaj nové.' },
  { id: 4, name: 'Rebel', motto: 'Pravidlá sú na porušenie', coreDesire: 'Revolúcia a pomsta', gift: 'Radikálna sloboda a odvaha', shadow: 'Deštruktívnosť a nihilizmus', strategy: 'Búraj to, čo nefunguje — ale buduj niečo lepšie.' },
  { id: 5, name: 'Mág', motto: 'Chcem, aby sa to stalo', coreDesire: 'Pochopenie zákonov vesmíru', gift: 'Transformácia a vízia', shadow: 'Manipulácia a odpojenie od reality', strategy: 'Premieňaj víziu na realitu krok za krokom.' },
  { id: 6, name: 'Hrdina', motto: 'Kde je vôľa, tam je cesta', coreDesire: 'Dokázať svoju hodnotu', gift: 'Kompetencia a odvaha', shadow: 'Arogancia a potreba neustáleho boja', strategy: 'Konaj odvážne — ale vedz, kedy odpočívať.' },
  { id: 7, name: 'Milovník', motto: 'Si jediný/á pre mňa', coreDesire: 'Intimita a prepojenie', gift: 'Vášeň a oddanosť', shadow: 'Závislosť a strata identity', strategy: 'Miluj hlboko — ale nezabudni na seba.' },
  { id: 8, name: 'Šašo', motto: 'Žiješ len raz', coreDesire: 'Radosť a ľahkosť', gift: 'Humor a prítomnosť', shadow: 'Povrchnosť a únik od zodpovednosti', strategy: 'Nájdi radosť v prítomnom okamihu.' },
  { id: 9, name: 'Opatrovateľ', motto: 'Miluj blížneho ako seba', coreDesire: 'Chrániť a pomáhať', gift: 'Veľkorysosť a súcit', shadow: 'Mučeníctvo a sebaobetovanie', strategy: 'Pomáhaj druhým — ale doplň si najprv vlastnú energiu.' },
  { id: 10, name: 'Tvorca', motto: 'Čo si viem predstaviť, to vytvorím', coreDesire: 'Vytvoriť niečo trvalé', gift: 'Kreativita a imaginácia', shadow: 'Perfekcionizmus a neukončené diela', strategy: 'Tvor bez autocenzúry — dokončenie príde.' },
  { id: 11, name: 'Vládca', motto: 'Moc nie je všetko — je to jediná vec', coreDesire: 'Kontrola a poriadok', gift: 'Zodpovednosť a vedenie', shadow: 'Autoritárstvo a rigidita', strategy: 'Veď príkladom — skutočná moc je služba.' },
  { id: 12, name: 'Každý človek', motto: 'Všetci sme si rovní', coreDesire: 'Príslušnosť a prepojenie', gift: 'Empatia a reálnosť', shadow: 'Strata individuality a konformita', strategy: 'Buď súčasťou celku — ale zachovaj si hlas.' },
];

const ARCHETYPES_EN: Archetype[] = [
  { id: 1, name: 'Innocent', motto: 'Freedom to be yourself', coreDesire: 'Safety and happiness', gift: 'Optimism and trust', shadow: 'Naivety and denial of reality', strategy: 'Trust life and do things right.' },
  { id: 2, name: 'Sage', motto: 'The truth will set you free', coreDesire: 'Understanding the world', gift: 'Wisdom and clarity', shadow: 'Analysis paralysis and detachment', strategy: 'Seek knowledge and share it with others.' },
  { id: 3, name: 'Explorer', motto: 'Don\'t fence me in', coreDesire: 'Freedom to discover yourself', gift: 'Autonomy and ambition', shadow: 'Aimlessness and endless wandering', strategy: 'Go your own way and try new things.' },
  { id: 4, name: 'Rebel', motto: 'Rules are made to be broken', coreDesire: 'Revolution and vengeance', gift: 'Radical freedom and courage', shadow: 'Destructiveness and nihilism', strategy: 'Tear down what doesn\'t work — but build something better.' },
  { id: 5, name: 'Magician', motto: 'I want to make it happen', coreDesire: 'Understanding the laws of the universe', gift: 'Transformation and vision', shadow: 'Manipulation and disconnection from reality', strategy: 'Transform vision into reality step by step.' },
  { id: 6, name: 'Hero', motto: 'Where there\'s a will, there\'s a way', coreDesire: 'Proving one\'s worth', gift: 'Competence and courage', shadow: 'Arrogance and need for constant battle', strategy: 'Act courageously — but know when to rest.' },
  { id: 7, name: 'Lover', motto: 'You are the only one for me', coreDesire: 'Intimacy and connection', gift: 'Passion and devotion', shadow: 'Dependency and loss of identity', strategy: 'Love deeply — but don\'t forget yourself.' },
  { id: 8, name: 'Jester', motto: 'You only live once', coreDesire: 'Joy and lightness', gift: 'Humor and presence', shadow: 'Superficiality and avoidance of responsibility', strategy: 'Find joy in the present moment.' },
  { id: 9, name: 'Caregiver', motto: 'Love your neighbor as yourself', coreDesire: 'To protect and help', gift: 'Generosity and compassion', shadow: 'Martyrdom and self-sacrifice', strategy: 'Help others — but replenish your own energy first.' },
  { id: 10, name: 'Creator', motto: 'If I can imagine it, I can create it', coreDesire: 'To create something enduring', gift: 'Creativity and imagination', shadow: 'Perfectionism and unfinished works', strategy: 'Create without self-censorship — completion will come.' },
  { id: 11, name: 'Ruler', motto: 'Power isn\'t everything — it\'s the only thing', coreDesire: 'Control and order', gift: 'Responsibility and leadership', shadow: 'Authoritarianism and rigidity', strategy: 'Lead by example — true power is service.' },
  { id: 12, name: 'Everyman', motto: 'We are all equal', coreDesire: 'Belonging and connection', gift: 'Empathy and groundedness', shadow: 'Loss of individuality and conformity', strategy: 'Be part of the whole — but keep your voice.' },
];

const LP_TO_ARCHETYPE: Record<number, number> = {
  1: 6,   // Hrdina
  2: 9,   // Opatrovateľ
  3: 10,  // Tvorca
  4: 11,  // Vládca
  5: 3,   // Prieskumník
  6: 7,   // Milovník
  7: 2,   // Mudrc
  8: 5,   // Mág
  9: 1,   // Nevinný
  11: 5,  // Mág (master)
  22: 11, // Vládca (master)
  33: 9,  // Opatrovateľ (master)
};

const ENNEAGRAM_TO_ARCHETYPE: Record<number, number> = {
  1: 6,   // Hrdina
  2: 9,   // Opatrovateľ
  3: 5,   // Mág
  4: 10,  // Tvorca
  5: 2,   // Mudrc
  6: 12,  // Každý človek
  7: 8,   // Šašo
  8: 4,   // Rebel
  9: 1,   // Nevinný
};

const HD_TYPE_TO_ARCHETYPE: Record<string, number> = {
  'Manifestor': 4,      // Rebel
  'Generátor': 6,       // Hrdina
  'Manifestujúci Generátor': 3, // Prieskumník
  'Projektor': 2,       // Mudrc
  'Reflektor': 1,       // Nevinný
};

export function deriveArchetype(
  lifePathNumber: number,
  enneagramType: number,
  hdType: string,
  lang: Language = 'sk'
): ArchetypeResult {
  const lpArchId = LP_TO_ARCHETYPE[lifePathNumber] || LP_TO_ARCHETYPE[lifePathNumber > 9 ? lifePathNumber : 1] || 6;
  const enneaArchId = ENNEAGRAM_TO_ARCHETYPE[enneagramType] || 12;
  const hdArchId = HD_TYPE_TO_ARCHETYPE[hdType] || 12;

  // Primary = najčastejší z troch systémov, alebo LP ak všetky rôzne
  const counts: Record<number, number> = {};
  [lpArchId, enneaArchId, hdArchId].forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primaryId = Number(sorted[0][0]);

  // Secondary = druhý najčastejší, alebo enneagram ak rôzne
  const secondaryId = sorted.length > 1 ? Number(sorted[1][0]) :
    (enneaArchId !== primaryId ? enneaArchId : hdArchId);

  // Shadow = protiklad primary
  const shadowMap: Record<number, number> = {
    1: 4, 2: 8, 3: 12, 4: 1, 5: 12, 6: 9,
    7: 3, 8: 2, 9: 6, 10: 4, 11: 8, 12: 5,
  };
  const shadowId = shadowMap[primaryId] || 4;

  const archetypes = lang === 'sk' ? ARCHETYPES : ARCHETYPES_EN;

  return {
    primary: archetypes[primaryId - 1],
    secondary: archetypes[secondaryId - 1] || archetypes[0],
    shadow: archetypes[shadowId - 1],
  };
}

export { ARCHETYPES };
