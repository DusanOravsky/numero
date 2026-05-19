export interface BachFlower {
  name: string;
  latinName: string;
  chakra: number;
  emotionalState: string;
  helps: string;
  affirmation: string;
}

export const BACH_FLOWERS_BY_CHAKRA: Record<number, BachFlower[]> = {
  1: [
    {
      name: 'Mimulus',
      latinName: 'Mimulus guttatus',
      chakra: 1,
      emotionalState: 'Konkrétne strachy — strach z chudoby, choroby, osamelosti',
      helps: 'Dodáva odvahu čeliť známym strachom s pokojom a dôverou',
      affirmation: 'Čelím životu s odvahou. Som v bezpečí.',
    },
    {
      name: 'Rock Rose',
      latinName: 'Helianthemum nummularium',
      chakra: 1,
      emotionalState: 'Akútny teror, panika, bezmocnosť v krízovej situácii',
      helps: 'Prináša vnútornú silu a pokoj aj v extrémnych situáciách',
      affirmation: 'Aj v búrke nachádzam vnútorný pokoj a silu konať.',
    },
    {
      name: 'Aspen',
      latinName: 'Populus tremula',
      chakra: 1,
      emotionalState: 'Neurčité obavy, predtuchy, úzkosť bez zjavnej príčiny',
      helps: 'Premieňa temné predtuchy na dôveru v neznáme',
      affirmation: 'Dôverujem životu. Neznáme mi prináša rast.',
    },
  ],
  2: [
    {
      name: 'Cherry Plum',
      latinName: 'Prunus cerasifera',
      chakra: 2,
      emotionalState: 'Strach zo straty kontroly, z výbuchu emócií, z „zošalenia"',
      helps: 'Pomáha integrovať intenzívne emócie bez strachu z ich sily',
      affirmation: 'Moje emócie sú mojou silou. Dôverujem ich toku.',
    },
    {
      name: 'Crab Apple',
      latinName: 'Malus pumila',
      chakra: 2,
      emotionalState: 'Pocit nečistoty, hanby za telo, odpor k sebe',
      helps: 'Prináša prijatie vlastného tela a sexuality bez viny',
      affirmation: 'Prijímam svoje telo s láskou. Som čistý/á taký/á aký/á som.',
    },
  ],
  3: [
    {
      name: 'Larch',
      latinName: 'Larix decidua',
      chakra: 3,
      emotionalState: 'Nedostatok sebadôvery, vopred očakávaný neúspech',
      helps: 'Buduje odvahu riskovať a dôverovať vlastným schopnostiam',
      affirmation: 'Som schopný/á. Mám všetko čo potrebujem na úspech.',
    },
    {
      name: 'Centaury',
      latinName: 'Centaurium umbellatum',
      chakra: 3,
      emotionalState: 'Neschopnosť povedať nie, slúženie iným na úkor seba',
      helps: 'Posilňuje osobnú vôľu a schopnosť klásť zdravé hranice',
      affirmation: 'Moje potreby sú rovnako dôležité. Hovorím NIE s láskou.',
    },
    {
      name: 'Cerato',
      latinName: 'Ceratostigma willmottiana',
      chakra: 3,
      emotionalState: 'Nedôvera vlastnej intuícii, neustále hľadanie rady u iných',
      helps: 'Posilňuje vnútorný hlas a dôveru vo vlastný úsudok',
      affirmation: 'Dôverujem svojmu vnútornému vedeniu. Viem čo je pre mňa správne.',
    },
  ],
  4: [
    {
      name: 'Holly',
      latinName: 'Ilex aquifolium',
      chakra: 4,
      emotionalState: 'Žiarlivosť, závisť, podozrievavosť, hnev voči blízkym',
      helps: 'Otvára srdce pre bezpodmienečnú lásku a veľkorysosť',
      affirmation: 'Moje srdce je otvorené. Milujem bez podmienok.',
    },
    {
      name: 'Chicory',
      latinName: 'Cichorium intybus',
      chakra: 4,
      emotionalState: 'Vlastnícka láska, manipulácia cez emócie, požadovanie pozornosti',
      helps: 'Učí milovať slobodne, bez priväzovania a očakávaní',
      affirmation: 'Milujem slobodne. Dávam bez očakávania návratu.',
    },
    {
      name: 'Willow',
      latinName: 'Salix vitellina',
      chakra: 4,
      emotionalState: 'Zatrpknutosť, pocit obeť osudu, resentiment',
      helps: 'Prináša odpustenie a prevzatie zodpovednosti za vlastný život',
      affirmation: 'Preberám zodpovednosť za svoj život. Odpúšťam a posúvam sa ďalej.',
    },
  ],
  5: [
    {
      name: 'Agrimony',
      latinName: 'Agrimonia eupatoria',
      chakra: 5,
      emotionalState: 'Skrývanie trápenia za úsmevom, vyhýbanie sa konfrontácii',
      helps: 'Odvaha byť autentický a vyjadriť skutočné pocity',
      affirmation: 'Vyjadrujm pravdu s jemnosťou. Moja autenticita lieči.',
    },
    {
      name: 'Water Violet',
      latinName: 'Hottonia palustris',
      chakra: 5,
      emotionalState: 'Pýcha, izolácia, neschopnosť požiadať o pomoc',
      helps: 'Otvára komunikáciu a ochotu zdieľať sa s ostatnými',
      affirmation: 'Zdieľam sa s ostatnými. V spojení je sila.',
    },
  ],
  6: [
    {
      name: 'Clematis',
      latinName: 'Clematis vitalba',
      chakra: 6,
      emotionalState: 'Denné snenie, neprítomnosť, útek do fantázie',
      helps: 'Uzemnenie vizionárskej energie do prítomného momentu',
      affirmation: 'Som plne prítomný/á. Moje vízie uskutočňujem tu a teraz.',
    },
    {
      name: 'Wild Oat',
      latinName: 'Bromus ramosus',
      chakra: 6,
      emotionalState: 'Neistota životným smerom, roztrieštenosť záujmov',
      helps: 'Jasnosť vnútorného poslania a smerovanie energie',
      affirmation: 'Vidím svoj životný smer jasne. Nasledujem vnútorné volanie.',
    },
  ],
  7: [
    {
      name: 'Rock Water',
      latinName: 'Aqua petra',
      chakra: 7,
      emotionalState: 'Duchovná rigidita, prísne sebazapieranie, askéza bez radosti',
      helps: 'Flexibilita na duchovnej ceste, radosť z praxe',
      affirmation: 'Moja duchovná cesta je radostná. Prijímam život v plnosti.',
    },
    {
      name: 'Vine',
      latinName: 'Vitis vinifera',
      chakra: 7,
      emotionalState: 'Duchovná nadradenosť, dogmatizmus, vnucovanie vlastnej cesty iným',
      helps: 'Pokora a rešpekt k jedinečnej ceste každého človeka',
      affirmation: 'Vediem príkladom, nie silou. Každý má svoju cestu.',
    },
  ],
};
