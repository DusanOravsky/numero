// Kompletná veľká arkána (Major Arcana 0–XXI).
// Každá karta má hlavnú radu (advice) + pole alternatívnych rád (advices).
// getDailyTarot rotuje cez advices podľa dňa v roku.

export interface TarotCard {
  number: number;
  name: string;
  arcana: 'major';
  symbol: string;
  meaning: string;
  shadow: string;
  advice: string;
  advices: string[];
}

export const TAROT_CARDS: TarotCard[] = [
  {
    number: 0,
    name: 'Blázon',
    arcana: 'major',
    symbol: '🃏',
    meaning: 'Nový začiatok, spontánnosť, nevinnosť. Skok do neznáma s dôverou.',
    shadow: 'Nezodpovednosť, naivita, neuváženosť.',
    advice: 'Skoč. Nemusíš mať plán — dôveruj procesu a začni.',
    advices: [
      'Skoč. Nemusíš mať plán — dôveruj procesu a začni.',
      'Urob dnes niečo, čo si nikdy predtým neskúsil.',
      'Zbav sa jedného „musím" a nahraď ho „chcem".',
      'Dovoľ si byť začiatočníkom. Neskúsenosť je tvoja výhoda.',
      'Opusti starú cestu — nová sa otvorí až keď pustíš tú známu.',
      'Dnes neplánuj. Reaguj na to, čo ti život prinesie.',
      'Bláznivý nápad, ktorý ti dnes napadne, stojí za vyskúšanie.',
      'Ľahkosť nie je nezrelosť. Hraj sa s plnou vážnosťou.',
      'Zbytočný batoh ťa spomaľuje. Nechaj ho tu a choď ďalej.',
      'Hovor „áno" prvej príležitosti, ktorá dnes zaklopá.',
      'Strach z pádu ťa drží na mieste. Jeden krok — a už letíš.',
      'Daj prednosť zvedavosti pred bezpečím.',
    ],
  },
  {
    number: 1,
    name: 'Mág',
    arcana: 'major',
    symbol: '🪄',
    meaning: 'Začiatok, vôľa, manifestácia. Máš všetky nástroje — len ich použi.',
    shadow: 'Manipulácia, klam sám seba, prehnaná sebadôvera.',
    advice: 'Dnes máš všetky nástroje — použi ich vedome.',
    advices: [
      'Dnes máš všetky nástroje — použi ich vedome.',
      'Iniciuj. Nečakaj. Tvoj zámer je dnes silnejší ako prekážky.',
      'Skoncentruj energiu do jedného zámeru — rozptyľovanie ťa oslabuje.',
      'Slovo má dnes váhu. Povedz nahlas, čo chceš vytvoriť.',
      'Prepoj myslenie s konaním. Teória bez praxe je dnes strata.',
      'Si kanál, nie zdroj. Nechaj cez seba prúdiť väčšiu silu.',
      'Použi to, čo máš po ruke — nemusíš čakať na dokonalé podmienky.',
      'Tvoja vôľa je dnes jasná. Ladi podľa nej všetky rozhodnutia.',
      'Komunikuj priamo. Jasné slová sú dnes tvoja mágia.',
      'Začni projekt, na ktorý si čakal. Dnes je ten správny deň.',
      'Zamysli sa, aký výsledok chceš vidieť o mesiac — a konaj podľa toho teraz.',
      'Spoj štyri elementy: myšlienku, emóciu, slovo a čin. Vtedy sa veci dejú.',
    ],
  },
  {
    number: 2,
    name: 'Veľkňažka',
    arcana: 'major',
    symbol: '🌙',
    meaning: 'Intuícia, vnútorná múdrosť, podvedomie. Tichá pravda hovorí cez tvoju citlivosť.',
    shadow: 'Tajnostkárstvo, izolácia, ignorovanie reality.',
    advice: 'Počúvaj svoju intuíciu. Dnes nie je deň pre racionálne výpočty.',
    advices: [
      'Počúvaj svoju intuíciu. Dnes nie je deň pre racionálne výpočty.',
      'Odpoveď už poznáš — len si ju nechceš priznať.',
      'Sny z poslednej noci nesú správu. Vráť sa k nim.',
      'Netlač na riešenie. Nechaj podvedomie pracovať.',
      'Ticho je dnes tvojím spojencom. Vyhľadaj ho zámerne.',
      'Dôveruj prvému pocitu — ešte pred tým, než ho rozum preanalyzuje.',
      'Sleduj, čo ťa pritahuje bez logického dôvodu. Je v tom vodítko.',
      'Dnes viac vnímaj, menej hovor. Informácie prichádzajú cez atmosféru.',
      'Zapíš si ráno tri slová, ktoré ti napadnú — večer pochopíš prečo.',
      'Tajomstvo, ktoré držíš, ťa chráni. Nezdieľaj ho predčasne.',
      'Čítaj medzi riadkami. Dôležitejšie je to, čo nebolo povedané.',
      'Mesačný cyklus ovplyvňuje tvoju vnímavosť — dnes si toho všimni.',
    ],
  },
  {
    number: 3,
    name: 'Cisárovná',
    arcana: 'major',
    symbol: '👑',
    meaning: 'Plodnosť, kreativita, hojnosť. Tvor a zberaj plody.',
    shadow: 'Posadnutosť materiálnym, nadmerné rozmaznávanie.',
    advice: 'Tvor s láskou. Nech sa tvoja kreativita prelieva do toho, čo dnes robíš.',
    advices: [
      'Tvor s láskou. Nech sa tvoja kreativita prelieva do toho, čo dnes robíš.',
      'Dopraj si zmyslový pôžitok — dobré jedlo, prírodu, krásu.',
      'Staraj sa o niečo živé — rastlinu, vzťah, projekt. Pestuj to.',
      'Hojnosť začína vďačnosťou. Menovite ocen tri veci, čo máš.',
      'Tvoje telo ti dnes hovorí, čo potrebuje. Vypočuj ho.',
      'Kreatívny blok prelomíš tým, že začneš — hoci aj nedokonale.',
      'Dnes si dovoľ byť mäkký/á. Sila nemusí byť tvrdá.',
      'Niečo v tvojom živote dozrieva. Buď trpezlivý/á — úroda príde.',
      'Daj prednosť kráse pred efektivitou. Aspoň v jednej veci.',
      'Objatie, dotyk, blízkosť — to je jazyk, ktorým dnes hovoríš najlepšie.',
      'Čo by si dnes vytvoril/a, keby si sa nebál/a hodnotenia?',
      'Príroda ti pripomenie tvoj rytmus. Vyjdi von aspoň na 15 minút.',
    ],
  },
  {
    number: 4,
    name: 'Cisár',
    arcana: 'major',
    symbol: '🏛️',
    meaning: 'Štruktúra, autorita, stabilita. Postav základy.',
    shadow: 'Tyrania, rigidita, nepriateľstvo voči zmenám.',
    advice: 'Buď organizovaný/á a disciplinovaný/á. Štruktúra ti dnes prinesie pokoj.',
    advices: [
      'Buď organizovaný/á a disciplinovaný/á. Štruktúra ti dnes prinesie pokoj.',
      'Nastav jednu jasnú hranicu — a dodržuj ju celý deň.',
      'Rozhodnutie, ktoré odkladáš, ťa stojí energiu. Rozhodni teraz.',
      'Postav sa do role lídra. Ľudia okolo teba dnes potrebujú smer.',
      'Plán na papieri je silnejší ako plán v hlave. Zapíš si ho.',
      'Dokončenie jednej rozrobenej veci má väčšiu hodnotu ako tri nové začiatky.',
      'Tvoja autorita rastie z integrity, nie z hlasitosti.',
      'Skontroluj fundament — financie, zdravie, bývanie. Kde je trhlina?',
      'Dnes buď otec/matka svojmu vnútornému dieťaťu. Ochraň ho pravidlami.',
      'Chaos okolo teba nemusí byť chaos v tebe. Drž svoju os.',
      'Praktická pomoc je dnes cennejšia ako empatické slová.',
      'Čo by tvoje budúce ja ocenilo, že si dnes urobil? Urob to.',
    ],
  },
  {
    number: 5,
    name: 'Hierofant',
    arcana: 'major',
    symbol: '⚖️',
    meaning: 'Tradícia, učenie, duchovná autorita, vyššie hodnoty.',
    shadow: 'Dogma, slepá poslušnosť, nestrávené presvedčenia.',
    advice: 'Hľadaj učiteľa alebo tradíciu, ktorá ti dnes ponúka múdrosť.',
    advices: [
      'Hľadaj učiteľa alebo tradíciu, ktorá ti dnes ponúka múdrosť.',
      'Otvor knihu, ktorú si dlho odkladal. Prvá veta je odpoveď.',
      'Zdieľaj to, čo vieš. Učenie iných upevňuje tvoje vlastné poznanie.',
      'Rituál — aj jednoduchý — dáva dňu posvätnosť. Vytvor si jeden.',
      'Zvyk z detstva, ktorý si zahodil, možno stojí za prehodnotenie.',
      'Kto je tvoj mentor? Ak žiadneho nemáš, dnes ho hľadaj.',
      'Pravidlá existujú z dôvodu. Predtým ako ich porušíš, pochop prečo sú.',
      'Duchovná prax nie je únik. Je to tréning pre realitu.',
      'Dnes sa pýtaj skôr než tvrdíš. Otázky sú dnes silnejšie.',
      'Preskúmaj jedno svoje presvedčenie — je naozaj tvoje, alebo zdedené?',
      'Etika nie je obmedzenie. Je to kompas v hmle.',
      'Spojenie s komunitou ťa dnes posilní viac ako samota.',
    ],
  },
  {
    number: 6,
    name: 'Zaľúbení',
    arcana: 'major',
    symbol: '💕',
    meaning: 'Voľba, partnerstvo, harmónia. Srdcové rozhodnutie.',
    shadow: 'Nerozhodnosť, kompromis zo strachu, povrchná láska.',
    advice: 'Rozhoduj zo srdca. Dnešná voľba má dlhodobý dopad.',
    advices: [
      'Rozhoduj zo srdca. Dnešná voľba má dlhodobý dopad.',
      'Povedz niekomu, čo pre teba znamená. Dnes. Slovami.',
      'Voľba medzi dvoma cestami? Vyber tú, pri ktorej cítiš rozšírenie v hrudi.',
      'Harmónia vo vzťahu neznamená bezkonfliktnosť — znamená úprimnosť.',
      'Čo by si vybral/a, keby sa nikto nedíval? To je tvoja pravdivá voľba.',
      'Dnes sa zameruj na kvalitu spojenia, nie na kvantitu kontaktov.',
      'Protiklad, ktorý ťa dráždí na druhom, je zrkadlo tvojej potlačenej časti.',
      'Láska nie je pocit — je to rozhodnutie, ktoré robíš znova každý deň.',
      'Ak stojíš na rázcestí, pýtaj sa: „Kde budem za 5 rokov šťastnejší?"',
      'Dnešný kompromis ťa nezabije — ale dlhodobý áno. Rozlíš ich.',
      'Intímne spojenie vyžaduje zraniteľnosť. Odvaha otvoriť sa je dnes tvoja sila.',
      'Pozri sa na vzťah, v ktorom si naposledy. Čo môžeš dať — nie žiadať?',
    ],
  },
  {
    number: 7,
    name: 'Voz',
    arcana: 'major',
    symbol: '🏆',
    meaning: 'Víťazstvo, odvaha, kontrola, smer. Drž opraty pevne.',
    shadow: 'Agresia, prehnaná ambícia, strata smeru.',
    advice: 'Daj jasný smer svojej energii. Vyhrávaš keď sú protiklady v rovnováhe.',
    advices: [
      'Daj jasný smer svojej energii. Vyhrávaš keď sú protiklady v rovnováhe.',
      'Drž smer aj keď je protivietor. Disciplína dnes rozhoduje.',
      'Nesťažuj sa na prekážky — objazdi ich. Cesta je vždy.',
      'Tvoja vôľa je dnes motor. Nasmeruj ju a nepúšťaj volant.',
      'Súťažíš len sám so sebou. Včerajšia verzia teba je tvoj jediný súper.',
      'Prestaň čakať na povolenie. Choď — aj bez súhlasu okolia.',
      'Rozporuplné túžby ťa trhajú? Nájdi ten jeden cieľ, čo ich zjednotí.',
      'Víťazstvo dnes vyzerá inak, ako si čakal. Buď otvorený forme.',
      'Rýchlosť bez smeru je chaos. Spomaľ na sekundu a nasmeruj sa.',
      'Povedz „nie" tomu, čo ťa odvádza od hlavného cieľa. Bez výčitiek.',
      'Sebadisciplína nie je trest — je to dar, ktorý si dávaš budúcemu sebe.',
      'Dnes sa posúvaš vpred. Aj malý krok je pohyb — a ten stačí.',
    ],
  },
  {
    number: 8,
    name: 'Sila',
    arcana: 'major',
    symbol: '🦁',
    meaning: 'Vnútorná sila, súcit, ovládanie inštinktov cez lásku, nie cez násilie.',
    shadow: 'Pochybnosti o sebe, potlačovanie inštinktov, slabosť.',
    advice: 'Buď nežne silný/á. Vnútorná stabilita prekoná vonkajšiu výzvu.',
    advices: [
      'Buď nežne silný/á. Vnútorná stabilita prekoná vonkajšiu výzvu.',
      'Strach, ktorý cítiš, nie je nepriateľ — je to pes, ktorý chce byť skrotený.',
      'Trpezlivosť je dnes tvoja superschopnosť. Výsledky prídu.',
      'Netlač silou tam, kde stačí jemný dotyk. Menej je dnes viac.',
      'Tvoja zraniteľnosť nie je slabosť — je to brána k autentickej sile.',
      'Hnev, ktorý cítiš, obsahuje správu. Počúvaj ju skôr, než zareaguješ.',
      'Si silnejší/á, než si myslíš. Dnes to dokážeš — sebe aj svetu.',
      'Skutočná odvaha je zostať otvorený tam, kde chceš zatvoriť.',
      'Ochočuj svoju temnú stránku — nie potlačovaním, ale porozumením.',
      'Vydrž ešte chvíľu. To, čo ťa teraz testuje, ťa pripravuje na väčšie.',
      'Reaguj s pokojom tam, kde by iní kričali. To je tvoja dnešná sila.',
      'Láskavosť k sebe nie je sebeckosť. Daj si dnes to, čo potrebuješ.',
    ],
  },
  {
    number: 9,
    name: 'Pustovník',
    arcana: 'major',
    symbol: '🕯️',
    meaning: 'Introspekcia, hľadanie pravdy v ústraní, vnútorné vedenie.',
    shadow: 'Izolácia, melanchólia, nedôvera v ľudí.',
    advice: 'Stiahni sa do ticha. Odpoveď príde, keď prestaneš hľadať.',
    advices: [
      'Stiahni sa do ticha. Odpoveď príde, keď prestaneš hľadať.',
      'Samota nie je osamelosť. Dnes je tvojím liečivým priestorom.',
      'Zníž hluk okolo seba — vypni notifikácie, hudbu, správy. Počúvaj.',
      'Múdrosť sa rodí v tichu medzi slovami. Hľadaj ju tam.',
      'Dnes nepotrebuješ nikoho radu. Ty sám/sama vieš najlepšie.',
      'Choď na prechádzku sám/sama. Bez slúchadiel. Len ty a tvoje myšlienky.',
      'Zapáľ sviečku a polož si jednu otázku. Odpoveď príde do večera.',
      'Svetlo tvojej lampy svieti aj pre iných — ale najprv musíš nájsť vlastnú cestu.',
      'Denník je dnes mocnejší nástroj ako konverzácia. Píš.',
      'Odstup od situácie ti dá perspektívu, ktorú zblízka nevidíš.',
      'To, čo sa ti javí ako stagnácia, je dozrievanie. Dôveruj tomu.',
      'Hĺbka je vzácnejšia ako šírka. Dnes choď hlboko do jednej veci.',
    ],
  },
  {
    number: 10,
    name: 'Koleso šťastia',
    arcana: 'major',
    symbol: '☸️',
    meaning: 'Cyklickosť, zmena, osud, šťastie aj nešťastie. Všetko sa točí.',
    shadow: 'Pasivita, viera v osud bez konania, nestálosť.',
    advice: 'Zmena je tu. Nechytaj sa starého — prúd ťa nesie správnym smerom.',
    advices: [
      'Zmena je tu. Nechytaj sa starého — prúd ťa nesie správnym smerom.',
      'To, čo dnes vyzerá ako smola, sa o mesiac ukáže ako požehnanie.',
      'Koleso sa točí. Ak si hore — buď pokorný. Ak dole — buď trpezlivý.',
      'Šťastná „náhoda" dnes nie je náhoda. Všimni si ju a konaj.',
      'Cyklus sa opakuje, kým nepochopíš lekciu. Čo sa opakuje v tvojom živote?',
      'Pusti kontrolu. Niektoré veci sa musia vyriešiť samy.',
      'Dnes je bod zlomu. Malé rozhodnutie môže zmeniť celý smer.',
      'Čo sa minulý rok zdalo neriešiteľné, je dnes za tebou. Pamätaj na to.',
      'Prispôsobivosť je dnes dôležitejšia ako plán.',
      'Osud a slobodná vôľa nie sú protiklady. Využi príležitosť, ktorá prichádza.',
      'Ak cítiš nepokoj — niečo nové sa rodí. Nedus to.',
      'Nič netrvá večne — ani dobré, ani zlé. Užívaj si prítomnosť.',
    ],
  },
  {
    number: 11,
    name: 'Spravodlivosť',
    arcana: 'major',
    symbol: '⚖️',
    meaning: 'Rovnováha, pravda, zodpovednosť za dôsledky. Karma v akcii.',
    shadow: 'Tvrdé súdenie, chladná logika bez srdca, nesúlad.',
    advice: 'Buď férový — k sebe aj k druhým. Pravda dnes vyhráva.',
    advices: [
      'Buď férový — k sebe aj k druhým. Pravda dnes vyhráva.',
      'Dôsledok starého rozhodnutia sa dnes ukáže. Prijmi ho bez obviňovania.',
      'Vyvážiš to, čo je naklonené? Pozri, kde dávaš priveľa a kde primálo.',
      'Klamstvo — aj „milosrdné" — ťa dnes stojí viac ako pravda.',
      'Zodpovednosť nie je bremeno. Je to znalosť, že máš moc veci meniť.',
      'Objektivita ti dnes pomôže viac ako empatia. Pozri na fakty.',
      'Ak čakáš na spravodlivosť zvonku — začni ju robiť sám/sama.',
      'Rovnováha práce a odpočinku: kde si dnes? Uprav to.',
      'Zmluva, dohoda alebo záväzok — dodržuj ho. Integrita je tvoj základ.',
      'Prestať sa porovnávať s inými je akt spravodlivosti voči sebe.',
      'Čo by si poradil najlepšiemu priateľovi v tvojej situácii? Poraď si to.',
      'Dnes sa rozhoduj ako sudca — s múdrosťou, nie s emóciou.',
    ],
  },
  {
    number: 12,
    name: 'Obesenec',
    arcana: 'major',
    symbol: '🙃',
    meaning: 'Pauza, nový uhol pohľadu, obeta pre vyššie poznanie.',
    shadow: 'Mučeníctvo, stagnácia, odmietanie konať.',
    advice: 'Otoč perspektívu. Problém, ktorý riešiš, vyzerá inak z opačnej strany.',
    advices: [
      'Otoč perspektívu. Problém, ktorý riešiš, vyzerá inak z opačnej strany.',
      'Nekonaj. Čakanie je dnes aktívna stratégia, nie pasivita.',
      'Obetuj malé ego pre väčší princíp. Čo musíš pustiť?',
      'Situácia sa nezmení, kým nezmeníš uhol pohľadu. Skús opak.',
      'To, čo vyzerá ako strata, je investícia. Uvidíš návratnosť neskôr.',
      'Visíš hore nohami? Dobre. Z tejto pozície vidíš veci, čo iní nevidia.',
      'Pusť potrebu mať pravdu. Nechaj sa poučiť nečakaným zdrojom.',
      'Pauza nie je prehra. Je to nabíjanie pred ďalším krokom.',
      'Dnes nedostaneš to, čo chceš — ale to, čo potrebuješ. Prijmi to.',
      'Skúmaj diskomfort namiesto toho, aby si pred ním utiekol.',
      'Odovzdanosť nie je rezignácia. Je to dôvera v proces väčší ako ty.',
      'Čo keby situácia, v ktorej sa cítiš uväznený, bola tvoj najlepší učiteľ?',
    ],
  },
  {
    number: 13,
    name: 'Smrť',
    arcana: 'major',
    symbol: '💀',
    meaning: 'Transformácia, koniec a nový začiatok. Nevyhnutná premena.',
    shadow: 'Strach zo zmeny, lipnutie na mŕtvom, stagnácia.',
    advice: 'Nechaj zomrieť to, čo už neslúži. Uvoľni miesto novému.',
    advices: [
      'Nechaj zomrieť to, čo už neslúži. Uvoľni miesto novému.',
      'Koniec nie je zlyhanie — je to dokončenie. Uzavri kapitolu vedome.',
      'Vyhoď, daruj alebo zmaž jednu vec, ktorá ťa ťahá do minulosti.',
      'Smútiť za starým je normálne. Ale nežiť kvôli nemu — to už nie.',
      'Transformácia bolí len vtedy, keď sa jej brániš.',
      'Kto budeš, keď pustíš identitu, za ktorú sa držíš?',
      'Starý vzorec správania dnes definitívne konči. Nahraď ho vedomým výberom.',
      'Smrť starého ja je pôrod nového. Dýchaj cez prechod.',
      'Čo v tvojom živote je už mŕtve, ale ty to stále živíš?',
      'Rozlúčka nie je porážka. Je to akt zrelosti a sebaurčenia.',
      'Dnes je posledný deň niečoho starého. Zajtra začínaš inak.',
      'Príroda nepozná smrť — len premenu formy. Ty tiež nie.',
    ],
  },
  {
    number: 14,
    name: 'Miernosť',
    arcana: 'major',
    symbol: '⏳',
    meaning: 'Rovnováha, trpezlivosť, miešanie protikladov, stredná cesta.',
    shadow: 'Extrém, netrpezlivosť, vnútorný konflikt.',
    advice: 'Hľadaj strednú cestu. Extrém ťa dnes neposunie — rovnováha áno.',
    advices: [
      'Hľadaj strednú cestu. Extrém ťa dnes neposunie — rovnováha áno.',
      'Zmiešaj dve veci, ktoré sa zdajú nezlučiteľné. Výsledok ťa prekvapí.',
      'Trpezlivosť — nie rýchlosť — je dnes kľúč k výsledku.',
      'Daj rovnaký čas práci aj odpočinku. Neobetuj jedno pre druhé.',
      'Kompromis nie je slabosť. Je to umenie vidieť celok.',
      'Telo a myseľ potrebujú synchronizáciu. Čo z toho zanedbávaš?',
      'Nelieči sa rýchlo, čo sa dlho pokazilo. Daj procesu čas.',
      'Integrácia protikladov: buď prísny AJ láskavý. Obe naraz.',
      'Dnes varí pomaly. Rýchly oheň spáli jedlo — nízky plameň ho dovarí.',
      'Alchýmia dňa: transformuj frustráciu na trpezlivosť, strach na zvedavosť.',
      'Keď nevieš či áno alebo nie — odpoveď je „ešte nie". Čakaj.',
      'Rovnováha sa nenájde — vytvára sa. Aktívne. Každý deň znova.',
    ],
  },
  {
    number: 15,
    name: 'Diabol',
    arcana: 'major',
    symbol: '😈',
    meaning: 'Pripútanosť, tieň, ilúzia zajatia. Reťaz, ktorú si sám navliekol.',
    shadow: 'Závislosť, manipulácia, materializmus.',
    advice: 'Pozri sa, čo ťa drží v zajatí. Reťaz je voľnejšia, než si myslíš.',
    advices: [
      'Pozri sa, čo ťa drží v zajatí. Reťaz je voľnejšia, než si myslíš.',
      'Závislosť nie je len látka. Zvyk, vzťah, myšlienka — čo je tvoje?',
      'Dnes si prizaj tieňovú stránku. Potlačená, rastie. Uznaná, stráca moc.',
      'Pohodlie ťa drží v klietke. Nepohodlie je cesta von.',
      'Si v zlatej klietke? Peniaze, status, istota — ak ťa nenapĺňajú, sú väzením.',
      'Humor a nadhľad sú zbrane proti vlastnému tieňu. Zasmej sa na sebe.',
      'Kto alebo čo ovláda tvoju pozornosť? Vedomé znovuzískanie moci začína tým, že si to uvedomíš.',
      'Odmietni dnes jedno pokušenie vedome. Nie z morálky — z moci nad sebou.',
      'Strach ťa paralyzuje? Pozri sa mu priamo do tváre. Je menší, než vyzerá.',
      'Tvoj tieň nie je nepriateľ — je to nevyužitý potenciál.',
      'Ak niečo musíš robiť tajne — opýtaj sa prečo. Tajomstvo je signál.',
      'Sloboda začína slovom „nie". Komu alebo čomu ho dnes povieš?',
    ],
  },
  {
    number: 16,
    name: 'Veža',
    arcana: 'major',
    symbol: '🗼',
    meaning: 'Náhla zmena, rozpad ilúzií, blesk pravdy. Pád starých štruktúr.',
    shadow: 'Deštrukcia, katastrofizmus, odmietanie reality.',
    advice: 'Ak niečo padá, nechaj to padnúť. Na troskách postavíš lepšie.',
    advices: [
      'Ak niečo padá, nechaj to padnúť. Na troskách postavíš lepšie.',
      'Šok dnes nie je trest — je to prebudenie. Ber ho ako dar.',
      'Ilúzia, ktorú si udržiaval, sa dnes môže rozbiť. To je oslobodenie.',
      'Plány sa menia. Adaptuj sa namiesto toho, aby si trucoval.',
      'Niečo, čo si považoval za stabilné, sa zatrasie. Základ je v tebe, nie v tom.',
      'Blesk osvetlí to, čo si nechcel vidieť. Teraz už vieš — konaj podľa toho.',
      'Ego padá tvrdšie ako duch. Nechaj ho. Duch vstane vždy.',
      'Kríza je príležitosť. Čo nové môžeš postaviť na uvoľnenom mieste?',
      'Dnes nedrž fasádu. Autentickosť je silnejšia ako dokonalý obraz.',
      'Ak sa bojíš zmeny — ona sa bojí teba ešte viac. Si silnejší.',
      'To, čo sa zdá byť katastrofa, je korekcia kurzu. Dôveruj.',
      'Staré mury padajú, aby si videl oblohu. Pozri hore.',
    ],
  },
  {
    number: 17,
    name: 'Hviezda',
    arcana: 'major',
    symbol: '⭐',
    meaning: 'Nádej, inšpirácia, vnútorný pokoj po búrke. Hviezda svieti v tme.',
    shadow: 'Naivný optimizmus, odpojenie od reality, pasivita.',
    advice: 'Nádej nie je naivita — je to sila. Dôveruj, že sa to vyvinie dobre.',
    advices: [
      'Nádej nie je naivita — je to sila. Dôveruj, že sa to vyvinie dobre.',
      'Po búrke vychádza hviezda. Ak si prežil včerajšok — dnes svietiš.',
      'Zdieľaj svoj dar. Svet ťa dnes potrebuje presne takého, aký si.',
      'Vizualizuj si ideálny výsledok. Predstavivosť je dnes tvoja mapa.',
      'Lieč sa. Dnes je deň na regeneráciu — telesnú aj duševnú.',
      'Inšpirácia prichádza nečakane. Buď otvorený — možno cez pieseň, obraz alebo cudzinca.',
      'Si na správnej ceste, aj keď to tak necítiš. Hviezda svieti aj za mrakmi.',
      'Čistá voda — pi ju, ponor sa do nej, predstav si ju. Očistenie je dnes téma.',
      'Tvoje rany sú tvoje kvalifikácie. To, čím si prešiel, pomáha iným.',
      'Dôvera v život nie je naivita — je to odvaha po skúsenosti.',
      'Dnes si dovoľ snívať. Sny sú semienka zajtrajšej reality.',
      'Pokoj po kríze je posvätný priestor. Využi ho na nový zámer.',
    ],
  },
  {
    number: 18,
    name: 'Mesiac',
    arcana: 'major',
    symbol: '🌑',
    meaning: 'Ilúzie, strach, podvedomé vzorce. Cesta cez temnotu.',
    shadow: 'Klam, úzkosť, paranoia, odmietanie tieňa.',
    advice: 'Nie všetko je dnes také, ako vyzerá. Nedôveruj prvému dojmu — kopaj hlbšie.',
    advices: [
      'Nie všetko je dnes také, ako vyzerá. Nedôveruj prvému dojmu — kopaj hlbšie.',
      'Strach, ktorý cítiš, je starý. Nie je z dneška — je z minulosti. Rozlíš to.',
      'Sny a nočné vízie nesú správu. Zapíš si ich hneď ráno.',
      'Nejasnosť je signál — nerob dnes veľké rozhodnutia. Čakaj na svetlo.',
      'Tvoja fantázia ti dnes klame. Over si fakty pred akciou.',
      'Podvedomé vzorce ťa vedú na autopilote. Dnes si zapni manuálny režim.',
      'Tma nie je nepriateľ — je to priestor, kde sa rodí nové. Zostaň v nej.',
      'Ak sa bojíš — pomenuj strach nahlas. Stráca moc, keď dostane meno.',
      'Intuícia a paranoia vyzerajú rovnako. Rozlíš ich podľa toho, či ťa sťahujú alebo rozširujú.',
      'Cesta cez temnotu je legitímna cesta. Nemusíš byť stále v svetle.',
      'Dnes pozoruj, čo sa deje na periférii. Dôležité nie je v centre pozornosti.',
      'Mesačné svetlo skresluje. Počkaj na ráno, než vynesieš súd.',
    ],
  },
  {
    number: 19,
    name: 'Slnko',
    arcana: 'major',
    symbol: '☀️',
    meaning: 'Radosť, vitalita, jasnosť, úspech. Svetlo po tme.',
    shadow: 'Povrchný optimizmus, vyhorenie, prehnaná extrovertnosť.',
    advice: 'Dnes žiar. Tvoja energia je nákazlivá — zdieľaj ju s ostatnými.',
    advices: [
      'Dnes žiar. Tvoja energia je nákazlivá — zdieľaj ju s ostatnými.',
      'Jednoduché radosti — slnko na tvári, smiech dieťaťa — sú dnes liek.',
      'Jasnosť myslenia je tvoja výhoda. Využi ju na dôležité rozhodnutia.',
      'Buď viditeľný/á. Dnes nie je deň schovávať sa v úzadí.',
      'Oslavuj malé víťazstvo. Nemusíš čakať na veľký úspech.',
      'Tvoje vnútorné dieťa chce pozornosť. Čo by ťa dnes potešilo ako 7-ročného?',
      'Energia, ktorú dnes máš, je vzácna. Investuj ju múdro — nie rozptýlene.',
      'Vyjdi na slnko. Doslova. Vitamín D a svetlo menia náladu za 15 minút.',
      'Autenticita je magnetická. Čím viac si sám sebou, tým viac priťahuješ.',
      'Dnes je deň na hranie, nie na trápenie. Ľahkosť nie je povrchnosť.',
      'Rozjasni niekomu deň. Kompliment, pomoc, úsmev — stačí málo.',
      'Úspech, ktorý dnes príde, si zaslúžiš. Prijmi ho bez falošnej skromnosti.',
    ],
  },
  {
    number: 20,
    name: 'Súd',
    arcana: 'major',
    symbol: '📯',
    meaning: 'Prebudenie, povolanie, hodnotenie života. Trúba volá k novému.',
    shadow: 'Sebaodsudzovanie, neschopnosť odpustiť, rigidné súdenie.',
    advice: 'Počuješ volanie? Niečo vyššie ťa dnes zvoláva. Odpovedz.',
    advices: [
      'Počuješ volanie? Niečo vyššie ťa dnes zvoláva. Odpovedz.',
      'Odpusť si starú chybu. Držíš ju dlhšie, než si zaslúži.',
      'Obzri sa na svoju cestu — nie s ľútosťou, ale s ocenením. Prešiel si dosť.',
      'Dnes je deň na veľké rozhodnutie, ktoré si odkladal. Trúba zaznela.',
      'Kto si bol, už nie si. Kto si dnes — toho si vyber vedome.',
      'Sebahodnotenie bez sebaodsúdenia: čo si sa za posledný rok naučil?',
      'Volanie prichádza zvnútra. Nerob ho závislým na vonkajšom potvrdení.',
      'Uzavri starý účet — ospravedlnenie, odpustenie, rozlúčka. Uvoľni to.',
      'Tvoj životný zmysel ťa hľadá rovnako, ako ty hľadáš jeho.',
      'Dnes zhodnoť: čo funguje a čo nie? Buď brutálne úprimný sám k sebe.',
      'Prebudenie bolí len spánok, nie teba. Prebúdzaj sa.',
      'Zmŕtvychvstanie: oživuj to, čo si predčasne pochoval. Možno to ešte žije.',
    ],
  },
  {
    number: 21,
    name: 'Svet',
    arcana: 'major',
    symbol: '🌍',
    meaning: 'Dokončenie, integrácia, naplnenie. Celok je kompletný.',
    shadow: 'Strach z dokončenia, neschopnosť uzavrieť, stagnácia po úspechu.',
    advice: 'Niečo v tvojom živote sa práve dokončuje. Oslavuj to a priprav sa na ďalší cyklus.',
    advices: [
      'Niečo v tvojom živote sa práve dokončuje. Oslavuj to a priprav sa na ďalší cyklus.',
      'Dokonči jednu vec — úplne, poriadne, do bodky. Potom sa oslavuj.',
      'Si na konci cyklu. Čo si sa naučil? Zosumarizuj si to.',
      'Integrácia znamená: všetko, čím si prešiel, má zmysel. Aj bolesti.',
      'Tanec Sveta: pohybuj sa dnes s radosťou. Telo chce osláviť.',
      'Celý svet je tvoja učebňa. Dnes ťa lekcia čaká vonku — vyjdi.',
      'Kruh sa zatvára. Ďakuj za cestu a otvor novú bránu.',
      'Si kompletný/á — aj bez partnera, úspechu alebo potvrdenia. Práve teraz.',
      'Pozri sa na svoj život zhora — ako na mapu. Vidíš vzory?',
      'Dovoľ si pocit naplnenia. Nemusíš hneď hľadať ďalší cieľ.',
      'Svet ti dnes hovorí „áno". Prijmi to bez podmienok.',
      'Koniec je začiatok. Spirála sa točí vyššie — si pripravený/á.',
    ],
  },
];

// Tematicky príbuzné karty per ODV (2-3 karty rotujú)
const TAROT_GROUPS_BY_ODV: Record<number, number[]> = {
  1: [1, 0, 7],    // Mág, Blázon, Voz — iniciatíva, začiatky, pohyb vpred
  2: [2, 11, 6],   // Veľkňažka, Spravodlivosť, Zaľúbení — intuícia, rovnováha, vzťahy
  3: [3, 17, 19],  // Cisárovná, Hviezda, Slnko — tvorivosť, inšpirácia, radosť
  4: [4, 11, 21],  // Cisár, Spravodlivosť, Svet — štruktúra, poriadok, dokončenie
  5: [10, 16, 0],  // Kolo šťastia, Veža, Blázon — zmena, prekvapenie, skok
  6: [6, 3, 14],   // Zaľúbení, Cisárovná, Miernosť — láska, harmónia, starostlivosť
  7: [9, 12, 18],  // Pustovník, Obesenec, Mesiac — introspekcia, ticho, hlbiny
  8: [8, 15, 21],  // Sila, Diabol, Svet — moc, manifestácia, majstrovstvo
  9: [13, 20, 9],  // Smrť, Súd, Pustovník — transformácia, uzatváranie, múdrosť
};

// Spätná kompatibilita
export const TAROT_BY_ODV: Record<number, TarotCard> = {
  1: TAROT_CARDS[1],
  2: TAROT_CARDS[2],
  3: TAROT_CARDS[3],
  4: TAROT_CARDS[4],
  5: TAROT_CARDS[5],
  6: TAROT_CARDS[6],
  7: TAROT_CARDS[7],
  8: TAROT_CARDS[8],
  9: TAROT_CARDS[9],
};

/**
 * Vráti dennú tarot kartu pre dané ODV číslo (1-9).
 * Rotuje cez skupinu 2-3 tematicky príbuzných kariet + ich advices.
 */
export function getDailyTarot(odv: number): TarotCard & { dailyAdvice: string } {
  const group = TAROT_GROUPS_BY_ODV[odv] || TAROT_GROUPS_BY_ODV[1];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const card = TAROT_CARDS[group[dayOfYear % group.length]];
  const adviceIndex = Math.floor(dayOfYear / group.length) % card.advices.length;

  return {
    ...card,
    dailyAdvice: card.advices[adviceIndex],
  };
}

/**
 * Vráti mesačnú tarot kartu podľa OMV (1-9).
 * Rotuje cez rok — každý mesiac s rovnakým OMV dostane inú kartu.
 */
export function getMonthlyTarot(omv: number): TarotCard & { monthlyAdvice: string } {
  const group = TAROT_GROUPS_BY_ODV[omv] || TAROT_GROUPS_BY_ODV[1];
  const now = new Date();
  const monthIndex = now.getMonth();
  // Offset od dennej aby nebola rovnaká karta
  const card = TAROT_CARDS[group[(monthIndex + 1) % group.length]];
  const adviceIndex = monthIndex % card.advices.length;
  return { ...card, monthlyAdvice: card.advices[adviceIndex] };
}

/**
 * Vráti dennú kartu z celej veľkej arkány (0-21) podľa dňa v roku.
 * Rotuje aj kartu aj radu.
 */
export function getDailyMajorArcana(): TarotCard & { dailyAdvice: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const cardIndex = dayOfYear % TAROT_CARDS.length;
  const card = TAROT_CARDS[cardIndex];
  const adviceIndex = Math.floor(dayOfYear / TAROT_CARDS.length) % card.advices.length;

  return {
    ...card,
    dailyAdvice: card.advices[adviceIndex],
  };
}
