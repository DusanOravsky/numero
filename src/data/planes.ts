import type { Language } from '../store/useStore';

interface FullPlaneInfo {
  description: string;
  gift: string;
  recommendation: string;
}

interface EmptyPlaneInfo {
  description: string;
  lesson: string;
  recommendation: string;
}

interface PlanesData {
  full: Record<string, FullPlaneInfo>;
  empty: Record<string, EmptyPlaneInfo>;
}

const sk: PlanesData = {
  full: {
    "1-2-3 Myslenie": {
      description: "Rovnina intelektu. Máte silnú schopnosť analyticky myslieť, logicky uvažovať a spracovávať informácie.",
      gift: "Jasná myseľ, schopnosť analýzy a pochopenia",
      recommendation: "Využívajte svoju mentálnu silu, ale nezabudnite na emócie a telo"
    },
    "4-5-6 Vytrvalosť": {
      description: "Rovnina vôle. Máte prirodzenú vytrvalosť, disciplínu a schopnosť dotiahnuť veci do konca.",
      gift: "Neúnavná sila dokončovať, čo začnete",
      recommendation: "Vaša vytrvalosť je dar – ale dovoľte si aj oddych"
    },
    "7-8-9 Energia": {
      description: "Rovnina akcie a energie. Máte silnú životnú energiu, aktivitu a schopnosť konať.",
      gift: "Dynamická životná sila a schopnosť pôsobiť",
      recommendation: "Smerujte svoju energiu vedome – bez smeru sa môže rozptýliť"
    },
    "1-4-7 Zručnosti": {
      description: "Rovnina praktických schopností. Máte talent pre manuálnu zručnosť, technické riešenia a praktickú inteligenciu.",
      gift: "Šikovnosť rúk a praktická inteligencia",
      recommendation: "Vaše ruky a myseľ pracujú spolu – tvorte niečo hmatateľné"
    },
    "2-5-8 Vášeň": {
      description: "Rovnina emočnej sily. Máte hlbokú vášeň, emocionálnu intenzitu a schopnosť hlboko prežívať.",
      gift: "Intenzita prežívania a schopnosť motivovať seba aj iných",
      recommendation: "Vaša vášeň je motor – smerujte ju k tomu, čo vám dáva zmysel"
    },
    "3-6-9 Empatia": {
      description: "Rovnina citlivosti a prepojenia. Máte výnimočnú schopnosť cítiť druhých, chápať ich potreby a vytvárať hlboké vzťahy.",
      gift: "Dar empatie – cítite, čo iní nevyslovili",
      recommendation: "Chráňte svoju energiu – empatia bez hraníc vyčerpáva"
    },
    "1-5-9 Odhodlanie": {
      description: "Rovnina vnútornej sily. Máte železnú vôľu, odhodlanie a schopnosť prekonať prekážky.",
      gift: "Neochvejná vnútorná sila a vytrvalosť",
      recommendation: "Vaše odhodlanie je vzácne – uistite sa, že smeruje k správnym cieľom"
    },
    "3-5-7 Pochopenie": {
      description: "Rovnina múdrosti. Máte hlbokú schopnosť chápať podstatu vecí, vidieť za povrch a rozumieť zložitým vzorcom.",
      gift: "Hĺbka pochopenia a intuitívna múdrosť",
      recommendation: "Zdieľajte svoju múdrosť – svet ju potrebuje"
    }
  },
  empty: {
    "1-4-7 Postreh": {
      description: "Bez tejto roviny vám môžu unikať praktické detaily. Vaša pozornosť sa zameriava viac na abstraktné než konkrétne.",
      lesson: "Učíte sa všímať si detaily a byť viac prítomní v materiálnom svete",
      recommendation: "Pravidelne sa zastavte a všímajte si, čo je priamo pred vami"
    },
    "2-5-8 Senzitivita": {
      description: "Bez tejto roviny môžete mať výzvy s emocionálnou citlivosťou. Pocity nie sú vždy jasné.",
      lesson: "Učíte sa cítiť a dôverovať emóciám",
      recommendation: "Denný check-in: Čo cítim práve teraz? Kde v tele to cítim?"
    },
    "3-6-9 Inšpirácia": {
      description: "Bez tejto roviny môžete hľadať inšpiráciu a kreativitu vonku namiesto vnútri.",
      lesson: "Učíte sa nachádzať tvorivú iskru vo vlastnom vnútri",
      recommendation: "Doprajte si čas na umenie, prírodu a krásu – živia vašu dušu"
    },
    "4-5-6 Saturn": {
      description: "Saturnovská rovina učí disciplíne cez obmedzenia. Bez nej sa učíte štruktúre.",
      lesson: "Učíte sa trpezlivosti, vytrvalosti a sebadisciplíne",
      recommendation: "Malé denné návyky budujú veľké výsledky. Konzistencia je kľúč."
    },
    "7-8-9 Oddanosť veci": {
      description: "Bez tejto roviny môžete mať výzvy so zameraním na dlhodobé ciele.",
      lesson: "Učíte sa oddanosti niečomu väčšiemu než ste vy sami",
      recommendation: "Nájdite jednu vec, ktorej sa oddáte celým srdcom"
    },
    "1-5-9 Rozvoj": {
      description: "Bez roviny rozvoja sa osobný rast deje menej lineárne – viac cez skoky a prebudenia.",
      lesson: "Učíte sa trpezlivosti na vlastnej ceste rastu",
      recommendation: "Nezrovnávajte sa s inými – vaša cesta je unikátna a správna"
    },
    "3-5-7 Vízia": {
      description: "Bez roviny vízie môžete mať výzvy s dlhodobým plánovaním a videním za horizont.",
      lesson: "Učíte sa dôverovať procesu aj bez jasnej mapy",
      recommendation: "Dôverujte intuícii – vaša cesta sa odhaľuje krok za krokom"
    }
  }
};

const en: PlanesData = {
  full: {
    "1-2-3 Myslenie": {
      description: "The plane of intellect. You have a strong ability to think analytically, reason logically, and process information.",
      gift: "A clear mind, capacity for analysis and understanding",
      recommendation: "Use your mental strength, but don't forget about emotions and body"
    },
    "4-5-6 Vytrvalosť": {
      description: "The plane of willpower. You have natural persistence, discipline, and the ability to see things through to the end.",
      gift: "Tireless strength to finish what you start",
      recommendation: "Your persistence is a gift — but allow yourself rest too"
    },
    "7-8-9 Energia": {
      description: "The plane of action and energy. You have strong life energy, activity, and the ability to act.",
      gift: "Dynamic life force and the ability to make an impact",
      recommendation: "Direct your energy consciously — without direction it can scatter"
    },
    "1-4-7 Zručnosti": {
      description: "The plane of practical abilities. You have a talent for manual dexterity, technical solutions, and practical intelligence.",
      gift: "Skillful hands and practical intelligence",
      recommendation: "Your hands and mind work together — create something tangible"
    },
    "2-5-8 Vášeň": {
      description: "The plane of emotional strength. You have deep passion, emotional intensity, and the ability to feel deeply.",
      gift: "Intensity of experience and the ability to motivate yourself and others",
      recommendation: "Your passion is an engine — direct it toward what gives you meaning"
    },
    "3-6-9 Empatia": {
      description: "The plane of sensitivity and connection. You have an exceptional ability to feel others, understand their needs, and create deep relationships.",
      gift: "The gift of empathy — you sense what others leave unspoken",
      recommendation: "Protect your energy — empathy without boundaries is exhausting"
    },
    "1-5-9 Odhodlanie": {
      description: "The plane of inner strength. You have an iron will, determination, and the ability to overcome obstacles.",
      gift: "Unwavering inner strength and perseverance",
      recommendation: "Your determination is rare — make sure it aims at the right goals"
    },
    "3-5-7 Pochopenie": {
      description: "The plane of wisdom. You have a deep ability to grasp the essence of things, see beyond the surface, and understand complex patterns.",
      gift: "Depth of understanding and intuitive wisdom",
      recommendation: "Share your wisdom — the world needs it"
    }
  },
  empty: {
    "1-4-7 Postreh": {
      description: "Without this plane, practical details may escape you. Your attention focuses more on the abstract than the concrete.",
      lesson: "You are learning to notice details and be more present in the material world",
      recommendation: "Regularly stop and notice what is right in front of you"
    },
    "2-5-8 Senzitivita": {
      description: "Without this plane, you may have challenges with emotional sensitivity. Feelings are not always clear.",
      lesson: "You are learning to feel and trust emotions",
      recommendation: "Daily check-in: What am I feeling right now? Where in my body do I feel it?"
    },
    "3-6-9 Inšpirácia": {
      description: "Without this plane, you may seek inspiration and creativity externally rather than within.",
      lesson: "You are learning to find the creative spark within yourself",
      recommendation: "Give yourself time for art, nature, and beauty — they nourish your soul"
    },
    "4-5-6 Saturn": {
      description: "The Saturn plane teaches discipline through limitations. Without it, you are learning structure.",
      lesson: "You are learning patience, perseverance, and self-discipline",
      recommendation: "Small daily habits build big results. Consistency is the key."
    },
    "7-8-9 Oddanosť veci": {
      description: "Without this plane, you may have challenges focusing on long-term goals.",
      lesson: "You are learning devotion to something greater than yourself",
      recommendation: "Find one thing to which you devote yourself wholeheartedly"
    },
    "1-5-9 Rozvoj": {
      description: "Without the plane of development, personal growth happens less linearly — more through leaps and awakenings.",
      lesson: "You are learning patience on your own path of growth",
      recommendation: "Don't compare yourself to others — your path is unique and right"
    },
    "3-5-7 Vízia": {
      description: "Without the plane of vision, you may have challenges with long-term planning and seeing beyond the horizon.",
      lesson: "You are learning to trust the process even without a clear map",
      recommendation: "Trust your intuition — your path reveals itself step by step"
    }
  }
};

const planeNameMap: Record<Language, Record<string, string>> = {
  sk: {
    "1-2-3 Myslenie": "1-2-3 Myslenie",
    "4-5-6 Vytrvalosť": "4-5-6 Vytrvalosť",
    "7-8-9 Energia": "7-8-9 Energia",
    "1-4-7 Zručnosti": "1-4-7 Zručnosti",
    "2-5-8 Vášeň": "2-5-8 Vášeň",
    "3-6-9 Empatia": "3-6-9 Empatia",
    "1-5-9 Odhodlanie": "1-5-9 Odhodlanie",
    "3-5-7 Pochopenie": "3-5-7 Pochopenie",
    "1-4-7 Postreh": "1-4-7 Postreh",
    "2-5-8 Senzitivita": "2-5-8 Senzitivita",
    "3-6-9 Inšpirácia": "3-6-9 Inšpirácia",
    "4-5-6 Saturn": "4-5-6 Saturn",
    "7-8-9 Oddanosť veci": "7-8-9 Oddanosť veci",
    "1-5-9 Rozvoj": "1-5-9 Rozvoj",
    "3-5-7 Vízia": "3-5-7 Vízia"
  },
  en: {
    "1-2-3 Myslenie": "1-2-3 Thinking",
    "4-5-6 Vytrvalosť": "4-5-6 Persistence",
    "7-8-9 Energia": "7-8-9 Energy",
    "1-4-7 Zručnosti": "1-4-7 Practicality",
    "2-5-8 Vášeň": "2-5-8 Passion",
    "3-6-9 Empatia": "3-6-9 Empathy",
    "1-5-9 Odhodlanie": "1-5-9 Determination",
    "3-5-7 Pochopenie": "3-5-7 Understanding",
    "1-4-7 Postreh": "1-4-7 Perception",
    "2-5-8 Senzitivita": "2-5-8 Sensitivity",
    "3-6-9 Inšpirácia": "3-6-9 Inspiration",
    "4-5-6 Saturn": "4-5-6 Saturn",
    "7-8-9 Oddanosť veci": "7-8-9 Devotion",
    "1-5-9 Rozvoj": "1-5-9 Development",
    "3-5-7 Vízia": "3-5-7 Vision"
  }
};

const dicts: Record<Language, PlanesData> = { sk, en };

export function getFullPlane(skKey: string, lang: Language = 'sk'): FullPlaneInfo | undefined {
  return dicts[lang]?.full[skKey] ?? dicts.sk.full[skKey];
}

export function getEmptyPlane(skKey: string, lang: Language = 'sk'): EmptyPlaneInfo | undefined {
  return dicts[lang]?.empty[skKey] ?? dicts.sk.empty[skKey];
}

export function getPlaneName(skKey: string, lang: Language = 'sk'): string {
  return planeNameMap[lang]?.[skKey] ?? skKey;
}

const planesData = sk;
export default planesData;
