import type { Language } from '../../store/useStore';

export type ChakrasKey =
  | 'chakras.title' | 'chakras.subtitle' | 'chakras.howEvaluated'
  | 'chakras.balanced' | 'chakras.blocked' | 'chakras.hyperactive'
  | 'chakras.yourReading' | 'chakras.scoreExplanation'
  | 'chakras.etikoterapia' | 'chakras.etikoterapiaBadge'
  | 'theta.title' | 'theta.subtitle'
  | 'modality.title' | 'modality.subtitle'
  | 'modality.tabOverview' | 'modality.tabAyurveda' | 'modality.tabBach'
  | 'modality.tabCrystals' | 'modality.tabArchetype' | 'modality.tabFengShui'
  | 'summary.title' | 'summary.howToRead' | 'summary.guide'
  | 'summary.whoYouAre' | 'summary.howToFunction' | 'summary.whereGoing'
  | 'summary.gift' | 'summary.shadowLabel'
  | 'summary.integralMap' | 'summary.sharedReading'
  | 'summary.loveLanguages' | 'summary.currentPeriod'
  | 'ai.title' | 'ai.notActivated' | 'ai.notActivatedDesc'
  | 'ai.apiKeyHint' | 'ai.createReading' | 'ai.readingTime'
  | 'ai.you' | 'ai.assistant' | 'ai.writing' | 'ai.preparing'
  | 'ai.errorLabel' | 'ai.stopGeneration' | 'ai.inputPlaceholder'
  | 'ai.clearConfirm' | 'ai.loadingHistory' | 'ai.savedReading'
  | 'ai.offlineHint' | 'ai.drawerLabel' | 'ai.drawerTitle' | 'ai.closeDrawer'
  | 'ai.interrupted' | 'ai.unknownError'
  | 'pwa.offlineMode' | 'pwa.iosInstallTitle' | 'pwa.iosInstallDesc'
  | 'pwa.understand' | 'pwa.installTitle' | 'pwa.installDesc'
  | 'pwa.newVersion' | 'pwa.newVersionDesc'
  | 'onboarding.skip'
  | 'error.title' | 'error.description' | 'error.showDetails'
  | 'error.restart' | 'error.copyDetail';

type Dict = Record<ChakrasKey, string>;

const sk: Dict = {
  'chakras.title': 'Čakry',
  'chakras.subtitle': 'Energetické centrá a ich stav',
  'chakras.howEvaluated': 'Ako sa vyhodnocujú čakry',
  'chakras.balanced': 'Vyvážená',
  'chakras.blocked': 'Blokovaná',
  'chakras.hyperactive': 'Hyperaktívna',
  'chakras.yourReading': 'Tvoje čítanie — ako pracovať s čakrami',
  'chakras.scoreExplanation': 'Ako sa skóre vyrátalo?',
  'chakras.etikoterapia': 'Etická príčina a cnosť (etikoterapia)',
  'chakras.etikoterapiaBadge': 'etikoterapia',
  'theta.title': 'Theta Healing',
  'theta.subtitle': 'Limitujúce presvedčenia a ich transformácia',
  'modality.title': 'Doplnkové systémy',
  'modality.subtitle': 'Ayurvéda, TCM, Bachove kvety, Kryštály, Archetypy, Feng Shui',
  'modality.tabOverview': 'Prehľad',
  'modality.tabAyurveda': 'Ayurvéda & TCM',
  'modality.tabBach': 'Bachove kvety',
  'modality.tabCrystals': 'Kryštály',
  'modality.tabArchetype': 'Archetyp',
  'modality.tabFengShui': 'Feng Shui',
  'summary.title': 'Integrálny súhrn osobnosti',
  'summary.howToRead': 'Ako čítať tento súhrn',
  'summary.guide': 'personalizovaný sprievodca',
  'summary.whoYouAre': 'Kto si v jadre',
  'summary.howToFunction': 'Ako správne fungovať',
  'summary.whereGoing': 'Kam smeruješ',
  'summary.gift': 'Dar',
  'summary.shadowLabel': 'Tieň',
  'summary.integralMap': 'Integrálna mapa bytia',
  'summary.sharedReading': 'Zdieľaný výklad',
  'summary.loveLanguages': 'Jazyky lásky',
  'summary.currentPeriod': 'Aktuálne obdobie',
  'ai.title': 'AI integrálny výklad',
  'ai.notActivated': 'AI výklad nie je aktivovaný.',
  'ai.notActivatedDesc': 'Pre vygenerovanie integratívneho výkladu vložte API kľúč v Nastaveniach → AI.',
  'ai.apiKeyHint': 'API kľúč získaš na console.anthropic.com',
  'ai.createReading': '✦ Vytvoriť AI výklad',
  'ai.readingTime': 'Výpočet trvá 5-15 sekúnd...',
  'ai.you': 'Vy',
  'ai.assistant': '✦ AI',
  'ai.writing': '✦ AI píše…',
  'ai.preparing': 'Pripravujem odpoveď…',
  'ai.errorLabel': 'Chyba:',
  'ai.stopGeneration': '⏸ Zastaviť generovanie',
  'ai.inputPlaceholder': 'Spýtaj sa AI na čokoľvek z tvojho profilu...',
  'ai.clearConfirm': 'Vymazať celý rozhovor a začať odznova?',
  'ai.loadingHistory': 'Načítavam históriu...',
  'ai.savedReading': '(uložený výklad)',
  'ai.offlineHint': 'Offline / bez API kľúča — zobrazuje sa posledný uložený výklad.',
  'ai.drawerLabel': 'AI asistent',
  'ai.drawerTitle': '✦ AI asistent',
  'ai.closeDrawer': 'Zavrieť AI asistenta',
  'ai.interrupted': '*(prerušené)*',
  'ai.unknownError': 'Neznáma chyba',
  'pwa.offlineMode': 'Offline režim – všetky dáta sú uložené lokálne',
  'pwa.iosInstallTitle': 'Pridať na plochu (iPhone / iPad)',
  'pwa.iosInstallDesc': 'V Safari klepnite na ikonu zdieľania (☐↑) a vyberte "Pridať na plochu".',
  'pwa.understand': 'Rozumiem',
  'pwa.installTitle': 'Pridať na plochu',
  'pwa.installDesc': 'Nainštalujte si aplikáciu pre rýchly prístup a offline použitie.',
  'pwa.newVersion': 'Nová verzia',
  'pwa.newVersionDesc': 'Stiahni najnovšiu verziu pre lepší výkon a nové funkcie.',
  'onboarding.skip': 'Preskočiť',
  'error.title': 'Niečo sa pokazilo',
  'error.description': 'Nastala neočakávaná chyba. Skúste obnoviť aplikáciu.',
  'error.showDetails': 'Zobraziť technické detaily',
  'error.restart': 'Obnoviť aplikáciu',
  'error.copyDetail': 'Skopírovať detail',
};

const en: Dict = {
  'chakras.title': 'Chakras',
  'chakras.subtitle': 'Energy centers and their state',
  'chakras.howEvaluated': 'How chakras are evaluated',
  'chakras.balanced': 'Balanced',
  'chakras.blocked': 'Blocked',
  'chakras.hyperactive': 'Hyperactive',
  'chakras.yourReading': 'Your reading — how to work with chakras',
  'chakras.scoreExplanation': 'How was this score calculated?',
  'chakras.etikoterapia': 'Ethical cause and virtue (etikoterapia)',
  'chakras.etikoterapiaBadge': 'etikoterapia',
  'theta.title': 'Theta Healing',
  'theta.subtitle': 'Limiting beliefs and their transformation',
  'modality.title': 'Complementary systems',
  'modality.subtitle': 'Ayurveda, TCM, Bach flowers, Crystals, Archetypes, Feng Shui',
  'modality.tabOverview': 'Overview',
  'modality.tabAyurveda': 'Ayurveda & TCM',
  'modality.tabBach': 'Bach flowers',
  'modality.tabCrystals': 'Crystals',
  'modality.tabArchetype': 'Archetype',
  'modality.tabFengShui': 'Feng Shui',
  'summary.title': 'Integral personality summary',
  'summary.howToRead': 'How to read this summary',
  'summary.guide': 'personalized guide',
  'summary.whoYouAre': 'Who you are at the core',
  'summary.howToFunction': 'How to operate correctly',
  'summary.whereGoing': 'Where you are heading',
  'summary.gift': 'Gift',
  'summary.shadowLabel': 'Shadow',
  'summary.integralMap': 'Integral map of being',
  'summary.sharedReading': 'Shared reading',
  'summary.loveLanguages': 'Love languages',
  'summary.currentPeriod': 'Current period',
  'ai.title': 'AI integral reading',
  'ai.notActivated': 'AI reading is not activated.',
  'ai.notActivatedDesc': 'To generate an integrative reading, enter your API key in Settings → AI.',
  'ai.apiKeyHint': 'Get your API key at console.anthropic.com',
  'ai.createReading': '✦ Create AI reading',
  'ai.readingTime': 'Calculation takes 5-15 seconds...',
  'ai.you': 'You',
  'ai.assistant': '✦ AI',
  'ai.writing': '✦ AI is writing…',
  'ai.preparing': 'Preparing response…',
  'ai.errorLabel': 'Error:',
  'ai.stopGeneration': '⏸ Stop generation',
  'ai.inputPlaceholder': 'Ask AI anything about your profile...',
  'ai.clearConfirm': 'Clear entire conversation and start fresh?',
  'ai.loadingHistory': 'Loading history...',
  'ai.savedReading': '(saved reading)',
  'ai.offlineHint': 'Offline / no API key — showing last saved reading.',
  'ai.drawerLabel': 'AI assistant',
  'ai.drawerTitle': '✦ AI assistant',
  'ai.closeDrawer': 'Close AI assistant',
  'ai.interrupted': '*(interrupted)*',
  'ai.unknownError': 'Unknown error',
  'pwa.offlineMode': 'Offline mode – all data is stored locally',
  'pwa.iosInstallTitle': 'Add to Home Screen (iPhone / iPad)',
  'pwa.iosInstallDesc': 'In Safari, tap the share icon (☐↑) and select "Add to Home Screen".',
  'pwa.understand': 'Got it',
  'pwa.installTitle': 'Add to Home Screen',
  'pwa.installDesc': 'Install the app for quick access and offline use.',
  'pwa.newVersion': 'New version',
  'pwa.newVersionDesc': 'Download the latest version for better performance and new features.',
  'onboarding.skip': 'Skip',
  'error.title': 'Something went wrong',
  'error.description': 'An unexpected error occurred. Try restarting the app.',
  'error.showDetails': 'Show technical details',
  'error.restart': 'Restart app',
  'error.copyDetail': 'Copy details',
};

export const chakrasDictionaries: Record<Language, Dict> = { sk, en };
