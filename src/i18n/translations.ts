// Ľahká i18n bez závislostí. Default jazyk: slovenčina.
// Výklady (numerology meanings, gene keys, life paths…) zostávajú v slovenčine —
// sú to citácie z konkrétnych slovenských kníh.

import type { Language } from '../store/useStore';

export type TranslationKey =
  // Navigácia
  | 'nav.dashboard' | 'nav.numerology' | 'nav.astrology' | 'nav.humanDesign'
  | 'nav.relationships' | 'nav.chakras' | 'nav.kabalah' | 'nav.theta'
  | 'nav.modality' | 'nav.clients' | 'nav.settings' | 'nav.more'
  // Spoločné akcie
  | 'common.save' | 'common.cancel' | 'common.delete' | 'common.edit'
  | 'common.add' | 'common.close' | 'common.calculate' | 'common.today'
  | 'common.yes' | 'common.no' | 'common.optional' | 'common.required'
  | 'common.back' | 'common.next' | 'common.male' | 'common.female'
  | 'common.activate' | 'common.active' | 'common.search' | 'common.loading'
  | 'common.newCalculation' | 'common.skip' | 'common.continue'
  | 'common.export' | 'common.import' | 'common.confirm' | 'common.deleteAll'
  // Profil / dátum
  | 'profile.name' | 'profile.gender' | 'profile.birthDate' | 'profile.birthTime'
  | 'profile.birthPlace' | 'profile.day' | 'profile.month' | 'profile.year'
  | 'profile.hour' | 'profile.minute' | 'profile.notes'
  | 'profile.timeWarning' | 'profile.create' | 'profile.welcome' | 'profile.newProfile'
  // Settings
  | 'settings.title' | 'settings.theme' | 'settings.themeLight' | 'settings.themeDark'
  | 'settings.themeSystem' | 'settings.language' | 'settings.languageSk'
  | 'settings.languageEn' | 'settings.numerologyMethod' | 'settings.profiles'
  | 'settings.newProfile' | 'settings.install' | 'settings.about'
  | 'settings.exportBackup' | 'settings.version' | 'settings.appearance'
  | 'settings.methodCharacter' | 'settings.methodDevelopmental'
  // Klienti
  | 'clients.title' | 'clients.searchPlaceholder' | 'clients.noClients'
  | 'clients.addFirst' | 'clients.newClient' | 'clients.history'
  | 'clients.deleteAll' | 'clients.foundOf' | 'clients.notesLabel'
  | 'clients.parent' | 'clients.child' | 'clients.partner' | 'clients.partnerCompat'
  // Dashboard
  | 'dashboard.welcome' | 'dashboard.universalDay' | 'dashboard.todayAffirmation'
  | 'dashboard.todayRitual' | 'dashboard.morning' | 'dashboard.evening' | 'dashboard.body'
  | 'dashboard.startJourney' | 'dashboard.appTitle' | 'dashboard.appSubtitle'
  | 'dashboard.todayDo' | 'dashboard.transitsToday'
  // Numerology
  | 'numerology.title' | 'numerology.subtitle' | 'numerology.lifePath'
  | 'numerology.grid' | 'numerology.fullPlanes' | 'numerology.emptyPlanes'
  | 'numerology.isolated' | 'numerology.tabOverview' | 'numerology.tabPlanes'
  | 'numerology.tabVibrations' | 'numerology.tabKarmic' | 'numerology.tabLove'
  | 'numerology.tabName' | 'numerology.activeMethod'
  | 'numerology.changeMethod' | 'numerology.from' | 'numerology.missing'
  // Vývojová
  | 'dev.title' | 'dev.circled' | 'dev.egoPolarity' | 'dev.masculine' | 'dev.feminine'
  | 'dev.lifeMission' | 'dev.psychicStability' | 'dev.materialStability' | 'dev.childhoodDreams'
  // Astrology / HD / Kabalah
  | 'astrology.title' | 'astrology.subtitle' | 'astrology.sun' | 'astrology.moon'
  | 'astrology.ascendant' | 'astrology.dominantElement' | 'astrology.dominantQuality'
  | 'astrology.moonPhase' | 'astrology.northNode' | 'astrology.southNode'
  | 'astrology.houses' | 'astrology.natalAspects'
  | 'hd.type' | 'hd.authority' | 'hd.strategy' | 'hd.profile'
  | 'hd.definedCenters' | 'hd.openCenters' | 'hd.channels' | 'hd.cross'
  | 'kabalah.title' | 'kabalah.primarySefira' | 'kabalah.secondarySefira'
  | 'kabalah.path' | 'kabalah.malchutAction'
  // Validation
  | 'validation.invalidDate' | 'validation.fillDate' | 'validation.fillName'
  | 'validation.emptyName';

type Dictionary = Record<TranslationKey, string>;

const sk: Dictionary = {
  // Navigácia
  'nav.dashboard': 'Dashboard',
  'nav.numerology': 'Numerológia',
  'nav.astrology': 'Astrológia',
  'nav.humanDesign': 'Human Design',
  'nav.relationships': 'Vzťahy',
  'nav.chakras': 'Čakry',
  'nav.kabalah': 'Kabala',
  'nav.theta': 'Theta Healing',
  'nav.modality': 'Modality',
  'nav.clients': 'Klienti',
  'nav.settings': 'Nastavenia',
  'nav.more': 'Viac',
  // Spoločné
  'common.save': 'Uložiť',
  'common.cancel': 'Zrušiť',
  'common.delete': 'Vymazať',
  'common.edit': 'Upraviť',
  'common.add': 'Pridať',
  'common.close': 'Zavrieť',
  'common.calculate': 'Vypočítať',
  'common.today': 'Dnes',
  'common.yes': 'Áno',
  'common.no': 'Nie',
  'common.optional': 'voliteľné',
  'common.required': 'povinné',
  'common.back': 'Späť',
  'common.next': 'Ďalej',
  'common.male': 'Muž',
  'common.female': 'Žena',
  'common.activate': 'Aktivovať',
  'common.active': 'Aktívny',
  'common.search': 'Hľadať',
  'common.loading': 'Načítavam…',
  'common.newCalculation': 'Nový výpočet',
  'common.skip': 'Preskočiť',
  'common.continue': 'Pokračovať',
  'common.export': 'Exportovať',
  'common.import': 'Importovať',
  'common.confirm': 'Potvrdiť',
  'common.deleteAll': 'Vymazať všetko',
  // Profil
  'profile.name': 'Meno',
  'profile.gender': 'Pohlavie',
  'profile.birthDate': 'Dátum narodenia',
  'profile.birthTime': 'Čas narodenia',
  'profile.birthPlace': 'Miesto narodenia',
  'profile.day': 'Deň',
  'profile.month': 'Mesiac',
  'profile.year': 'Rok',
  'profile.hour': 'Hod',
  'profile.minute': 'Min',
  'profile.notes': 'Poznámky',
  'profile.timeWarning': 'Bez presného času sa Mesiac môže pohnúť o znamenie a ascendent o ~1 znamenie za 2 hodiny. Ak nepoznáš čas, použi 12:00.',
  'profile.create': 'Vytvoriť profil',
  'profile.welcome': 'Vitajte',
  'profile.newProfile': 'Nový profil',
  // Settings
  'settings.title': 'Nastavenia',
  'settings.appearance': 'Vzhľad aplikácie',
  'settings.theme': 'Téma',
  'settings.themeLight': '☀ Svetlá',
  'settings.themeDark': '☾ Tmavá',
  'settings.themeSystem': '⚙ Podľa systému',
  'settings.language': 'Jazyk',
  'settings.languageSk': 'Slovenčina',
  'settings.languageEn': 'English',
  'settings.numerologyMethod': 'Numerologická metóda',
  'settings.profiles': 'Profily',
  'settings.newProfile': '+ Nový profil',
  'settings.install': 'Inštalácia na plochu',
  'settings.about': 'O aplikácii',
  'settings.exportBackup': 'Exportovať zálohu (JSON)',
  'settings.version': 'Verzia',
  'settings.methodCharacter': 'Charakterová (Robin Steinová)',
  'settings.methodDevelopmental': 'Vývojová (Lívia Mičková)',
  // Klienti
  'clients.title': 'Klienti',
  'clients.searchPlaceholder': 'Hľadať podľa mena, dátumu, ŽČ, miesta alebo poznámok…',
  'clients.noClients': 'Zatiaľ nemáte žiadnych klientov',
  'clients.addFirst': 'Pridať prvého klienta',
  'clients.newClient': '+ Nový klient',
  'clients.history': 'História výkladov',
  'clients.deleteAll': 'Vymazať všetky',
  'clients.foundOf': 'Nájdených',
  'clients.notesLabel': 'Poznámky',
  'clients.parent': 'Rodič',
  'clients.child': 'Dieťa',
  'clients.partner': 'Partner',
  'clients.partnerCompat': 'Kompatibilita s partnerom',
  // Dashboard
  'dashboard.welcome': 'Vitajte',
  'dashboard.universalDay': 'Univerzálny deň',
  'dashboard.todayAffirmation': 'Dnešná afirmácia',
  'dashboard.todayRitual': 'Denný rituál',
  'dashboard.morning': 'Ranná prax',
  'dashboard.evening': 'Večerná reflexia',
  'dashboard.body': 'Odporúčanie pre telo',
  'dashboard.startJourney': 'Začať cestu',
  'dashboard.appTitle': 'Integrálna mapa bytia',
  'dashboard.appSubtitle': 'Váš osobný sprievodca sebapoznaním. Offline. Súkromne. Profesionálne.',
  'dashboard.todayDo': 'Čo robiť dnes',
  'dashboard.transitsToday': 'Astro tranzity dnes',
  // Numerology
  'numerology.title': 'Numerológia',
  'numerology.subtitle': 'Kompletný numerologický rozbor',
  'numerology.lifePath': 'Životné číslo',
  'numerology.grid': 'Mriežka 3×3',
  'numerology.fullPlanes': 'Plné roviny',
  'numerology.emptyPlanes': 'Prázdne roviny',
  'numerology.isolated': 'Izolované čísla',
  'numerology.tabOverview': 'Prehľad',
  'numerology.tabPlanes': 'Roviny',
  'numerology.tabVibrations': 'Vibrácie',
  'numerology.tabKarmic': 'Karmické cykly',
  'numerology.tabLove': 'Jazyky lásky',
  'numerology.tabName': 'Meno',
  'numerology.activeMethod': 'Aktívna metóda',
  'numerology.changeMethod': 'Zmeniť metódu',
  'numerology.from': 'z',
  'numerology.missing': 'Chýbajúce',
  // Vývojová
  'dev.title': 'Vývojová mriežka',
  'dev.circled': 'Karmické cykly (zakrúžkované čísla)',
  'dev.egoPolarity': 'Polarita ega',
  'dev.masculine': 'Mužské ego',
  'dev.feminine': 'Ženské ego',
  'dev.lifeMission': 'Životné poslanie (K3)',
  'dev.psychicStability': 'Psychická stabilita (K1)',
  'dev.materialStability': 'Materiálna stabilita (K2)',
  'dev.childhoodDreams': 'Detské sny (K4)',
  // Astrology
  'astrology.title': 'Astrológia',
  'astrology.subtitle': 'Natálny horoskop',
  'astrology.sun': 'Slnko',
  'astrology.moon': 'Mesiac',
  'astrology.ascendant': 'Ascendent',
  'astrology.dominantElement': 'Dominantný živel',
  'astrology.dominantQuality': 'Dominantná kvalita',
  'astrology.moonPhase': 'Fáza Mesiaca',
  'astrology.northNode': 'Severný uzol',
  'astrology.southNode': 'Južný uzol',
  'astrology.houses': 'Domy',
  'astrology.natalAspects': 'Natálne aspekty',
  // HD
  'hd.type': 'Typ',
  'hd.authority': 'Autorita',
  'hd.strategy': 'Stratégia',
  'hd.profile': 'Profil',
  'hd.definedCenters': 'Definované centrá',
  'hd.openCenters': 'Otvorené centrá',
  'hd.channels': 'Kanály',
  'hd.cross': 'Inkarnačný kríž',
  // Kabalah
  'kabalah.title': 'Kabala',
  'kabalah.primarySefira': 'Primárna sefira',
  'kabalah.secondarySefira': 'Sekundárna sefira',
  'kabalah.path': 'Cesta',
  'kabalah.malchutAction': 'Akcia v Malchut',
  // Validation
  'validation.invalidDate': 'Neplatný dátum',
  'validation.fillDate': 'Vyplňte celý dátum narodenia.',
  'validation.fillName': 'Zadajte meno.',
  'validation.emptyName': 'Meno nesmie byť prázdne.',
};

const en: Dictionary = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.numerology': 'Numerology',
  'nav.astrology': 'Astrology',
  'nav.humanDesign': 'Human Design',
  'nav.relationships': 'Relationships',
  'nav.chakras': 'Chakras',
  'nav.kabalah': 'Kabbalah',
  'nav.theta': 'Theta Healing',
  'nav.modality': 'Modalities',
  'nav.clients': 'Clients',
  'nav.settings': 'Settings',
  'nav.more': 'More',
  // Common
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.close': 'Close',
  'common.calculate': 'Calculate',
  'common.today': 'Today',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.optional': 'optional',
  'common.required': 'required',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.male': 'Male',
  'common.female': 'Female',
  'common.activate': 'Activate',
  'common.active': 'Active',
  'common.search': 'Search',
  'common.loading': 'Loading…',
  'common.newCalculation': 'New calculation',
  'common.skip': 'Skip',
  'common.continue': 'Continue',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.confirm': 'Confirm',
  'common.deleteAll': 'Delete all',
  // Profile
  'profile.name': 'Name',
  'profile.gender': 'Gender',
  'profile.birthDate': 'Birth date',
  'profile.birthTime': 'Birth time',
  'profile.birthPlace': 'Birth place',
  'profile.day': 'Day',
  'profile.month': 'Month',
  'profile.year': 'Year',
  'profile.hour': 'Hr',
  'profile.minute': 'Min',
  'profile.notes': 'Notes',
  'profile.timeWarning': 'Without exact time, the Moon can shift one sign and the Ascendant ~1 sign per 2 hours. If unknown, use 12:00.',
  'profile.create': 'Create profile',
  'profile.welcome': 'Welcome',
  'profile.newProfile': 'New profile',
  // Settings
  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.theme': 'Theme',
  'settings.themeLight': '☀ Light',
  'settings.themeDark': '☾ Dark',
  'settings.themeSystem': '⚙ System',
  'settings.language': 'Language',
  'settings.languageSk': 'Slovenčina',
  'settings.languageEn': 'English',
  'settings.numerologyMethod': 'Numerology method',
  'settings.profiles': 'Profiles',
  'settings.newProfile': '+ New profile',
  'settings.install': 'Install to home screen',
  'settings.about': 'About',
  'settings.exportBackup': 'Export backup (JSON)',
  'settings.version': 'Version',
  'settings.methodCharacter': 'Characterological (Robin Steinová)',
  'settings.methodDevelopmental': 'Developmental (Lívia Mičková)',
  // Clients
  'clients.title': 'Clients',
  'clients.searchPlaceholder': 'Search by name, date, life path, place or notes…',
  'clients.noClients': 'No clients yet',
  'clients.addFirst': 'Add first client',
  'clients.newClient': '+ New client',
  'clients.history': 'Reading history',
  'clients.deleteAll': 'Delete all',
  'clients.foundOf': 'Found',
  'clients.notesLabel': 'Notes',
  'clients.parent': 'Parent',
  'clients.child': 'Child',
  'clients.partner': 'Partner',
  'clients.partnerCompat': 'Partner compatibility',
  // Dashboard
  'dashboard.welcome': 'Welcome',
  'dashboard.universalDay': 'Universal day',
  'dashboard.todayAffirmation': "Today's affirmation",
  'dashboard.todayRitual': 'Daily ritual',
  'dashboard.morning': 'Morning practice',
  'dashboard.evening': 'Evening reflection',
  'dashboard.body': 'Body recommendation',
  'dashboard.startJourney': 'Start the journey',
  'dashboard.appTitle': 'Integral Map of Being',
  'dashboard.appSubtitle': 'Your personal guide to self-knowledge. Offline. Private. Professional.',
  'dashboard.todayDo': 'What to do today',
  'dashboard.transitsToday': 'Astro transits today',
  // Numerology
  'numerology.title': 'Numerology',
  'numerology.subtitle': 'Full numerological reading',
  'numerology.lifePath': 'Life Path number',
  'numerology.grid': 'Grid 3×3',
  'numerology.fullPlanes': 'Full planes',
  'numerology.emptyPlanes': 'Empty planes',
  'numerology.isolated': 'Isolated numbers',
  'numerology.tabOverview': 'Overview',
  'numerology.tabPlanes': 'Planes',
  'numerology.tabVibrations': 'Vibrations',
  'numerology.tabKarmic': 'Karmic cycles',
  'numerology.tabLove': 'Love languages',
  'numerology.tabName': 'Name',
  'numerology.activeMethod': 'Active method',
  'numerology.changeMethod': 'Change method',
  'numerology.from': 'of',
  'numerology.missing': 'Missing',
  // Vývojová
  'dev.title': 'Developmental grid',
  'dev.circled': 'Karmic cycles (circled numbers)',
  'dev.egoPolarity': 'Ego polarity',
  'dev.masculine': 'Masculine ego',
  'dev.feminine': 'Feminine ego',
  'dev.lifeMission': 'Life mission (K3)',
  'dev.psychicStability': 'Psychic stability (K1)',
  'dev.materialStability': 'Material stability (K2)',
  'dev.childhoodDreams': 'Childhood dreams (K4)',
  // Astrology
  'astrology.title': 'Astrology',
  'astrology.subtitle': 'Natal horoscope',
  'astrology.sun': 'Sun',
  'astrology.moon': 'Moon',
  'astrology.ascendant': 'Ascendant',
  'astrology.dominantElement': 'Dominant element',
  'astrology.dominantQuality': 'Dominant quality',
  'astrology.moonPhase': 'Moon phase',
  'astrology.northNode': 'North Node',
  'astrology.southNode': 'South Node',
  'astrology.houses': 'Houses',
  'astrology.natalAspects': 'Natal aspects',
  // HD
  'hd.type': 'Type',
  'hd.authority': 'Authority',
  'hd.strategy': 'Strategy',
  'hd.profile': 'Profile',
  'hd.definedCenters': 'Defined centers',
  'hd.openCenters': 'Open centers',
  'hd.channels': 'Channels',
  'hd.cross': 'Incarnation cross',
  // Kabalah
  'kabalah.title': 'Kabbalah',
  'kabalah.primarySefira': 'Primary sefira',
  'kabalah.secondarySefira': 'Secondary sefira',
  'kabalah.path': 'Path',
  'kabalah.malchutAction': 'Malchut action',
  // Validation
  'validation.invalidDate': 'Invalid date',
  'validation.fillDate': 'Fill in the full birth date.',
  'validation.fillName': 'Enter a name.',
  'validation.emptyName': 'Name cannot be empty.',
};

const dictionaries: Record<Language, Dictionary> = { sk, en };

export function translate(lang: Language, key: TranslationKey): string {
  return dictionaries[lang][key] || dictionaries.sk[key] || key;
}
