// Popis osobnej ročnej vibrácie (ORV) 1-9 - čo znamená daná energia pre rok
export const orvDescriptions: Record<number, { title: string; theme: string; description: string; advice: string; keywords: string[] }> = {
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

// Popis jazykov lásky - čo každý jazyk znamená a ako sa prejavuje
export const loveLanguageDescriptions: Record<string, { description: string; examples: string; howToShow: string }> = {
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

// Popis skórovania jazykov lásky
export const loveLanguageScoringExplanation = `Skóre jazykov lásky sa vypočítava z numerologickej mriežky. Každý jazyk lásky zodpovedá určitým číselným rovným v mriežke. Čím viac čísel v danej rovine máte, tým silnejšie je vaše prirodzené vyjadrenie tohto jazyka. Záporné skóre neznamená neschopnosť – len to, že tento jazyk nie je váš primárny a vyžaduje vedomé úsilie.`;

// Popis Vek Vodnára vs Vek Rýb
export const cosmicAgeDescriptions: Record<string, { title: string; description: string; traits: string; relationship: string }> = {
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
