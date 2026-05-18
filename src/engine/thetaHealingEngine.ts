export type BeliefLevel = 'core' | 'genetic' | 'history' | 'soul';

export interface LimitingBelief {
  belief: string;
  level: BeliefLevel;
  origin: string;
  emotion: string;
  bodyArea: string;
}

export interface NewBelief {
  belief: string;
  affirmation: string;
  feeling: string;
}

export interface DiggingResult {
  rootBelief: LimitingBelief;
  chain: string[];
  newBelief: NewBelief;
  healingSteps: string[];
}

export interface ThetaHealingResult {
  primaryBeliefs: LimitingBelief[];
  diggingResults: DiggingResult[];
  healingWorkflow: string[];
  recommendations: string[];
}

const BELIEF_TEMPLATES: Record<number, { beliefs: LimitingBelief[]; newBeliefs: NewBelief[] }> = {
  1: {
    beliefs: [
      { belief: 'Musím všetko zvládnuť sám/sama', level: 'core', origin: 'Detstvo – nedostatok podpory', emotion: 'Osamelosť', bodyArea: 'Ramená' },
      { belief: 'Nie som dosť dobrý/á', level: 'genetic', origin: 'Rodová línia – tlak na výkon', emotion: 'Hanba', bodyArea: 'Solárny plexus' },
      { belief: 'Ak budem zraniteľný/á, zrania ma', level: 'history', origin: 'Minulé životy – zrada', emotion: 'Strach', bodyArea: 'Srdce' },
    ],
    newBeliefs: [
      { belief: 'Je bezpečné prijať pomoc', affirmation: 'Prijímam podporu s vďačnosťou', feeling: 'Ľahkosť a prepojenie' },
      { belief: 'Som dosť dobrý/á presne taký/á, aký/á som', affirmation: 'Moja hodnota je vo mne, nie v tom, čo robím', feeling: 'Vnútorný pokoj' },
      { belief: 'Zraniteľnosť je sila', affirmation: 'Otváram sa láske bezpečne', feeling: 'Nežnosť a odvaha' },
    ],
  },
  2: {
    beliefs: [
      { belief: 'Moje potreby nie sú dôležité', level: 'core', origin: 'Detstvo – zanedbanie emócií', emotion: 'Smútok', bodyArea: 'Hruď' },
      { belief: 'Musím sa starať o ostatných, aby ma mali radi', level: 'genetic', origin: 'Matrilineárny vzorec', emotion: 'Vyčerpanie', bodyArea: 'Obličky' },
      { belief: 'Ak poviem nie, stratím lásku', level: 'soul', origin: 'Duševný kontrakt', emotion: 'Strach z opustenia', bodyArea: 'Krk' },
    ],
    newBeliefs: [
      { belief: 'Moje potreby sú rovnako dôležité', affirmation: 'Starám sa o seba s rovnakou láskou ako o iných', feeling: 'Naplnenie' },
      { belief: 'Som milovaný/á aj keď kladiem hranice', affirmation: 'Moje nie je dar pre mňa aj pre iných', feeling: 'Sloboda' },
      { belief: 'Láska nie je podmienená mojou obetou', affirmation: 'Zasluhujem lásku len preto, že existujem', feeling: 'Bezpečie' },
    ],
  },
  3: {
    beliefs: [
      { belief: 'Ak sa vyjadrím, budú ma súdiť', level: 'core', origin: 'Detstvo – potlačenie prejavu', emotion: 'Hanba', bodyArea: 'Hrdlo' },
      { belief: 'Nemám čo ponúknuť', level: 'genetic', origin: 'Rodová línia – odsudzovanie', emotion: 'Bezcennosť', bodyArea: 'Solárny plexus' },
      { belief: 'Radosť je povrchná', level: 'history', origin: 'Kolektívna trauma', emotion: 'Vina', bodyArea: 'Srdce' },
    ],
    newBeliefs: [
      { belief: 'Moje vyjadrenie má hodnotu', affirmation: 'Vyjadrujem sa s odvahou a radosťou', feeling: 'Tvorivá sloboda' },
      { belief: 'Mám unikátne dary pre svet', affirmation: 'Svet potrebuje práve moje svetlo', feeling: 'Nadšenie' },
      { belief: 'Radosť je moja prirodzená podstata', affirmation: 'Dovoľujem si radovať sa', feeling: 'Ľahkosť' },
    ],
  },
  4: {
    beliefs: [
      { belief: 'Svet nie je bezpečné miesto', level: 'core', origin: 'Detstvo – nestabilita prostredia', emotion: 'Úzkosť', bodyArea: 'Koreňová čakra' },
      { belief: 'Musím kontrolovať všetko', level: 'genetic', origin: 'Generačná trauma – strata', emotion: 'Strach', bodyArea: 'Žalúdok' },
      { belief: 'Ak sa uvoľním, niečo zlé sa stane', level: 'soul', origin: 'Duševná skúsenosť', emotion: 'Hypervigilancia', bodyArea: 'Chrbtice' },
    ],
    newBeliefs: [
      { belief: 'Svet ma podporuje', affirmation: 'Dôverujem procesu života', feeling: 'Uzemnenosť' },
      { belief: 'Je bezpečné pustiť kontrolu', affirmation: 'Život ma nesie', feeling: 'Mier' },
      { belief: 'Stabilita je vo mne, nie okolo mňa', affirmation: 'Som svoj vlastný domov', feeling: 'Zakorenenie' },
    ],
  },
  5: {
    beliefs: [
      { belief: 'Sloboda znamená osamelosť', level: 'core', origin: 'Detstvo – trest za samostatnosť', emotion: 'Strach', bodyArea: 'Hrdlo' },
      { belief: 'Ak budem autentický/á, ľudia odídu', level: 'genetic', origin: 'Rodová línia – konformita', emotion: 'Úzkosť', bodyArea: 'Srdce' },
      { belief: 'Zmena je nebezpečná', level: 'history', origin: 'Minulé skúsenosti', emotion: 'Odpor', bodyArea: 'Solárny plexus' },
    ],
    newBeliefs: [
      { belief: 'Sloboda a prepojenie koexistujú', affirmation: 'Som slobodný/á a prepojený/á zároveň', feeling: 'Rozpínavosť' },
      { belief: 'Moja autenticita priťahuje správnych ľudí', affirmation: 'Byť sám/sama sebou je môj najväčší dar', feeling: 'Sebadôvera' },
      { belief: 'Zmena je brána k rastu', affirmation: 'Vítam nové s dôverou', feeling: 'Vzrušenie' },
    ],
  },
  6: {
    beliefs: [
      { belief: 'Musím byť dokonalý/á, aby ma milovali', level: 'core', origin: 'Detstvo – podmienená láska', emotion: 'Strach z odmietnutia', bodyArea: 'Srdce' },
      { belief: 'Zodpovednosť za šťastie iných je moja', level: 'genetic', origin: 'Rodový vzorec – obetovanie', emotion: 'Preťaženie', bodyArea: 'Ramená' },
      { belief: 'Ak niečo nie je perfektné, nemá to hodnotu', level: 'soul', origin: 'Duševný perfekcionizmus', emotion: 'Frustrácia', bodyArea: 'Oči' },
    ],
    newBeliefs: [
      { belief: 'Som milovaný/á aj v nedokonalosti', affirmation: 'Moja ľudskosť je krásna', feeling: 'Prijatie' },
      { belief: 'Každý je zodpovedný za svoje šťastie', affirmation: 'Nechávam iných byť a starám sa o seba', feeling: 'Uvoľnenie' },
      { belief: 'Krása je v nedokonalosti', affirmation: 'Dovoľujem si byť nedokonalý/á', feeling: 'Sloboda' },
    ],
  },
  7: {
    beliefs: [
      { belief: 'Ak sa otvorím, zrania ma', level: 'core', origin: 'Detstvo – emocionálna zrada', emotion: 'Nedôvera', bodyArea: 'Srdce' },
      { belief: 'Byť sám/sama je bezpečnejšie', level: 'genetic', origin: 'Rodová línia – izolácia', emotion: 'Osamelosť', bodyArea: 'Hruď' },
      { belief: 'Musím všetko pochopiť rozumom', level: 'history', origin: 'Intelektualizácia ako obrana', emotion: 'Odpojenie', bodyArea: 'Hlava' },
    ],
    newBeliefs: [
      { belief: 'Je bezpečné dôverovať', affirmation: 'Otváram sa prepojeniu s múdrosťou', feeling: 'Nežnosť' },
      { belief: 'Prepojenie obohacuje moju cestu', affirmation: 'Som prepojený/á a zároveň celý/á', feeling: 'Plnosť' },
      { belief: 'Múdrosť je spojenie rozumu a intuície', affirmation: 'Dôverujem svojmu vnútornému vedeniu', feeling: 'Jasnosť' },
    ],
  },
  8: {
    beliefs: [
      { belief: 'Moc je nebezpečná', level: 'core', origin: 'Detstvo – zneužitie moci', emotion: 'Strach', bodyArea: 'Solárny plexus' },
      { belief: 'Peniaze sú špinavé', level: 'genetic', origin: 'Rodová línia – chudoba', emotion: 'Odpor', bodyArea: 'Koreňová čakra' },
      { belief: 'Úspech znamená stratu lásky', level: 'soul', origin: 'Duševná skúsenosť', emotion: 'Vina', bodyArea: 'Srdce' },
    ],
    newBeliefs: [
      { belief: 'Moc v službe lásky je požehnaním', affirmation: 'Používam svoju silu pre dobro', feeling: 'Dôvera' },
      { belief: 'Hojnosť je prirodzený stav', affirmation: 'Zasluhujem hojnosť vo všetkých oblastiach', feeling: 'Radosť' },
      { belief: 'Úspech a láska koexistujú', affirmation: 'Čím viac prosperujem, tým viac darujem', feeling: 'Štedrá sila' },
    ],
  },
  9: {
    beliefs: [
      { belief: 'Svet sa nedá zmeniť', level: 'core', origin: 'Detstvo – bezmocnosť', emotion: 'Rezignácia', bodyArea: 'Srdce' },
      { belief: 'Ak niečo skončí, zlyhalo to', level: 'genetic', origin: 'Rodová línia – strach z konca', emotion: 'Smútok', bodyArea: 'Pľúca' },
      { belief: 'Nie je bezpečné púšťať staré', level: 'soul', origin: 'Duševná pripútanosť', emotion: 'Strach', bodyArea: 'Hrubé črevo' },
    ],
    newBeliefs: [
      { belief: 'Každý dobrý čin mení svet', affirmation: 'Som súčasťou pozitívnej zmeny', feeling: 'Zmysluplnosť' },
      { belief: 'Dokončenie je posvätné', affirmation: 'Púšťam s vďačnosťou a dôverou', feeling: 'Mier' },
      { belief: 'V novom začiatku je dar', affirmation: 'Každý koniec je bránou k novému', feeling: 'Nádej' },
    ],
  },
};

const LEVEL_NAMES: Record<BeliefLevel, string> = {
  core: 'Koreňová úroveň (toto život)',
  genetic: 'Genetická úroveň (rodová línia)',
  history: 'Historická úroveň (minulé životy)',
  soul: 'Duševná úroveň (duševné kontrakty)',
};

export function getLevelName(level: BeliefLevel): string {
  return LEVEL_NAMES[level];
}

export function calculateThetaHealing(lifePathNumber: number): ThetaHealingResult {
  const template = BELIEF_TEMPLATES[lifePathNumber] || BELIEF_TEMPLATES[1];

  const diggingResults: DiggingResult[] = template.beliefs.map((belief, i) => ({
    rootBelief: belief,
    chain: [
      `"Prečo verím, že ${belief.belief.toLowerCase()}?"`,
      `"Čo by sa stalo, keby to nebola pravda?"`,
      `"Kedy som si toto prvýkrát myslel/a?"`,
      `"Čo cítim v tele, keď si to pomyslím?"`,
      `→ Koreňové presvedčenie: "${belief.belief}"`,
    ],
    newBelief: template.newBeliefs[i],
    healingSteps: [
      'Spojte sa so zdrojovou energiou (Stvoriteľ všetkého čo je)',
      `Požiadajte o odstránenie: "${belief.belief}"`,
      `Nahraďte novým: "${template.newBeliefs[i].belief}"`,
      `Pocíťte: ${template.newBeliefs[i].feeling}`,
      'Poďakujte a uzavrite',
    ],
  }));

  const healingWorkflow = [
    '1. Uvoľnite sa a zhlboka dýchajte',
    '2. Predstavte si energiu stúpajúcu nahor cez korunnou čakru',
    '3. Spojte sa so Stvoriteľom všetkého čo je',
    '4. Požiadajte o ukázanie koreňového presvedčenia',
    '5. Pozorujte, kde v tele sa presvedčenie drží',
    '6. Požiadajte o odpojenie a zrušenie presvedčenia na všetkých úrovniach',
    '7. Nahraďte novým presvedčením',
    '8. Pocíťte nové presvedčenie v tele',
    '9. Poďakujte a vráťte sa do prítomnosti',
  ];

  const recommendations = [
    'Pracujte s jedným presvedčením denne',
    'Zapisujte si pocity a zmeny',
    'Buďte trpezliví – transformácia je proces',
    'Vracajte sa k afirmáciám ráno a večer',
    'Pozorujte zmeny v snoch a vzťahoch',
  ];

  return {
    primaryBeliefs: template.beliefs,
    diggingResults,
    healingWorkflow,
    recommendations,
  };
}

export { BELIEF_TEMPLATES };
