import type { Language } from '../store/useStore';

export interface LifePathInfo {
  title: string;
  keywords: string[];
  description: string;
  gift: string;
  shadow: string;
  lesson?: string;
  recommendation?: string;
  career?: string[];
  relationships?: string;
}

const sk: Record<string, LifePathInfo> = {
  "1": {
    title: "Vodca",
    keywords: ["nezávislosť", "iniciatíva", "odvaha", "originalita"],
    description: "Životné číslo 1 symbolizuje ducha priekopníka. Ste tu, aby ste išli vlastnou cestou, viedli príkladom a nebáli sa byť prví. Vaša energia je energia začiatkov, originality a odvahy.",
    gift: "Schopnosť ísť vlastnou cestou a inšpirovať ostatných svojou odvahou",
    shadow: "Izolácia, egocentrizmus, strach z závislosti na iných",
    lesson: "Naučiť sa viesť s pokorou a prijať, že aj nezávislosť potrebuje prepojenie",
    recommendation: "Denne si pripomínajte: Moja sila je v autenticite, nie v kontrole. Dovoľte si požiadať o pomoc.",
    career: ["podnikanie", "vedenie", "inovácie", "nezávislé profesie"],
    relationships: "V partnerstvách potrebujete priestor pre svoju individualitu. Ideálny partner rešpektuje vašu nezávislosť a má vlastnú silnú identitu."
  },
  "2": {
    title: "Diplomat",
    keywords: ["spolupráca", "citlivosť", "harmónia", "intuícia"],
    description: "Životné číslo 2 prináša energiu spolupráce, diplomacie a jemnej sily. Vaším darom je schopnosť vidieť obe strany, vytvárať mosty a prinášať harmóniu tam, kde je konflikt.",
    gift: "Empatia, diplomacia, schopnosť vytvárať hlboké prepojenia",
    shadow: "Strata vlastnej identity v iných, nerozhodnosť, závislosť na schválení",
    lesson: "Naučiť sa, že vaše potreby sú rovnako dôležité ako potreby iných",
    recommendation: "Denne si vytvorte aspoň 10 minút len pre seba. Pýtajte sa: Čo chcem JA?",
    career: ["mediácia", "poradenstvo", "umenie", "tímová práca", "liečiteľstvo"],
    relationships: "V vzťahoch ste darom – vaša intuícia a empatia vytvárajú hlboké prepojenie. Chráňte si hranice."
  },
  "3": {
    title: "Tvorca",
    keywords: ["kreativita", "sebavyjadrenie", "radosť", "komunikácia"],
    description: "Životné číslo 3 je číslom tvorivého vyjadrenia. Vaša duša sa chce vyjadriť – slovom, obrazom, pohybom, hudbou. Ste tu, aby ste prinášali radosť a krásu do sveta.",
    gift: "Kreativita, radosť, schopnosť inšpirovať a zabávať",
    shadow: "Povrchnosť, rozptýlenosť, strach z hĺbky a záväzkov",
    lesson: "Naučiť sa, že hĺbka neznižuje radosť – práve naopak",
    recommendation: "Každý deň stvorte aspoň jednu vec – vetu, kresbu, melódiu. Vaša kreativita je liek.",
    career: ["písanie", "umenie", "komunikácia", "učenie", "zábava"],
    relationships: "Prinášate ľahkosť a radosť. Hľadajte partnera, ktorý oceňuje vašu hravosť a zároveň vám ponúka hĺbku."
  },
  "4": {
    title: "Staviteľ",
    keywords: ["stabilita", "práca", "systematickosť", "spoľahlivosť"],
    description: "Životné číslo 4 je číslom staviteľa. Vaša sila spočíva v schopnosti vytvárať pevné základy – pre seba, rodinu, komunitu. Ste pilierom spoľahlivosti.",
    gift: "Spoľahlivosť, systematickosť, schopnosť budovať trvalé hodnoty",
    shadow: "Rigidita, strach zo zmeny, workoholizmus, kontrola",
    lesson: "Naučiť sa, že flexibilita nie je slabosť a že odpočinok je tiež práca",
    recommendation: "Pravidelne si dovoľte neproduktívny čas. Vaša hodnota nie je v tom, čo robíte, ale v tom, kto ste.",
    career: ["inžinierstvo", "architektúra", "manažment", "financie", "remeslo"],
    relationships: "Ponúkate stabilitu a bezpečie. Potrebujete partnera, ktorý ocení vašu spoľahlivosť a pomôže vám uvoľniť sa."
  },
  "5": {
    title: "Slobodný duch",
    keywords: ["sloboda", "zmena", "dobrodružstvo", "adaptabilita"],
    description: "Životné číslo 5 je číslom slobody a zmeny. Vaša duša túži po skúsenostiach, cestovaní a raste cez rôznorodosť. Ste katalyzátorom zmeny.",
    gift: "Adaptabilita, sloboda, schopnosť inšpirovať zmeny a rast",
    shadow: "Nestálosť, útek pred zodpovednosťou, závislosť na vzrušení",
    lesson: "Naučiť sa, že pravá sloboda zahŕňa aj záväzok – voči sebe a svojim hodnotám",
    recommendation: "Nájdite slobodu aj v rutine. Nie každá zmena musí byť dramatická – mikro-dobrodružstvá počítajú.",
    career: ["cestovanie", "žurnalistika", "predaj", "marketing", "podnikanie"],
    relationships: "Potrebujete partnera, ktorý sa nebojí zmeny a dáva vám priestor. Záväzok nie je klietka – je to voľba."
  },
  "6": {
    title: "Opatrovník",
    keywords: ["láska", "zodpovednosť", "krása", "harmónia"],
    description: "Životné číslo 6 je číslom srdca a domova. Vaším poslaním je prinášať lásku, krásu a harmóniu. Ste prirodzený opatrovník s hlbokým zmyslom pre zodpovednosť.",
    gift: "Bezpodmienečná láska, zmysel pre krásu, schopnosť vytvárať domov",
    shadow: "Kontrola cez starostlivosť, perfekcionizmus, obetovanie sa",
    lesson: "Naučiť sa, že starostlivosť o seba nie je sebeckosť – je to základ",
    recommendation: "Každý deň urobte niečo LEN pre seba, bez pocitu viny. Ste hodní rovnakej lásky, akú dávate.",
    career: ["liečiteľstvo", "vzdelávanie", "umenie", "dizajn", "sociálna práca"],
    relationships: "Ste darom pre partnerov – ale chráňte sa pred obetovaním. Zdravý vzťah je výmena, nie jednosmerka."
  },
  "7": {
    title: "Mystik",
    keywords: ["múdrosť", "introspekcia", "duchovno", "analýza"],
    description: "Životné číslo 7 je číslom hľadača pravdy. Vaša duša túži po pochopení – hlbokom, pravdivom, neobmedzenom. Ste mystik, filozof, vedec duše.",
    gift: "Múdrosť, intuícia, hlboké pochopenie podstaty vecí",
    shadow: "Izolácia, cynizmus, nedôvera, intelektualizácia emócií",
    lesson: "Naučiť sa, že pravá múdrosť zahŕňa srdce aj myseľ – a prepojenie s inými",
    recommendation: "Rovnováha medzi samotou a prepojením. Vaša múdrosť rastie aj cez zdieľanie, nie len cez stiahnutie.",
    career: ["výskum", "psychológia", "duchovno", "filozofia", "technológie"],
    relationships: "Potrebujete partnera, ktorý rešpektuje vaše ticho a zároveň vás jemne volá von z ulity."
  },
  "8": {
    title: "Mocnár",
    keywords: ["sila", "hojnosť", "autorita", "manifestácia"],
    description: "Životné číslo 8 je číslom moci a hojnosti. Vaša energia je energia manifestácie – schopnosti premieňať víziu na realitu. Ste tu, aby ste ukázali, že sila a súcit môžu koexistovať.",
    gift: "Sila, hojnosť, schopnosť manifestovať a viesť",
    shadow: "Manipulácia, posadnutosť mocou, materializmus, strach zo straty",
    lesson: "Naučiť sa, že pravá moc je v službe – a že hojnosť zahŕňa aj dávanie",
    recommendation: "Pravidelne si pripomínajte: Pre koho používam svoju silu? Moc v službe lásky je najväčšia moc.",
    career: ["podnikanie", "financie", "vedenie", "právo", "nehnuteľnosti"],
    relationships: "Ste silný partner – ale učte sa zraniteľnosti. Pravá intimita vyžaduje odloženie brnenia."
  },
  "9": {
    title: "Mudrc",
    keywords: ["múdrosť", "súcit", "dovŕšenie", "služba"],
    description: "Životné číslo 9 je číslom dovŕšenia a univerzálnej lásky. Vaša duša je stará a múdra – prišli ste dokončiť, uzavrieť a zdieľať nazbieranú múdrosť s ostatnými.",
    gift: "Hlboký súcit, múdrosť, schopnosť vidieť celok a inšpirovať",
    shadow: "Nadradennosť, únik z reality, neschopnosť pustiť, martýrstvo",
    lesson: "Naučiť sa púšťať s vďačnosťou a dôverou, že koniec je vždy aj začiatkom",
    recommendation: "Učte sa umeniu dokončovania. Nie každý koniec je strata – niektoré sú darčeky.",
    career: ["humanitárna práca", "umenie", "učenie", "liečiteľstvo", "duchovná práca"],
    relationships: "Ste hlboký a múdry partner. Učte sa byť prítomní tu a teraz, nie len v ideáloch."
  },
  "11": {
    title: "Intuitívny vizionár",
    keywords: ["intuícia", "inšpirácia", "duchovnosť", "osvietenie"],
    description: "Master číslo 11 je číslom duchovného osvietenia a intuície. Máte priamy prístup k vyšším úrovniam vedomia. Ste tu aby ste inšpirovali a ukazovali cestu — nie silou, ale svetlom, ktoré vyžarujete.",
    gift: "Mimoriadna intuícia, schopnosť inšpirovať, duchovná hĺbka, vizionárstvo",
    shadow: "Úzkosť, nervozita, sebadeštruktívne vzorce, neschopnosť uzemnenia, prehnaný idealizmus",
    lesson: "Naučiť sa uzemnenie — inšpirácia bez koreňov sa stáva úzkosťou. Vaša úloha je preniesť víziu do reality",
    recommendation: "Každý deň si nájdite čas na ticho — tam počujete svoju intuíciu najlepšie. Ale potom konajte — inšpirácia bez akcie je len sen.",
    career: ["poradenstvo", "umenie", "duchovné vedenie", "psychológia", "médiá", "inovácie"],
    relationships: "Ste hlboko citlivý partner s intenzívnym vnútorným životom. Potrebujete niekoho, kto rešpektuje vašu potrebu ticha a hĺbky."
  },
  "22": {
    title: "Majstrovský staviteľ",
    keywords: ["manifestácia", "vízia", "stavba", "zmena sveta"],
    description: "Master číslo 22 je najsilnejšie zo všetkých — je to vízia 11 spojená s praktickosťou 4. Ste tu aby ste stavali niečo trvalé, čo presiahne váš život. Vaše sny nie sú fantázie — sú plány.",
    gift: "Schopnosť premeniť veľké vízie na realitu, disciplína, praktická múdrosť, vedenie veľkých projektov",
    shadow: "Ohromenie z vlastného potenciálu, prokrastinácia z veľkosti úlohy, workoholizmus, kontrola",
    lesson: "Naučiť sa, že aj najväčšia stavba začína jednou tehlou. Nemusíte zmeniť svet naraz — stačí začať",
    recommendation: "Rozdeľte veľkú víziu na malé kroky. Každý deň jedna tehla. Nedovoľte veľkosti sna paralyzovať konanie.",
    career: ["architektúra", "podnikanie", "politika", "inžinierstvo", "vedenie organizácií", "infraštruktúra"],
    relationships: "Ste spoľahlivý a oddaný partner s veľkými ambíciami. Dávajte pozor aby práca nezožrala vzťah — stavajte aj dom lásky, nie len kariéry."
  },
  "33": {
    title: "Majstrovský učiteľ",
    keywords: ["súcit", "liečenie", "služba", "bezpodmienečná láska"],
    description: "Master číslo 33 je najvzácnejšie — je to energia bezpodmienečnej lásky a služby ľudstvu. Kombinuje intuíciu 11 a staviteľstvo 22 s hlbokým súcitom 6. Ste tu aby ste liečili — nie predpismi, ale prítomnosťou.",
    gift: "Hlboký súcit, schopnosť liečiť prítomnosťou, inšpirácia cez príklad, bezpodmienečná láska",
    shadow: "Martýrstvo, obetovanie sa na úkor seba, perfekcionizmus v službe, emočné vyčerpanie",
    lesson: "Naučiť sa, že najväčšia služba začína od seba. Nemôžete liečiť z prázdna — najprv naplňte seba",
    recommendation: "Služba iným je váš dar — ale nie na úkor vlastného zdravia. Každý deň niečo len pre seba. Zdravý učiteľ učí príkladom, nie obeťou.",
    career: ["liečiteľstvo", "učenie", "poradenstvo", "duchovné vedenie", "umenie", "humanitárna práca"],
    relationships: "Ste mimoriadne láskavý a oddaný partner. Ale pozor na tendenciu 'zachraňovať' — partnerstvo je rovnocenné, nie projekt."
  }
};

const en: Record<string, LifePathInfo> = {
  "1": {
    title: "The Leader",
    keywords: ["independence", "initiative", "courage", "originality"],
    description: "Life Path 1 symbolizes the spirit of a pioneer. You are here to go your own way, lead by example, and not be afraid to be first. Your energy is the energy of beginnings, originality, and courage.",
    gift: "The ability to walk your own path and inspire others with your courage",
    shadow: "Isolation, egocentrism, fear of dependence on others",
    lesson: "Learn to lead with humility and accept that even independence needs connection",
    recommendation: "Remind yourself daily: My strength is in authenticity, not in control. Allow yourself to ask for help.",
    career: ["entrepreneurship", "leadership", "innovation", "independent professions"],
    relationships: "In partnerships, you need space for your individuality. The ideal partner respects your independence and has their own strong identity."
  },
  "2": {
    title: "The Diplomat",
    keywords: ["cooperation", "sensitivity", "harmony", "intuition"],
    description: "Life Path 2 brings the energy of cooperation, diplomacy, and gentle strength. Your gift is the ability to see both sides, build bridges, and bring harmony where there is conflict.",
    gift: "Empathy, diplomacy, the ability to create deep connections",
    shadow: "Loss of own identity in others, indecisiveness, dependence on approval",
    lesson: "Learn that your needs are equally important as the needs of others",
    recommendation: "Create at least 10 minutes daily just for yourself. Ask: What do I want?",
    career: ["mediation", "counseling", "art", "teamwork", "healing"],
    relationships: "In relationships you are a gift — your intuition and empathy create deep connection. Protect your boundaries."
  },
  "3": {
    title: "The Creator",
    keywords: ["creativity", "self-expression", "joy", "communication"],
    description: "Life Path 3 is the number of creative expression. Your soul wants to express itself — through words, images, movement, music. You are here to bring joy and beauty to the world.",
    gift: "Creativity, joy, the ability to inspire and entertain",
    shadow: "Superficiality, distraction, fear of depth and commitment",
    lesson: "Learn that depth does not diminish joy — quite the opposite",
    recommendation: "Create at least one thing every day — a sentence, a drawing, a melody. Your creativity is medicine.",
    career: ["writing", "art", "communication", "teaching", "entertainment"],
    relationships: "You bring lightness and joy. Seek a partner who appreciates your playfulness and also offers you depth."
  },
  "4": {
    title: "The Builder",
    keywords: ["stability", "work", "systematicity", "reliability"],
    description: "Life Path 4 is the number of the builder. Your strength lies in the ability to create solid foundations — for yourself, family, community. You are a pillar of reliability.",
    gift: "Reliability, systematicity, the ability to build lasting values",
    shadow: "Rigidity, fear of change, workaholism, control",
    lesson: "Learn that flexibility is not weakness and that rest is also work",
    recommendation: "Regularly allow yourself unproductive time. Your value is not in what you do, but in who you are.",
    career: ["engineering", "architecture", "management", "finance", "craftsmanship"],
    relationships: "You offer stability and safety. You need a partner who appreciates your reliability and helps you relax."
  },
  "5": {
    title: "The Free Spirit",
    keywords: ["freedom", "change", "adventure", "adaptability"],
    description: "Life Path 5 is the number of freedom and change. Your soul yearns for experiences, travel, and growth through diversity. You are a catalyst of change.",
    gift: "Adaptability, freedom, the ability to inspire change and growth",
    shadow: "Inconstancy, escaping responsibility, addiction to excitement",
    lesson: "Learn that true freedom also includes commitment — to yourself and your values",
    recommendation: "Find freedom even in routine. Not every change needs to be dramatic — micro-adventures count.",
    career: ["travel", "journalism", "sales", "marketing", "entrepreneurship"],
    relationships: "You need a partner who is not afraid of change and gives you space. Commitment is not a cage — it is a choice."
  },
  "6": {
    title: "The Caregiver",
    keywords: ["love", "responsibility", "beauty", "harmony"],
    description: "Life Path 6 is the number of the heart and home. Your mission is to bring love, beauty, and harmony. You are a natural caregiver with a deep sense of responsibility.",
    gift: "Unconditional love, sense of beauty, the ability to create home",
    shadow: "Control through care, perfectionism, self-sacrifice",
    lesson: "Learn that self-care is not selfishness — it is the foundation",
    recommendation: "Every day do something ONLY for yourself, without guilt. You are worthy of the same love you give.",
    career: ["healing", "education", "art", "design", "social work"],
    relationships: "You are a gift to partners — but protect yourself from self-sacrifice. A healthy relationship is an exchange, not a one-way street."
  },
  "7": {
    title: "The Mystic",
    keywords: ["wisdom", "introspection", "spirituality", "analysis"],
    description: "Life Path 7 is the number of the truth seeker. Your soul yearns for understanding — deep, true, unlimited. You are a mystic, philosopher, scientist of the soul.",
    gift: "Wisdom, intuition, deep understanding of the essence of things",
    shadow: "Isolation, cynicism, distrust, intellectualizing emotions",
    lesson: "Learn that true wisdom includes both heart and mind — and connection with others",
    recommendation: "Balance between solitude and connection. Your wisdom grows also through sharing, not just through withdrawal.",
    career: ["research", "psychology", "spirituality", "philosophy", "technology"],
    relationships: "You need a partner who respects your silence and gently calls you out of your shell."
  },
  "8": {
    title: "The Powerhouse",
    keywords: ["strength", "abundance", "authority", "manifestation"],
    description: "Life Path 8 is the number of power and abundance. Your energy is the energy of manifestation — the ability to transform vision into reality. You are here to show that strength and compassion can coexist.",
    gift: "Strength, abundance, the ability to manifest and lead",
    shadow: "Manipulation, obsession with power, materialism, fear of loss",
    lesson: "Learn that true power is in service — and that abundance also includes giving",
    recommendation: "Regularly remind yourself: For whom am I using my strength? Power in service of love is the greatest power.",
    career: ["entrepreneurship", "finance", "leadership", "law", "real estate"],
    relationships: "You are a strong partner — but learn vulnerability. True intimacy requires laying down your armor."
  },
  "9": {
    title: "The Sage",
    keywords: ["wisdom", "compassion", "completion", "service"],
    description: "Life Path 9 is the number of completion and universal love. Your soul is old and wise — you came to finish, close, and share accumulated wisdom with others.",
    gift: "Deep compassion, wisdom, the ability to see the whole and inspire",
    shadow: "Superiority, escape from reality, inability to let go, martyrdom",
    lesson: "Learn to let go with gratitude and trust that every ending is also a beginning",
    recommendation: "Learn the art of completion. Not every ending is a loss — some are gifts.",
    career: ["humanitarian work", "art", "teaching", "healing", "spiritual work"],
    relationships: "You are a deep and wise partner. Learn to be present here and now, not just in ideals."
  },
  "11": {
    title: "The Intuitive Visionary",
    keywords: ["intuition", "inspiration", "spirituality", "enlightenment"],
    description: "Master number 11 is the number of spiritual enlightenment and intuition. You have direct access to higher levels of consciousness. You are here to inspire and show the way — not by force, but by the light you radiate.",
    gift: "Extraordinary intuition, ability to inspire, spiritual depth, visionary capacity",
    shadow: "Anxiety, nervousness, self-destructive patterns, inability to ground, excessive idealism",
    lesson: "Learn grounding — inspiration without roots becomes anxiety. Your task is to bring vision into reality",
    recommendation: "Find time for silence every day — that is where you hear your intuition best. But then act — inspiration without action is just a dream.",
    career: ["counseling", "art", "spiritual leadership", "psychology", "media", "innovation"],
    relationships: "You are a deeply sensitive partner with an intense inner life. You need someone who respects your need for silence and depth."
  },
  "22": {
    title: "The Master Builder",
    keywords: ["manifestation", "vision", "building", "world change"],
    description: "Master number 22 is the most powerful of all — it is the vision of 11 combined with the practicality of 4. You are here to build something lasting that will outlive you. Your dreams are not fantasies — they are blueprints.",
    gift: "The ability to turn great visions into reality, discipline, practical wisdom, leading large projects",
    shadow: "Overwhelm from own potential, procrastination from the magnitude of the task, workaholism, control",
    lesson: "Learn that even the greatest building starts with one brick. You don't need to change the world at once — just start",
    recommendation: "Break the great vision into small steps. One brick every day. Don't let the size of the dream paralyze action.",
    career: ["architecture", "entrepreneurship", "politics", "engineering", "leading organizations", "infrastructure"],
    relationships: "You are a reliable and devoted partner with great ambitions. Be careful that work doesn't consume the relationship — build a house of love too, not just a career."
  },
  "33": {
    title: "The Master Teacher",
    keywords: ["compassion", "healing", "service", "unconditional love"],
    description: "Master number 33 is the rarest — it is the energy of unconditional love and service to humanity. It combines the intuition of 11 and the building capacity of 22 with the deep compassion of 6. You are here to heal — not with prescriptions, but with presence.",
    gift: "Deep compassion, ability to heal through presence, inspiration by example, unconditional love",
    shadow: "Martyrdom, self-sacrifice at own expense, perfectionism in service, emotional exhaustion",
    lesson: "Learn that the greatest service begins with yourself. You cannot heal from emptiness — first fill yourself",
    recommendation: "Service to others is your gift — but not at the expense of your own health. Something just for yourself every day. A healthy teacher teaches by example, not by sacrifice.",
    career: ["healing", "teaching", "counseling", "spiritual leadership", "art", "humanitarian work"],
    relationships: "You are an extraordinarily loving and devoted partner. But watch the tendency to 'rescue' — partnership is equal, not a project."
  }
};

export function getLifePath(key: string, lang: Language = 'sk'): LifePathInfo | undefined {
  const dicts = { sk, en };
  return dicts[lang]?.[key] ?? dicts.sk[key];
}

// Backward compat
const lifePaths = sk;
export default lifePaths;
