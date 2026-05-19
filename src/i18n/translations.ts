// Ľahká i18n bez závislostí. Default jazyk: slovenčina.
// Výklady (numerology meanings, gene keys, life paths…) zostávajú v slovenčine —
// sú to citácie z konkrétnych slovenských kníh.

import type { Language } from '../store/useStore';

export type TranslationKey =
  // Navigácia
  | 'nav.dashboard' | 'nav.numerology' | 'nav.astrology' | 'nav.humanDesign'
  | 'nav.relationships' | 'nav.chakras' | 'nav.kabalah' | 'nav.theta'
  | 'nav.clients' | 'nav.settings' | 'nav.more'
  // Spoločné akcie
  | 'common.save' | 'common.cancel' | 'common.delete' | 'common.edit'
  | 'common.add' | 'common.close' | 'common.calculate' | 'common.today'
  | 'common.yes' | 'common.no' | 'common.optional' | 'common.required'
  | 'common.back' | 'common.next' | 'common.male' | 'common.female'
  | 'common.activate' | 'common.active' | 'common.search' | 'common.loading'
  | 'common.newCalculation'
  // Profil / dátum
  | 'profile.name' | 'profile.gender' | 'profile.birthDate' | 'profile.birthTime'
  | 'profile.birthPlace' | 'profile.day' | 'profile.month' | 'profile.year'
  | 'profile.hour' | 'profile.minute' | 'profile.notes'
  | 'profile.timeWarning'
  // Settings
  | 'settings.title' | 'settings.theme' | 'settings.themeLight' | 'settings.themeDark'
  | 'settings.themeSystem' | 'settings.language' | 'settings.languageSk'
  | 'settings.languageEn' | 'settings.numerologyMethod' | 'settings.profiles'
  | 'settings.newProfile' | 'settings.install' | 'settings.about'
  | 'settings.exportBackup' | 'settings.version' | 'settings.appearance'
  // Klienti
  | 'clients.title' | 'clients.searchPlaceholder' | 'clients.noClients'
  | 'clients.addFirst' | 'clients.newClient' | 'clients.history'
  | 'clients.deleteAll' | 'clients.foundOf'
  // Dashboard
  | 'dashboard.welcome' | 'dashboard.universalDay' | 'dashboard.todayAffirmation'
  | 'dashboard.todayRitual' | 'dashboard.morning' | 'dashboard.evening' | 'dashboard.body'
  // Numerology
  | 'numerology.title' | 'numerology.subtitle' | 'numerology.lifePath'
  | 'numerology.grid' | 'numerology.fullPlanes' | 'numerology.emptyPlanes'
  | 'numerology.isolated' | 'numerology.tabOverview' | 'numerology.tabPlanes'
  | 'numerology.tabVibrations' | 'numerology.tabKarmic' | 'numerology.tabLove'
  | 'numerology.tabName' | 'numerology.activeMethod'
  // Vývojová
  | 'dev.title' | 'dev.circled' | 'dev.egoPolarity' | 'dev.masculine' | 'dev.feminine'
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
  'nav.theta': 'Theta',
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
  // Klienti
  'clients.title': 'Klienti',
  'clients.searchPlaceholder': 'Hľadať podľa mena, dátumu, ŽČ, miesta alebo poznámok…',
  'clients.noClients': 'Zatiaľ nemáte žiadnych klientov',
  'clients.addFirst': 'Pridať prvého klienta',
  'clients.newClient': '+ Nový klient',
  'clients.history': 'História výkladov',
  'clients.deleteAll': 'Vymazať všetky',
  'clients.foundOf': 'Nájdených',
  // Dashboard
  'dashboard.welcome': 'Vitajte',
  'dashboard.universalDay': 'Univerzálny deň',
  'dashboard.todayAffirmation': 'Dnešná afirmácia',
  'dashboard.todayRitual': 'Denný rituál',
  'dashboard.morning': 'Ranná prax',
  'dashboard.evening': 'Večerná reflexia',
  'dashboard.body': 'Odporúčanie pre telo',
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
  // Vývojová
  'dev.title': 'Vývojová mriežka',
  'dev.circled': 'Karmické cykly (zakrúžkované čísla)',
  'dev.egoPolarity': 'Polarita ega',
  'dev.masculine': 'Mužské ego',
  'dev.feminine': 'Ženské ego',
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
  'nav.theta': 'Theta',
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
  // Clients
  'clients.title': 'Clients',
  'clients.searchPlaceholder': 'Search by name, date, life path, place or notes…',
  'clients.noClients': 'No clients yet',
  'clients.addFirst': 'Add first client',
  'clients.newClient': '+ New client',
  'clients.history': 'Reading history',
  'clients.deleteAll': 'Delete all',
  'clients.foundOf': 'Found',
  // Dashboard
  'dashboard.welcome': 'Welcome',
  'dashboard.universalDay': 'Universal day',
  'dashboard.todayAffirmation': "Today's affirmation",
  'dashboard.todayRitual': 'Daily ritual',
  'dashboard.morning': 'Morning practice',
  'dashboard.evening': 'Evening reflection',
  'dashboard.body': 'Body recommendation',
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
  // Vývojová
  'dev.title': 'Developmental grid',
  'dev.circled': 'Karmic cycles (circled numbers)',
  'dev.egoPolarity': 'Ego polarity',
  'dev.masculine': 'Masculine ego',
  'dev.feminine': 'Feminine ego',
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
