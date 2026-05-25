import type { Language } from '../store/useStore';

export interface BachFlower {
  name: string;
  latinName: string;
  chakra: number;
  emotionalState: string;
  helps: string;
  affirmation: string;
}

const sk: Record<number, BachFlower[]> = {
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

const en: Record<number, BachFlower[]> = {
  1: [
    {
      name: 'Mimulus',
      latinName: 'Mimulus guttatus',
      chakra: 1,
      emotionalState: 'Specific fears — fear of poverty, illness, loneliness',
      helps: 'Gives courage to face known fears with calm and trust',
      affirmation: 'I face life with courage. I am safe.',
    },
    {
      name: 'Rock Rose',
      latinName: 'Helianthemum nummularium',
      chakra: 1,
      emotionalState: 'Acute terror, panic, helplessness in crisis',
      helps: 'Brings inner strength and peace even in extreme situations',
      affirmation: 'Even in the storm I find inner peace and strength to act.',
    },
    {
      name: 'Aspen',
      latinName: 'Populus tremula',
      chakra: 1,
      emotionalState: 'Vague fears, premonitions, anxiety without obvious cause',
      helps: 'Transforms dark premonitions into trust in the unknown',
      affirmation: 'I trust life. The unknown brings me growth.',
    },
  ],
  2: [
    {
      name: 'Cherry Plum',
      latinName: 'Prunus cerasifera',
      chakra: 2,
      emotionalState: 'Fear of losing control, of emotional outbursts, of "going crazy"',
      helps: 'Helps integrate intense emotions without fear of their power',
      affirmation: 'My emotions are my strength. I trust their flow.',
    },
    {
      name: 'Crab Apple',
      latinName: 'Malus pumila',
      chakra: 2,
      emotionalState: 'Feeling of impurity, body shame, self-disgust',
      helps: 'Brings acceptance of one\'s body and sexuality without guilt',
      affirmation: 'I accept my body with love. I am pure just as I am.',
    },
  ],
  3: [
    {
      name: 'Larch',
      latinName: 'Larix decidua',
      chakra: 3,
      emotionalState: 'Lack of self-confidence, expecting failure in advance',
      helps: 'Builds courage to take risks and trust one\'s own abilities',
      affirmation: 'I am capable. I have everything I need to succeed.',
    },
    {
      name: 'Centaury',
      latinName: 'Centaurium umbellatum',
      chakra: 3,
      emotionalState: 'Inability to say no, serving others at own expense',
      helps: 'Strengthens personal will and ability to set healthy boundaries',
      affirmation: 'My needs are equally important. I say NO with love.',
    },
    {
      name: 'Cerato',
      latinName: 'Ceratostigma willmottiana',
      chakra: 3,
      emotionalState: 'Distrust of own intuition, constantly seeking advice from others',
      helps: 'Strengthens inner voice and trust in own judgment',
      affirmation: 'I trust my inner guidance. I know what is right for me.',
    },
  ],
  4: [
    {
      name: 'Holly',
      latinName: 'Ilex aquifolium',
      chakra: 4,
      emotionalState: 'Jealousy, envy, suspicion, anger toward loved ones',
      helps: 'Opens the heart to unconditional love and generosity',
      affirmation: 'My heart is open. I love without conditions.',
    },
    {
      name: 'Chicory',
      latinName: 'Cichorium intybus',
      chakra: 4,
      emotionalState: 'Possessive love, emotional manipulation, demanding attention',
      helps: 'Teaches to love freely, without attachment and expectations',
      affirmation: 'I love freely. I give without expecting return.',
    },
    {
      name: 'Willow',
      latinName: 'Salix vitellina',
      chakra: 4,
      emotionalState: 'Bitterness, feeling like a victim of fate, resentment',
      helps: 'Brings forgiveness and taking responsibility for one\'s own life',
      affirmation: 'I take responsibility for my life. I forgive and move forward.',
    },
  ],
  5: [
    {
      name: 'Agrimony',
      latinName: 'Agrimonia eupatoria',
      chakra: 5,
      emotionalState: 'Hiding suffering behind a smile, avoiding confrontation',
      helps: 'Courage to be authentic and express true feelings',
      affirmation: 'I express truth with gentleness. My authenticity heals.',
    },
    {
      name: 'Water Violet',
      latinName: 'Hottonia palustris',
      chakra: 5,
      emotionalState: 'Pride, isolation, inability to ask for help',
      helps: 'Opens communication and willingness to share with others',
      affirmation: 'I share with others. There is strength in connection.',
    },
  ],
  6: [
    {
      name: 'Clematis',
      latinName: 'Clematis vitalba',
      chakra: 6,
      emotionalState: 'Daydreaming, absence, escape into fantasy',
      helps: 'Grounding visionary energy into the present moment',
      affirmation: 'I am fully present. I realize my visions here and now.',
    },
    {
      name: 'Wild Oat',
      latinName: 'Bromus ramosus',
      chakra: 6,
      emotionalState: 'Uncertainty about life direction, scattered interests',
      helps: 'Clarity of inner calling and direction of energy',
      affirmation: 'I see my life direction clearly. I follow the inner calling.',
    },
  ],
  7: [
    {
      name: 'Rock Water',
      latinName: 'Aqua petra',
      chakra: 7,
      emotionalState: 'Spiritual rigidity, strict self-denial, joyless asceticism',
      helps: 'Flexibility on the spiritual path, joy in practice',
      affirmation: 'My spiritual path is joyful. I embrace life in fullness.',
    },
    {
      name: 'Vine',
      latinName: 'Vitis vinifera',
      chakra: 7,
      emotionalState: 'Spiritual superiority, dogmatism, imposing own path on others',
      helps: 'Humility and respect for the unique path of every person',
      affirmation: 'I lead by example, not by force. Everyone has their own path.',
    },
  ],
};

export const BACH_FLOWERS_BY_CHAKRA: Record<number, BachFlower[]> = sk;

export function getBachFlowersByChakra(chakra: number, lang: Language = 'sk'): BachFlower[] {
  return lang === 'en' ? (en[chakra] || []) : (sk[chakra] || []);
}

export function getAllBachFlowers(lang: Language = 'sk'): BachFlower[] {
  const data = lang === 'en' ? en : sk;
  return Object.values(data).flat();
}
