import type { Language } from '../store/useStore';

export interface ChineseAnimalInfo {
  animal: string;
  traits: string;
  strengths: string;
  challenges: string;
  compatibility: string;
  advice: string;
}

export interface ChineseElementInfo {
  element: string;
  description: string;
  personality: string;
}

export const CHINESE_ANIMALS: Record<string, ChineseAnimalInfo> = {
  'Potkan': {
    animal: 'Potkan',
    traits: 'Bystrý, šarmantný, ambiciózny a vynaliezavý. Prvé zviera cyklu — symbolizuje nové začiatky a prispôsobivosť.',
    strengths: 'Rýchle myslenie, sociálna inteligencia, schopnosť nájsť riešenie v každej situácii. Dobrý pozorovateľ.',
    challenges: 'Tendencia k manipulácii, nervozita, netrpezlivosť. Občas príliš kalkuluje.',
    compatibility: 'Najlepšia harmónia s Drakom a Opicou. Vyhýbať sa Koňovi.',
    advice: 'Využi svoju inteligenciu na službu iným, nie len sebe. Dôveruj — nie každý je konkurencia.',
  },
  'Byvol': {
    animal: 'Byvol',
    traits: 'Pracovitý, spoľahlivý, trpezlivý a odhodlaný. Symbol vytrvalosti a sily.',
    strengths: 'Neuveriteľná vytrvalosť, zodpovednosť, metodickosť. Keď sa rozhodne, dotlačí veci do konca.',
    challenges: 'Tvrdohlavosť, odpor k zmenám, občasná emočná uzavretosť. Ťažko odpúšťa.',
    compatibility: 'Najlepšia harmónia s Hadom a Kohútom. Vyhýbať sa Koze.',
    advice: 'Nauč sa flexibilite — nie každá zmena je hrozba. Otvor sa emóciám blízkych.',
  },
  'Tiger': {
    animal: 'Tiger',
    traits: 'Odvážny, vášnivý, sebavedomý a magnetický. Prirodzený vodca s veľkou charizmou.',
    strengths: 'Odvaha, veľkorysosť, schopnosť inšpirovať ostatných. Chráni slabších.',
    challenges: 'Impulzívnosť, netrpezlivosť, potreba dominovať. Môže byť arogantný.',
    compatibility: 'Najlepšia harmónia s Koňom a Psom. Vyhýbať sa Opici.',
    advice: 'Tvoja sila je v službe, nie v kontrole. Počúvaj predtým, než konáš.',
  },
  'Zajac': {
    animal: 'Zajac',
    traits: 'Elegantný, diplomatický, jemný a intuitívny. Symbol mieru a harmónie.',
    strengths: 'Diplomacia, estetické cítenie, schopnosť vytvárať harmonické prostredie. Dobrý poslucháč.',
    challenges: 'Vyhýbanie sa konfliktom, nerozhodnosť, povrchnosť. Niekedy príliš opatrný.',
    compatibility: 'Najlepšia harmónia s Kozou a Prasaťom. Vyhýbať sa Kohútovi.',
    advice: 'Konflikty nie sú vždy zlé — niekedy treba povedať pravdu priamo. Buď odvážnejší.',
  },
  'Drak': {
    animal: 'Drak',
    traits: 'Silný, ambiciózny, charizmatický a šťastný. Jediné mýtické zviera — symbol výnimočnosti.',
    strengths: 'Energia, odvaha, veľkoleposť, prirodzená autorita. Priťahuje úspech.',
    challenges: 'Arogancia, netrpezlivosť, neschopnosť prijať kritiku. Očakáva obdiv.',
    compatibility: 'Najlepšia harmónia s Potkanom a Opicou. Vyhýbať sa Psovi.',
    advice: 'Veľkosť nie je o sebe — je o tom, koľkých zdvihneš so sebou. Pokora je sila, nie slabosť.',
  },
  'Had': {
    animal: 'Had',
    traits: 'Múdry, intuitívny, záhadný a sofistikovaný. Symbol hlbokého poznania a transformácie.',
    strengths: 'Hlboká intuícia, analytické myslenie, šarm, schopnosť vidieť pod povrch.',
    challenges: 'Žiarlivosť, podozrievavosť, tendencia k manipulácii. Ťažko dôveruje.',
    compatibility: 'Najlepšia harmónia s Byvolom a Kohútom. Vyhýbať sa Prasaťu.',
    advice: 'Dôvera nie je slabosť. Pusti kontrolu — nie všetko musíš vedieť dopredu.',
  },
  'Kôň': {
    animal: 'Kôň',
    traits: 'Energický, nezávislý, nadšený a spoločenský. Symbol slobody a dynamiky.',
    strengths: 'Energia, optimizmus, komunikačné schopnosti, pracovitosť. Inšpiruje okolie.',
    challenges: 'Netrpezlivosť, nestálosť, egocentrizmus. Ťažko znáša rutinu a obmedzenia.',
    compatibility: 'Najlepšia harmónia s Tigrom a Psom. Vyhýbať sa Potkanovi.',
    advice: 'Sloboda nie je útek od záväzkov — je to voľba byť niekde celým srdcom. Spomaľ.',
  },
  'Koza': {
    animal: 'Koza',
    traits: 'Kreatívna, jemná, súcitná a umelecky založená. Symbol krásy a harmónie.',
    strengths: 'Kreativita, empatia, estetické cítenie, schopnosť liečiť prítomnosťou.',
    challenges: 'Nerozhodnosť, závislosť na iných, pesimizmus. Potrebuje bezpečie.',
    compatibility: 'Najlepšia harmónia s Zajacom a Prasaťom. Vyhýbať sa Byvolovi.',
    advice: 'Tvoja citlivosť je dar, nie slabosť. Ale nauč sa stáť aj sama — bez opory iných.',
  },
  'Opica': {
    animal: 'Opica',
    traits: 'Inteligentná, vtipná, vynaliezavá a všestranná. Symbol šikovnosti a adaptability.',
    strengths: 'Rýchle myslenie, humor, schopnosť riešiť problémy nekonvenčne. Večne mladá energia.',
    challenges: 'Povrchnosť, nestálosť, sklon k podvádzaniu. Ťažko sa zaväzuje.',
    compatibility: 'Najlepšia harmónia s Potkanom a Drakom. Vyhýbať sa Tigrovi.',
    advice: 'Hĺbka nie je nuda. Vydrž pri jednej veci dlhšie — tam sa skrýva skutočné majstrovstvo.',
  },
  'Kohút': {
    animal: 'Kohút',
    traits: 'Presný, pracovitý, odvážny a priamy. Symbol poctivosti a poriadku.',
    strengths: 'Organizačné schopnosti, poctivosť, odvaha hovoriť pravdu, pracovitosť.',
    challenges: 'Kritickosť, perfekcionizmus, potreba pozornosti. Niekedy príliš priamy.',
    compatibility: 'Najlepšia harmónia s Byvolom a Hadom. Vyhýbať sa Zajacovi.',
    advice: 'Nie každý potrebuje tvoju radu. Občas stačí počúvať — aj to je služba.',
  },
  'Pes': {
    animal: 'Pes',
    traits: 'Verný, čestný, starostlivý a ochranársky. Symbol loajality a spravodlivosti.',
    strengths: 'Lojalita, čestnosť, ochota pomáhať, zmysel pre spravodlivosť.',
    challenges: 'Úzkostlivosť, pesimizmus, tvrdohlavosť. Ťažko odpúšťa zradu.',
    compatibility: 'Najlepšia harmónia s Tigrom a Koňom. Vyhýbať sa Drakovi.',
    advice: 'Svet nie je len čiernobiely. Nie každý, kto ťa sklame, je nepriateľ — aj dobrí ľudia robia chyby.',
  },
  'Prasa': {
    animal: 'Prasa',
    traits: 'Veľkorysé, úprimné, tolerantné a pôžitkárske. Symbol hojnosti a dobrosrdečnosti.',
    strengths: 'Veľkorysosť, zmysel pre rodinu, optimizmus, schopnosť užívať si život.',
    challenges: 'Naivita, lenivosť, prehnaná dôverčivosť. Niekedy sa nechá zneužiť.',
    compatibility: 'Najlepšia harmónia so Zajacom a Kozou. Vyhýbať sa Hadovi.',
    advice: 'Tvoja dobrota je sila — ale nauč sa rozlíšiť, kto si ju zaslúži a kto ju zneužíva.',
  },
};

const CHINESE_ANIMALS_EN: Record<string, ChineseAnimalInfo> = {
  'Potkan': {
    animal: 'Rat',
    traits: 'Clever, charming, ambitious, and resourceful. The first animal of the cycle — symbolizes new beginnings and adaptability.',
    strengths: 'Quick thinking, social intelligence, ability to find a solution in any situation. A keen observer.',
    challenges: 'Tendency to manipulate, nervousness, impatience. Sometimes over-calculating.',
    compatibility: 'Best harmony with Dragon and Monkey. Avoid Horse.',
    advice: 'Use your intelligence to serve others, not just yourself. Trust — not everyone is competition.',
  },
  'Byvol': {
    animal: 'Ox',
    traits: 'Hardworking, reliable, patient, and determined. A symbol of perseverance and strength.',
    strengths: 'Incredible persistence, responsibility, methodical approach. Once decided, pushes things through to the end.',
    challenges: 'Stubbornness, resistance to change, occasional emotional withdrawal. Difficulty forgiving.',
    compatibility: 'Best harmony with Snake and Rooster. Avoid Goat.',
    advice: 'Learn flexibility — not every change is a threat. Open yourself to the emotions of those close to you.',
  },
  'Tiger': {
    animal: 'Tiger',
    traits: 'Brave, passionate, confident, and magnetic. A natural leader with great charisma.',
    strengths: 'Courage, generosity, ability to inspire others. Protects the vulnerable.',
    challenges: 'Impulsiveness, impatience, need to dominate. Can be arrogant.',
    compatibility: 'Best harmony with Horse and Dog. Avoid Monkey.',
    advice: 'Your strength is in service, not in control. Listen before you act.',
  },
  'Zajac': {
    animal: 'Rabbit',
    traits: 'Elegant, diplomatic, gentle, and intuitive. A symbol of peace and harmony.',
    strengths: 'Diplomacy, aesthetic sense, ability to create harmonious environments. A good listener.',
    challenges: 'Conflict avoidance, indecisiveness, superficiality. Sometimes overly cautious.',
    compatibility: 'Best harmony with Goat and Pig. Avoid Rooster.',
    advice: 'Conflicts are not always bad — sometimes you need to speak the truth directly. Be braver.',
  },
  'Drak': {
    animal: 'Dragon',
    traits: 'Powerful, ambitious, charismatic, and lucky. The only mythical animal — a symbol of uniqueness.',
    strengths: 'Energy, courage, magnificence, natural authority. Attracts success.',
    challenges: 'Arrogance, impatience, inability to accept criticism. Expects admiration.',
    compatibility: 'Best harmony with Rat and Monkey. Avoid Dog.',
    advice: 'Greatness is not about yourself — it is about how many you lift with you. Humility is strength, not weakness.',
  },
  'Had': {
    animal: 'Snake',
    traits: 'Wise, intuitive, mysterious, and sophisticated. A symbol of deep knowledge and transformation.',
    strengths: 'Deep intuition, analytical thinking, charm, ability to see beneath the surface.',
    challenges: 'Jealousy, suspicion, tendency to manipulate. Difficulty trusting.',
    compatibility: 'Best harmony with Ox and Rooster. Avoid Pig.',
    advice: 'Trust is not weakness. Let go of control — you do not need to know everything in advance.',
  },
  'Kôň': {
    animal: 'Horse',
    traits: 'Energetic, independent, enthusiastic, and sociable. A symbol of freedom and dynamism.',
    strengths: 'Energy, optimism, communication skills, diligence. Inspires those around.',
    challenges: 'Impatience, inconsistency, egocentrism. Difficulty tolerating routine and limitations.',
    compatibility: 'Best harmony with Tiger and Dog. Avoid Rat.',
    advice: 'Freedom is not escape from commitments — it is choosing to be somewhere wholeheartedly. Slow down.',
  },
  'Koza': {
    animal: 'Goat',
    traits: 'Creative, gentle, compassionate, and artistically inclined. A symbol of beauty and harmony.',
    strengths: 'Creativity, empathy, aesthetic sense, ability to heal through presence.',
    challenges: 'Indecisiveness, dependence on others, pessimism. Needs security.',
    compatibility: 'Best harmony with Rabbit and Pig. Avoid Ox.',
    advice: 'Your sensitivity is a gift, not a weakness. But learn to stand on your own — without relying on others.',
  },
  'Opica': {
    animal: 'Monkey',
    traits: 'Intelligent, witty, inventive, and versatile. A symbol of cleverness and adaptability.',
    strengths: 'Quick thinking, humor, ability to solve problems unconventionally. Eternally youthful energy.',
    challenges: 'Superficiality, inconsistency, tendency to cheat. Difficulty committing.',
    compatibility: 'Best harmony with Rat and Dragon. Avoid Tiger.',
    advice: 'Depth is not boring. Stay with one thing longer — that is where true mastery lies.',
  },
  'Kohút': {
    animal: 'Rooster',
    traits: 'Precise, hardworking, brave, and direct. A symbol of honesty and order.',
    strengths: 'Organizational skills, honesty, courage to speak the truth, diligence.',
    challenges: 'Being overly critical, perfectionism, need for attention. Sometimes too direct.',
    compatibility: 'Best harmony with Ox and Snake. Avoid Rabbit.',
    advice: 'Not everyone needs your advice. Sometimes just listening is enough — that too is service.',
  },
  'Pes': {
    animal: 'Dog',
    traits: 'Loyal, honest, caring, and protective. A symbol of loyalty and justice.',
    strengths: 'Loyalty, honesty, willingness to help, sense of justice.',
    challenges: 'Anxiety, pessimism, stubbornness. Difficulty forgiving betrayal.',
    compatibility: 'Best harmony with Tiger and Horse. Avoid Dragon.',
    advice: 'The world is not just black and white. Not everyone who disappoints you is an enemy — good people also make mistakes.',
  },
  'Prasa': {
    animal: 'Pig',
    traits: 'Generous, sincere, tolerant, and pleasure-loving. A symbol of abundance and kindness.',
    strengths: 'Generosity, sense of family, optimism, ability to enjoy life.',
    challenges: 'Naivety, laziness, excessive trust. Sometimes allows themselves to be exploited.',
    compatibility: 'Best harmony with Rabbit and Goat. Avoid Snake.',
    advice: 'Your kindness is strength — but learn to distinguish who deserves it and who exploits it.',
  },
};

export const CHINESE_ELEMENTS: Record<string, ChineseElementInfo> = {
  'Kov': {
    element: 'Kov',
    description: 'Kov je energia štruktúry, disciplíny a spravodlivosti.',
    personality: 'Rozhodný, silná vôľa, zmysel pre poriadok a pravidlá. Razantný a jasný v komunikácii.',
  },
  'Voda': {
    element: 'Voda',
    description: 'Voda je energia múdrosti, intuície a adaptability.',
    personality: 'Hlboký, intuitívny, flexibilný a komunikatívny. Prúdi okolo prekážok namiesto boja.',
  },
  'Drevo': {
    element: 'Drevo',
    description: 'Drevo je energia rastu, kreativity a expanzie.',
    personality: 'Veľkorysý, idealistický, súcitný a smerujúci nahor. Hľadá rast a rozvoj.',
  },
  'Oheň': {
    element: 'Oheň',
    description: 'Oheň je energia vášne, radosti a dynamiky.',
    personality: 'Vášnivý, charizmatický, optimistický a energický. Priťahuje ostatných svojím svetlom.',
  },
  'Zem': {
    element: 'Zem',
    description: 'Zem je energia stability, starostlivosti a praktickosti.',
    personality: 'Spoľahlivý, trpezlivý, starostlivý a praktický. Vytvára bezpečný základ pre seba aj iných.',
  },
};

const CHINESE_ELEMENTS_EN: Record<string, ChineseElementInfo> = {
  'Kov': {
    element: 'Metal',
    description: 'Metal is the energy of structure, discipline, and justice.',
    personality: 'Decisive, strong-willed, sense of order and rules. Assertive and clear in communication.',
  },
  'Voda': {
    element: 'Water',
    description: 'Water is the energy of wisdom, intuition, and adaptability.',
    personality: 'Deep, intuitive, flexible, and communicative. Flows around obstacles instead of fighting them.',
  },
  'Drevo': {
    element: 'Wood',
    description: 'Wood is the energy of growth, creativity, and expansion.',
    personality: 'Generous, idealistic, compassionate, and reaching upward. Seeks growth and development.',
  },
  'Oheň': {
    element: 'Fire',
    description: 'Fire is the energy of passion, joy, and dynamism.',
    personality: 'Passionate, charismatic, optimistic, and energetic. Attracts others with its light.',
  },
  'Zem': {
    element: 'Earth',
    description: 'Earth is the energy of stability, care, and practicality.',
    personality: 'Reliable, patient, caring, and practical. Creates a safe foundation for self and others.',
  },
};

export function getChineseAnimalInfo(skKey: string, lang: Language = 'sk'): ChineseAnimalInfo {
  if (lang === 'en') {
    return CHINESE_ANIMALS_EN[skKey] || CHINESE_ANIMALS[skKey];
  }
  return CHINESE_ANIMALS[skKey];
}

export function getChineseElementInfo(skKey: string, lang: Language = 'sk'): ChineseElementInfo {
  if (lang === 'en') {
    return CHINESE_ELEMENTS_EN[skKey] || CHINESE_ELEMENTS[skKey];
  }
  return CHINESE_ELEMENTS[skKey];
}
