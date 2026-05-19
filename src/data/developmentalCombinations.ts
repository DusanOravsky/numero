// Pozoruhodné kombinácie čísel v Vývojovej mriežke (Lívia / Mičková).
// Každá kombinácia má podmienku, hlavičku a stručný popis. Popisy sú vlastné syntézy
// princípov z knihy Lívia Mičková – Duchovná numerológia, nie doslovné citácie.

import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';

export interface DevelopmentalCombination {
  id: string;
  title: string;
  /** Krátky popis – čo to znamená pre osobu/dieťa */
  description: string;
  /** Odporúčanie pre prácu s touto kombináciou */
  recommendation?: string;
  /** Závažnosť: info / pozor / sila */
  tone: 'info' | 'warn' | 'gift';
  /** Funkcia, ktorá vyhodnotí, či kombinácia platí pre daný profil */
  matches: (r: DevelopmentalNumerologyResult) => boolean;
}

const c = (n: number, r: DevelopmentalNumerologyResult) => r.counts[n] || 0;

export const developmentalCombinations: DevelopmentalCombination[] = [
  // === SCHOPNOSŤ UČIŤ SA + HYPERAKTIVITA ===
  {
    id: 'fast-learner-restless',
    title: 'Bystrá myseľ + nepokojné telo',
    description:
      'Veľa trojok (vnútorná múdrosť, „internet") spolu s viacerými dvojkami (silná bioenergia tela) – človek pochopí veci rýchlo, ale telo nedokáže obsedieť. U detí sa to často nesprávne označuje ako hyperaktivita.',
    recommendation:
      'Pri deťoch: nedávať liečby na hyperaktivitu, ale viac podnetov a pohybu. Po pochopení potrebujú motorický odventil. U dospelých: pohyb je súčasť mentálnej hygieny.',
    tone: 'gift',
    matches: r => c(3, r) >= 3 && c(2, r) >= 3,
  },

  // === EGO + SEBAVEDOMIE ===
  {
    id: 'high-ego-low-confidence',
    title: 'Vysoké ego + nízke sebavedomie',
    description:
      'Veľa jednotiek (3+ ego) a žiadna štvorka (chýbajúce sebavedomie). Navonok môže pôsobiť panovačne alebo dominantne, vnútri ale často pociťuje, že nie je „dosť dobrý". Ego kompenzuje vnútornú neistotu.',
    recommendation:
      'Pracovať s afirmáciami zameranými na vlastnú hodnotu. Hľadanie hodnoty mimo výkonu a kontroly. Bezpečné prostredie (terapia, blízke osoby), kde nemusí dokazovať.',
    tone: 'warn',
    matches: r => c(1, r) >= 3 && c(4, r) === 0,
  },
  {
    id: 'low-ego-low-confidence',
    title: 'Nízke ego + nízke sebavedomie',
    description:
      'Žiadne alebo jedna jednotka (slabé ego) a žiadna štvorka. Človek ľahko podlieha vplyvu iných, stratí sa v skupine, nevie sa presadiť. Často mu chýba vnútorný kompas „čo chcem ja".',
    recommendation:
      'Tréning vyjadrenia osobných potrieb. Cvičenie „dnes urobím jedno rozhodnutie len pre seba". Hľadanie samostatných záujmov a rozhodnutí.',
    tone: 'warn',
    matches: r => c(1, r) <= 1 && c(4, r) === 0,
  },
  {
    id: 'high-confidence-stubborn',
    title: 'Veľmi tvrdohlavé sebavedomie',
    description:
      '3 a viac štvoriek. Človek si potrebuje VŠETKO zažiť sám. Rady iných odmieta, kým sa nepoučí cez vlastnú skúsenosť – aj na úkor zdravia alebo vzťahov.',
    recommendation:
      'Vedome si dovoliť počúvať aj iné cesty pred „vlastnou skúsenosťou". Cvičenie pokory: „Kto z mojho okolia toto už zažil?". Pri deťoch: nezakazovať, ale vysvetľovať dôsledky.',
    tone: 'warn',
    matches: r => c(4, r) >= 3,
  },

  // === INTUÍCIA ===
  {
    id: 'strong-intuition-no-trust',
    title: 'Silná intuícia + slabá dôvera',
    description:
      'Veľa päťiek (intuícia 3+) a žiadna alebo jedna sedmička. Človek silno cíti, čo je správne, ale neverí si, ignoruje vnútorný hlas a sleduje radu iných. Často sa potom diví: „Predsa som to vedel/a."',
    recommendation:
      'Denník intuícií: zaznamenať predtuchy a potom skontrolovať, ako to dopadlo. Buduje sa tým dôvera vo vlastný hlas.',
    tone: 'warn',
    matches: r => c(5, r) >= 3 && c(7, r) <= 1,
  },
  {
    id: 'no-intuition-needs-rules',
    title: 'Bez intuície – potreba systému',
    description:
      'Žiadna päťka. Človek si potrebuje vytvárať pravidlá a logické postupy, lebo „cítenie" mu neslúži ako spoľahlivý kompas. Vyhovujú mu fakty, plány, štruktúry.',
    recommendation:
      'Neignorovať pocity, len ich brať ako jeden zo zdrojov. Telesné meditácie a body-scan môžu otvoriť kanál intuície postupne.',
    tone: 'info',
    matches: r => c(5, r) === 0,
  },

  // === BIOENERGIA TELA (číslo 2) ===
  {
    id: 'no-bioenergy',
    title: 'Bez 2 – krehká bioenergia tela',
    description:
      'Žiadna dvojka v mriežke. Telo má nižšiu prirodzenú zásobu energie. Je dôležité s ňou múdro hospodáriť — vyhýbať sa preťaženiu, výkonovému športu na hrane a vystavovaniu sa "ťažkým" miestam (cintoríny, nemocnice), kde môže ľahko dôjsť k vyčerpaniu.',
    recommendation:
      'Počúvať telo: keď si pýta oddych, vaňu, spánok — dopraj mu to. Pravidelné regeneračné rituály (jemný strečing, dýchanie, kvalitný spánok). Šport zvoľ skôr nízkou intenzitou (jóga, prechádzky), nie výkonový.',
    tone: 'warn',
    matches: r => c(2, r) === 0,
  },

  // === VNÚTORNÁ MÚDROSŤ (číslo 3) ===
  {
    id: 'no-inner-wisdom',
    title: 'Bez 3 – učenie cez vonkajšie zdroje',
    description:
      'Žiadna trojka v mriežke. Vnútorný "internet" (priame chápanie podstaty) nie je pre teba prirodzený nástroj. Múdrosť získavaš skôr cez knihy, učiteľov, autority a vlastnú skúsenosť, nie intuitívnym vhľadom.',
    recommendation:
      'Vyhľadávať kvalitné zdroje a mentorov. Nezľahčovať si proces učenia — to, čo iní pochopia hneď, ty pochopíš poriadne až cez systém a opakovanie. Tvoja sila je v štruktúrovanom učení.',
    tone: 'info',
    matches: r => c(3, r) === 0,
  },

  // === DÔVERA / VIERA (číslo 7) ===
  {
    id: 'no-trust',
    title: 'Bez 7 – učenie sa dôvere',
    description:
      'Žiadna sedmička v mriežke. Vysoký potenciál zvyšovať si sebadôveru. Často priťahuje ľudí, ktorí ti prejavujú nedôveru — to je odraz vlastného vnútorného stavu. Útek nepomôže, treba zmeniť čosi vnútri.',
    recommendation:
      'Robiť rozhodnutia z náhľadu — rozumom, intuíciou, pocitmi a duchovnou rovinou súčasne. Keď tomu dôveruješ, môžeš dôverovať svojmu úsudku. Cvičenie: každý deň si zaznamenaj jedno rozhodnutie, ktorému si dôveroval/a.',
    tone: 'info',
    matches: r => c(7, r) === 0,
  },

  // === MÁGIA / VYTRVALOSŤ ===
  {
    id: 'mage-pattern',
    title: 'Energia mága',
    description:
      'Dve alebo viac šestiek. Človek vie pracovať s energiami – aj nevedome. Myšlienky sa mu zhmotňujú rýchlejšie ako bežne. Môže pomáhať aj manipulovať. Hranica je v zámere.',
    recommendation:
      'Strážiť negatívne myšlienky – materializujú sa veľmi rýchlo. Cvičiť technológie ako ho\'oponopono alebo vedomé prečisťovanie zámeru pred akciou.',
    tone: 'gift',
    matches: r => c(6, r) >= 2,
  },
  {
    id: 'no-perseverance',
    title: 'Bez vytrvalosti',
    description:
      'Žiadna šestka. Tendencia nedokončovať, nechávať rozrobené veci, prechádzať od projektu k projektu. Nie zlyhanie – len úloha, ktorú si duša prišla naučiť.',
    recommendation:
      'Cvičiť dokončovanie aj v malom: variť až po upratanie kuchyne, projekt až po archiváciu. Týždenné rituály uzatvárania.',
    tone: 'info',
    matches: r => c(6, r) === 0,
  },

  // === LÁSKA ===
  {
    id: 'love-school-beginner',
    title: 'V škole lásky úplný začiatočník',
    description:
      'Žiadna osmička. Človek prišiel preskúmať lásku vo všetkých jej formách – od základov. Bude konfrontovaný s rôznymi „učiteľmi" lásky.',
    recommendation:
      'Dovoliť si milovať aj nesprávne. Skúsenosť, čo láska nie je, je rovnako cenná ako skúsenosť, čo láska je. Bez sebakritiky.',
    tone: 'info',
    matches: r => c(8, r) === 0,
  },
  {
    id: 'love-overflowing',
    title: 'Otvorený zdroj lásky',
    description:
      '3 a viac osmičiek. „Slniečko" – miluje takmer každého, otvorene a bez podmienok. Môže nerozumieť, prečo druhí nie sú schopní rovnako otvorenej lásky.',
    recommendation:
      'Pamätať: každý je v škole lásky inde. Nestrácať sa v opačných reakciách iných. Vlastnú lásku chrániť aj vedomými hranicami.',
    tone: 'gift',
    matches: r => c(8, r) >= 3,
  },

  // === FINANCIE / HMOTNÝ SVET ===
  {
    id: 'financial-wisdom',
    title: 'Finančná inteligencia',
    description:
      '4 a viac deviatok. Pochopenie peňazí a hmotného sveta nadpriemerné. Človek inštinktívne rozumie aktívam, pasívam, investíciám, hodnote.',
    recommendation:
      'Túto silu používať vedome – učiť aj iných základné finančné princípy. 5–10 % príjmu odkladať do aktív, ktoré zarábajú za teba.',
    tone: 'gift',
    matches: r => c(9, r) >= 4,
  },
  {
    id: 'gambler-pattern',
    title: 'Hazardný vzor',
    description:
      '3 deviatky bez kompenzujúcich štvoriek. Energia veľkých čísel – peniaze prichádzajú ľahko, ale rovnako ľahko odchádzajú. Sklon k hazardu.',
    recommendation:
      'Učiť sa princíp: na luxus si nepožičiavať, luxus financovať z výnosov, nie zo základu. Striktné odkladanie pevného % príjmu.',
    tone: 'warn',
    matches: r => c(9, r) === 3 && c(4, r) <= 1,
  },
  {
    id: 'live-paycheck-to-paycheck',
    title: 'Zo zamestnania od výplaty po výplatu',
    description:
      'Žiadna alebo jedna deviatka. Klasický vzor: chodí do práce, dostáva výplatu, žije z nej. Akékoľvek väčšie investície alebo dlhy sú riziko.',
    recommendation:
      'Držať sa stabilného zdroja príjmu, vyhýbať sa špekulatívnym investíciám. Ak ide o väčšie rozhodnutie, konzultovať s niekým, kto má vyššie deviatky.',
    tone: 'info',
    matches: r => c(9, r) <= 1,
  },

  // === KOMBINÁCIE ENERGIE ===
  {
    id: 'low-energy-no-passion',
    title: 'Nízka energia + chýbajúca päťka',
    description:
      'Iba 1 dvojka a žiadna päťka. Telo má málo energie a chýba intuitívny pocit pre to, čo sa „oplatí" robiť. Človek sa môže ľahko vyčerpať bez výsledku.',
    recommendation:
      'Šetriť energiu prísne. Nepúšťať sa do projektov len preto, že to robia iní. Telo si pýta oddych – počúvať ho.',
    tone: 'warn',
    matches: r => c(2, r) === 1 && c(5, r) === 0,
  },
  {
    id: 'powerhouse-with-direction',
    title: 'Energetické dynamo s jasným smerom',
    description:
      'Veľa dvojiek (3+) a aspoň jedna šestka aj sedmička. Človek má silnú vitalitu, vytrvalosť a dôveru v seba – kombinácia, ktorá dosahuje veľké veci.',
    recommendation:
      'Túto silu nasmerovať na zmysluplné ciele. Pamätať na regeneráciu – aj dynamo potrebuje servis.',
    tone: 'gift',
    matches: r => c(2, r) >= 3 && c(6, r) >= 1 && c(7, r) >= 1,
  },
];

export function findMatchingCombinations(r: DevelopmentalNumerologyResult): DevelopmentalCombination[] {
  return developmentalCombinations.filter(combo => combo.matches(r));
}
