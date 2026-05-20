// Významy políčok mriežky pre Vývojovú metódu (Lívia / Červenák)
// Zdroje:
//   - kniha "Duchovná numerológia" – Lívia Mičková
//   - kniha "Duchovná numerológia pre deti" – Lívia Mičková
//   - prednáška Červenáka (transcript)
//
// Každé políčko v mriežke má iný význam ako pri Charakterovej (Daniláková) metóde
// a navyše sa interpretuje POČET výskytov (0, 1, 2, 3, 4+). Pri jednotke navyše
// rozlišujeme párny vs. nepárny počet (mužské vs. ženské ego).

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

export const developmentalMeanings: Record<number, DevelopmentalCellMeaning> = {
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
      'Pri 0 štvorkach: 7-dňová audio nahrávka pozitívnych afirmácií, denne. Pri 2+ štvorkach: vedome si dovoliť aj iné stratégie ako "len cez vlastnú skúsenosť".',
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

export const developmentalGridIntro = `Vývojová mriežka sa líši od klasickej v tom, že do mriežky vstupujú aj 4 "zakrúžkované" pomocné čísla, ktoré ukazujú karmické cykly a životnú školu duše. Mriežka neukazuje, "kto si", ale "čo si sa prišiel naučiť". Roky 2000+ sa počítajú špeciálne (rok = 20 + zvyšok). Zdroj: kniha Lívia Mičková – Duchovná numerológia.`;

export const developmentalHowToRead = {
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
