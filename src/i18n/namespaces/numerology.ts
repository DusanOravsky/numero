import type { Language } from '../../store/useStore';

export type NumerologyKey =
  | 'numerology.title' | 'numerology.subtitle' | 'numerology.lifePath'
  | 'numerology.grid' | 'numerology.fullPlanes' | 'numerology.emptyPlanes'
  | 'numerology.isolated' | 'numerology.tabOverview' | 'numerology.tabPlanes'
  | 'numerology.tabVibrations' | 'numerology.tabKarmic' | 'numerology.tabLove'
  | 'numerology.tabName' | 'numerology.tabArchetype' | 'numerology.tabEnneagram'
  | 'numerology.activeMethod' | 'numerology.changeMethod'
  | 'numerology.from' | 'numerology.missing'
  | 'numerology.baseDigits' | 'numerology.derivedDigits'
  | 'numerology.profileOverview' | 'numerology.k3Mission'
  | 'numerology.egoPolarity' | 'numerology.orv' | 'numerology.omv' | 'numerology.odv'
  | 'numerology.karmicDebts' | 'numerology.sharedBothMethods'
  | 'numerology.missingNumbers' | 'numerology.missingDesc'
  | 'numerology.isolatedDesc' | 'numerology.oddTension' | 'numerology.evenPassivity'
  | 'numerology.shadow' | 'numerology.bodyLabel' | 'numerology.recommendation'
  | 'numerology.lesson' | 'numerology.radarCharacter' | 'numerology.radarDevelopmental'
  | 'numerology.orvYear' | 'numerology.omvMonth' | 'numerology.odvDay'
  | 'numerology.howVibrationsWork' | 'numerology.orvExplanation'
  | 'numerology.omvExplanation' | 'numerology.odvExplanation'
  | 'numerology.yearRecommendation' | 'numerology.monthRecommendation'
  | 'numerology.allOrvOverview' | 'numerology.allOrvDesc'
  | 'numerology.current' | 'numerology.currentYear'
  | 'numerology.orvTimeline' | 'numerology.orvTimelineDesc'
  | 'numerology.monthCalendar' | 'numerology.monthCalendarDesc'
  | 'numerology.tapDayHint'
  | 'numerology.nameAnalysis' | 'numerology.nameDesc'
  | 'numerology.namePlaceholder' | 'numerology.letterBreakdown'
  | 'numerology.expressionNumber' | 'numerology.soulNumber' | 'numerology.personalityNumber'
  | 'numerology.karmicLessons' | 'numerology.keyLetters'
  | 'numerology.vowels' | 'numerology.consonants'
  | 'numerology.fullPlanesHeading' | 'numerology.emptyPlanesHeading'
  | 'numerology.enneagramTitle' | 'numerology.enneagramWing'
  | 'numerology.enneagramIntegration' | 'numerology.enneagramDisintegration'
  | 'numerology.enneagramMotivation' | 'numerology.enneagramFear'
  | 'numerology.enneagramStrengths' | 'numerology.enneagramChallenges'
  | 'numerology.enneagramGrowthPath' | 'numerology.enneagramGrowthDirections'
  | 'numerology.enneagramWings' | 'numerology.enneagramNumerologyLink'
  | 'numerology.enneagramAllTypes' | 'numerology.enneagramYourType'
  | 'numerology.enneagramYourReading'
  | 'dev.title' | 'dev.circled' | 'dev.egoPolarity'
  | 'dev.masculine' | 'dev.feminine' | 'dev.none'
  | 'dev.lifeMission' | 'dev.psychicStability'
  | 'dev.materialStability' | 'dev.childhoodDreams'
  | 'dev.calculationSteps' | 'dev.karmicCycles'
  | 'dev.gridLabel' | 'dev.clickForDetail'
  | 'dev.fromDate' | 'dev.circledLabel'
  | 'dev.notableCombinations' | 'dev.yourReading';

type Dict = Record<NumerologyKey, string>;

const sk: Dict = {
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
  'numerology.tabArchetype': 'Archetyp',
  'numerology.tabEnneagram': 'Enneagram',
  'numerology.activeMethod': 'Aktívna metóda',
  'numerology.changeMethod': 'Zmeniť metódu',
  'numerology.from': 'z',
  'numerology.missing': 'Chýbajúce',
  'numerology.baseDigits': 'Základné',
  'numerology.derivedDigits': 'Doplnkové',
  'numerology.profileOverview': 'Tvoj numerologický profil v kocke',
  'numerology.k3Mission': '★ K3 životné poslanie',
  'numerology.egoPolarity': 'Polarita ega',
  'numerology.orv': 'ORV (rok)',
  'numerology.omv': 'OMV (mesiac)',
  'numerology.odv': 'ODV (deň)',
  'numerology.karmicDebts': 'Karmické dlhy:',
  'numerology.sharedBothMethods': 'Spoločné pre obe metódy',
  'numerology.missingNumbers': 'Chýbajúce čísla v mriežke',
  'numerology.missingDesc': 'Čísla, ktoré nemáte v mriežke, predstavujú energie, ktoré ste si v minulých životoch dostatočne nerozvíjali. Sú to vaše karmické lekcie — oblasti pre vedomý rast.',
  'numerology.isolatedDesc': 'Izolované číslo nemá priameho suseda v mriežke (horizontálne, vertikálne ani diagonálne). Jeho energia je ťažšie dostupná — prejavuje sa nepredvídateľne alebo v extrémoch.',
  'numerology.oddTension': 'Nepárne – napätie, agresivita',
  'numerology.evenPassivity': 'Párne – pasivita, utiahnutosť',
  'numerology.shadow': 'Tieň',
  'numerology.bodyLabel': 'Telo',
  'numerology.recommendation': 'Odporúčanie',
  'numerology.lesson': 'Lekcia',
  'numerology.radarCharacter': 'Radar 9 energií — Charakterová mriežka',
  'numerology.radarDevelopmental': 'Radar 9 energií — Vývojová mriežka',
  'numerology.orvYear': 'Osobná ročná vibrácia',
  'numerology.omvMonth': 'Osobná mesačná vibrácia',
  'numerology.odvDay': 'Osobná denná vibrácia',
  'numerology.howVibrationsWork': 'Ako fungujú vibrácie',
  'numerology.orvExplanation': 'ORV sa počíta od vašich posledných narodenín do ďalších. Definuje hlavnú tému roka.',
  'numerology.omvExplanation': 'OMV = ORV + aktuálny mesiac. Ukazuje mesačnú podtému.',
  'numerology.odvExplanation': 'ODV = ORV + mesiac + deň. Denná energia a najlepší prístup k dnešnému dňu.',
  'numerology.yearRecommendation': 'Odporúčanie pre tento rok',
  'numerology.monthRecommendation': 'Odporúčanie pre tento mesiac',
  'numerology.allOrvOverview': 'Prehľad všetkých ORV (1-9)',
  'numerology.allOrvDesc': 'Každý rok sa nesie v jednej z 9 vibrácií. Tu je prehľad všetkých ORV cyklov.',
  'numerology.current': 'Aktuálny',
  'numerology.currentYear': 'Aktuálny rok',
  'numerology.orvTimeline': 'ORV Timeline',
  'numerology.orvTimelineDesc': 'Vaša cesta cez 9-ročné cykly — minulosť a budúcnosť.',
  'numerology.monthCalendar': 'Mesačný kalendár ODV',
  'numerology.monthCalendarDesc': 'Prehľad denných energií pre celý mesiac.',
  'numerology.tapDayHint': 'Klepni na deň pre detail...',
  'numerology.nameAnalysis': 'Numerológia mena',
  'numerology.nameDesc': 'Zadajte celé meno (krstné + priezvisko) pre výpočet čísla výrazu, duše a osobnosti.',
  'numerology.namePlaceholder': 'Meno a priezvisko',
  'numerology.letterBreakdown': 'Rozklad písmen',
  'numerology.expressionNumber': 'Číslo výrazu',
  'numerology.soulNumber': 'Číslo duše',
  'numerology.personalityNumber': 'Číslo osobnosti',
  'numerology.karmicLessons': 'Karmické lekcie',
  'numerology.keyLetters': 'Kľúčové písmená',
  'numerology.vowels': 'Samohlásky (duša)',
  'numerology.consonants': 'Spoluhlásky (osobnosť)',
  'numerology.fullPlanesHeading': 'Plné roviny – vaše vrodené schopnosti',
  'numerology.emptyPlanesHeading': 'Prázdne roviny – oblasti rastu',
  'numerology.enneagramTitle': 'Enneagram',
  'numerology.enneagramWing': 'Krídlo',
  'numerology.enneagramIntegration': 'Integrácia (rast)',
  'numerology.enneagramDisintegration': 'Stres (dezintegrácia)',
  'numerology.enneagramMotivation': 'Základná motivácia',
  'numerology.enneagramFear': 'Základný strach',
  'numerology.enneagramStrengths': 'Silné stránky',
  'numerology.enneagramChallenges': 'Výzvy',
  'numerology.enneagramGrowthPath': 'Praktická cesta rastu',
  'numerology.enneagramGrowthDirections': 'Smery rastu a stresu',
  'numerology.enneagramWings': 'Krídla',
  'numerology.enneagramNumerologyLink': 'Prepojenie s numerológiou',
  'numerology.enneagramAllTypes': 'Prehľad všetkých 9 enneagram typov',
  'numerology.enneagramYourType': 'Tvoj typ',
  'numerology.enneagramYourReading': 'Tvoje čítanie — ako pracovať s Archetypom a Enneagramom',
  'dev.title': 'Vývojová mriežka',
  'dev.circled': 'Karmické cykly (zakrúžkované čísla)',
  'dev.egoPolarity': 'Polarita ega',
  'dev.masculine': 'Mužské ego',
  'dev.feminine': 'Ženské ego',
  'dev.none': 'Bez polarity',
  'dev.lifeMission': 'Životné poslanie (K3)',
  'dev.psychicStability': 'Psychická stabilita (K1)',
  'dev.materialStability': 'Materiálna stabilita (K2)',
  'dev.childhoodDreams': 'Detské sny (K4)',
  'dev.calculationSteps': 'Postup výpočtu',
  'dev.karmicCycles': 'Karmické cykly (zakrúžkované čísla)',
  'dev.gridLabel': 'Mriežka',
  'dev.clickForDetail': 'Klikni na číslo pre detail',
  'dev.fromDate': 'Z dátumu',
  'dev.circledLabel': 'Zakrúžkované',
  'dev.notableCombinations': 'Pozoruhodné kombinácie čísel',
  'dev.yourReading': 'Tvoje čítanie — ako pracovať s číslami',
};

const en: Dict = {
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
  'numerology.tabArchetype': 'Archetype',
  'numerology.tabEnneagram': 'Enneagram',
  'numerology.activeMethod': 'Active method',
  'numerology.changeMethod': 'Change method',
  'numerology.from': 'of',
  'numerology.missing': 'Missing',
  'numerology.baseDigits': 'Base',
  'numerology.derivedDigits': 'Derived',
  'numerology.profileOverview': 'Your numerological profile at a glance',
  'numerology.k3Mission': '★ K3 life mission',
  'numerology.egoPolarity': 'Ego polarity',
  'numerology.orv': 'PYV (year)',
  'numerology.omv': 'PMV (month)',
  'numerology.odv': 'PDV (day)',
  'numerology.karmicDebts': 'Karmic debts:',
  'numerology.sharedBothMethods': 'Shared across both methods',
  'numerology.missingNumbers': 'Missing numbers in the grid',
  'numerology.missingDesc': 'Numbers absent from your grid represent energies you have not sufficiently developed in past lives. They are your karmic lessons — areas for conscious growth.',
  'numerology.isolatedDesc': 'An isolated number has no direct neighbor in the grid (horizontally, vertically, or diagonally). Its energy is harder to access — it manifests unpredictably or in extremes.',
  'numerology.oddTension': 'Odd — tension, aggression',
  'numerology.evenPassivity': 'Even — passivity, withdrawal',
  'numerology.shadow': 'Shadow',
  'numerology.bodyLabel': 'Body',
  'numerology.recommendation': 'Recommendation',
  'numerology.lesson': 'Lesson',
  'numerology.radarCharacter': 'Radar of 9 energies — Characterological grid',
  'numerology.radarDevelopmental': 'Radar of 9 energies — Developmental grid',
  'numerology.orvYear': 'Personal year vibration',
  'numerology.omvMonth': 'Personal month vibration',
  'numerology.odvDay': 'Personal day vibration',
  'numerology.howVibrationsWork': 'How vibrations work',
  'numerology.orvExplanation': 'PYV is calculated from your last birthday to the next. It defines the main theme of the year.',
  'numerology.omvExplanation': 'PMV = PYV + current month. Shows the monthly sub-theme.',
  'numerology.odvExplanation': 'PDV = PYV + month + day. Daily energy and the best approach to today.',
  'numerology.yearRecommendation': 'Recommendation for this year',
  'numerology.monthRecommendation': 'Recommendation for this month',
  'numerology.allOrvOverview': 'Overview of all PYV (1-9)',
  'numerology.allOrvDesc': 'Every year carries one of 9 vibrations. Here is an overview of all PYV cycles.',
  'numerology.current': 'Current',
  'numerology.currentYear': 'Current year',
  'numerology.orvTimeline': 'PYV Timeline',
  'numerology.orvTimelineDesc': 'Your journey through 9-year cycles — past and future.',
  'numerology.monthCalendar': 'Monthly PDV calendar',
  'numerology.monthCalendarDesc': 'Overview of daily energies for the entire month.',
  'numerology.tapDayHint': 'Tap a day for details...',
  'numerology.nameAnalysis': 'Name numerology',
  'numerology.nameDesc': 'Enter your full name (first + last) to calculate expression, soul and personality numbers.',
  'numerology.namePlaceholder': 'First and last name',
  'numerology.letterBreakdown': 'Letter breakdown',
  'numerology.expressionNumber': 'Expression number',
  'numerology.soulNumber': 'Soul number',
  'numerology.personalityNumber': 'Personality number',
  'numerology.karmicLessons': 'Karmic lessons',
  'numerology.keyLetters': 'Key letters',
  'numerology.vowels': 'Vowels (soul)',
  'numerology.consonants': 'Consonants (personality)',
  'numerology.fullPlanesHeading': 'Full planes — your innate abilities',
  'numerology.emptyPlanesHeading': 'Empty planes — areas of growth',
  'numerology.enneagramTitle': 'Enneagram',
  'numerology.enneagramWing': 'Wing',
  'numerology.enneagramIntegration': 'Integration (growth)',
  'numerology.enneagramDisintegration': 'Stress (disintegration)',
  'numerology.enneagramMotivation': 'Core motivation',
  'numerology.enneagramFear': 'Core fear',
  'numerology.enneagramStrengths': 'Strengths',
  'numerology.enneagramChallenges': 'Challenges',
  'numerology.enneagramGrowthPath': 'Practical growth path',
  'numerology.enneagramGrowthDirections': 'Growth and stress directions',
  'numerology.enneagramWings': 'Wings',
  'numerology.enneagramNumerologyLink': 'Link to numerology',
  'numerology.enneagramAllTypes': 'Overview of all 9 enneagram types',
  'numerology.enneagramYourType': 'Your type',
  'numerology.enneagramYourReading': 'Your reading — working with Archetype and Enneagram',
  'dev.title': 'Developmental grid',
  'dev.circled': 'Karmic cycles (circled numbers)',
  'dev.egoPolarity': 'Ego polarity',
  'dev.masculine': 'Masculine ego',
  'dev.feminine': 'Feminine ego',
  'dev.none': 'No polarity',
  'dev.lifeMission': 'Life mission (K3)',
  'dev.psychicStability': 'Psychic stability (K1)',
  'dev.materialStability': 'Material stability (K2)',
  'dev.childhoodDreams': 'Childhood dreams (K4)',
  'dev.calculationSteps': 'Calculation steps',
  'dev.karmicCycles': 'Karmic cycles (circled numbers)',
  'dev.gridLabel': 'Grid',
  'dev.clickForDetail': 'Click a number for details',
  'dev.fromDate': 'From date',
  'dev.circledLabel': 'Circled',
  'dev.notableCombinations': 'Notable number combinations',
  'dev.yourReading': 'Your reading — working with numbers',
};

export const numerologyDictionaries: Record<Language, Dict> = { sk, en };
