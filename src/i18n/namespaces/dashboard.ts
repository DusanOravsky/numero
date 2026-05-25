import type { Language } from '../../store/useStore';

export type DashboardKey =
  | 'dashboard.welcome' | 'dashboard.universalDay' | 'dashboard.todayAffirmation'
  | 'dashboard.todayRitual' | 'dashboard.morning' | 'dashboard.evening' | 'dashboard.body'
  | 'dashboard.startJourney' | 'dashboard.appTitle' | 'dashboard.appSubtitle'
  | 'dashboard.todayDo' | 'dashboard.transitsToday'
  | 'dashboard.morningBrief' | 'dashboard.lastClient'
  | 'dashboard.hideLastClient' | 'dashboard.biorhythm'
  | 'dashboard.physical' | 'dashboard.emotional' | 'dashboard.intellectual'
  | 'dashboard.crystalOfDay' | 'dashboard.todayEnergy'
  | 'dashboard.yearLabel' | 'dashboard.enneagramGrowth'
  | 'dashboard.virtueOfDay' | 'dashboard.eveningLabel'
  | 'dashboard.todayMantra' | 'dashboard.todayQuote'
  | 'dashboard.tarotOfDay' | 'dashboard.tarotMeaning' | 'dashboard.tarotShadow'
  | 'dashboard.tarotAdvice' | 'dashboard.tarotFullReading' | 'dashboard.monthCard'
  | 'dashboard.detailsSection' | 'dashboard.dailyEnergyDetail'
  | 'dashboard.monthlyEnergyDetail' | 'dashboard.energyCalendar'
  | 'dashboard.deeperProfile' | 'dashboard.creative' | 'dashboard.work'
  | 'dashboard.heart' | 'dashboard.inner'
  | 'dashboard.odvLabels1' | 'dashboard.odvLabels2' | 'dashboard.odvLabels3'
  | 'dashboard.odvLabels4' | 'dashboard.odvLabels5' | 'dashboard.odvLabels6'
  | 'dashboard.odvLabels7' | 'dashboard.odvLabels8' | 'dashboard.odvLabels9'
  | 'dashboard.bioTipHigh' | 'dashboard.bioTipLow' | 'dashboard.bioTipCritical'
  | 'dashboard.seasonSpring' | 'dashboard.seasonSummer'
  | 'dashboard.seasonAutumn' | 'dashboard.seasonWinter';

type Dict = Record<DashboardKey, string>;

const sk: Dict = {
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
  'dashboard.todayDo': 'Jedna vec na dnes',
  'dashboard.transitsToday': 'Astro tranzity dnes',
  'dashboard.morningBrief': 'Ranný brief',
  'dashboard.lastClient': 'Posledný klient',
  'dashboard.hideLastClient': 'Skryť posledného klienta',
  'dashboard.biorhythm': 'Biorytmus',
  'dashboard.physical': 'Fyzický',
  'dashboard.emotional': 'Emocionálny',
  'dashboard.intellectual': 'Intelektuálny',
  'dashboard.crystalOfDay': 'Kryštál dňa',
  'dashboard.todayEnergy': 'Dnešná energia',
  'dashboard.yearLabel': 'Rok:',
  'dashboard.enneagramGrowth': 'Enneagram: smeruj k',
  'dashboard.virtueOfDay': 'Cnosť dňa:',
  'dashboard.eveningLabel': 'Večer:',
  'dashboard.todayMantra': 'Dnešná mantra',
  'dashboard.todayQuote': 'Dnešný citát',
  'dashboard.tarotOfDay': 'Tarot dňa:',
  'dashboard.tarotMeaning': 'Význam:',
  'dashboard.tarotShadow': 'Tieň:',
  'dashboard.tarotAdvice': 'Rada:',
  'dashboard.tarotFullReading': 'Plný výklad karty',
  'dashboard.monthCard': 'Karta mesiaca:',
  'dashboard.detailsSection': 'Detaily a inšpirácie',
  'dashboard.dailyEnergyDetail': 'Detail dennej energie',
  'dashboard.monthlyEnergyDetail': 'Detail mesačnej energie',
  'dashboard.energyCalendar': 'Kalendár energie',
  'dashboard.deeperProfile': 'Hlbší profil',
  'dashboard.creative': 'Tvorivé (1, 3, 8)',
  'dashboard.work': 'Práca (4, 9)',
  'dashboard.heart': 'Srdce (2, 6)',
  'dashboard.inner': 'Vnútro (5, 7)',
  'dashboard.odvLabels1': 'Začiatky',
  'dashboard.odvLabels2': 'Vzťahy',
  'dashboard.odvLabels3': 'Kreativita',
  'dashboard.odvLabels4': 'Stabilita',
  'dashboard.odvLabels5': 'Zmena',
  'dashboard.odvLabels6': 'Harmónia',
  'dashboard.odvLabels7': 'Reflexia',
  'dashboard.odvLabels8': 'Sila',
  'dashboard.odvLabels9': 'Uzatváranie',
  'dashboard.bioTipHigh': 'Deň plný energie — využi ho naplno.',
  'dashboard.bioTipLow': 'Oddychový deň — šetri silami.',
  'dashboard.bioTipCritical': 'Kritický deň — buď opatrný a pozorný.',
  'dashboard.seasonSpring': 'Jarná energia prebúdzania',
  'dashboard.seasonSummer': 'Letná energia plnosti',
  'dashboard.seasonAutumn': 'Jesenná energia zberu',
  'dashboard.seasonWinter': 'Zimná energia pokoja',
};

const en: Dict = {
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
  'dashboard.todayDo': 'One thing to do today',
  'dashboard.transitsToday': 'Astro transits today',
  'dashboard.morningBrief': 'Morning brief',
  'dashboard.lastClient': 'Last client',
  'dashboard.hideLastClient': 'Hide last client',
  'dashboard.biorhythm': 'Biorhythm',
  'dashboard.physical': 'Physical',
  'dashboard.emotional': 'Emotional',
  'dashboard.intellectual': 'Intellectual',
  'dashboard.crystalOfDay': 'Crystal of the day',
  'dashboard.todayEnergy': "Today's energy",
  'dashboard.yearLabel': 'Year:',
  'dashboard.enneagramGrowth': 'Enneagram: grow toward',
  'dashboard.virtueOfDay': 'Virtue of the day:',
  'dashboard.eveningLabel': 'Evening:',
  'dashboard.todayMantra': "Today's mantra",
  'dashboard.todayQuote': "Today's quote",
  'dashboard.tarotOfDay': 'Tarot of the day:',
  'dashboard.tarotMeaning': 'Meaning:',
  'dashboard.tarotShadow': 'Shadow:',
  'dashboard.tarotAdvice': 'Advice:',
  'dashboard.tarotFullReading': 'Full card reading',
  'dashboard.monthCard': 'Card of the month:',
  'dashboard.detailsSection': 'Details & inspirations',
  'dashboard.dailyEnergyDetail': 'Daily energy detail',
  'dashboard.monthlyEnergyDetail': 'Monthly energy detail',
  'dashboard.energyCalendar': 'Energy calendar',
  'dashboard.deeperProfile': 'Deeper profile',
  'dashboard.creative': 'Creative (1, 3, 8)',
  'dashboard.work': 'Work (4, 9)',
  'dashboard.heart': 'Heart (2, 6)',
  'dashboard.inner': 'Inner (5, 7)',
  'dashboard.odvLabels1': 'Beginnings',
  'dashboard.odvLabels2': 'Relationships',
  'dashboard.odvLabels3': 'Creativity',
  'dashboard.odvLabels4': 'Stability',
  'dashboard.odvLabels5': 'Change',
  'dashboard.odvLabels6': 'Harmony',
  'dashboard.odvLabels7': 'Reflection',
  'dashboard.odvLabels8': 'Power',
  'dashboard.odvLabels9': 'Completion',
  'dashboard.bioTipHigh': 'High energy day — make the most of it.',
  'dashboard.bioTipLow': 'Rest day — conserve your energy.',
  'dashboard.bioTipCritical': 'Critical day — be careful and mindful.',
  'dashboard.seasonSpring': 'Spring awakening energy',
  'dashboard.seasonSummer': 'Summer fullness energy',
  'dashboard.seasonAutumn': 'Autumn harvest energy',
  'dashboard.seasonWinter': 'Winter stillness energy',
};

export const dashboardDictionaries: Record<Language, Dict> = { sk, en };
