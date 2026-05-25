import type { Language } from '../../store/useStore';

export type SettingsKey =
  | 'settings.title' | 'settings.subtitle' | 'settings.theme' | 'settings.themeLight'
  | 'settings.themeDark' | 'settings.themeSystem' | 'settings.language'
  | 'settings.languageSk' | 'settings.languageEn' | 'settings.numerologyMethod'
  | 'settings.profiles' | 'settings.newProfile' | 'settings.install' | 'settings.about'
  | 'settings.exportBackup' | 'settings.version' | 'settings.appearance'
  | 'settings.methodCharacter' | 'settings.methodDevelopmental'
  | 'settings.tabProfile' | 'settings.tabAi' | 'settings.tabData' | 'settings.tabAbout'
  | 'settings.noProfiles' | 'settings.deleteProfile' | 'settings.methodDescription'
  | 'settings.themeDescription' | 'settings.installTitle' | 'settings.installDescription'
  | 'settings.installIos' | 'settings.installButton' | 'settings.installAndroid'
  | 'settings.aiTitle' | 'settings.aiActive' | 'settings.aiDescription'
  | 'settings.aiKeyLabel' | 'settings.aiKeySaved' | 'settings.aiKeyRemoved'
  | 'settings.aiKeyRemove' | 'settings.aiKeyRemoveConfirm'
  | 'settings.aiModel' | 'settings.aiLens' | 'settings.aiLensDescription'
  | 'settings.aiLensTip' | 'settings.aiClearAll' | 'settings.aiClearAllConfirm'
  | 'settings.aiClearAllDone'
  | 'settings.reminderTitle' | 'settings.reminderDescription'
  | 'settings.reminderOn' | 'settings.reminderOff' | 'settings.reminderDenied'
  | 'settings.reminderNotSupported' | 'settings.reminderEnable' | 'settings.reminderDisable'
  | 'settings.aboutTitle' | 'settings.aboutDescription'
  | 'settings.checkUpdate' | 'settings.checkUpdateDesc'
  | 'settings.forceCache' | 'settings.forceCacheDesc' | 'settings.forceCacheConfirm'
  | 'settings.perfMetrics' | 'settings.clearLog' | 'settings.diagnostics'
  | 'settings.copyLog' | 'settings.backup' | 'settings.backupDesc'
  | 'settings.exportBtn' | 'settings.importBtn'
  | 'settings.importConfirm' | 'settings.importSuccess' | 'settings.importError'
  | 'settings.githubOffline';

type Dict = Record<SettingsKey, string>;

const sk: Dict = {
  'settings.title': 'Nastavenia',
  'settings.subtitle': 'Správa profilov a preferencií',
  'settings.theme': 'Téma',
  'settings.themeLight': '☀ Svetlá',
  'settings.themeDark': '🌙 Tmavá',
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
  'settings.appearance': 'Vzhľad',
  'settings.methodCharacter': 'Charakterová (Robin Steinová)',
  'settings.methodDevelopmental': 'Vývojová (Lívia Mičková)',
  'settings.tabProfile': 'Profil',
  'settings.tabAi': 'AI',
  'settings.tabData': 'Dáta',
  'settings.tabAbout': 'O appke',
  'settings.noProfiles': 'Žiadne profily. Vytvorte si prvý.',
  'settings.deleteProfile': 'Naozaj vymazať profil?',
  'settings.methodDescription': 'Aplikácia podporuje dve numerologické školy. Prepínač ovplyvňuje výpočty a zobrazené sekcie na všetkých stránkach.',
  'settings.themeDescription': 'Zvoľte svetlý alebo tmavý režim zobrazenia.',
  'settings.installTitle': 'Inštalácia na plochu',
  'settings.installDescription': 'Aplikácia funguje aj offline. Nainštalujte si ju na plochu pre rýchly prístup.',
  'settings.installIos': 'Na iPhone/iPad: Otvorte v Safari → Klepnite na ikonu zdieľania (☐↑) → "Pridať na plochu".',
  'settings.installButton': 'Nainštalovať na plochu',
  'settings.installAndroid': 'Na Androide sa po inštalácii aplikácia objaví na ploche ako natívna appka.',
  'settings.aiTitle': '✦ AI integrácia (Claude)',
  'settings.aiActive': 'Aktívna',
  'settings.aiDescription': 'Priamy prístup k Claude AI pre personalizovaný integratívny výklad. API kľúč zostáva len vo vašom zariadení.',
  'settings.aiKeyLabel': 'API kľúč',
  'settings.aiKeySaved': 'Kľúč uložený.',
  'settings.aiKeyRemoved': 'Kľúč odstránený.',
  'settings.aiKeyRemove': 'Odstrániť kľúč',
  'settings.aiKeyRemoveConfirm': 'Naozaj odstrániť API kľúč?',
  'settings.aiModel': 'Model',
  'settings.aiLens': 'Štýl výkladu (lens)',
  'settings.aiLensDescription': 'Vyberte perspektívu, z ktorej bude AI interpretovať váš profil. Lens mení len štýl odpovede, nie výpočty.',
  'settings.aiLensTip': 'Tip: Po zmene lensu odporúčame vymazať chat a začať nový rozhovor.',
  'settings.aiClearAll': '⚠ Vymazať VŠETKY AI dáta (kľúč + chat história)',
  'settings.aiClearAllConfirm': 'Vymazať API kľúč A celú chat históriu? Toto je nezvratné.',
  'settings.aiClearAllDone': 'Všetky AI dáta vymazané. Stránka sa obnoví.',
  'settings.reminderTitle': 'Denné pripomenutie',
  'settings.reminderDescription': 'Zapnite denné pripomenutie a každé ráno o 7:00 dostanete notifikáciu s vašou dennou energiou.',
  'settings.reminderOn': 'Denné pripomenutie zapnuté! Každé ráno o 7:00.',
  'settings.reminderOff': 'Denné pripomenutie vypnuté.',
  'settings.reminderDenied': 'Notifikácie boli zamietnuté. Povoľte ich v nastaveniach prehliadača.',
  'settings.reminderNotSupported': 'Tento prehliadač nepodporuje notifikácie.',
  'settings.reminderEnable': 'Zapnúť denné pripomenutie',
  'settings.reminderDisable': '✓ Zapnuté — vypnúť',
  'settings.aboutTitle': 'O aplikácii',
  'settings.aboutDescription': 'Integrálna mapa bytia — osobný sprievodca sebapoznaním. Offline-first. Súkromné. Bez reklám.',
  'settings.checkUpdate': '↻ Skontrolovať update',
  'settings.checkUpdateDesc': 'Skontroluje či je na serveri novšia verzia a ponúkne aktualizáciu.',
  'settings.forceCache': 'Pokročilé: vynútiť cache wipe',
  'settings.forceCacheDesc': 'Vymaže všetky cache a service worker. Použite ak opakovaná kontrola update nefunguje.',
  'settings.forceCacheConfirm': 'Vynútiť stiahnutie novej verzie? Vymaže cache a obnoví stránku.',
  'settings.perfMetrics': 'Výkonnostné metriky',
  'settings.clearLog': 'Vymazať log',
  'settings.diagnostics': 'Diagnostika',
  'settings.copyLog': 'Skopírovať celý log do schránky',
  'settings.backup': 'Záloha dát',
  'settings.backupDesc': 'Exportujte alebo importujte všetky profily, klientov, reporty a nastavenia.',
  'settings.exportBtn': '↓ Exportovať zálohu',
  'settings.importBtn': '↑ Importovať zálohu',
  'settings.importConfirm': 'Importovať zálohu? Existujúce dáta budú prepísané.',
  'settings.importSuccess': 'Import úspešný!',
  'settings.importError': 'Chyba pri čítaní súboru.',
  'settings.githubOffline': 'GitHub je offline. Skúste neskôr.',
};

const en: Dict = {
  'settings.title': 'Settings',
  'settings.subtitle': 'Profile management and preferences',
  'settings.theme': 'Theme',
  'settings.themeLight': '☀ Light',
  'settings.themeDark': '🌙 Dark',
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
  'settings.appearance': 'Appearance',
  'settings.methodCharacter': 'Characterological (Robin Steinová)',
  'settings.methodDevelopmental': 'Developmental (Lívia Mičková)',
  'settings.tabProfile': 'Profile',
  'settings.tabAi': 'AI',
  'settings.tabData': 'Data',
  'settings.tabAbout': 'About',
  'settings.noProfiles': 'No profiles. Create your first one.',
  'settings.deleteProfile': 'Delete this profile?',
  'settings.methodDescription': 'The app supports two numerology schools. The switch affects calculations and displayed sections across all pages.',
  'settings.themeDescription': 'Choose light or dark display mode.',
  'settings.installTitle': 'Install to home screen',
  'settings.installDescription': 'The app works offline. Install it for quick access.',
  'settings.installIos': 'On iPhone/iPad: Open in Safari → Tap Share icon (☐↑) → "Add to Home Screen".',
  'settings.installButton': 'Install to home screen',
  'settings.installAndroid': 'On Android, after installation the app appears on your home screen as a native app.',
  'settings.aiTitle': '✦ AI integration (Claude)',
  'settings.aiActive': 'Active',
  'settings.aiDescription': 'Direct access to Claude AI for personalized integral readings. The API key stays only on your device.',
  'settings.aiKeyLabel': 'API key',
  'settings.aiKeySaved': 'Key saved.',
  'settings.aiKeyRemoved': 'Key removed.',
  'settings.aiKeyRemove': 'Remove key',
  'settings.aiKeyRemoveConfirm': 'Remove API key?',
  'settings.aiModel': 'Model',
  'settings.aiLens': 'Reading style (lens)',
  'settings.aiLensDescription': 'Choose the perspective from which AI will interpret your profile. Lens only changes the response style, not calculations.',
  'settings.aiLensTip': 'Tip: After changing the lens, we recommend clearing the chat and starting a new conversation.',
  'settings.aiClearAll': '⚠ Delete ALL AI data (key + chat history)',
  'settings.aiClearAllConfirm': 'Delete API key AND entire chat history? This cannot be undone.',
  'settings.aiClearAllDone': 'All AI data deleted. Page will reload.',
  'settings.reminderTitle': 'Daily reminder',
  'settings.reminderDescription': 'Enable daily reminders to get a notification with your daily energy every morning at 7:00.',
  'settings.reminderOn': 'Daily reminder enabled! Every morning at 7:00.',
  'settings.reminderOff': 'Daily reminder disabled.',
  'settings.reminderDenied': 'Notifications were denied. Enable them in your browser settings.',
  'settings.reminderNotSupported': 'This browser does not support notifications.',
  'settings.reminderEnable': 'Enable daily reminder',
  'settings.reminderDisable': '✓ Enabled — disable',
  'settings.aboutTitle': 'About the app',
  'settings.aboutDescription': 'Integral Map of Being — your personal guide to self-knowledge. Offline-first. Private. Ad-free.',
  'settings.checkUpdate': '↻ Check for update',
  'settings.checkUpdateDesc': 'Checks if a newer version is available on the server and offers to update.',
  'settings.forceCache': 'Advanced: force cache wipe',
  'settings.forceCacheDesc': 'Clears all caches and service worker. Use if repeated update checks fail.',
  'settings.forceCacheConfirm': 'Force download of new version? This will clear cache and reload.',
  'settings.perfMetrics': 'Performance metrics',
  'settings.clearLog': 'Clear log',
  'settings.diagnostics': 'Diagnostics',
  'settings.copyLog': 'Copy full log to clipboard',
  'settings.backup': 'Data backup',
  'settings.backupDesc': 'Export or import all profiles, clients, reports and settings.',
  'settings.exportBtn': '↓ Export backup',
  'settings.importBtn': '↑ Import backup',
  'settings.importConfirm': 'Import backup? Existing data will be overwritten.',
  'settings.importSuccess': 'Import successful!',
  'settings.importError': 'Error reading file.',
  'settings.githubOffline': 'GitHub is offline. Try again later.',
};

export const settingsDictionaries: Record<Language, Dict> = { sk, en };
