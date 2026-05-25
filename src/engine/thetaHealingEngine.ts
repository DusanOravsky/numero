import type { Language } from '../store/useStore';

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
  11: {
    beliefs: [
      { belief: 'Moje vízie sú príliš veľké pre tento svet', level: 'soul', origin: 'Duševná pamäť – nepochopenie', emotion: 'Izolácia', bodyArea: 'Tretie oko' },
      { belief: 'Ak ukážem svoju citlivosť, zneužijú ju', level: 'core', origin: 'Detstvo – odmietnutie intuície', emotion: 'Strach', bodyArea: 'Srdce' },
      { belief: 'Musím sa obetovať pre vyšší účel', level: 'genetic', origin: 'Rodová línia – mučeníctvo', emotion: 'Vyčerpanie', bodyArea: 'Nadobličky' },
    ],
    newBeliefs: [
      { belief: 'Svet je pripravený na moje vízie', affirmation: 'Moje svetlo inšpiruje a lieči', feeling: 'Žiarenie' },
      { belief: 'Moja citlivosť je môj superpower', affirmation: 'Zdieľam svoju intuíciu bezpečne', feeling: 'Sila v nežnosti' },
      { belief: 'Slúžim najlepšie keď som naplnený/á', affirmation: 'Moja plnosť je služba svetu', feeling: 'Vyrovnanosť' },
    ],
  },
  22: {
    beliefs: [
      { belief: 'Zodpovednosť ma rozdrví', level: 'core', origin: 'Detstvo – príliš veľa príliš skoro', emotion: 'Preťaženie', bodyArea: 'Ramená' },
      { belief: 'Ak postavím niečo veľké, stratím slobodu', level: 'soul', origin: 'Duševná skúsenosť – väznenie', emotion: 'Klaustrofóbia', bodyArea: 'Hruď' },
      { belief: 'Nie som dosť silný/á na to čo cítim že mám robiť', level: 'genetic', origin: 'Rodová línia – nedokončené diela', emotion: 'Pochybnosti', bodyArea: 'Solárny plexus' },
    ],
    newBeliefs: [
      { belief: 'Staviam krok po kroku s radosťou', affirmation: 'Každý malý krok je súčasťou majstrovského diela', feeling: 'Trpezlivá sila' },
      { belief: 'Moje dielo je moja sloboda', affirmation: 'Tvorba je môj najväčší prejav slobody', feeling: 'Tvorivá radosť' },
      { belief: 'Mám presne tú silu ktorú potrebujem', affirmation: 'Vesmír ma vybavil na moju misiu', feeling: 'Dôvera' },
    ],
  },
  33: {
    beliefs: [
      { belief: 'Moje utrpenie nemá zmysel', level: 'soul', origin: 'Duševná skúsenosť – kozmická bolesť', emotion: 'Bezvýznamnosť', bodyArea: 'Srdce' },
      { belief: 'Ak budem príliš milujúci/a, ľudia to zneužijú', level: 'core', origin: 'Detstvo – zneužitie dôvery', emotion: 'Horkosť', bodyArea: 'Hruď' },
      { belief: 'Nemôžem uzdraviť svet', level: 'genetic', origin: 'Rodová línia – bezmocnosť liečiteľov', emotion: 'Frustrácia', bodyArea: 'Ruky' },
    ],
    newBeliefs: [
      { belief: 'Moja cesta transformuje bolesť v múdrosť', affirmation: 'Každá skúsenosť je dar pre moju službu', feeling: 'Hlboký zmysel' },
      { belief: 'Moja láska má zdravé hranice', affirmation: 'Milujem múdro a chránene', feeling: 'Sila súcitu' },
      { belief: 'Uzdravujem svet tým že uzdravím seba', affirmation: 'Moja vnútorná harmónia žiari navonok', feeling: 'Celostná radosť' },
    ],
  },
};

const BELIEF_TEMPLATES_EN: Record<number, { beliefs: LimitingBelief[]; newBeliefs: NewBelief[] }> = {
  1: {
    beliefs: [
      { belief: 'I have to handle everything alone', level: 'core', origin: 'Childhood – lack of support', emotion: 'Loneliness', bodyArea: 'Shoulders' },
      { belief: 'I am not good enough', level: 'genetic', origin: 'Family lineage – pressure to perform', emotion: 'Shame', bodyArea: 'Solar plexus' },
      { belief: 'If I am vulnerable, I will get hurt', level: 'history', origin: 'Past lives – betrayal', emotion: 'Fear', bodyArea: 'Heart' },
    ],
    newBeliefs: [
      { belief: 'It is safe to accept help', affirmation: 'I receive support with gratitude', feeling: 'Lightness and connection' },
      { belief: 'I am good enough exactly as I am', affirmation: 'My worth is within me, not in what I do', feeling: 'Inner peace' },
      { belief: 'Vulnerability is strength', affirmation: 'I open to love safely', feeling: 'Tenderness and courage' },
    ],
  },
  2: {
    beliefs: [
      { belief: 'My needs are not important', level: 'core', origin: 'Childhood – emotional neglect', emotion: 'Sadness', bodyArea: 'Chest' },
      { belief: 'I must take care of others to be loved', level: 'genetic', origin: 'Matrilineal pattern', emotion: 'Exhaustion', bodyArea: 'Kidneys' },
      { belief: 'If I say no, I will lose love', level: 'soul', origin: 'Soul contract', emotion: 'Fear of abandonment', bodyArea: 'Throat' },
    ],
    newBeliefs: [
      { belief: 'My needs are equally important', affirmation: 'I care for myself with the same love as for others', feeling: 'Fulfillment' },
      { belief: 'I am loved even when I set boundaries', affirmation: 'My no is a gift for me and for others', feeling: 'Freedom' },
      { belief: 'Love is not conditional on my sacrifice', affirmation: 'I deserve love simply because I exist', feeling: 'Safety' },
    ],
  },
  3: {
    beliefs: [
      { belief: 'If I express myself, I will be judged', level: 'core', origin: 'Childhood – suppressed expression', emotion: 'Shame', bodyArea: 'Throat' },
      { belief: 'I have nothing to offer', level: 'genetic', origin: 'Family lineage – judgment', emotion: 'Worthlessness', bodyArea: 'Solar plexus' },
      { belief: 'Joy is superficial', level: 'history', origin: 'Collective trauma', emotion: 'Guilt', bodyArea: 'Heart' },
    ],
    newBeliefs: [
      { belief: 'My expression has value', affirmation: 'I express myself with courage and joy', feeling: 'Creative freedom' },
      { belief: 'I have unique gifts for the world', affirmation: 'The world needs exactly my light', feeling: 'Enthusiasm' },
      { belief: 'Joy is my natural essence', affirmation: 'I allow myself to feel joy', feeling: 'Lightness' },
    ],
  },
  4: {
    beliefs: [
      { belief: 'The world is not a safe place', level: 'core', origin: 'Childhood – environmental instability', emotion: 'Anxiety', bodyArea: 'Root chakra' },
      { belief: 'I must control everything', level: 'genetic', origin: 'Generational trauma – loss', emotion: 'Fear', bodyArea: 'Stomach' },
      { belief: 'If I relax, something bad will happen', level: 'soul', origin: 'Soul experience', emotion: 'Hypervigilance', bodyArea: 'Spine' },
    ],
    newBeliefs: [
      { belief: 'The world supports me', affirmation: 'I trust the process of life', feeling: 'Groundedness' },
      { belief: 'It is safe to let go of control', affirmation: 'Life carries me', feeling: 'Peace' },
      { belief: 'Stability is within me, not around me', affirmation: 'I am my own home', feeling: 'Rootedness' },
    ],
  },
  5: {
    beliefs: [
      { belief: 'Freedom means loneliness', level: 'core', origin: 'Childhood – punished for independence', emotion: 'Fear', bodyArea: 'Throat' },
      { belief: 'If I am authentic, people will leave', level: 'genetic', origin: 'Family lineage – conformity', emotion: 'Anxiety', bodyArea: 'Heart' },
      { belief: 'Change is dangerous', level: 'history', origin: 'Past experiences', emotion: 'Resistance', bodyArea: 'Solar plexus' },
    ],
    newBeliefs: [
      { belief: 'Freedom and connection coexist', affirmation: 'I am free and connected at the same time', feeling: 'Expansiveness' },
      { belief: 'My authenticity attracts the right people', affirmation: 'Being myself is my greatest gift', feeling: 'Self-confidence' },
      { belief: 'Change is a gateway to growth', affirmation: 'I welcome the new with trust', feeling: 'Excitement' },
    ],
  },
  6: {
    beliefs: [
      { belief: 'I must be perfect to be loved', level: 'core', origin: 'Childhood – conditional love', emotion: 'Fear of rejection', bodyArea: 'Heart' },
      { belief: 'The happiness of others is my responsibility', level: 'genetic', origin: 'Family pattern – self-sacrifice', emotion: 'Overwhelm', bodyArea: 'Shoulders' },
      { belief: 'If something is not perfect, it has no value', level: 'soul', origin: 'Soul perfectionism', emotion: 'Frustration', bodyArea: 'Eyes' },
    ],
    newBeliefs: [
      { belief: 'I am loved even in imperfection', affirmation: 'My humanity is beautiful', feeling: 'Acceptance' },
      { belief: 'Everyone is responsible for their own happiness', affirmation: 'I let others be and care for myself', feeling: 'Relief' },
      { belief: 'There is beauty in imperfection', affirmation: 'I allow myself to be imperfect', feeling: 'Freedom' },
    ],
  },
  7: {
    beliefs: [
      { belief: 'If I open up, I will get hurt', level: 'core', origin: 'Childhood – emotional betrayal', emotion: 'Distrust', bodyArea: 'Heart' },
      { belief: 'Being alone is safer', level: 'genetic', origin: 'Family lineage – isolation', emotion: 'Loneliness', bodyArea: 'Chest' },
      { belief: 'I must understand everything with my mind', level: 'history', origin: 'Intellectualization as defense', emotion: 'Disconnection', bodyArea: 'Head' },
    ],
    newBeliefs: [
      { belief: 'It is safe to trust', affirmation: 'I open to connection with wisdom', feeling: 'Tenderness' },
      { belief: 'Connection enriches my journey', affirmation: 'I am connected and whole at the same time', feeling: 'Fullness' },
      { belief: 'Wisdom is the union of mind and intuition', affirmation: 'I trust my inner guidance', feeling: 'Clarity' },
    ],
  },
  8: {
    beliefs: [
      { belief: 'Power is dangerous', level: 'core', origin: 'Childhood – abuse of power', emotion: 'Fear', bodyArea: 'Solar plexus' },
      { belief: 'Money is dirty', level: 'genetic', origin: 'Family lineage – poverty', emotion: 'Disgust', bodyArea: 'Root chakra' },
      { belief: 'Success means losing love', level: 'soul', origin: 'Soul experience', emotion: 'Guilt', bodyArea: 'Heart' },
    ],
    newBeliefs: [
      { belief: 'Power in service of love is a blessing', affirmation: 'I use my strength for good', feeling: 'Trust' },
      { belief: 'Abundance is a natural state', affirmation: 'I deserve abundance in all areas', feeling: 'Joy' },
      { belief: 'Success and love coexist', affirmation: 'The more I prosper, the more I give', feeling: 'Generous strength' },
    ],
  },
  9: {
    beliefs: [
      { belief: 'The world cannot be changed', level: 'core', origin: 'Childhood – helplessness', emotion: 'Resignation', bodyArea: 'Heart' },
      { belief: 'If something ends, it has failed', level: 'genetic', origin: 'Family lineage – fear of endings', emotion: 'Sadness', bodyArea: 'Lungs' },
      { belief: 'It is not safe to let go of the old', level: 'soul', origin: 'Soul attachment', emotion: 'Fear', bodyArea: 'Large intestine' },
    ],
    newBeliefs: [
      { belief: 'Every good deed changes the world', affirmation: 'I am part of positive change', feeling: 'Meaningfulness' },
      { belief: 'Completion is sacred', affirmation: 'I release with gratitude and trust', feeling: 'Peace' },
      { belief: 'In every new beginning there is a gift', affirmation: 'Every ending is a gateway to the new', feeling: 'Hope' },
    ],
  },
  11: {
    beliefs: [
      { belief: 'My visions are too big for this world', level: 'soul', origin: 'Soul memory – being misunderstood', emotion: 'Isolation', bodyArea: 'Third eye' },
      { belief: 'If I show my sensitivity, it will be exploited', level: 'core', origin: 'Childhood – rejection of intuition', emotion: 'Fear', bodyArea: 'Heart' },
      { belief: 'I must sacrifice myself for a higher purpose', level: 'genetic', origin: 'Family lineage – martyrdom', emotion: 'Exhaustion', bodyArea: 'Adrenals' },
    ],
    newBeliefs: [
      { belief: 'The world is ready for my visions', affirmation: 'My light inspires and heals', feeling: 'Radiance' },
      { belief: 'My sensitivity is my superpower', affirmation: 'I share my intuition safely', feeling: 'Strength in tenderness' },
      { belief: 'I serve best when I am fulfilled', affirmation: 'My fullness is service to the world', feeling: 'Balance' },
    ],
  },
  22: {
    beliefs: [
      { belief: 'Responsibility will crush me', level: 'core', origin: 'Childhood – too much too soon', emotion: 'Overwhelm', bodyArea: 'Shoulders' },
      { belief: 'If I build something big, I will lose my freedom', level: 'soul', origin: 'Soul experience – imprisonment', emotion: 'Claustrophobia', bodyArea: 'Chest' },
      { belief: 'I am not strong enough for what I feel I should do', level: 'genetic', origin: 'Family lineage – unfinished works', emotion: 'Doubt', bodyArea: 'Solar plexus' },
    ],
    newBeliefs: [
      { belief: 'I build step by step with joy', affirmation: 'Every small step is part of a masterpiece', feeling: 'Patient strength' },
      { belief: 'My work is my freedom', affirmation: 'Creation is my greatest expression of freedom', feeling: 'Creative joy' },
      { belief: 'I have exactly the strength I need', affirmation: 'The universe equipped me for my mission', feeling: 'Trust' },
    ],
  },
  33: {
    beliefs: [
      { belief: 'My suffering has no meaning', level: 'soul', origin: 'Soul experience – cosmic pain', emotion: 'Insignificance', bodyArea: 'Heart' },
      { belief: 'If I am too loving, people will exploit it', level: 'core', origin: 'Childhood – betrayal of trust', emotion: 'Bitterness', bodyArea: 'Chest' },
      { belief: 'I cannot heal the world', level: 'genetic', origin: 'Family lineage – healer helplessness', emotion: 'Frustration', bodyArea: 'Hands' },
    ],
    newBeliefs: [
      { belief: 'My journey transforms pain into wisdom', affirmation: 'Every experience is a gift for my service', feeling: 'Deep meaning' },
      { belief: 'My love has healthy boundaries', affirmation: 'I love wisely and protectedly', feeling: 'Strength of compassion' },
      { belief: 'I heal the world by healing myself', affirmation: 'My inner harmony radiates outward', feeling: 'Holistic joy' },
    ],
  },
};

const LEVEL_NAMES: Record<BeliefLevel, string> = {
  core: 'Koreňová úroveň (toto život)',
  genetic: 'Genetická úroveň (rodová línia)',
  history: 'Historická úroveň (minulé životy)',
  soul: 'Duševná úroveň (duševné kontrakty)',
};

const LEVEL_NAMES_EN: Record<BeliefLevel, string> = {
  core: 'Core level (this lifetime)',
  genetic: 'Genetic level (family lineage)',
  history: 'Historical level (past lives)',
  soul: 'Soul level (soul contracts)',
};

export function getLevelName(level: BeliefLevel, lang: Language = 'sk'): string {
  return lang === 'sk' ? LEVEL_NAMES[level] : LEVEL_NAMES_EN[level];
}

export function calculateThetaHealing(lifePathNumber: number, lang: Language = 'sk'): ThetaHealingResult {
  const templates = lang === 'sk' ? BELIEF_TEMPLATES : BELIEF_TEMPLATES_EN;
  const template = templates[lifePathNumber] || templates[1];

  const diggingResults: DiggingResult[] = template.beliefs.map((belief, i) => ({
    rootBelief: belief,
    chain: lang === 'sk' ? [
      `"Prečo verím, že ${belief.belief.toLowerCase()}?"`,
      `"Čo by sa stalo, keby to nebola pravda?"`,
      `"Kedy som si toto prvýkrát myslel/a?"`,
      `"Čo cítim v tele, keď si to pomyslím?"`,
      `→ Koreňové presvedčenie: "${belief.belief}"`,
    ] : [
      `"Why do I believe that ${belief.belief.toLowerCase()}?"`,
      `"What would happen if it weren't true?"`,
      `"When did I first think this?"`,
      `"What do I feel in my body when I think this?"`,
      `→ Root belief: "${belief.belief}"`,
    ],
    newBelief: template.newBeliefs[i],
    healingSteps: lang === 'sk' ? [
      'Spojte sa so zdrojovou energiou (Stvoriteľ všetkého čo je)',
      `Požiadajte o odstránenie: "${belief.belief}"`,
      `Nahraďte novým: "${template.newBeliefs[i].belief}"`,
      `Pocíťte: ${template.newBeliefs[i].feeling}`,
      'Poďakujte a uzavrite',
    ] : [
      'Connect with source energy (Creator of All That Is)',
      `Ask for removal: "${belief.belief}"`,
      `Replace with new: "${template.newBeliefs[i].belief}"`,
      `Feel: ${template.newBeliefs[i].feeling}`,
      'Give thanks and close',
    ],
  }));

  const healingWorkflow = lang === 'sk' ? [
    '1. Uvoľnite sa a zhlboka dýchajte',
    '2. Predstavte si energiu stúpajúcu nahor cez korunnou čakru',
    '3. Spojte sa so Stvoriteľom všetkého čo je',
    '4. Požiadajte o ukázanie koreňového presvedčenia',
    '5. Pozorujte, kde v tele sa presvedčenie drží',
    '6. Požiadajte o odpojenie a zrušenie presvedčenia na všetkých úrovniach',
    '7. Nahraďte novým presvedčením',
    '8. Pocíťte nové presvedčenie v tele',
    '9. Poďakujte a vráťte sa do prítomnosti',
  ] : [
    '1. Relax and breathe deeply',
    '2. Visualize energy rising up through the crown chakra',
    '3. Connect with the Creator of All That Is',
    '4. Ask to be shown the root belief',
    '5. Observe where in the body the belief is held',
    '6. Ask for disconnection and cancellation of the belief on all levels',
    '7. Replace with a new belief',
    '8. Feel the new belief in your body',
    '9. Give thanks and return to the present',
  ];

  const recommendations = lang === 'sk' ? [
    'Pracujte s jedným presvedčením denne',
    'Zapisujte si pocity a zmeny',
    'Buďte trpezliví – transformácia je proces',
    'Vracajte sa k afirmáciám ráno a večer',
    'Pozorujte zmeny v snoch a vzťahoch',
  ] : [
    'Work with one belief per day',
    'Write down your feelings and changes',
    'Be patient – transformation is a process',
    'Return to affirmations morning and evening',
    'Observe changes in dreams and relationships',
  ];

  return {
    primaryBeliefs: template.beliefs,
    diggingResults,
    healingWorkflow,
    recommendations,
  };
}

export { BELIEF_TEMPLATES };
