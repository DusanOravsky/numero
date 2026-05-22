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
  { id: 6, name: 'Hrdina', motto: 'Kde je vôľa, tam je cesta', coreDesire: 'Dokázať svoju hodnotu', gift: 'Kompetencia a odvaha', shadow: 'Aroganica a potreba neustáleho boja', strategy: 'Konaj odvážne — ale vedz, kedy odpočívať.' },
  { id: 7, name: 'Milovník', motto: 'Si jediný/á pre mňa', coreDesire: 'Intimita a prepojenie', gift: 'Vášeň a oddanosť', shadow: 'Závislosť a strata identity', strategy: 'Miluj hlboko — ale nezabudni na seba.' },
  { id: 8, name: 'Šašo', motto: 'Žiješ len raz', coreDesire: 'Radosť a ľahkosť', gift: 'Humor a prítomnosť', shadow: 'Povrchnosť a únik od zodpovednosti', strategy: 'Nájdi radosť v prítomnom okamihu.' },
  { id: 9, name: 'Opatrovateľ', motto: 'Miluj blížneho ako seba', coreDesire: 'Chrániť a pomáhať', gift: 'Veľkorysosť a súcit', shadow: 'Mučeníctvo a sebaobetovanie', strategy: 'Pomáhaj druhým — ale doplň si najprv vlastnú energiu.' },
  { id: 10, name: 'Tvorca', motto: 'Čo si viem predstaviť, to vytvorím', coreDesire: 'Vytvoriť niečo trvalé', gift: 'Kreativita a imaginácia', shadow: 'Perfekcionizmus a neukončené diela', strategy: 'Tvor bez autocenzúry — dokončenie príde.' },
  { id: 11, name: 'Vládca', motto: 'Moc nie je všetko — je to jediná vec', coreDesire: 'Kontrola a poriadok', gift: 'Zodpovednosť a vedenie', shadow: 'Autoritárstvo a rigidita', strategy: 'Veď príkladom — skutočná moc je služba.' },
  { id: 12, name: 'Každý človek', motto: 'Všetci sme si rovní', coreDesire: 'Príslušnosť a prepojenie', gift: 'Empatia a reálnosť', shadow: 'Strata individuality a konformita', strategy: 'Buď súčasťou celku — ale zachovaj si hlas.' },
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
  hdType: string
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

  return {
    primary: ARCHETYPES[primaryId - 1],
    secondary: ARCHETYPES[secondaryId - 1] || ARCHETYPES[0],
    shadow: ARCHETYPES[shadowId - 1],
  };
}

export { ARCHETYPES };
