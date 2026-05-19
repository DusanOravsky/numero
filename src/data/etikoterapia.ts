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

export const ETIKOTERAPIA_BY_CHAKRA: Record<number, EtikoterapiaChakraMap> = {
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
      'Doprajteváhľadané "neproduktívne" radosti: tanec, kreslenie, voda. Pri pocite hanby napíš na papier "cítim sa vinný za..." a spýtaj sa: je to skutočne moja vina, alebo iba prevzaté pravidlo?',
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
      'Skúsi povedať jedno čisté "nie" denne. Hnev nepotláčaj ani nevybuchni — píš ho, behaj s ním, hovor o ňom s niekým bezpečným. Pestuj si vedomé rozhodnutia: ráno si pomenuj 3 veci ktoré dnes urobíš pre seba (nie pre druhých).',
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

/**
 * Pomocná funkcia — vráti etikoterapeutickú mapu pre čakru. Vracia null
 * iba pre chakraNumber mimo 1-7.
 */
export function getEtikoterapiaForChakra(chakraNumber: number): EtikoterapiaChakraMap | null {
  return ETIKOTERAPIA_BY_CHAKRA[chakraNumber] || null;
}
