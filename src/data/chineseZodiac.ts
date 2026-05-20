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
