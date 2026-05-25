// Etikoterapia (Vladimír Vogeltanz, Ctibor Bezděk)
//
// Slovensko-česká liečebná tradícia, ktorá mapuje fyzické symptómy
// na etické príčiny — neresti / nesprávne myslenie / nezvládnuté emócie.
// Cieľom nie je diagnostika, ale reflexia: aký vzorec myslenia/správania
// stojí za chronickým blokom.
//
// Tu pripájame etikoterapeutický pohľad na každú zo 7 čakier — keď je
// čakra blokovaná, etikoterapia ponúka *prečo* a *čo s tým*.
//
// Zdroje:
// - Vladimír Vogeltanz, "Etikoterapia" (kniha, 2008+)
// - Ctibor Bezděk, "Etikoterapie - léčba mravností" (1948, fundamentálne dielo)
//
// DISCLAIMER: Toto sú archetypálne mapy, nie medicínska diagnostika.
// Pri fyzických ťažkostiach treba ísť k lekárovi. Etikoterapia je
// reflexný/sebaspoznávací nástroj.

import type { Language } from '../store/useStore';

export interface EtikoterapiaChakraMap {
  chakraNumber: number;
  /** Hlavná etická téma viažuca sa na túto čakru */
  ethicalTheme: string;
  /** Aké emócie/postoje blokujú energiu tejto čakry */
  blockingEmotions: string[];
  /** Cnosť (čnosť), ktorá oslobodzuje */
  liberatingVirtue: string;
  /** Krátky popis cnosti a jej praxe */
  virtueDescription: string;
  /** Orgány a fyzické systémy, ktoré sú v tradícii etikoterapie spojené s touto čakrou */
  relatedOrgans: string[];
  /** Typické symptómy / sklony, ktoré naznačujú blok na tejto úrovni */
  symptomsHints: string[];
  /** Reflexné otázky pre sebareflexiu (3-4 otázky) */
  reflectionQuestions: string[];
  /** Praktická cesta — čo robiť (krátke, konkrétne) */
  practicalPath: string;
}

const sk: Record<number, EtikoterapiaChakraMap> = {
  1: {
    chakraNumber: 1,
    ethicalTheme: 'Strach a nedôvera v život',
    blockingEmotions: ['Strach o existenciu', 'Nedôvera', 'Pocit nepatričnosti', 'Zúfalstvo'],
    liberatingVirtue: 'Dôvera (viera v život)',
    virtueDescription:
      'Dôvera nie je naivita, ale rozhodnutie veriť že život ma drží aj keď nerozumiem. Pestujem ju malými dennými aktmi: spoľahnem sa na človeka, dovolím si oddych, prijmem že nemusím všetko ovládať.',
    relatedOrgans: ['Chrbtica', 'Kosti', 'Nadobličky', 'Konečník', 'Imunitný systém'],
    symptomsHints: [
      'Chronická únava bez fyzickej príčiny',
      'Bolesti krížov a chrbtice',
      'Slabá imunita, časté infekcie',
      'Finančné problémy z paniky / impulzívnych rozhodnutí',
    ],
    reflectionQuestions: [
      'Čoho sa najviac bojím keď si predstavím že stratím všetko?',
      'Komu (alebo čomu) skutočne dôverujem v živote?',
      'Kedy som naposledy cítil pocit "som doma, som v bezpečí"?',
      'Čo by som musel pustiť aby som mohol cítiť pokoj?',
    ],
    practicalPath:
      'Praktikuj zakorenenie: bosé chodidlá v tráve, hlboké dýchanie do brucha, jednoduché manuálne práce. Ráno si pomenuj 3 veci za ktoré si vďačný — ukotvuje to dôveru.',
  },
  2: {
    chakraNumber: 2,
    ethicalTheme: 'Vina, hanba a popretá radosť',
    blockingEmotions: ['Vina', 'Hanba', 'Sebaodsudzovanie', 'Potlačená radosť', 'Sexuálne tabu'],
    liberatingVirtue: 'Sebaprijatie a zdravá radosť',
    virtueDescription:
      'Prijímam svoje telo, túžby, emócie ako súčasť seba — bez moralizmu. Cnosť tu nie je cudnosť ako popretie, ale úprimnosť: cítim čo cítim, a hľadám kde to vyjadrím v prospech života.',
    relatedOrgans: ['Reprodukčné orgány', 'Vaječníky', 'Maternica', 'Močový mechúr', 'Bedrá', 'Krížová kosť'],
    symptomsHints: [
      'Gynekologické / urologické problémy',
      'Bolesti bedier a krížov',
      'Strata libido alebo nutkavá sexualita bez spojenia',
      'Tvorivá blokáda, neschopnosť tešiť sa',
    ],
    reflectionQuestions: [
      'Z čoho sa hanbím — a kto mi to ako prvý povedal že je to zlé?',
      'Kde popieram svoju radosť pretože mi to "nepatrí"?',
      'Aký vzťah mám ku svojmu telu? Hovorím s ním láskavo?',
      'Ktorý detský sen som odpísal ako "neserióznu hru"?',
    ],
    practicalPath:
      'Dopraj si vyhľadané "neproduktívne" radosti: tanec, kreslenie, voda. Pri pocite hanby napíš na papier "cítim sa vinný za..." a spýtaj sa: je to skutočne moja vina, alebo iba prevzaté pravidlo?',
  },
  3: {
    chakraNumber: 3,
    ethicalTheme: 'Falošná moc, kontrola a strach byť videný',
    blockingEmotions: ['Hnev (potlačený alebo výbušný)', 'Bezmocnosť', 'Pýcha', 'Závisť', 'Strach z autorít'],
    liberatingVirtue: 'Pravá vôľa a pokora bez podriadenosti',
    virtueDescription:
      'Konám z vlastného stredu — nie aby som niekoho potešil ani aby som niekomu dokázal. Pokora tu znamená že prijímam svoju silu aj svoje obmedzenia bez potreby kontrolovať druhých.',
    relatedOrgans: ['Pečeň', 'Žalúdok', 'Pankreas', 'Žlčník', 'Tenké črevo', 'Slezina'],
    symptomsHints: [
      'Pečeňové problémy, žlčníkové ťažkosti',
      'Žalúdočné vredy, reflux',
      'Cukrovka (etikoterapeutický pohľad: nedostatok "sladkosti" prijatia)',
      'Chronický hnev alebo strata vôle',
    ],
    reflectionQuestions: [
      'Koho sa snažím ovládať — a koho som sa pred ním zradil?',
      'V akom konaní som naposledy poslúchol "treba" namiesto "chcem"?',
      'Kde sa hnevám ale neukazujem to? Čo mám zo zadržiavania hnevu?',
      'Čo by sa stalo keby som povedal "nie" tej osobe ktorej sa najviac bojím?',
    ],
    practicalPath:
      'Skús povedať jedno čisté "nie" denne. Hnev nepotláčaj ani nevybuchni — píš ho, behaj s ním, hovor o ňom s niekým bezpečným. Pestuj si vedomé rozhodnutia: ráno si pomenuj 3 veci ktoré dnes urobíš pre seba (nie pre druhých).',
  },
  4: {
    chakraNumber: 4,
    ethicalTheme: 'Neodpustenie a uzavreté srdce',
    blockingEmotions: ['Neodpustenie', 'Trpkosť', 'Žiaľ', 'Sebaľútosť', 'Strach z lásky'],
    liberatingVirtue: 'Odpustenie a súcit (so sebou aj s druhými)',
    virtueDescription:
      'Odpustenie nie je súhlas s tým čo sa stalo, ani zabudnutie. Je to rozhodnutie pustiť bremeno, ktoré nesiem zbytočne dlho. Začínam u seba — odpúšťam si svoju nedokonalosť, naivitu, slabosť.',
    relatedOrgans: ['Srdce', 'Pľúca', 'Cievny systém', 'Hrudník', 'Ramená', 'Hrubé črevo'],
    symptomsHints: [
      'Srdcové ťažkosti, vysoký tlak',
      'Astma, opakované zápaly priedušiek',
      'Bolesti hrudníka a ramien',
      'Úzkosti a depresie zo straty',
    ],
    reflectionQuestions: [
      'Komu nemôžem odpustiť? A koľko ma ten neodpustený človek stojí denne?',
      'Čo presne nesiem ako "nikdy ti to neodpustím"?',
      'Odpustil som už sebe? V čom?',
      'Komu som zatvoril srdce — a kde mi to teraz najviac chýba?',
    ],
    practicalPath:
      'Napíš list (neposielaj ho) tomu komu nemôžeš odpustiť. Vypovedz všetko. Potom napíš druhý list — sebe, ako by ti v tej situácii odpovedal niekto múdry a láskavý. Cvič denne 5 minút sebasúcit: položiť ruku na srdce, dýchať a povedať si "som tu pre seba".',
  },
  5: {
    chakraNumber: 5,
    ethicalTheme: 'Klamstvo, mlčanie zo strachu a popretá pravda',
    blockingEmotions: ['Strach hovoriť', 'Pocit že "nemám právo"', 'Klamstvo (aj zo zdvorilosti)', 'Hnev bez slov'],
    liberatingVirtue: 'Pravdivosť a autentický prejav',
    virtueDescription:
      'Hovorím čo si skutočne myslím — láskavo, ale pravdivo. Mlčím keď slová nepomôžu, hovorím keď nepravda škodí. Cnosť tu je rovnováha medzi diplomaciou a integritou.',
    relatedOrgans: ['Štítna žľaza', 'Krk', 'Hlasivky', 'Pľúca (vrch)', 'Šija', 'Ústa', 'Zuby'],
    symptomsHints: [
      'Problémy so štítnou žľazou (hyper/hypo)',
      'Chronické bolesti hrdla, zachrípnutie',
      'Bolesti šije a krčnej chrbtice',
      'Bruxizmus (škrípanie zubmi v noci)',
    ],
    reflectionQuestions: [
      'Kde dnes klamem (aj seba)? Kde poviem "áno" keď cítim "nie"?',
      'Komu som už dlho chcel niečo povedať a stále to nehovorím?',
      'V akej situácii sa mi sťahuje hrdlo? O čom je to?',
      'Aký je rozdiel medzi mojím skutočným hlasom a tým ktorý ukazujem svetu?',
    ],
    practicalPath:
      'Cvič denné "mikropravdy": v jednej drobnosti denne povedz to čo skutočne cítiš (radšej "nie ďakujem, nemám chuť" než zdvorilá lož). Spievaj alebo nahlas čítaj — fyzicky uvoľňuje krčnú čakru. Píš denník: aspoň 3 vety denne čo sa skutočne dialo.',
  },
  6: {
    chakraNumber: 6,
    ethicalTheme: 'Ilúzie, sebaklam a strata vnútorného videnia',
    blockingEmotions: ['Sebaklam', 'Pýcha mysle', 'Cynizmus', 'Materialistická redukcia', 'Strach zo "šialenstva"'],
    liberatingVirtue: 'Vnútorná čestnosť (rozlišovanie pravdy od ilúzie)',
    virtueDescription:
      'Vidím čo je — bez toho aby som si farbal realitu na ružovo, ani na čierno. Cnosť je rozlišovanie: čo je moja projekcia, čo je fakt, čo je intuícia, čo je strach v prevleku.',
    relatedOrgans: ['Oči', 'Mozog', 'Hypofýza', 'Šišinka (epifýza)', 'Sinusy', 'Uši'],
    symptomsHints: [
      'Migrény, časté bolesti hlavy',
      'Problémy so zrakom (najmä náhle zhoršenie)',
      'Sinusitída, problémy s dutinami',
      'Nespavosť z premýšľania, "prepálená" myseľ',
    ],
    reflectionQuestions: [
      'V čom dnes klamem sám seba? Aký príbeh si nahováram aby som nemusel konať?',
      'Kde ignorujem svoju intuíciu pretože mi to nesedí do plánu?',
      'Kedy som naposledy zmenil názor na základe nových informácií, aj keď to bolelo ego?',
      'Čo vidím okolo seba ale nedovolím si to priznať?',
    ],
    practicalPath:
      'Praktikuj "vidím" meditáciu: 5 minút iba pozoruj bez hodnotenia. Pýtaj sa: "čo vidím — a čo si predstavujem že vidím?" Keď cítiš silné presvedčenie, polož otázku: "ako by som vedel že je opak pravda?" Skutočná intuícia je tichá; strach kričí.',
  },
  7: {
    chakraNumber: 7,
    ethicalTheme: 'Odpojenie od zmyslu a duchovná pýcha alebo materializmus',
    blockingEmotions: ['Pocit nezmyselnosti', 'Duchovná pýcha (som "vyspelejší")', 'Materializmus ako popretie', 'Hnev na "Boha" / vyššiu silu'],
    liberatingVirtue: 'Pokora a otvorenosť tajomstvu',
    virtueDescription:
      'Prijímam že nie som centrom vesmíru ani jeho obsluhou. Som časť celku — nie viac, nie menej. Cnosť je otvorenosť: nemusím všetko vedieť, môžem žiť v otázke. Spirituality nie je o "vyššej úrovni", ale o hlbšom kontakte s realitou.',
    relatedOrgans: ['Mozog ako celok', 'Mozgová kôra', 'Centrálny nervový systém', 'Vrch hlavy'],
    symptomsHints: [
      'Chronická depresia bez zjavnej príčiny',
      'Pocit straty zmyslu',
      'Neurologické ťažkosti',
      '"Spirituálne bypassovanie" — používanie duchovna ako úniku pred životom',
    ],
    reflectionQuestions: [
      'Čomu skutočne slúžim svojím životom? (nie čo by som "mal", ale čo robím)',
      'Kde používam duchovno aby som sa nemusel pozrieť do tieňa?',
      'Kedy som naposledy bol potichu — bez podnetov, bez "praxe", iba v bytí?',
      'Aký je môj vzťah k tomu väčšiemu (Bohu / vesmíru / životu) — naozajstný?',
    ],
    practicalPath:
      'Denne 10 minút bytia v tichu — bez meditačnej techniky, iba sedenie. Pestuj malé akty služby ktoré nikto nevidí (nezdieľaš ich na sociálnych). Pýtaj sa: "čo by chcel život odo mňa dnes?" — bez očakávania jasnej odpovede.',
  },
};

const en: Record<number, EtikoterapiaChakraMap> = {
  1: {
    chakraNumber: 1,
    ethicalTheme: 'Fear and distrust of life',
    blockingEmotions: ['Existential fear', 'Distrust', 'Feeling of not belonging', 'Despair'],
    liberatingVirtue: 'Trust (faith in life)',
    virtueDescription:
      'Trust is not naivety but a decision to believe that life supports me even when I don\'t understand. I cultivate it through small daily acts: relying on someone, allowing myself rest, accepting that I don\'t need to control everything.',
    relatedOrgans: ['Spine', 'Bones', 'Adrenal glands', 'Rectum', 'Immune system'],
    symptomsHints: [
      'Chronic fatigue without physical cause',
      'Lower back and spine pain',
      'Weak immunity, frequent infections',
      'Financial problems from panic / impulsive decisions',
    ],
    reflectionQuestions: [
      'What do I fear most when I imagine losing everything?',
      'Who (or what) do I truly trust in life?',
      'When did I last feel "I am home, I am safe"?',
      'What would I need to let go of to feel at peace?',
    ],
    practicalPath:
      'Practice grounding: bare feet in the grass, deep belly breathing, simple manual work. In the morning, name 3 things you are grateful for — this anchors trust.',
  },
  2: {
    chakraNumber: 2,
    ethicalTheme: 'Guilt, shame, and denied joy',
    blockingEmotions: ['Guilt', 'Shame', 'Self-condemnation', 'Suppressed joy', 'Sexual taboos'],
    liberatingVirtue: 'Self-acceptance and healthy joy',
    virtueDescription:
      'I accept my body, desires, and emotions as part of myself — without moralizing. The virtue here is not chastity as denial, but honesty: I feel what I feel, and I seek where to express it in service of life.',
    relatedOrgans: ['Reproductive organs', 'Ovaries', 'Uterus', 'Bladder', 'Hips', 'Sacrum'],
    symptomsHints: [
      'Gynecological / urological problems',
      'Hip and lower back pain',
      'Loss of libido or compulsive sexuality without connection',
      'Creative block, inability to enjoy',
    ],
    reflectionQuestions: [
      'What am I ashamed of — and who first told me it was wrong?',
      'Where do I deny my joy because I "don\'t deserve it"?',
      'What is my relationship with my body? Do I speak to it kindly?',
      'Which childhood dream did I dismiss as "unserious play"?',
    ],
    practicalPath:
      'Allow yourself sought-out "unproductive" joys: dancing, drawing, water. When feeling shame, write on paper "I feel guilty about..." and ask: is this truly my fault, or just an inherited rule?',
  },
  3: {
    chakraNumber: 3,
    ethicalTheme: 'False power, control, and fear of being seen',
    blockingEmotions: ['Anger (suppressed or explosive)', 'Helplessness', 'Pride', 'Envy', 'Fear of authority'],
    liberatingVirtue: 'True will and humility without submission',
    virtueDescription:
      'I act from my own center — not to please someone nor to prove myself. Humility here means accepting my strength and limitations without needing to control others.',
    relatedOrgans: ['Liver', 'Stomach', 'Pancreas', 'Gallbladder', 'Small intestine', 'Spleen'],
    symptomsHints: [
      'Liver problems, gallbladder issues',
      'Stomach ulcers, reflux',
      'Diabetes (ethicotherapy view: lack of "sweetness" of acceptance)',
      'Chronic anger or loss of will',
    ],
    reflectionQuestions: [
      'Whom am I trying to control — and whom did I betray in front of them?',
      'In what action did I last obey "I should" instead of "I want"?',
      'Where am I angry but not showing it? What do I gain from holding anger?',
      'What would happen if I said "no" to the person I fear most?',
    ],
    practicalPath:
      'Try saying one clear "no" each day. Don\'t suppress anger or explode — write it, run with it, talk about it with someone safe. Cultivate conscious decisions: in the morning, name 3 things you will do today for yourself (not for others).',
  },
  4: {
    chakraNumber: 4,
    ethicalTheme: 'Unforgiveness and a closed heart',
    blockingEmotions: ['Unforgiveness', 'Bitterness', 'Grief', 'Self-pity', 'Fear of love'],
    liberatingVirtue: 'Forgiveness and compassion (for self and others)',
    virtueDescription:
      'Forgiveness is not agreement with what happened, nor forgetting. It is a decision to release the burden I have been carrying needlessly for too long. I begin with myself — forgiving my imperfection, naivety, weakness.',
    relatedOrgans: ['Heart', 'Lungs', 'Circulatory system', 'Chest', 'Shoulders', 'Large intestine'],
    symptomsHints: [
      'Heart problems, high blood pressure',
      'Asthma, recurrent bronchial infections',
      'Chest and shoulder pain',
      'Anxiety and depression from loss',
    ],
    reflectionQuestions: [
      'Whom can I not forgive? And how much does that unforgiven person cost me daily?',
      'What exactly am I carrying as "I will never forgive you"?',
      'Have I already forgiven myself? In what?',
      'Whose heart did I close off — and where do I miss it most now?',
    ],
    practicalPath:
      'Write a letter (don\'t send it) to the one you cannot forgive. Say everything. Then write a second letter — to yourself, as if a wise and loving person were responding. Practice 5 minutes of self-compassion daily: place your hand on your heart, breathe, and say "I am here for myself."',
  },
  5: {
    chakraNumber: 5,
    ethicalTheme: 'Lies, fearful silence, and denied truth',
    blockingEmotions: ['Fear of speaking', 'Feeling "I have no right"', 'Lying (even out of politeness)', 'Wordless anger'],
    liberatingVirtue: 'Truthfulness and authentic expression',
    virtueDescription:
      'I say what I truly think — kindly, but truthfully. I stay silent when words don\'t help, I speak when untruth harms. The virtue here is a balance between diplomacy and integrity.',
    relatedOrgans: ['Thyroid', 'Throat', 'Vocal cords', 'Lungs (upper)', 'Neck', 'Mouth', 'Teeth'],
    symptomsHints: [
      'Thyroid problems (hyper/hypo)',
      'Chronic sore throat, hoarseness',
      'Neck and cervical spine pain',
      'Bruxism (teeth grinding at night)',
    ],
    reflectionQuestions: [
      'Where do I lie today (even to myself)? Where do I say "yes" when I feel "no"?',
      'To whom have I long wanted to say something and still don\'t?',
      'In what situation does my throat tighten? What is it about?',
      'What is the difference between my true voice and the one I show the world?',
    ],
    practicalPath:
      'Practice daily "micro-truths": in one small thing each day, say what you truly feel (rather "no thank you, I don\'t feel like it" than a polite lie). Sing or read aloud — it physically releases the throat chakra. Write a journal: at least 3 sentences daily about what actually happened.',
  },
  6: {
    chakraNumber: 6,
    ethicalTheme: 'Illusions, self-deception, and loss of inner vision',
    blockingEmotions: ['Self-deception', 'Intellectual pride', 'Cynicism', 'Materialistic reductionism', 'Fear of "madness"'],
    liberatingVirtue: 'Inner honesty (discerning truth from illusion)',
    virtueDescription:
      'I see what is — without coloring reality pink or black. The virtue is discernment: what is my projection, what is fact, what is intuition, what is fear in disguise.',
    relatedOrgans: ['Eyes', 'Brain', 'Pituitary gland', 'Pineal gland (epiphysis)', 'Sinuses', 'Ears'],
    symptomsHints: [
      'Migraines, frequent headaches',
      'Vision problems (especially sudden deterioration)',
      'Sinusitis, sinus problems',
      'Insomnia from overthinking, "burned-out" mind',
    ],
    reflectionQuestions: [
      'In what am I deceiving myself today? What story am I telling myself to avoid action?',
      'Where am I ignoring my intuition because it doesn\'t fit my plan?',
      'When did I last change my mind based on new information, even though it hurt my ego?',
      'What do I see around me but won\'t allow myself to admit?',
    ],
    practicalPath:
      'Practice "I see" meditation: 5 minutes of just observing without judging. Ask yourself: "what do I see — and what do I imagine I see?" When you feel a strong conviction, ask: "how would I know if the opposite were true?" True intuition is quiet; fear screams.',
  },
  7: {
    chakraNumber: 7,
    ethicalTheme: 'Disconnection from meaning and spiritual pride or materialism',
    blockingEmotions: ['Feeling of meaninglessness', 'Spiritual pride ("I am more advanced")', 'Materialism as denial', 'Anger at "God" / higher power'],
    liberatingVirtue: 'Humility and openness to mystery',
    virtueDescription:
      'I accept that I am neither the center of the universe nor its servant. I am part of the whole — no more, no less. The virtue is openness: I don\'t need to know everything, I can live in the question. Spirituality is not about a "higher level" but about deeper contact with reality.',
    relatedOrgans: ['Brain as a whole', 'Cerebral cortex', 'Central nervous system', 'Crown of the head'],
    symptomsHints: [
      'Chronic depression without apparent cause',
      'Feeling of loss of meaning',
      'Neurological difficulties',
      '"Spiritual bypassing" — using spirituality as escape from life',
    ],
    reflectionQuestions: [
      'What am I truly serving with my life? (not what I "should" but what I actually do)',
      'Where do I use spirituality to avoid looking at my shadow?',
      'When was I last in silence — without stimuli, without "practice", just being?',
      'What is my relationship with the greater (God / universe / life) — truly?',
    ],
    practicalPath:
      'Daily 10 minutes of being in silence — without meditation technique, just sitting. Cultivate small acts of service that nobody sees (don\'t share them on social media). Ask: "what would life want from me today?" — without expecting a clear answer.',
  },
};

// Backward compat export
export const ETIKOTERAPIA_BY_CHAKRA: Record<number, EtikoterapiaChakraMap> = sk;

/**
 * Pomocná funkcia — vráti etikoterapeutickú mapu pre čakru. Vracia null
 * iba pre chakraNumber mimo 1-7.
 */
export function getEtikoterapiaForChakra(chakraNumber: number, lang: Language = 'sk'): EtikoterapiaChakraMap | null {
  const dicts = { sk, en };
  return dicts[lang]?.[chakraNumber] ?? dicts.sk[chakraNumber] ?? null;
}
