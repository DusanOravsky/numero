import type { Language } from '../store/useStore';

interface OdvDescription {
  title: string;
  theme: string;
  advice: string;
  keywords: string[];
}

const sk: Record<number, OdvDescription> = {
  1: {
    title: 'Deň nových začiatkov',
    theme: 'Iniciatíva, odvaha, prvý krok',
    advice: 'Dnes je ideálny čas začať niečo nové — projekt, rozhovor, rozhodnutie. Neodkladajte na zajtra to, čo dnes cítite.',
    keywords: ['začiatok', 'odvaha', 'akcia', 'iniciatíva', 'rozhodnutie'],
  },
  2: {
    title: 'Deň spolupráce a trpezlivosti',
    theme: 'Vzťahy, diplomacia, počúvanie',
    advice: 'Spomaľte. Dnes je dôležitejšie počúvať než hovoriť. Venujte pozornosť vzťahom a drobným detailom. Hľadajte spojencov.',
    keywords: ['spolupráca', 'trpezlivosť', 'intuícia', 'vzťahy', 'jemnosť'],
  },
  3: {
    title: 'Deň tvorivosti a komunikácie',
    theme: 'Sebavyjadrenie, radosť, zdieľanie',
    advice: 'Tvorte, hovorte, zdieľajte. Dnes je energia ľahká a podporuje kreativitu. Napíšte správu, zavolajte, nakreslite. Buďte viditeľní.',
    keywords: ['kreativita', 'komunikácia', 'radosť', 'ľahkosť', 'zdieľanie'],
  },
  4: {
    title: 'Deň práce a poriadku',
    theme: 'Disciplína, organizácia, dokončenie',
    advice: 'Praktický deň. Dokončite rozrobenú vec, upratajte, vyriešte papierovačky. Malé kroky s disciplínou dnes prinášajú veľké výsledky.',
    keywords: ['disciplína', 'poriadok', 'dokončenie', 'práca', 'stabilita'],
  },
  5: {
    title: 'Deň zmien a slobody',
    theme: 'Flexibilita, nečakané, dobrodružstvo',
    advice: 'Očakávajte nečakané — a privítajte to. Dnes je deň na spontánnosť. Zmeňte rutinu, skúste novú cestu, povedzte áno.',
    keywords: ['zmena', 'sloboda', 'spontánnosť', 'adaptabilita', 'energia'],
  },
  6: {
    title: 'Deň lásky a harmónie',
    theme: 'Rodina, starostlivosť, krása',
    advice: 'Venujte sa blízkym. Vytvorte niečo krásne — v priestore, vo vzťahu, v sebe. Ak je niečo v disharmonii, dnes je čas to vyladiť.',
    keywords: ['láska', 'harmónia', 'starostlivosť', 'krása', 'domov'],
  },
  7: {
    title: 'Deň vnútorného ticha',
    theme: 'Introspekcia, reflexia, oddych',
    advice: 'Stiahnite sa dovnútra. Dnes nie je deň na veľké akcie navonok — skôr na premýšľanie, čítanie, meditáciu. Počúvajte svoju vnútornú múdrosť.',
    keywords: ['introspekcia', 'ticho', 'reflexia', 'múdrosť', 'oddych'],
  },
  8: {
    title: 'Deň manifestácie a sily',
    theme: 'Autorita, výsledky, odvaha konať',
    advice: 'Konajte s autoritou. Dnes je energia manifestácie — žiadajte o to čo potrebujete, prezentujte sa, robte finančné rozhodnutia.',
    keywords: ['manifestácia', 'sila', 'autorita', 'výsledky', 'odvaha'],
  },
  9: {
    title: 'Deň uzatvárania a odpúšťania',
    theme: 'Dokončenie, pustenie, súcit',
    advice: 'Pustite to, čo vás ťaží. Dnes je deň na dokončenie, odpustenie a uvoľnenie. Neštartujte nové — uzavrite staré s vďačnosťou.',
    keywords: ['uzatváranie', 'odpustenie', 'dokončenie', 'súcit', 'uvoľnenie'],
  },
};

const en: Record<number, OdvDescription> = {
  1: {
    title: 'Day of new beginnings',
    theme: 'Initiative, courage, first step',
    advice: 'Today is the ideal time to start something new — a project, conversation, decision. Don\'t put off until tomorrow what you feel today.',
    keywords: ['beginning', 'courage', 'action', 'initiative', 'decision'],
  },
  2: {
    title: 'Day of cooperation and patience',
    theme: 'Relationships, diplomacy, listening',
    advice: 'Slow down. Today it\'s more important to listen than to speak. Pay attention to relationships and small details. Seek allies.',
    keywords: ['cooperation', 'patience', 'intuition', 'relationships', 'gentleness'],
  },
  3: {
    title: 'Day of creativity and communication',
    theme: 'Self-expression, joy, sharing',
    advice: 'Create, speak, share. Today\'s energy is light and supports creativity. Write a message, call, draw. Be visible.',
    keywords: ['creativity', 'communication', 'joy', 'lightness', 'sharing'],
  },
  4: {
    title: 'Day of work and order',
    theme: 'Discipline, organization, completion',
    advice: 'A practical day. Finish something in progress, tidy up, sort out paperwork. Small disciplined steps bring big results today.',
    keywords: ['discipline', 'order', 'completion', 'work', 'stability'],
  },
  5: {
    title: 'Day of change and freedom',
    theme: 'Flexibility, unexpected, adventure',
    advice: 'Expect the unexpected — and welcome it. Today is for spontaneity. Change your routine, try a new path, say yes.',
    keywords: ['change', 'freedom', 'spontaneity', 'adaptability', 'energy'],
  },
  6: {
    title: 'Day of love and harmony',
    theme: 'Family, care, beauty',
    advice: 'Devote yourself to loved ones. Create something beautiful — in space, in a relationship, in yourself. If something is in disharmony, today is the time to tune it.',
    keywords: ['love', 'harmony', 'care', 'beauty', 'home'],
  },
  7: {
    title: 'Day of inner silence',
    theme: 'Introspection, reflection, rest',
    advice: 'Withdraw inward. Today is not for big outward actions — rather for thinking, reading, meditation. Listen to your inner wisdom.',
    keywords: ['introspection', 'silence', 'reflection', 'wisdom', 'rest'],
  },
  8: {
    title: 'Day of manifestation and power',
    theme: 'Authority, results, courage to act',
    advice: 'Act with authority. Today carries manifestation energy — ask for what you need, present yourself, make financial decisions.',
    keywords: ['manifestation', 'power', 'authority', 'results', 'courage'],
  },
  9: {
    title: 'Day of closure and forgiveness',
    theme: 'Completion, letting go, compassion',
    advice: 'Let go of what weighs you down. Today is for finishing, forgiving, and releasing. Don\'t start new things — close the old with gratitude.',
    keywords: ['closure', 'forgiveness', 'completion', 'compassion', 'release'],
  },
};

const dictionaries: Record<Language, Record<number, OdvDescription>> = { sk, en };

export function getOdvDescription(odv: number, lang: Language = 'sk'): OdvDescription {
  return dictionaries[lang]?.[odv] ?? dictionaries.sk[odv];
}

// Backward compat — deprecated, use getOdvDescription(odv, lang) instead
export const odvDescriptions = sk;
