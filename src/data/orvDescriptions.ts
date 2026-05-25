import type { Language } from '../store/useStore';

// === ORV Descriptions ===

export interface OrvDescription {
  title: string;
  theme: string;
  description: string;
  advice: string;
  keywords: string[];
}

const orvSk: Record<number, OrvDescription> = {
  1: {
    title: 'Rok nových začiatkov',
    theme: 'Nový cyklus, iniciatíva, nezávislosť',
    description: 'Rok 1 je začiatkom nového deväťročného cyklu. Je to čas zasievať semienka, začínať nové projekty, meniť smer a presadzovať sa. Energia podporuje odvahu, originalitu a samostatnosť. Staré sa uzatvára a nové sa otvára.',
    advice: 'Buďte odvážni, začnite niečo nové. Nespoliehajte sa na iných – je to váš rok osobnej iniciatívy. Dôverujte svojej vízii.',
    keywords: ['začiatok', 'odvaha', 'nezávislosť', 'iniciatíva', 'vedenie'],
  },
  2: {
    title: 'Rok spolupráce a trpezlivosti',
    theme: 'Partnerstvo, diplomacia, čakanie',
    description: 'Rok 2 spomaľuje tempo. Učíte sa trpezlivosti, spolupráci a diplomacii. Je to čas budovať vzťahy, počúvať intuíciu a nechať veci dozrieť. Nie je vhodný na veľké akcie – skôr na jemné ladenie.',
    advice: 'Buďte trpezliví, rozvíjajte vzťahy a spolupráce. Nepúšťajte sa do veľkých rozhodnutí sami – hľadajte spojencov a počúvajte svoju intuíciu.',
    keywords: ['trpezlivosť', 'spolupráca', 'intuícia', 'diplomacia', 'detaily'],
  },
  3: {
    title: 'Rok tvorivosti a komunikácie',
    theme: 'Sebavyjadrenie, radosť, kreativita',
    description: 'Rok 3 prináša ľahkosť, kreativitu a potrebu komunikovať. Energia podporuje umelecké vyjadrenie, sociálny život a optimizmus. Je to čas byť viditeľný, tvoriť a zdieľať svoju radosť s okolím.',
    advice: 'Tvorte, komunikujte, bavte sa. Zapojte sa do spoločenského diania. Vyjadrujte sa – písaním, umením, hovorením. Nedržte si veci pre seba.',
    keywords: ['kreativita', 'komunikácia', 'radosť', 'sebavyjadrenie', 'spoločenskosť'],
  },
  4: {
    title: 'Rok budovania a disciplíny',
    theme: 'Práca, poriadok, základy, štruktúra',
    description: 'Rok 4 žiada disciplínu a systematickú prácu. Je to čas položiť pevné základy pre budúcnosť – v zdraví, financiách, kariére aj vzťahoch. Energia nie je vzrušujúca, ale je stabilizujúca a nevyhnutná.',
    advice: 'Pracujte na základoch. Usporiadajte financie, zdravie, domov. Buďte disciplinovaní a vytrvalí – tento rok stavia piliere pre budúce úspechy.',
    keywords: ['disciplína', 'práca', 'poriadok', 'základy', 'stabilita'],
  },
  5: {
    title: 'Rok zmien a slobody',
    theme: 'Zmena, cestovanie, nové skúsenosti',
    description: 'Rok 5 prináša dynamiku, zmeny a nečakané príležitosti. Energia podporuje cestovanie, nové kontakty, dobrodružstvo a adaptabilitu. Môžu prísť nečakané zvraty – privítajte ich.',
    advice: 'Buďte flexibilní a otvorení zmenám. Cestujte, skúšajte nové veci, stretávajte nových ľudí. Neodporujte zmenám – sú to príležitosti.',
    keywords: ['zmena', 'sloboda', 'cestovanie', 'dobrodružstvo', 'adaptabilita'],
  },
  6: {
    title: 'Rok lásky a zodpovednosti',
    theme: 'Rodina, vzťahy, harmónia, služba',
    description: 'Rok 6 je o láske, domove, rodine a zodpovednosti. Energia podporuje vytváranie harmónie vo vzťahoch, starostlivosť o blízkych a estetiku. Môže priniesť záväzky – svadbu, dieťa, nový domov.',
    advice: 'Venujte sa vzťahom a rodine. Vytvárajte krásu a harmóniu okolo seba. Prijmite zodpovednosť s láskou – nie ako bremeno.',
    keywords: ['láska', 'rodina', 'harmónia', 'zodpovednosť', 'krása'],
  },
  7: {
    title: 'Rok vnútorného rastu',
    theme: 'Introspekcia, duchovnosť, štúdium',
    description: 'Rok 7 je o vnútornom svete – meditácii, štúdiu, duchovnom raste a samote. Energia podporuje hlboké premýšľanie, analytiku a hľadanie pravdy. Nie je to rok vonkajšej aktivity, ale vnútornej transformácie.',
    advice: 'Venujte čas sebe, štúdiu a duchovnej praxi. Buďte v tichu, meditujte, analyzujte. Dôverujte procesu vnútorného rastu – nemusíte byť stále aktívni navonok.',
    keywords: ['introspekcia', 'duchovnosť', 'štúdium', 'múdrosť', 'ticho'],
  },
  8: {
    title: 'Rok manifestácie a hojnosti',
    theme: 'Moc, úspech, materiálno, autorita',
    description: 'Rok 8 prináša energiu manifestácie, finančného úspechu a osobnej moci. Je to čas zbierať úrodu predchádzajúcich rokov. Energia podporuje podnikanie, kariérny postup a materiálne zlepšenie.',
    advice: 'Konajte s autoritou a sebavedomím. Investujte, podnikajte, žiadajte o zvýšenie. Tento rok odmieňa tých, čo v predchádzajúcich rokoch pracovali na sebe.',
    keywords: ['úspech', 'hojnosť', 'moc', 'kariéra', 'manifestácia'],
  },
  9: {
    title: 'Rok ukončenia a uvoľnenia',
    theme: 'Dokončenie, odpustenie, príprava na nové',
    description: 'Rok 9 uzatvára celý deväťročný cyklus. Je to čas dokončiť rozrobené veci, odpustiť, pustiť staré a pripraviť sa na nový začiatok. Energia podporuje filantropiu, súcit a uzatváranie.',
    advice: 'Dokončite, čo ste začali. Odpustite a pustite to, čo vám už neslúži. Neštartujte veľké nové projekty – nechajte priestor pre uzavretie cyklu.',
    keywords: ['ukončenie', 'odpustenie', 'múdrosť', 'súcit', 'transformácia'],
  },
};

const orvEn: Record<number, OrvDescription> = {
  1: {
    title: 'Year of New Beginnings',
    theme: 'New cycle, initiative, independence',
    description: 'Year 1 marks the start of a new nine-year cycle. It is time to plant seeds, launch new projects, change direction and assert yourself. The energy supports courage, originality and self-reliance. The old is closing and the new is opening.',
    advice: 'Be bold, start something new. Do not rely on others — this is your year of personal initiative. Trust your vision.',
    keywords: ['beginning', 'courage', 'independence', 'initiative', 'leadership'],
  },
  2: {
    title: 'Year of Cooperation and Patience',
    theme: 'Partnership, diplomacy, waiting',
    description: 'Year 2 slows the pace. You are learning patience, cooperation and diplomacy. It is time to build relationships, listen to intuition and let things ripen. Not suited for grand actions — rather for subtle fine-tuning.',
    advice: 'Be patient, cultivate relationships and partnerships. Do not make big decisions alone — seek allies and listen to your intuition.',
    keywords: ['patience', 'cooperation', 'intuition', 'diplomacy', 'details'],
  },
  3: {
    title: 'Year of Creativity and Communication',
    theme: 'Self-expression, joy, creativity',
    description: 'Year 3 brings lightness, creativity and the need to communicate. The energy supports artistic expression, social life and optimism. It is time to be visible, create and share your joy with those around you.',
    advice: 'Create, communicate, have fun. Engage in social life. Express yourself — through writing, art, speaking. Do not keep things to yourself.',
    keywords: ['creativity', 'communication', 'joy', 'self-expression', 'sociability'],
  },
  4: {
    title: 'Year of Building and Discipline',
    theme: 'Work, order, foundations, structure',
    description: 'Year 4 demands discipline and systematic effort. It is time to lay solid foundations for the future — in health, finances, career and relationships. The energy is not exciting, but it is stabilizing and essential.',
    advice: 'Work on your foundations. Organize finances, health, home. Be disciplined and persistent — this year builds the pillars for future success.',
    keywords: ['discipline', 'work', 'order', 'foundations', 'stability'],
  },
  5: {
    title: 'Year of Change and Freedom',
    theme: 'Change, travel, new experiences',
    description: 'Year 5 brings dynamism, change and unexpected opportunities. The energy supports travel, new contacts, adventure and adaptability. Unexpected turns may come — welcome them.',
    advice: 'Be flexible and open to change. Travel, try new things, meet new people. Do not resist changes — they are opportunities.',
    keywords: ['change', 'freedom', 'travel', 'adventure', 'adaptability'],
  },
  6: {
    title: 'Year of Love and Responsibility',
    theme: 'Family, relationships, harmony, service',
    description: 'Year 6 is about love, home, family and responsibility. The energy supports creating harmony in relationships, caring for loved ones and aesthetics. It may bring commitments — marriage, a child, a new home.',
    advice: 'Dedicate yourself to relationships and family. Create beauty and harmony around you. Accept responsibility with love — not as a burden.',
    keywords: ['love', 'family', 'harmony', 'responsibility', 'beauty'],
  },
  7: {
    title: 'Year of Inner Growth',
    theme: 'Introspection, spirituality, study',
    description: 'Year 7 is about the inner world — meditation, study, spiritual growth and solitude. The energy supports deep thinking, analysis and the search for truth. It is not a year of outer activity, but of inner transformation.',
    advice: 'Dedicate time to yourself, study and spiritual practice. Be in silence, meditate, analyze. Trust the process of inner growth — you do not need to be outwardly active all the time.',
    keywords: ['introspection', 'spirituality', 'study', 'wisdom', 'silence'],
  },
  8: {
    title: 'Year of Manifestation and Abundance',
    theme: 'Power, success, material realm, authority',
    description: 'Year 8 brings the energy of manifestation, financial success and personal power. It is time to harvest what you have sown in previous years. The energy supports entrepreneurship, career advancement and material improvement.',
    advice: 'Act with authority and confidence. Invest, start a business, ask for a raise. This year rewards those who worked on themselves in previous years.',
    keywords: ['success', 'abundance', 'power', 'career', 'manifestation'],
  },
  9: {
    title: 'Year of Completion and Release',
    theme: 'Completion, forgiveness, preparing for the new',
    description: 'Year 9 closes the entire nine-year cycle. It is time to finish unfinished business, forgive, release the old and prepare for a new beginning. The energy supports philanthropy, compassion and closure.',
    advice: 'Complete what you started. Forgive and release what no longer serves you. Do not start major new projects — leave space for the cycle to close.',
    keywords: ['completion', 'forgiveness', 'wisdom', 'compassion', 'transformation'],
  },
};

const orvDictionaries = { sk: orvSk, en: orvEn };

export function getOrvDescription(key: number, lang: Language = 'sk'): OrvDescription {
  return orvDictionaries[lang]?.[key] ?? orvDictionaries.sk[key];
}

// Backward compatibility
export const orvDescriptions = orvSk;

// === Love Language Descriptions ===

export interface LoveLanguageDescription {
  description: string;
  examples: string;
  howToShow: string;
}

const loveLanguageSk: Record<string, LoveLanguageDescription> = {
  'Slová uistenia': {
    description: 'Človek s týmto jazykom lásky potrebuje počuť slová uznania, podpory a lásky. Komplimenty, povzbudenia a verbálne vyjadrenia citov sú pre neho kľúčové.',
    examples: 'Pochvala, "mám ťa rád/a", uznanie úsilia, povzbudivé správy, verejné ocenenie.',
    howToShow: 'Hovorte mu/jej, čo na ňom/nej obdivujete. Posielajte správy s ocenením. Nikdy nekritizujte verejne.',
  },
  'Kvalitný čas': {
    description: 'Tento jazyk lásky vyžaduje plnú prítomnosť a pozornosť. Dôležitý je spoločný čas bez rozptyľovania – konverzácia, spoločné aktivity, plná prítomnosť.',
    examples: 'Večera bez telefónov, spoločná prechádzka, rozhovor z očí do očí, spoločný hobby.',
    howToShow: 'Buďte plne prítomní. Venujte čas bez rozptýlenia. Plánujte spoločné aktivity. Dajte najavo, že čas s nimi je priorita.',
  },
  'Obdarovávanie': {
    description: 'Dary sú symbolom toho, že na danom človeku záleží. Nie je to o hodnote daru, ale o premyslenosti – o tom, že ste na neho mysleli.',
    examples: 'Malé premyslené darčeky, kvety "len tak", suvenír z cesty, niečo čo pripomína spoločný zážitok.',
    howToShow: 'Prinášajte malé pozornosti. Pamätajte si, čo sa mu/jej páči. Dar nemusí byť drahý – musí byť premyslený.',
  },
  'Skutky služby': {
    description: 'Pre tohto človeka sú najväčším prejavom lásky konkrétne činy – pomoc, uľahčenie povinností, praktická starostlivosť. Činy hovoria viac ako slová.',
    examples: 'Varenie, pomoc s domácnosťou, oprava niečoho, prevzatie povinností keď je partner unavený.',
    howToShow: 'Pomáhajte bez prosby. Prevezmite niekedy povinnosti. Robte veci, ktoré mu/jej uľahčia život.',
  },
  'Fyzický dotyk': {
    description: 'Tento jazyk lásky komunikuje cez telesný kontakt – objatia, držanie sa za ruky, masáž, blízkosť. Fyzická prítomnosť a dotyk sú kľúčové pre pocit bezpečia a lásky.',
    examples: 'Objatie pri príchode, masáž, držanie za ruku, bozk na čelo, sedenie blízko seba.',
    howToShow: 'Dotýkajte sa pri prechádzaní okolo. Objímajte. Buďte fyzicky blízko. Ponúknite masáž po ťažkom dni.',
  },
};

const loveLanguageEn: Record<string, LoveLanguageDescription> = {
  'Slová uistenia': {
    description: 'A person with this love language needs to hear words of recognition, support and love. Compliments, encouragement and verbal expressions of affection are essential for them.',
    examples: 'Praise, "I love you", acknowledging effort, encouraging messages, public appreciation.',
    howToShow: 'Tell them what you admire about them. Send messages of appreciation. Never criticize them publicly.',
  },
  'Kvalitný čas': {
    description: 'This love language requires full presence and attention. What matters is shared time without distractions — conversation, joint activities, undivided attention.',
    examples: 'Dinner without phones, a walk together, face-to-face conversation, a shared hobby.',
    howToShow: 'Be fully present. Give time without distractions. Plan activities together. Show that time with them is a priority.',
  },
  'Obdarovávanie': {
    description: 'Gifts are a symbol that someone cares. It is not about the value of the gift, but about the thoughtfulness — that you were thinking of them.',
    examples: 'Small thoughtful gifts, flowers "just because", a souvenir from a trip, something that recalls a shared experience.',
    howToShow: 'Bring small tokens of attention. Remember what they like. A gift does not need to be expensive — it needs to be thoughtful.',
  },
  'Skutky služby': {
    description: 'For this person, the greatest expression of love comes through concrete actions — help, easing responsibilities, practical care. Actions speak louder than words.',
    examples: 'Cooking, helping with housework, fixing something, taking over duties when a partner is tired.',
    howToShow: 'Help without being asked. Take over responsibilities sometimes. Do things that make their life easier.',
  },
  'Fyzický dotyk': {
    description: 'This love language communicates through physical contact — hugs, holding hands, massage, closeness. Physical presence and touch are key to feeling safe and loved.',
    examples: 'A hug on arrival, massage, holding hands, a kiss on the forehead, sitting close together.',
    howToShow: 'Touch them as you walk by. Hug often. Be physically close. Offer a massage after a tough day.',
  },
};

const loveLanguageNames: Record<string, Record<string, string>> = {
  sk: {
    'Slová uistenia': 'Slová uistenia',
    'Kvalitný čas': 'Kvalitný čas',
    'Obdarovávanie': 'Obdarovávanie',
    'Skutky služby': 'Skutky služby',
    'Fyzický dotyk': 'Fyzický dotyk',
  },
  en: {
    'Slová uistenia': 'Words of Affirmation',
    'Kvalitný čas': 'Quality Time',
    'Obdarovávanie': 'Receiving Gifts',
    'Skutky služby': 'Acts of Service',
    'Fyzický dotyk': 'Physical Touch',
  },
};

const loveLanguageDictionaries = { sk: loveLanguageSk, en: loveLanguageEn };

export function getLoveLanguageDescription(skKey: string, lang: Language = 'sk'): LoveLanguageDescription {
  return loveLanguageDictionaries[lang]?.[skKey] ?? loveLanguageDictionaries.sk[skKey];
}

export function getLoveLanguageName(skKey: string, lang: Language = 'sk'): string {
  return loveLanguageNames[lang]?.[skKey] ?? loveLanguageNames.sk[skKey] ?? skKey;
}

// Backward compatibility
export const loveLanguageDescriptions = loveLanguageSk;

// === Love Language Scoring Explanation ===

const loveLanguageScoringExplanationSk = `Skóre jazykov lásky sa vypočítava z numerologickej mriežky. Každý jazyk lásky zodpovedá určitým číselným rovným v mriežke. Čím viac čísel v danej rovine máte, tým silnejšie je vaše prirodzené vyjadrenie tohto jazyka. Záporné skóre neznamená neschopnosť – len to, že tento jazyk nie je váš primárny a vyžaduje vedomé úsilie.`;

const loveLanguageScoringExplanationEn = `Love language scores are calculated from the numerological grid. Each love language corresponds to specific number planes in the grid. The more numbers you have in a given plane, the stronger your natural expression of that language. A negative score does not mean inability — only that this language is not your primary one and requires conscious effort.`;

const scoringExplanationDictionaries = { sk: loveLanguageScoringExplanationSk, en: loveLanguageScoringExplanationEn };

export function getLoveLanguageScoringExplanation(lang: Language = 'sk'): string {
  return scoringExplanationDictionaries[lang] ?? scoringExplanationDictionaries.sk;
}

// Backward compatibility
export const loveLanguageScoringExplanation = loveLanguageScoringExplanationSk;

// === Cosmic Age Descriptions ===

export interface CosmicAgeDescription {
  title: string;
  description: string;
  traits: string;
  relationship: string;
}

const cosmicAgeSk: Record<string, CosmicAgeDescription> = {
  aquarius: {
    title: 'Vek Vodnára',
    description: 'Osoba narodená vo Veku Vodnára (ΣT ≥ 2000) prináša na svet novú energiu. Prirodzene myslí inovatívne, je otvorená technológiám, komunite a kolektívnemu vedomiu. Menej sa viaže na tradície a autority – hľadá vlastnú pravdu.',
    traits: 'Nezávislosť v myslení, orientácia na budúcnosť, humanitárne hodnoty, technologická gramotnosť, odpor voči hierarchiám, potreba autenticity a slobody.',
    relationship: 'Vo vzťahoch hľadá rovnocennosť a mentálne prepojenie. Partner musí byť najprv priateľ. Tradičné roly im nesedia – preferujú partnerstvo založené na vzájomnom rešpekte a slobode.',
  },
  pisces: {
    title: 'Vek Rýb',
    description: 'Osoba narodená vo Veku Rýb (ΣT < 2000) nesie energiu staršieho kozmického cyklu. Je hlbšie prepojená s tradíciami, duchovno, emóciami a kolektívnym nevedomím. Cíti silnejšie prepojenie s minulosťou a koreňmi.',
    traits: 'Emočná hĺbka, silná intuícia, prepojenie s duchovno a tradíciami, empatia, obetavosť, schopnosť cítiť "neviditeľné", tendencia k idealizmu.',
    relationship: 'Vo vzťahoch hľadá hlboké emocionálne prepojenie a duchovnú blízkosť. Má tendenciu obetovať sa pre partnera. Potrebuje partnera, ktorý ocení ich citlivosť a nebude ju zneužívať.',
  },
};

const cosmicAgeEn: Record<string, CosmicAgeDescription> = {
  aquarius: {
    title: 'Age of Aquarius',
    description: 'A person born in the Age of Aquarius (ΣT ≥ 2000) brings new energy into the world. They naturally think innovatively, are open to technology, community and collective consciousness. They are less bound by traditions and authorities — seeking their own truth.',
    traits: 'Independent thinking, future orientation, humanitarian values, technological literacy, resistance to hierarchies, need for authenticity and freedom.',
    relationship: 'In relationships they seek equality and mental connection. A partner must first be a friend. Traditional roles do not suit them — they prefer partnership based on mutual respect and freedom.',
  },
  pisces: {
    title: 'Age of Pisces',
    description: 'A person born in the Age of Pisces (ΣT < 2000) carries the energy of an older cosmic cycle. They are more deeply connected to traditions, spirituality, emotions and the collective unconscious. They feel a stronger link to the past and roots.',
    traits: 'Emotional depth, strong intuition, connection to spirituality and traditions, empathy, self-sacrifice, ability to sense the "invisible", tendency toward idealism.',
    relationship: 'In relationships they seek deep emotional connection and spiritual closeness. They tend to sacrifice themselves for a partner. They need a partner who appreciates their sensitivity and will not exploit it.',
  },
};

const cosmicAgeDictionaries = { sk: cosmicAgeSk, en: cosmicAgeEn };

export function getCosmicAgeDescription(skKey: string, lang: Language = 'sk'): CosmicAgeDescription {
  return cosmicAgeDictionaries[lang]?.[skKey] ?? cosmicAgeDictionaries.sk[skKey];
}

// Backward compatibility
export const cosmicAgeDescriptions = cosmicAgeSk;
