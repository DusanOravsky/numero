// Významy políčok mriežky pre Vývojovú metódu (Lívia / Červenák)
// Zdroje:
//   - kniha "Duchovná numerológia" – Lívia Mičková
//   - kniha "Duchovná numerológia pre deti" – Lívia Mičková
//   - prednáška Červenáka (transcript)
//
// Každé políčko v mriežke má iný význam ako pri Charakterovej (Daniláková) metóde
// a navyše sa interpretuje POČET výskytov (0, 1, 2, 3, 4+). Pri jednotke navyše
// rozlišujeme párny vs. nepárny počet (mužské vs. ženské ego).

import type { Language } from '../store/useStore';

export interface DevelopmentalCellMeaning {
  number: number;
  theme: string; // hlavná téma políčka
  description: string; // všeobecný popis
  byCount: {
    none?: string;       // 0× v mriežke
    one?: string;        // 1×
    two?: string;        // 2×
    three?: string;      // 3×
    fourPlus?: string;   // 4+
  };
  // Špeciálna interpretácia pre 1 (párne/nepárne ego)
  parityNote?: { even: string; odd: string };
  recommendation?: string;
}

interface HowToReadStep {
  label: string;
  text: string;
}

interface KarmicCycle {
  label: string;
  period: string;
  desc: string;
}

interface HowToReadData {
  title: string;
  intro: string;
  steps: HowToReadStep[];
  karmicCycles: {
    title: string;
    text: string;
    cycles: KarmicCycle[];
    note: string;
  };
  practicalTip: string;
}

// ─── SK ───────────────────────────────────────────────────────────────────────

const skMeanings: Record<number, DevelopmentalCellMeaning> = {
  1: {
    number: 1,
    theme: 'EGO – vnímanie seba ako oddelenej časti celku',
    description:
      'Jednotka hovorí o miere ega – nakoľko sa človek vníma ako oddelená časť alebo ako súčasť celku. Čím viac jednotiek, tým väčšie ego. Dôležitý je aj párny / nepárny počet – rozlišuje mužské a ženské ego.',
    byCount: {
      none: 'Veľmi nízke ego – človek sa silno vníma ako súčasť celku, môže mať tendenciu strácať sa v iných.',
      one: 'Vyvážené ego – primerané sebauvedomenie.',
      two: 'Stredné ego – cíti potrebu vymedziť sa, ale neprehnane.',
      three: 'Silnejšie ego – jasné hranice, vlastný názor.',
      fourPlus: 'Vysoké ego – riziko egoizmu, sebectva, pýchy. Treba učiť sa pokore a vnímať sa ako súčasť celku.',
    },
    parityNote: {
      even: 'Ženské ego (párny počet jednotiek, napr. 11, 1111) – energia prijímania, otvorenia, plnenia priestoru teplom, trpezlivosti, intuície. Učí, ako byť otvorený svetu a iným ľuďom.',
      odd: 'Mužské ego (nepárny počet jednotiek, napr. 1, 111, 11111) – energia dávania, vymedzovania priestoru, ochrany, akcie a iniciatívy. Učí, ako konať, viesť a vymedziť hranice.',
    },
    recommendation:
      'Polaritu ega porovnaj so svojim biologickým pohlavím: ak je rovnaká (muž s mužským / žena so ženským egom), si v súlade so svojou prirodzenou polaritou — tvoja úloha je rozvíjať tento princíp s múdrosťou. Ak je opačná (muž so ženským / žena s mužským egom), tvoja životná úloha je vedome sa naučiť aj druhú polaritu — to čo chýba, tu prišla duša doplniť.',
  },

  2: {
    number: 2,
    theme: 'BIOENERGIA tela – životná energia, vitalita',
    description:
      'Dvojka hovorí o vnútornej energii tela, bioenergii, ktorú produkujú nadobličky. Je to energia dispozícii počas života. Je vyčerpateľná – treba sa naučiť ňou hospodáriť.',
    byCount: {
      none: 'Bez dvojky – veľmi opatrne s energiou. Odporúčanie: vyhýbať sa nemocniciam, cintorínom (cudzie energie môžu vyčerpávať). Žiadny výkonový šport.',
      one: 'Málo bioenergie – treba sa naučiť šetriť, nehospodáriť na hrane. Múdra gazdinka aj z mála navarí.',
      two: 'Vyvážená bioenergia – primeraná vitalita.',
      three: 'Silná energia – človek potrebuje pohyb, dynamiku, inak sa energia "tlačí" do hlavy.',
      fourPlus: 'Veľmi silná energia – nemôže obsedieť, potrebuje výkonový šport, dlhé pochody, pohyb. Bez pohybu sa stáva podráždený.',
    },
    recommendation:
      'Počúvaj telo: keď si pýta oddych, vaňu, spánok – dopraj mu to. Ignorácia je toxická. Pri málo dvojkách je výkonový šport zlá voľba.',
  },

  3: {
    number: 3,
    theme: 'VNÚTORNÁ MÚDROSŤ – "vnútorný internet"',
    description:
      'Trojka je schopnosť vstrebávať múdrosť cez seba zvnútra. Je to vnútorný internet – človek nemusí veci dlho vysvetľovať, pochopí ich rýchlo, "zvnútra".',
    byCount: {
      none: 'Múdrosť získava skôr cez vonkajšie zdroje a skúsenosť, nie intuitívne.',
      one: 'Funkčný vnútorný zdroj múdrosti.',
      two: 'Silná intuitívna múdrosť, ľahko chápe podstatu.',
      three: 'Veľmi silná vnútorná múdrosť – povieš raz, pochopí.',
      fourPlus: 'Geniálne vnímanie. Pozor – ak má dieťa veľa trojok aj veľa dvojok, môže mať problém v škole (rýchlo pochopí a otravuje), môže pohrdať učiteľom. Hyperaktivita je často iba prejav nudy.',
    },
    recommendation:
      'Pri deťoch s viac trojkami a dvojkami – nepatologizovať. Potrebujú viac podnetov, nie liekov. Ako rodič dieťaťa s veľa trojkami chrániť ho pred pohrdaním učiteľmi.',
  },

  4: {
    number: 4,
    theme: 'SEBAVEDOMIE',
    description:
      'Štvorka ukazuje úroveň sebavedomia. Optimálny počet je 1.',
    byCount: {
      none: 'Nízke sebavedomie, ALE zároveň vysoký potenciál si ho zvýšiť. Človek môže byť veľmi kritický voči sebe, často mal v detstve kritických rodičov. Riešenie: afirmácie, sústredenie sa na pozitívne aspekty, čo už dokázal.',
      one: 'Optimálne, zdravé sebavedomie – ani prepísknuté, ani potlačené.',
      two: 'Sebavedomie na druhú – tvrdohlavosť. Učí sa cez vlastnú skúsenosť, nedá sa ľahko presvedčiť.',
      three: 'Veľmi vysoká tvrdohlavosť – musí si všetko zažiť sám, niekedy aj na úkor zdravia. Vysoká odolnosť, vysoká imunita.',
      fourPlus: 'Extrémna tvrdohlavosť – život ho učí cez tvrdé skúsenosti.',
    },
    recommendation:
      'Pri 0 štvorkach: 7-dňová audio nahrávka pozitívnych afirmácií, denne. Pri 2+ štvorkách: vedome si dovoliť aj iné stratégie ako "len cez vlastnú skúsenosť".',
  },

  5: {
    number: 5,
    theme: 'INTUÍCIA – schopnosť cítiť, čo je správne',
    description:
      'Päťka je prvý "feeling", pocit, že "takto to je". Schopnosť vyciťovať vnútra.',
    byCount: {
      none: 'Bez intuície – človek si potlačuje to, čo cíti, žije podľa vonkajších rád. Úloha: vrátiť sa k intuícii, počúvať vlastné pocity.',
      one: 'Zdravá, fungujúca intuícia.',
      two: 'Silná intuícia.',
      three: 'Veľmi silná intuícia, niekedy v rozpore s tým, čo iní hovoria.',
      fourPlus: 'Mimoriadne silná intuícia – riziko, že človek úplne potlačí to, čo cíti, lebo je to v rozpore s okolím. Treba sa vrátiť k intuícii a začať jej veriť.',
    },
    recommendation: 'Neignoruj intuíciu – ignorácia je toxická.',
  },

  6: {
    number: 6,
    theme: 'VYTRVALOSŤ – schopnosť dokončovať',
    description:
      'Šestka ukazuje schopnosť doťahovať veci do konca. Optimálny počet je 1.',
    byCount: {
      none: 'Bez šestky – tendencia nedokončovať, nechávať rozrobené. Úloha v tomto živote: učiť sa doťahovať veci do konca, vedome ukončovať procesy (varíš až po upratanie kuchyne, projekt až po archiváciu).',
      one: 'Zdravá vytrvalosť.',
      two: 'Mág / čarodejnica – človek vie pracovať s energiami. Treba pracovať na čistote zámeru, lebo manipulácia (aj "v dobrej viere") sa vracia.',
      three: 'Silnejší mág – schopnosť ovplyvňovať energiou, riziko nesprávneho použitia (manipulácia, podmienené "pomáhanie"). Treba strážiť negatívne myšlienky – zhmotňujú sa rýchlo.',
      fourPlus: 'Veľmi silná energia – treba dôslednú prácu so zámermi a myšlienkami.',
    },
    recommendation:
      'Pri 2+ šestkách: technika ho\'oponopono – nahradiť negatívnu myšlienku okamžite, kým sa nenamotá. Cieľom je vyčistiť aj nevedomé negatívne vzorce.',
  },

  7: {
    number: 7,
    theme: 'DÔVERA, VIERA',
    description:
      'Sedmička je o dôvere – komu a čomu veriť. Slovo "dô-vera" má v sebe "viera".',
    byCount: {
      none: 'Vysoký potenciál zvýšiť si sebadôveru. Často priťahuje ľudí, ktorí mu prejavujú nedôveru, aby sa naučil dôverovať sám sebe. Útek nepomôže – treba zmeniť čosi v sebe.',
      one: 'Zdravá dôvera.',
      two: 'Otvorenejší človek, ženský princíp.',
      three: 'Ľahko dôverujúci, otvorený.',
      fourPlus: 'Riziko naivity – dôverovať aj tam, kde všetko hovorí, že nie. Treba dôverovať najmä vlastnej intuícii (päťke).',
    },
    recommendation:
      'Pri 0 sedmičkách: pozri "do náhľadu" – emócie, zmysly, spirituálnu úroveň, racionálne zhodnotenie. Tomu potom dôveruj.',
  },

  8: {
    number: 8,
    theme: 'LÁSKA – škola lásky',
    description:
      'Osmička ukazuje, ako rozumieš láske vo všetkých jej podobách: rodičovskej, partnerskej, súrodeneckej, k deťom...',
    byCount: {
      none: '"Prvák v škole lásky" – prišiel si sa ju učiť od základov. Spoznáš podmienené aj nepodmienené formy lásky. Dovoľ si milovať aj nesprávne – tak sa to naučíš (ako keď padáš pri učení chodiť).',
      one: 'Zdravá schopnosť milovať.',
      two: 'Silná schopnosť lásky.',
      three: '"Slniečka" – milujú každého, otvorení voči všetkým. Niekedy nerozumejú, prečo nie všetci opačne reagujú rovnako.',
      fourPlus: 'Veľmi otvorení voči láske – môžu nerozumieť, že iní sú "v inej triede" v škole lásky.',
    },
    recommendation:
      'Pamätaj: každý je v škole lásky inde. Nedá sa očakávať, že "deviatak" a "prvák" rozumejú láske rovnako. Neporovnávaj.',
  },

  9: {
    number: 9,
    theme: 'HMOTNÝ SVET – financie, majetok',
    description:
      'Deviatka ukazuje vzťah k hmotnému svetu, peniazom, financiám.',
    byCount: {
      none: 'Vysoký potenciál učiť sa narábať s peniazmi.',
      one: 'Žiť "od výplaty k výplate", zo zamestnania. Nedostávať sa do dlhov.',
      two: 'Peniaze prichádzajú vtedy, keď sú treba. Človek nemusí mať veľa, ale núdzu nezažije.',
      three: 'Hazardéri – myslia vo veľkých číslach. Ľahko prídu, ľahko odídu.',
      fourPlus: 'Múdri vo financiách. Vedia, že na luxus si nepožičiavajú, na luxus nepoužijú posledné. Najvyššia úroveň: aktíva → pasívny príjem → luxus.',
    },
    recommendation:
      'Princíp: 5–10 % každý mesiac odložiť, vytvoriť kapitál, investovať do aktív, ktoré zarábajú za teba. Luxus si dovoľ z výnosov, nie zo základných zdrojov.',
  },
};

const skGridIntro = `Vývojová mriežka sa líši od klasickej v tom, že do mriežky vstupujú aj 4 "zakrúžkované" pomocné čísla, ktoré ukazujú karmické cykly a životnú školu duše. Mriežka neukazuje, "kto si", ale "čo si sa prišiel naučiť". Roky 2000+ sa počítajú špeciálne (rok = 20 + zvyšok). Zdroj: kniha Lívia Mičková – Duchovná numerológia.`;

const skHowToRead: HowToReadData = {
  title: 'Ako čítať vývojovú mriežku',
  intro: 'Mriežka nie je „diagnóza" — je to mapa životných lekcií. Nuly nie sú nedostatky, ale úlohy, s ktorými si sa narodil. Vysoké počty nie sú automaticky dar — môžu byť aj výzva na zvládnutie.',
  steps: [
    {
      label: '1. Začni od K3 — životné poslanie',
      text: 'Tretie zakrúžkované číslo (K3) je najdôležitejšie. Je to hlavná téma, pre ktorú si sa sem prišiel. Nájdi ho v mriežke a prečítaj si jeho význam — to je tvoja "červená niť".',
    },
    {
      label: '2. Pozri sa na nuly — životné úlohy',
      text: 'Políčka bez čísla (prázdne bunky) ukazujú oblasti, kde sa máš v tomto živote naučiť niečo nové. Nie sú to slabiny — sú to lekcie. Venuj im pozornosť a buď k sebe trpezlivý.',
    },
    {
      label: '3. Vysoké počty (3+) — dary aj výzvy',
      text: 'Čísla, ktoré sa opakujú 3× a viac, ukazujú silnú energiu. Ak ju vieš nasmerovať, je to dar. Ak nie — stáva sa záťažou. Prečítaj si odporúčanie pri danom čísle.',
    },
    {
      label: '4. Ego polarita — mužský/ženský princíp',
      text: 'Počet jednotiek (párny vs. nepárny) určuje polaritu tvojho ega. Porovnaj ju s biologickým pohlavím — ak sú opačné, tvojou úlohou je vedome integrovať druhú polaritu.',
    },
    {
      label: '5. Kombinácie — čo jednotlivé bunky neprezradia',
      text: 'Niektoré dvojice čísel vytvárajú špecifické vzorce (napr. veľa trojok + dvojok = "bystrá myseľ + nepokojné telo"). Pozri sekciu Kombinácie nižšie — tam sú tvojim číslam prispôsobené postrehy.',
    },
  ],
  karmicCycles: {
    title: 'Kedy sa K1–K4 aktivujú v živote',
    text: 'Karmické cykly nie sú naraz aktívne — zapínajú sa postupne:',
    cycles: [
      { label: 'K1 — Psychická stabilita', period: '0 – cca 30 rokov', desc: 'Budovanie vnútorného sebaobrazu, hľadanie identity.' },
      { label: 'K2 — Materiálna stabilita', period: 'cca 30 – 50 rokov', desc: 'Zabezpečenie, kariéra, hmotný základ.' },
      { label: 'K3 — Životné poslanie ★', period: 'cca 50+ rokov (ale téma rezonuje celý život)', desc: 'Hlavná životná úloha — to, prečo si tu.' },
      { label: 'K4 — Detské sny', period: 'neskorší vek', desc: 'Návrat k pôvodným snom a radosti z detstva.' },
    ],
    note: 'Hranice nie sú ostré — cykly sa prekrývajú. K3 je aktívne celý život ako "pozadie", no naplno rezonuje po 50-ke.',
  },
  practicalTip: 'Nezačínaj od všetkého naraz. Vyber si jednu oblasť (napr. najvýraznejšiu nulu alebo K3) a venuj sa jej mesiac. Pozoruj, čo sa v živote zmení. Mriežka je kompas — nie zoznam úloh na zajtra.',
};

// ─── EN ───────────────────────────────────────────────────────────────────────

const enMeanings: Record<number, DevelopmentalCellMeaning> = {
  1: {
    number: 1,
    theme: 'EGO – perception of self as a separate part of the whole',
    description:
      'The number 1 speaks about the degree of ego – how much a person perceives themselves as separate versus part of the whole. The more ones, the stronger the ego. The even/odd count also matters – it distinguishes masculine and feminine ego.',
    byCount: {
      none: 'Very low ego – the person strongly feels as part of the whole, may tend to lose themselves in others.',
      one: 'Balanced ego – appropriate self-awareness.',
      two: 'Moderate ego – feels the need to differentiate, but not excessively.',
      three: 'Stronger ego – clear boundaries, own opinion.',
      fourPlus: 'High ego – risk of selfishness, vanity, pride. Needs to learn humility and perceive oneself as part of the whole.',
    },
    parityNote: {
      even: 'Feminine ego (even count of ones, e.g. 11, 1111) – energy of receiving, opening, filling space with warmth, patience, intuition. Teaches how to be open to the world and other people.',
      odd: 'Masculine ego (odd count of ones, e.g. 1, 111, 11111) – energy of giving, defining space, protection, action and initiative. Teaches how to act, lead and set boundaries.',
    },
    recommendation:
      'Compare your ego polarity with your biological sex: if they match (male with masculine / female with feminine ego), you are aligned with your natural polarity — your task is to develop this principle wisely. If opposite (male with feminine / female with masculine ego), your life task is to consciously learn the other polarity — what is missing is what the soul came here to integrate.',
  },

  2: {
    number: 2,
    theme: 'BIOENERGY of the body – life force, vitality',
    description:
      'The number 2 speaks about the body\'s inner energy, bioenergy produced by the adrenal glands. This is the energy available throughout life. It is depletable – one must learn to manage it wisely.',
    byCount: {
      none: 'No twos – be very careful with energy. Recommendation: avoid hospitals, cemeteries (foreign energies can drain you). No high-performance sport.',
      one: 'Low bioenergy – must learn to conserve, not to operate on the edge. A wise steward can make much from little.',
      two: 'Balanced bioenergy – adequate vitality.',
      three: 'Strong energy – the person needs movement, dynamics, otherwise the energy "pushes" into the head.',
      fourPlus: 'Very strong energy – cannot sit still, needs high-performance sport, long walks, movement. Without movement, becomes irritable.',
    },
    recommendation:
      'Listen to your body: when it asks for rest, a bath, sleep – give it that. Ignoring it is toxic. With few twos, high-performance sport is a bad choice.',
  },

  3: {
    number: 3,
    theme: 'INNER WISDOM – "inner internet"',
    description:
      'The number 3 is the ability to absorb wisdom from within. It is an inner internet – the person does not need lengthy explanations, they understand quickly, "from inside".',
    byCount: {
      none: 'Gains wisdom more through external sources and experience, not intuitively.',
      one: 'Functional inner source of wisdom.',
      two: 'Strong intuitive wisdom, easily grasps the essence.',
      three: 'Very strong inner wisdom – tell them once, they understand.',
      fourPlus: 'Brilliant perception. Caution – if a child has many threes and many twos, they may have school issues (understands quickly and gets bored), may look down on teachers. Hyperactivity is often just a sign of boredom.',
    },
    recommendation:
      'For children with many threes and twos – do not pathologize. They need more stimulation, not medication. As a parent of a child with many threes, protect them from contempt toward teachers.',
  },

  4: {
    number: 4,
    theme: 'SELF-CONFIDENCE',
    description:
      'The number 4 shows the level of self-confidence. The optimal count is 1.',
    byCount: {
      none: 'Low self-confidence, BUT also the highest potential to build it. The person may be very self-critical, often had critical parents in childhood. Solution: affirmations, focusing on positive aspects, what has already been achieved.',
      one: 'Optimal, healthy self-confidence – neither overblown nor suppressed.',
      two: 'Self-confidence squared – stubbornness. Learns through own experience, not easily persuaded.',
      three: 'Very high stubbornness – must experience everything firsthand, sometimes at the cost of health. High resilience, high immunity.',
      fourPlus: 'Extreme stubbornness – life teaches through hard experiences.',
    },
    recommendation:
      'With 0 fours: 7-day audio recording of positive affirmations, daily. With 2+ fours: consciously allow strategies other than "only through own experience".',
  },

  5: {
    number: 5,
    theme: 'INTUITION – the ability to feel what is right',
    description:
      'The number 5 is the first "feeling", the sense that "this is how it is". The ability to sense from within.',
    byCount: {
      none: 'No intuition – the person suppresses what they feel, lives by external advice. Task: return to intuition, listen to own feelings.',
      one: 'Healthy, functioning intuition.',
      two: 'Strong intuition.',
      three: 'Very strong intuition, sometimes at odds with what others say.',
      fourPlus: 'Extraordinarily strong intuition – risk that the person completely suppresses what they feel because it conflicts with surroundings. Must return to intuition and start trusting it.',
    },
    recommendation: 'Do not ignore intuition – ignoring it is toxic.',
  },

  6: {
    number: 6,
    theme: 'PERSEVERANCE – the ability to finish things',
    description:
      'The number 6 shows the ability to follow through to completion. The optimal count is 1.',
    byCount: {
      none: 'No sixes – tendency to leave things unfinished, to start but not complete. Life task: learn to finish things, consciously close processes (cook only after tidying the kitchen, archive a project after completion).',
      one: 'Healthy perseverance.',
      two: 'Mage / sorceress – the person can work with energies. Must work on purity of intention, because manipulation (even "well-meaning") comes back.',
      three: 'Stronger mage – ability to influence with energy, risk of misuse (manipulation, conditional "helping"). Must guard negative thoughts – they materialize quickly.',
      fourPlus: 'Very strong energy – requires diligent work with intentions and thoughts.',
    },
    recommendation:
      'With 2+ sixes: ho\'oponopono technique – replace a negative thought immediately before it spirals. The goal is to clear even unconscious negative patterns.',
  },

  7: {
    number: 7,
    theme: 'TRUST, FAITH',
    description:
      'The number 7 is about trust – whom and what to believe in. Trust in oneself and in life.',
    byCount: {
      none: 'High potential to build self-trust. Often attracts people who show distrust, so they can learn to trust themselves. Running away does not help – something within must change.',
      one: 'Healthy trust.',
      two: 'More open person, feminine principle.',
      three: 'Trusts easily, open.',
      fourPlus: 'Risk of naivety – trusting even where everything says otherwise. Must trust primarily own intuition (the fives).',
    },
    recommendation:
      'With 0 sevens: look "into preview" – emotions, senses, spiritual level, rational evaluation. Then trust that.',
  },

  8: {
    number: 8,
    theme: 'LOVE – the school of love',
    description:
      'The number 8 shows how you understand love in all its forms: parental, romantic, sibling, toward children...',
    byCount: {
      none: '"First-grader in the school of love" – you came to learn it from the basics. You will encounter both conditional and unconditional forms of love. Allow yourself to love imperfectly – that is how you learn (like falling when learning to walk).',
      one: 'Healthy ability to love.',
      two: 'Strong capacity for love.',
      three: '"Little suns" – they love everyone, open to all. Sometimes do not understand why others do not respond the same way.',
      fourPlus: 'Very open to love – may not understand that others are "in a different grade" in the school of love.',
    },
    recommendation:
      'Remember: everyone is at a different level in the school of love. You cannot expect a "ninth-grader" and a "first-grader" to understand love the same way. Do not compare.',
  },

  9: {
    number: 9,
    theme: 'MATERIAL WORLD – finances, possessions',
    description:
      'The number 9 shows the relationship to the material world, money, finances.',
    byCount: {
      none: 'High potential to learn how to handle money.',
      one: 'Living "paycheck to paycheck", from employment. Avoid getting into debt.',
      two: 'Money comes when needed. The person may not have much, but never experiences lack.',
      three: 'Gamblers – think in big numbers. Easy come, easy go.',
      fourPlus: 'Wise with finances. Know not to borrow for luxury, not to use the last resources for luxury. Highest level: assets → passive income → luxury.',
    },
    recommendation:
      'Principle: save 5–10% each month, build capital, invest in assets that earn for you. Allow luxury only from returns, not from base resources.',
  },
};

const enGridIntro = `The developmental grid differs from the classic one by including 4 "circled" auxiliary numbers that reveal karmic cycles and the soul's life school. The grid does not show "who you are" but "what you came to learn". Years 2000+ are calculated specially (year = 20 + remainder). Source: Livia Mickova – Spiritual Numerology.`;

const enHowToRead: HowToReadData = {
  title: 'How to read the developmental grid',
  intro: 'The grid is not a "diagnosis" — it is a map of life lessons. Zeros are not deficiencies but tasks you were born with. High counts are not automatically gifts — they can also be challenges to master.',
  steps: [
    {
      label: '1. Start with K3 — life purpose',
      text: 'The third circled number (K3) is the most important. It is the main theme you came here for. Find it in the grid and read its meaning — that is your "red thread".',
    },
    {
      label: '2. Look at the zeros — life tasks',
      text: 'Empty cells (no number) show areas where you are meant to learn something new in this life. They are not weaknesses — they are lessons. Give them attention and be patient with yourself.',
    },
    {
      label: '3. High counts (3+) — gifts and challenges',
      text: 'Numbers that repeat 3 or more times show strong energy. If you can direct it, it is a gift. If not — it becomes a burden. Read the recommendation for that number.',
    },
    {
      label: '4. Ego polarity — masculine/feminine principle',
      text: 'The count of ones (even vs. odd) determines your ego polarity. Compare it with your biological sex — if opposite, your task is to consciously integrate the other polarity.',
    },
    {
      label: '5. Combinations — what individual cells do not reveal',
      text: 'Certain pairs of numbers create specific patterns (e.g. many threes + twos = "sharp mind + restless body"). See the Combinations section below — insights tailored to your numbers.',
    },
  ],
  karmicCycles: {
    title: 'When K1–K4 activate in life',
    text: 'Karmic cycles are not all active at once — they switch on progressively:',
    cycles: [
      { label: 'K1 — Psychological stability', period: '0 – approx. 30 years', desc: 'Building inner self-image, seeking identity.' },
      { label: 'K2 — Material stability', period: 'approx. 30 – 50 years', desc: 'Security, career, material foundation.' },
      { label: 'K3 — Life purpose ★', period: 'approx. 50+ years (but the theme resonates throughout life)', desc: 'Main life task — why you are here.' },
      { label: 'K4 — Childhood dreams', period: 'later age', desc: 'Return to original dreams and childhood joy.' },
    ],
    note: 'Boundaries are not sharp — cycles overlap. K3 is active as a "background" throughout life, but fully resonates after 50.',
  },
  practicalTip: 'Do not start with everything at once. Pick one area (e.g. the most prominent zero or K3) and focus on it for a month. Observe what changes in your life. The grid is a compass — not a to-do list for tomorrow.',
};

// ─── ACCESSOR FUNCTIONS ───────────────────────────────────────────────────────

export function getCellMeaning(digit: number, lang: Language = 'sk'): DevelopmentalCellMeaning {
  const source = lang === 'en' ? enMeanings : skMeanings;
  return source[digit];
}

export function getGridIntro(lang: Language = 'sk'): string {
  return lang === 'en' ? enGridIntro : skGridIntro;
}

export function getHowToRead(lang: Language = 'sk'): HowToReadData {
  return lang === 'en' ? enHowToRead : skHowToRead;
}

// ─── BACKWARD COMPAT EXPORTS ──────────────────────────────────────────────────

export const developmentalMeanings: Record<number, DevelopmentalCellMeaning> = skMeanings;
export const developmentalGridIntro: string = skGridIntro;
export const developmentalHowToRead = skHowToRead;
