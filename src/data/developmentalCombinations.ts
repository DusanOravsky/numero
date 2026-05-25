// Pozoruhodné kombinácie čísel v Vývojovej mriežke (Lívia / Mičková).
// Každá kombinácia má podmienku, hlavičku a stručný popis. Popisy sú vlastné syntézy
// princípov z knihy Lívia Mičková – Duchovná numerológia, nie doslovné citácie.

import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import type { Language } from '../store/useStore';

export interface CombinationTexts {
  title: string;
  description: string;
  recommendation?: string;
}

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

// ─── SK TEXTS ─────────────────────────────────────────────────────────────────

const skTexts: Record<string, CombinationTexts> = {
  'fast-learner-restless': {
    title: 'Bystrá myseľ + nepokojné telo',
    description:
      'Veľa trojok (vnútorná múdrosť, „internet") spolu s viacerými dvojkami (silná bioenergia tela) – človek pochopí veci rýchlo, ale telo nedokáže obsedieť. U detí sa to často nesprávne označuje ako hyperaktivita.',
    recommendation:
      'Pri deťoch: nedávať liečby na hyperaktivitu, ale viac podnetov a pohybu. Po pochopení potrebujú motorický odventil. U dospelých: pohyb je súčasť mentálnej hygieny.',
  },
  'no-ego': {
    title: 'Bez 1 – tlmené ego, hľadanie seba',
    description:
      'Žiadna jednotka v mriežke. Veľmi nízke ego, človek sa silno vníma ako súčasť celku — bez vymedzenia voči nemu. Riziko: stráca sa v iných, ťažko nájde vlastný hlas, nevie, „čo chce ja". Často mu chýba vnútorný kompas pre rozhodovanie.',
    recommendation:
      'Cvičenie „dnes urobím jedno rozhodnutie len pre seba". Hľadať samostatné záujmy, koníčky a aktivity. Vedome sa pýtať „čo chcem JA?" pred tým, než sa pýtam ostatných. Bezpečné prostredie, kde sa môžeš učiť presadzovať.',
  },
  'high-ego-low-confidence': {
    title: 'Vysoké ego + nízke sebavedomie',
    description:
      'Veľa jednotiek (3+ ego) a žiadna štvorka (chýbajúce sebavedomie). Navonok môže pôsobiť panovačne alebo dominantne, vnútri ale často pociťuje, že nie je „dosť dobrý". Ego kompenzuje vnútornú neistotu.',
    recommendation:
      'Pracovať s afirmáciami zameranými na vlastnú hodnotu. Hľadanie hodnoty mimo výkonu a kontroly. Bezpečné prostredie (terapia, blízke osoby), kde nemusí dokazovať.',
  },
  'low-ego-low-confidence': {
    title: 'Nízke ego + nízke sebavedomie',
    description:
      'Žiadne alebo jedna jednotka (slabé ego) a žiadna štvorka. Človek ľahko podlieha vplyvu iných, stratí sa v skupine, nevie sa presadiť. Často mu chýba vnútorný kompas „čo chcem ja".',
    recommendation:
      'Tréning vyjadrenia osobných potrieb. Cvičenie „dnes urobím jedno rozhodnutie len pre seba". Hľadanie samostatných záujmov a rozhodnutí.',
  },
  'no-confidence': {
    title: 'Bez 4 – nízke sebavedomie, vysoký potenciál rastu',
    description:
      'Žiadna štvorka v mriežke. Sebavedomie nie je vrodená sila — je úlohou v tomto živote. Často kritickí rodičia v detstve, vnútorný hlas „nie som dosť dobrý". Ale: práve preto má človek najvyšší potenciál si ho vedome budovať.',
    recommendation:
      '7-dňová audio nahrávka pozitívnych afirmácií, denne. Sústrediť sa na to, čo už dokázal/a — viesť si denník malých úspechov. Nájsť svoju hodnotu v tom, čo si, nie len v tom, čo robíš.',
  },
  'high-confidence-stubborn': {
    title: 'Veľmi tvrdohlavé sebavedomie',
    description:
      '3 a viac štvoriek. Človek si potrebuje VŠETKO zažiť sám. Rady iných odmieta, kým sa nepoučí cez vlastnú skúsenosť – aj na úkor zdravia alebo vzťahov.',
    recommendation:
      'Vedome si dovoliť počúvať aj iné cesty pred „vlastnou skúsenosťou". Cvičenie pokory: „Kto z mojho okolia toto už zažil?". Pri deťoch: nezakazovať, ale vysvetľovať dôsledky.',
  },
  'strong-intuition-no-trust': {
    title: 'Silná intuícia + slabá dôvera',
    description:
      'Veľa päťiek (intuícia 3+) a žiadna alebo jedna sedmička. Človek silno cíti, čo je správne, ale neverí si, ignoruje vnútorný hlas a sleduje radu iných. Často sa potom diví: „Predsa som to vedel/a."',
    recommendation:
      'Denník intuícií: zaznamenať predtuchy a potom skontrolovať, ako to dopadlo. Buduje sa tým dôvera vo vlastný hlas.',
  },
  'no-intuition-needs-rules': {
    title: 'Bez intuície – potreba systému',
    description:
      'Žiadna päťka. Človek si potrebuje vytvárať pravidlá a logické postupy, lebo „cítenie" mu neslúži ako spoľahlivý kompas. Vyhovujú mu fakty, plány, štruktúry.',
    recommendation:
      'Neignorovať pocity, len ich brať ako jeden zo zdrojov. Telesné meditácie a body-scan môžu otvoriť kanál intuície postupne.',
  },
  'no-bioenergy': {
    title: 'Bez 2 – krehká bioenergia tela',
    description:
      'Žiadna dvojka v mriežke. Telo má nižšiu prirodzenú zásobu energie. Je dôležité s ňou múdro hospodáriť — vyhýbať sa preťaženiu, výkonovému športu na hrane a vystavovaniu sa "ťažkým" miestam (cintoríny, nemocnice), kde môže ľahko dôjsť k vyčerpaniu.',
    recommendation:
      'Počúvať telo: keď si pýta oddych, vaňu, spánok — dopraj mu to. Pravidelné regeneračné rituály (jemný strečing, dýchanie, kvalitný spánok). Šport zvoľ skôr nízkou intenzitou (jóga, prechádzky), nie výkonový.',
  },
  'no-inner-wisdom': {
    title: 'Bez 3 – učenie cez vonkajšie zdroje',
    description:
      'Žiadna trojka v mriežke. Vnútorný "internet" (priame chápanie podstaty) nie je pre teba prirodzený nástroj. Múdrosť získavaš skôr cez knihy, učiteľov, autority a vlastnú skúsenosť, nie intuitívnym vhľadom.',
    recommendation:
      'Vyhľadávať kvalitné zdroje a mentorov. Nezľahčovať si proces učenia — to, čo iní pochopia hneď, ty pochopíš poriadne až cez systém a opakovanie. Tvoja sila je v štruktúrovanom učení.',
  },
  'no-trust': {
    title: 'Bez 7 – učenie sa dôvere',
    description:
      'Žiadna sedmička v mriežke. Vysoký potenciál zvyšovať si sebadôveru. Často priťahuje ľudí, ktorí ti prejavujú nedôveru — to je odraz vlastného vnútorného stavu. Útek nepomôže, treba zmeniť čosi vnútri.',
    recommendation:
      'Robiť rozhodnutia z náhľadu — rozumom, intuíciou, pocitmi a duchovnou rovinou súčasne. Keď tomu dôveruješ, môžeš dôverovať svojmu úsudku. Cvičenie: každý deň si zaznamenaj jedno rozhodnutie, ktorému si dôveroval/a.',
  },
  'mage-pattern': {
    title: 'Energia mága',
    description:
      'Dve alebo viac šestiek. Človek vie pracovať s energiami – aj nevedome. Myšlienky sa mu zhmotňujú rýchlejšie ako bežne. Môže pomáhať aj manipulovať. Hranica je v zámere.',
    recommendation:
      'Strážiť negatívne myšlienky – materializujú sa veľmi rýchlo. Cvičiť technológie ako ho\'oponopono alebo vedomé prečisťovanie zámeru pred akciou.',
  },
  'no-perseverance': {
    title: 'Bez vytrvalosti',
    description:
      'Žiadna šestka. Tendencia nedokončovať, nechávať rozrobené veci, prechádzať od projektu k projektu. Nie zlyhanie – len úloha, ktorú si duša prišla naučiť.',
    recommendation:
      'Cvičiť dokončovanie aj v malom: variť až po upratanie kuchyne, projekt až po archiváciu. Týždenné rituály uzatvárania.',
  },
  'no-love-school': {
    title: 'Bez 8 – V škole lásky úplný začiatočník',
    description:
      'Žiadna osmička. Človek prišiel preskúmať lásku vo všetkých jej formách – od základov. Bude konfrontovaný s rôznymi „učiteľmi" lásky.',
    recommendation:
      'Dovoliť si milovať aj nesprávne. Skúsenosť, čo láska nie je, je rovnako cenná ako skúsenosť, čo láska je. Bez sebakritiky.',
  },
  'love-overflowing': {
    title: 'Otvorený zdroj lásky',
    description:
      '3 a viac osmičiek. „Slniečko" – miluje takmer každého, otvorene a bez podmienok. Môže nerozumieť, prečo druhí nie sú schopní rovnako otvorenej lásky.',
    recommendation:
      'Pamätať: každý je v škole lásky inde. Nestrácať sa v opačných reakciách iných. Vlastnú lásku chrániť aj vedomými hranicami.',
  },
  'financial-wisdom': {
    title: 'Finančná inteligencia',
    description:
      '4 a viac deviatok. Pochopenie peňazí a hmotného sveta nadpriemerné. Človek inštinktívne rozumie aktívam, pasívam, investíciám, hodnote.',
    recommendation:
      'Túto silu používať vedome – učiť aj iných základné finančné princípy. 5–10 % príjmu odkladať do aktív, ktoré zarábajú za teba.',
  },
  'gambler-pattern': {
    title: 'Hazardný vzor',
    description:
      '3 deviatky bez kompenzujúcich štvoriek. Energia veľkých čísel – peniaze prichádzajú ľahko, ale rovnako ľahko odchádzajú. Sklon k hazardu.',
    recommendation:
      'Učiť sa princíp: na luxus si nepožičiavať, luxus financovať z výnosov, nie zo základu. Striktné odkladanie pevného % príjmu.',
  },
  'no-material-grounding': {
    title: 'Bez 9 – učenie sa hmotnému svetu',
    description:
      'Žiadna deviatka v mriežke. Hmotný svet, peniaze, financie nie sú prirodzená sila. Človek sa musí vedome učiť pracovať s materiálnym — môže mať tendenciu odsudzovať peniaze alebo sa im naopak otrocky podriaďovať.',
    recommendation:
      'Naučiť sa základné finančné princípy: rozpočet, úspory, rozdiel aktíva vs pasíva. Vyhýbať sa špekulatívnym investíciám. Pri väčších rozhodnutiach konzultovať s niekým, kto má hmotnému svetu lepšie rozumie.',
  },
  'live-paycheck-to-paycheck': {
    title: 'Zo zamestnania od výplaty po výplatu',
    description:
      'Iba jedna deviatka. Klasický vzor: chodí do práce, dostáva výplatu, žije z nej. Akékoľvek väčšie investície alebo dlhy sú riziko.',
    recommendation:
      'Držať sa stabilného zdroja príjmu, vyhýbať sa špekulatívnym investíciám. Ak ide o väčšie rozhodnutie, konzultovať s niekým, kto má vyššie deviatky.',
  },
  'low-energy-no-passion': {
    title: 'Nízka energia + chýbajúca päťka',
    description:
      'Iba 1 dvojka a žiadna päťka. Telo má málo energie a chýba intuitívny pocit pre to, čo sa „oplatí" robiť. Človek sa môže ľahko vyčerpať bez výsledku.',
    recommendation:
      'Šetriť energiu prísne. Nepúšťať sa do projektov len preto, že to robia iní. Telo si pýta oddych – počúvať ho.',
  },
  'powerhouse-with-direction': {
    title: 'Energetické dynamo s jasným smerom',
    description:
      'Veľa dvojiek (3+) a aspoň jedna šestka aj sedmička. Človek má silnú vitalitu, vytrvalosť a dôveru v seba – kombinácia, ktorá dosahuje veľké veci.',
    recommendation:
      'Túto silu nasmerovať na zmysluplné ciele. Pamätať na regeneráciu – aj dynamo potrebuje servis.',
  },
};

// ─── EN TEXTS ─────────────────────────────────────────────────────────────────

const enTexts: Record<string, CombinationTexts> = {
  'fast-learner-restless': {
    title: 'Sharp mind + restless body',
    description:
      'Many threes (inner wisdom, "internet") combined with multiple twos (strong bioenergy) – the person grasps things quickly but the body cannot sit still. In children, this is often incorrectly labeled as hyperactivity.',
    recommendation:
      'For children: do not medicate for hyperactivity, provide more stimulation and movement instead. After understanding, they need a motor outlet. For adults: movement is part of mental hygiene.',
  },
  'no-ego': {
    title: 'No 1 – subdued ego, seeking self',
    description:
      'No ones in the grid. Very low ego, the person strongly perceives themselves as part of the whole — without differentiation. Risk: loses themselves in others, hard to find own voice, does not know "what I want". Often lacks an inner compass for decision-making.',
    recommendation:
      'Practice: "today I will make one decision just for myself". Seek independent interests, hobbies and activities. Consciously ask "what do I want?" before asking others. A safe environment where you can practice asserting yourself.',
  },
  'high-ego-low-confidence': {
    title: 'High ego + low self-confidence',
    description:
      'Many ones (3+ ego) and no fours (missing self-confidence). Outwardly may seem domineering or dominant, but inside often feels "not good enough". The ego compensates for inner insecurity.',
    recommendation:
      'Work with affirmations focused on self-worth. Find value beyond performance and control. A safe environment (therapy, close people) where there is no need to prove oneself.',
  },
  'low-ego-low-confidence': {
    title: 'Low ego + low self-confidence',
    description:
      'Zero or one ones (weak ego) and no fours. The person easily submits to others\' influence, gets lost in a group, cannot assert themselves. Often lacks an inner compass for "what do I want".',
    recommendation:
      'Practice expressing personal needs. Exercise: "today I will make one decision just for myself". Seek independent interests and decisions.',
  },
  'no-confidence': {
    title: 'No 4 – low self-confidence, high growth potential',
    description:
      'No fours in the grid. Self-confidence is not an innate strength — it is a life task. Often had critical parents in childhood, inner voice says "I am not good enough". But: precisely because of this, the person has the highest potential to build it consciously.',
    recommendation:
      '7-day audio recording of positive affirmations, daily. Focus on what has already been achieved — keep a journal of small successes. Find your worth in who you are, not just in what you do.',
  },
  'high-confidence-stubborn': {
    title: 'Very stubborn self-confidence',
    description:
      '3 or more fours. The person needs to experience EVERYTHING firsthand. Rejects others\' advice until they learn through their own experience — even at the cost of health or relationships.',
    recommendation:
      'Consciously allow yourself to listen to other paths before "own experience". Humility exercise: "Who in my circle has already been through this?". For children: do not forbid, but explain consequences.',
  },
  'strong-intuition-no-trust': {
    title: 'Strong intuition + weak trust',
    description:
      'Many fives (intuition 3+) and zero or one sevens. The person strongly feels what is right but does not trust themselves, ignores their inner voice and follows others\' advice. Often surprised afterwards: "I knew it all along."',
    recommendation:
      'Intuition journal: record premonitions and then check how things turned out. This builds trust in your own voice.',
  },
  'no-intuition-needs-rules': {
    title: 'No intuition – needs structure',
    description:
      'No fives. The person needs to create rules and logical procedures because "feeling" does not serve as a reliable compass. Prefers facts, plans, structures.',
    recommendation:
      'Do not ignore feelings, just treat them as one source among many. Body meditations and body-scan can gradually open the channel of intuition.',
  },
  'no-bioenergy': {
    title: 'No 2 – fragile body bioenergy',
    description:
      'No twos in the grid. The body has a lower natural energy reserve. It is important to manage it wisely — avoid overexertion, high-performance sport at the edge, and exposure to "heavy" places (cemeteries, hospitals) where depletion can happen easily.',
    recommendation:
      'Listen to the body: when it asks for rest, a bath, sleep — provide it. Regular regeneration rituals (gentle stretching, breathing, quality sleep). Choose low-intensity sport (yoga, walks), not high-performance.',
  },
  'no-inner-wisdom': {
    title: 'No 3 – learning through external sources',
    description:
      'No threes in the grid. The inner "internet" (direct grasp of essence) is not your natural tool. You gain wisdom through books, teachers, authorities and personal experience, not through intuitive insight.',
    recommendation:
      'Seek quality sources and mentors. Do not trivialize the learning process — what others grasp immediately, you will understand properly through system and repetition. Your strength is in structured learning.',
  },
  'no-trust': {
    title: 'No 7 – learning to trust',
    description:
      'No sevens in the grid. High potential to increase self-trust. Often attracts people who show distrust — that reflects your own inner state. Running away does not help, something inside must change.',
    recommendation:
      'Make decisions from insight — reason, intuition, feelings and spiritual level simultaneously. When you trust that process, you can trust your judgment. Practice: each day record one decision you trusted.',
  },
  'mage-pattern': {
    title: 'Mage energy',
    description:
      'Two or more sixes. The person can work with energies — even unconsciously. Thoughts materialize faster than usual. Can help or manipulate. The boundary lies in intention.',
    recommendation:
      'Guard negative thoughts — they materialize very quickly. Practice techniques like ho\'oponopono or conscious purification of intention before action.',
  },
  'no-perseverance': {
    title: 'No perseverance',
    description:
      'No sixes. Tendency to leave things unfinished, move from project to project. Not failure — just a task the soul came to learn.',
    recommendation:
      'Practice completing even small things: cook only after tidying the kitchen, archive a project after finishing it. Weekly closure rituals.',
  },
  'no-love-school': {
    title: 'No 8 – complete beginner in the school of love',
    description:
      'No eights. The person came to explore love in all its forms — from the basics. Will be confronted with various "teachers" of love.',
    recommendation:
      'Allow yourself to love imperfectly. The experience of what love is not is as valuable as the experience of what love is. Without self-criticism.',
  },
  'love-overflowing': {
    title: 'Open source of love',
    description:
      '3 or more eights. "Little sun" – loves almost everyone, openly and unconditionally. May not understand why others are not capable of equally open love.',
    recommendation:
      'Remember: everyone is at a different level in the school of love. Do not get lost in others\' opposite reactions. Protect your own love with conscious boundaries too.',
  },
  'financial-wisdom': {
    title: 'Financial intelligence',
    description:
      '4 or more nines. Above-average understanding of money and the material world. The person instinctively understands assets, liabilities, investments, value.',
    recommendation:
      'Use this strength consciously — teach others basic financial principles too. Save 5–10% of income into assets that earn for you.',
  },
  'gambler-pattern': {
    title: 'Gambler pattern',
    description:
      '3 nines without compensating fours. Energy of big numbers – money comes easily but leaves just as easily. Tendency toward gambling.',
    recommendation:
      'Learn the principle: do not borrow for luxury, finance luxury from returns, not from base. Strict saving of a fixed % of income.',
  },
  'no-material-grounding': {
    title: 'No 9 – learning the material world',
    description:
      'No nines in the grid. The material world, money, finances are not a natural strength. The person must consciously learn to work with the material — may tend to condemn money or, conversely, slavishly submit to it.',
    recommendation:
      'Learn basic financial principles: budget, savings, difference between assets and liabilities. Avoid speculative investments. For bigger decisions, consult someone who understands the material world better.',
  },
  'live-paycheck-to-paycheck': {
    title: 'Living paycheck to paycheck',
    description:
      'Only one nine. Classic pattern: goes to work, receives a salary, lives from it. Any larger investments or debts are a risk.',
    recommendation:
      'Stick to a stable income source, avoid speculative investments. For bigger decisions, consult someone with more nines.',
  },
  'low-energy-no-passion': {
    title: 'Low energy + missing five',
    description:
      'Only 1 two and no fives. The body has little energy and lacks the intuitive sense for what is "worth" doing. The person can easily exhaust themselves without results.',
    recommendation:
      'Conserve energy strictly. Do not jump into projects just because others do. The body asks for rest — listen to it.',
  },
  'powerhouse-with-direction': {
    title: 'Energy powerhouse with clear direction',
    description:
      'Many twos (3+) and at least one six and one seven. The person has strong vitality, perseverance and self-trust – a combination that achieves great things.',
    recommendation:
      'Direct this strength toward meaningful goals. Remember regeneration – even a dynamo needs maintenance.',
  },
};

// ─── COMBINATIONS DATA ────────────────────────────────────────────────────────

export const developmentalCombinations: DevelopmentalCombination[] = [
  // === SCHOPNOSŤ UČIŤ SA + HYPERAKTIVITA ===
  {
    id: 'fast-learner-restless',
    title: skTexts['fast-learner-restless'].title,
    description: skTexts['fast-learner-restless'].description,
    recommendation: skTexts['fast-learner-restless'].recommendation,
    tone: 'gift',
    matches: r => c(3, r) >= 3 && c(2, r) >= 3,
  },

  // === EGO (číslo 1) ===
  {
    id: 'no-ego',
    title: skTexts['no-ego'].title,
    description: skTexts['no-ego'].description,
    recommendation: skTexts['no-ego'].recommendation,
    tone: 'warn',
    matches: r => c(1, r) === 0,
  },

  // === EGO + SEBAVEDOMIE ===
  {
    id: 'high-ego-low-confidence',
    title: skTexts['high-ego-low-confidence'].title,
    description: skTexts['high-ego-low-confidence'].description,
    recommendation: skTexts['high-ego-low-confidence'].recommendation,
    tone: 'warn',
    matches: r => c(1, r) >= 3 && c(4, r) === 0,
  },
  {
    id: 'low-ego-low-confidence',
    title: skTexts['low-ego-low-confidence'].title,
    description: skTexts['low-ego-low-confidence'].description,
    recommendation: skTexts['low-ego-low-confidence'].recommendation,
    tone: 'warn',
    matches: r => c(1, r) <= 1 && c(4, r) === 0,
  },
  {
    id: 'no-confidence',
    title: skTexts['no-confidence'].title,
    description: skTexts['no-confidence'].description,
    recommendation: skTexts['no-confidence'].recommendation,
    tone: 'warn',
    matches: r => c(4, r) === 0,
  },
  {
    id: 'high-confidence-stubborn',
    title: skTexts['high-confidence-stubborn'].title,
    description: skTexts['high-confidence-stubborn'].description,
    recommendation: skTexts['high-confidence-stubborn'].recommendation,
    tone: 'warn',
    matches: r => c(4, r) >= 3,
  },

  // === INTUÍCIA ===
  {
    id: 'strong-intuition-no-trust',
    title: skTexts['strong-intuition-no-trust'].title,
    description: skTexts['strong-intuition-no-trust'].description,
    recommendation: skTexts['strong-intuition-no-trust'].recommendation,
    tone: 'warn',
    matches: r => c(5, r) >= 3 && c(7, r) <= 1,
  },
  {
    id: 'no-intuition-needs-rules',
    title: skTexts['no-intuition-needs-rules'].title,
    description: skTexts['no-intuition-needs-rules'].description,
    recommendation: skTexts['no-intuition-needs-rules'].recommendation,
    tone: 'info',
    matches: r => c(5, r) === 0,
  },

  // === BIOENERGIA TELA (číslo 2) ===
  {
    id: 'no-bioenergy',
    title: skTexts['no-bioenergy'].title,
    description: skTexts['no-bioenergy'].description,
    recommendation: skTexts['no-bioenergy'].recommendation,
    tone: 'warn',
    matches: r => c(2, r) === 0,
  },

  // === VNÚTORNÁ MÚDROSŤ (číslo 3) ===
  {
    id: 'no-inner-wisdom',
    title: skTexts['no-inner-wisdom'].title,
    description: skTexts['no-inner-wisdom'].description,
    recommendation: skTexts['no-inner-wisdom'].recommendation,
    tone: 'info',
    matches: r => c(3, r) === 0,
  },

  // === DÔVERA / VIERA (číslo 7) ===
  {
    id: 'no-trust',
    title: skTexts['no-trust'].title,
    description: skTexts['no-trust'].description,
    recommendation: skTexts['no-trust'].recommendation,
    tone: 'info',
    matches: r => c(7, r) === 0,
  },

  // === MÁGIA / VYTRVALOSŤ ===
  {
    id: 'mage-pattern',
    title: skTexts['mage-pattern'].title,
    description: skTexts['mage-pattern'].description,
    recommendation: skTexts['mage-pattern'].recommendation,
    tone: 'gift',
    matches: r => c(6, r) >= 2,
  },
  {
    id: 'no-perseverance',
    title: skTexts['no-perseverance'].title,
    description: skTexts['no-perseverance'].description,
    recommendation: skTexts['no-perseverance'].recommendation,
    tone: 'info',
    matches: r => c(6, r) === 0,
  },

  // === LÁSKA ===
  {
    id: 'no-love-school',
    title: skTexts['no-love-school'].title,
    description: skTexts['no-love-school'].description,
    recommendation: skTexts['no-love-school'].recommendation,
    tone: 'info',
    matches: r => c(8, r) === 0,
  },
  {
    id: 'love-overflowing',
    title: skTexts['love-overflowing'].title,
    description: skTexts['love-overflowing'].description,
    recommendation: skTexts['love-overflowing'].recommendation,
    tone: 'gift',
    matches: r => c(8, r) >= 3,
  },

  // === FINANCIE / HMOTNÝ SVET ===
  {
    id: 'financial-wisdom',
    title: skTexts['financial-wisdom'].title,
    description: skTexts['financial-wisdom'].description,
    recommendation: skTexts['financial-wisdom'].recommendation,
    tone: 'gift',
    matches: r => c(9, r) >= 4,
  },
  {
    id: 'gambler-pattern',
    title: skTexts['gambler-pattern'].title,
    description: skTexts['gambler-pattern'].description,
    recommendation: skTexts['gambler-pattern'].recommendation,
    tone: 'warn',
    matches: r => c(9, r) === 3 && c(4, r) <= 1,
  },
  {
    id: 'no-material-grounding',
    title: skTexts['no-material-grounding'].title,
    description: skTexts['no-material-grounding'].description,
    recommendation: skTexts['no-material-grounding'].recommendation,
    tone: 'warn',
    matches: r => c(9, r) === 0,
  },
  {
    id: 'live-paycheck-to-paycheck',
    title: skTexts['live-paycheck-to-paycheck'].title,
    description: skTexts['live-paycheck-to-paycheck'].description,
    recommendation: skTexts['live-paycheck-to-paycheck'].recommendation,
    tone: 'info',
    matches: r => c(9, r) === 1,
  },

  // === KOMBINÁCIE ENERGIE ===
  {
    id: 'low-energy-no-passion',
    title: skTexts['low-energy-no-passion'].title,
    description: skTexts['low-energy-no-passion'].description,
    recommendation: skTexts['low-energy-no-passion'].recommendation,
    tone: 'warn',
    matches: r => c(2, r) === 1 && c(5, r) === 0,
  },
  {
    id: 'powerhouse-with-direction',
    title: skTexts['powerhouse-with-direction'].title,
    description: skTexts['powerhouse-with-direction'].description,
    recommendation: skTexts['powerhouse-with-direction'].recommendation,
    tone: 'gift',
    matches: r => c(2, r) >= 3 && c(6, r) >= 1 && c(7, r) >= 1,
  },
];

// ─── ACCESSOR FUNCTIONS ───────────────────────────────────────────────────────

export function getCombinationText(combo: DevelopmentalCombination, lang: Language = 'sk'): CombinationTexts {
  const source = lang === 'en' ? enTexts : skTexts;
  return source[combo.id] ?? { title: combo.title, description: combo.description, recommendation: combo.recommendation };
}

export function getCombinationTexts(id: string, lang: Language = 'sk'): CombinationTexts {
  const source = lang === 'en' ? enTexts : skTexts;
  return source[id] ?? skTexts[id];
}

export function findMatchingCombinations(r: DevelopmentalNumerologyResult): DevelopmentalCombination[] {
  return developmentalCombinations.filter(combo => combo.matches(r));
}
