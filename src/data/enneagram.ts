// Statické dáta pre 9 enneagram typov (bilingválne sk/en)
// Integrácia/dezintegrácia podľa Riso-Hudson modelu

import type { Language } from '../store/useStore';

export interface EnneagramTypeData {
  type: number;
  name: string;
  subtitle: string;
  motivation: string;
  fear: string;
  integration: number;
  disintegration: number;
  strengths: string[];
  weaknesses: string[];
  growthPath: string;
}

const sk: Record<number, EnneagramTypeData> = {
  1: {
    type: 1,
    name: 'Perfekcionista / Reformátor',
    subtitle: 'Principiálny, účelný, sebaovládajúci a perfekcionistický',
    motivation: 'Byť dobrý, mať pravdu, zlepšovať svet a seba',
    fear: 'Byť zlý, skazený, chybný alebo nemorálny',
    integration: 7,
    disintegration: 4,
    strengths: [
      'Silný zmysel pre spravodlivosť a etiku',
      'Spoľahlivosť a zodpovednosť',
      'Schopnosť vidieť potenciál na zlepšenie',
      'Disciplína a dôslednosť',
    ],
    weaknesses: [
      'Prílišná kritickosť voči sebe aj ostatným',
      'Rigidita a neochota meniť pravidlá',
      'Potláčanie hnevu (vnútorná frustrácia)',
      'Ťažkosti s uvoľnením a spontánnosťou',
    ],
    growthPath:
      'Učiť sa prijímať nedokonalosť — svoju aj sveta. Pestovať radosť a spontánnosť (smer k 7). Uvedomiť si, že "dosť dobré" je často ideálne.',
  },
  2: {
    type: 2,
    name: 'Pomocník',
    subtitle: 'Starostlivý, veľkorysý, ľúbivý a vlastnícky',
    motivation: 'Byť milovaný, potrebný a ocenený',
    fear: 'Byť nemilovaný, nepotrebný a odmietnutý',
    integration: 4,
    disintegration: 8,
    strengths: [
      'Empatia a citlivosť k potrebám iných',
      'Veľkorysosť a ochota pomôcť',
      'Schopnosť vytvárať hlboké vzťahy',
      'Teplo a otvorenosť',
    ],
    weaknesses: [
      'Zanedbávanie vlastných potrieb',
      'Manipulatívne dávanie (s očakávaním)',
      'Ťažkosti s prijímaním pomoci',
      'Prílišné prispôsobovanie sa iným',
    ],
    growthPath:
      'Učiť sa rozpoznávať a vyjadrovať vlastné emócie a potreby (smer k 4). Prestať podmieňovať svoju hodnotu tým, čo dáva iným. Starostlivosť začína u seba.',
  },
  3: {
    type: 3,
    name: 'Úspešný / Achiever',
    subtitle: 'Prispôsobivý, výkonný, imidžovo orientovaný a ambiciózny',
    motivation: 'Byť úspešný, obdivovaný a odlíšiť sa od ostatných',
    fear: 'Byť bezcenný, neúspešný a bez hodnoty',
    integration: 6,
    disintegration: 9,
    strengths: [
      'Výnimočná efektivita a pracovitosť',
      'Schopnosť motivovať a inšpirovať iných',
      'Prispôsobivosť a flexibilita',
      'Orientácia na cieľ a výsledky',
    ],
    weaknesses: [
      'Stotožňovanie sa s výkonom a úspechom',
      'Povrchnosť a imidžovosť',
      'Ťažkosti s autenticitou',
      'Workoholizmus a vyhorenie',
    ],
    growthPath:
      'Učiť sa byť namiesto neustáleho dosahovania. Budovať dôveru a lojalitu (smer k 6). Objaviť vlastnú hodnotu nezávislú od externého uznania.',
  },
  4: {
    type: 4,
    name: 'Individualista / Romantik',
    subtitle: 'Expresívny, dramatický, introspektívny a temperamentný',
    motivation: 'Nájsť svoju identitu, byť autentický a jedinečný',
    fear: 'Byť bez identity, bezvýznamný a emocionálne odrezaný',
    integration: 1,
    disintegration: 2,
    strengths: [
      'Hlboká emocionálna inteligencia',
      'Kreativita a umelecký cit',
      'Autenticita a odvaha byť zraniteľný',
      'Schopnosť transformovať bolesť v krásu',
    ],
    weaknesses: [
      'Sklon k melanchólii a sebaľútosti',
      'Závisť a porovnávanie sa s inými',
      'Emocionálna nestálosť',
      'Ťažkosti s každodennou rutinou',
    ],
    growthPath:
      'Učiť sa disciplíne a objektívnosti (smer k 1). Uznať, že každodenné úsilie má rovnakú hodnotu ako inšpiratívne vrcholy. Prijať obyčajnosť bez straty hĺbky.',
  },
  5: {
    type: 5,
    name: 'Pozorovateľ / Vyšetrovateľ',
    subtitle: 'Vnímavý, analytický, inovatívny a izolujúci sa',
    motivation: 'Byť kompetentný, nezávislý a porozumieť svetu',
    fear: 'Byť bezmocný, nekompetentný a zahltený',
    integration: 8,
    disintegration: 7,
    strengths: [
      'Hlboký analytický intelekt',
      'Nezávislosť a sebestačnosť',
      'Schopnosť koncentrácie a objektivity',
      'Inovatívne myslenie',
    ],
    weaknesses: [
      'Emocionálna uzavretosť a izolácia',
      'Prehnaná šetrnosť s energiou a zdrojmi',
      'Ťažkosti s praxou (len teória)',
      'Oddelenie sa od telesných potrieb',
    ],
    growthPath:
      'Učiť sa konať a zaangažovať sa (smer k 8). Zdieľať vedomosti aktívne, nielen hromadiť. Riskovať zraniteľnosť vo vzťahoch.',
  },
  6: {
    type: 6,
    name: 'Lojálny / Skeptik',
    subtitle: 'Angažovaný, zodpovedný, úzkostlivý a podozrievavý',
    motivation: 'Mať istotu, bezpečie a oporu',
    fear: 'Byť bez opory, vedenia a schopnosti prežiť',
    integration: 9,
    disintegration: 3,
    strengths: [
      'Vernosť a zodpovednosť',
      'Schopnosť predvídať riziká',
      'Odvaha v krízových situáciách',
      'Zmysel pre komunitu a spoluprácu',
    ],
    weaknesses: [
      'Chronická úzkosť a pochybnosti',
      'Projikácia vlastných strachov na iných',
      'Váhavosť a nerozhodnosť',
      'Sklon k pesimizmu a paranoji',
    ],
    growthPath:
      'Učiť sa dôverovať sebe a procesu života (smer k 9). Rozlišovať medzi skutočným nebezpečenstvom a vytvorenými strachmi. Budovať vnútornú istotu namiesto hľadania vonkajšej.',
  },
  7: {
    type: 7,
    name: 'Nadšenec / Epikurejec',
    subtitle: 'Spontánny, všestranný, rozptýlený a nestriedmy',
    motivation: 'Byť šťastný, slobodný a vyhnúť sa bolesti',
    fear: 'Byť v bolesti, zbavený slobody a uväznený v utrpení',
    integration: 5,
    disintegration: 1,
    strengths: [
      'Optimizmus a radosť zo života',
      'Kreativita a vizionárske myslenie',
      'Schopnosť nadchnúť iných',
      'Flexibilita a vynaliezavosť',
    ],
    weaknesses: [
      'Vyhýbanie sa bolesti a ťažkým emóciám',
      'Povrchnosť a netrpezlivosť',
      'Závislosť na stimulácii a novosti',
      'Neschopnosť dokončiť projekty',
    ],
    growthPath:
      'Učiť sa hĺbke a sústredeniu (smer k 5). Prijať, že bolesť je súčasťou plného života. Dokončiť veci pred začatím nových.',
  },
  8: {
    type: 8,
    name: 'Vyzývateľ / Boss',
    subtitle: 'Sebavedomý, rozhodný, dominantný a konfrontačný',
    motivation: 'Chrániť seba, ovládať svoje prostredie a osud',
    fear: 'Byť ovládaný, zraniteľný a podriadený iným',
    integration: 2,
    disintegration: 5,
    strengths: [
      'Odvaha a prirodzené vodcovstvo',
      'Priamosť a ochrana slabších',
      'Výnimočná energia a rozhodnosť',
      'Schopnosť presadiť zmenu',
    ],
    weaknesses: [
      'Prehnaná kontrola a dominancia',
      'Necitlivosť a hrubosť',
      'Ťažkosti s prejavením zraniteľnosti',
      'Sklon k nadmernému sebapresadzovaniu',
    ],
    growthPath:
      'Učiť sa zraniteľnosti a nežnosti (smer k 2). Sila nie je v kontrole, ale v schopnosti otvoriť srdce. Dovoliť si závislosť na iných.',
  },
  9: {
    type: 9,
    name: 'Mierotvorec / Mediátor',
    subtitle: 'Zmierlivý, pokojný, spokojný a pasívny',
    motivation: 'Mať vnútorný pokoj, harmóniu a stabilitu',
    fear: 'Strata spojenia, fragmentácia a konflikt',
    integration: 3,
    disintegration: 6,
    strengths: [
      'Schopnosť vidieť všetky perspektívy',
      'Prirodzená diplomacia a mediácia',
      'Pokojná prítomnosť a stabilita',
      'Akceptácia a bezpodmienečné prijatie',
    ],
    weaknesses: [
      'Pasivita a prokrastinácia',
      'Strata kontaktu s vlastnými prianiami',
      'Vyhýbanie sa konfliktom za každú cenu',
      'Lenosť a zasnenosť (narcotizácia)',
    ],
    growthPath:
      'Učiť sa konať a presadzovať vlastné ciele (smer k 3). Uvedomiť si, že vyhýbanie sa konfliktu nie je skutočný mier. Objaviť vlastné túžby oddelene od túžob iných.',
  },
};

const en: Record<number, EnneagramTypeData> = {
  1: {
    type: 1,
    name: 'The Perfectionist / Reformer',
    subtitle: 'Principled, purposeful, self-controlled and perfectionistic',
    motivation: 'To be good, to be right, to improve the world and oneself',
    fear: 'Being bad, corrupt, flawed or immoral',
    integration: 7,
    disintegration: 4,
    strengths: [
      'Strong sense of justice and ethics',
      'Reliability and responsibility',
      'Ability to see potential for improvement',
      'Discipline and thoroughness',
    ],
    weaknesses: [
      'Excessive criticism of self and others',
      'Rigidity and reluctance to change rules',
      'Suppressed anger (inner frustration)',
      'Difficulty relaxing and being spontaneous',
    ],
    growthPath:
      'Learn to accept imperfection — yours and the world\'s. Cultivate joy and spontaneity (direction toward 7). Realize that "good enough" is often ideal.',
  },
  2: {
    type: 2,
    name: 'The Helper / Giver',
    subtitle: 'Caring, generous, people-pleasing and possessive',
    motivation: 'To be loved, needed and appreciated',
    fear: 'Being unloved, unneeded and rejected',
    integration: 4,
    disintegration: 8,
    strengths: [
      'Empathy and sensitivity to others\' needs',
      'Generosity and willingness to help',
      'Ability to create deep relationships',
      'Warmth and openness',
    ],
    weaknesses: [
      'Neglecting one\'s own needs',
      'Manipulative giving (with expectations)',
      'Difficulty accepting help',
      'Excessive adaptation to others',
    ],
    growthPath:
      'Learn to recognize and express your own emotions and needs (direction toward 4). Stop conditioning your worth on what you give to others. Care begins with yourself.',
  },
  3: {
    type: 3,
    name: 'The Achiever / Performer',
    subtitle: 'Adaptable, driven, image-conscious and ambitious',
    motivation: 'To be successful, admired and to distinguish oneself from others',
    fear: 'Being worthless, unsuccessful and without value',
    integration: 6,
    disintegration: 9,
    strengths: [
      'Exceptional efficiency and work ethic',
      'Ability to motivate and inspire others',
      'Adaptability and flexibility',
      'Goal and results orientation',
    ],
    weaknesses: [
      'Identifying self with performance and success',
      'Superficiality and image-consciousness',
      'Difficulty with authenticity',
      'Workaholism and burnout',
    ],
    growthPath:
      'Learn to be rather than constantly achieve. Build trust and loyalty (direction toward 6). Discover your own worth independent of external recognition.',
  },
  4: {
    type: 4,
    name: 'The Individualist / Romantic',
    subtitle: 'Expressive, dramatic, introspective and temperamental',
    motivation: 'To find one\'s identity, to be authentic and unique',
    fear: 'Being without identity, insignificant and emotionally cut off',
    integration: 1,
    disintegration: 2,
    strengths: [
      'Deep emotional intelligence',
      'Creativity and artistic sensibility',
      'Authenticity and courage to be vulnerable',
      'Ability to transform pain into beauty',
    ],
    weaknesses: [
      'Tendency toward melancholy and self-pity',
      'Envy and comparing oneself to others',
      'Emotional instability',
      'Difficulty with everyday routine',
    ],
    growthPath:
      'Learn discipline and objectivity (direction toward 1). Recognize that everyday effort has equal value to inspirational peaks. Accept ordinariness without losing depth.',
  },
  5: {
    type: 5,
    name: 'The Investigator / Observer',
    subtitle: 'Perceptive, analytical, innovative and isolating',
    motivation: 'To be competent, independent and to understand the world',
    fear: 'Being helpless, incompetent and overwhelmed',
    integration: 8,
    disintegration: 7,
    strengths: [
      'Deep analytical intellect',
      'Independence and self-sufficiency',
      'Ability to concentrate and be objective',
      'Innovative thinking',
    ],
    weaknesses: [
      'Emotional withdrawal and isolation',
      'Excessive hoarding of energy and resources',
      'Difficulty with practice (only theory)',
      'Disconnection from bodily needs',
    ],
    growthPath:
      'Learn to act and engage (direction toward 8). Share knowledge actively, not just accumulate it. Risk vulnerability in relationships.',
  },
  6: {
    type: 6,
    name: 'The Loyalist / Skeptic',
    subtitle: 'Committed, responsible, anxious and suspicious',
    motivation: 'To have security, safety and support',
    fear: 'Being without support, guidance and ability to survive',
    integration: 9,
    disintegration: 3,
    strengths: [
      'Loyalty and responsibility',
      'Ability to anticipate risks',
      'Courage in crisis situations',
      'Sense of community and collaboration',
    ],
    weaknesses: [
      'Chronic anxiety and doubt',
      'Projecting one\'s own fears onto others',
      'Indecisiveness and hesitation',
      'Tendency toward pessimism and paranoia',
    ],
    growthPath:
      'Learn to trust yourself and the process of life (direction toward 9). Distinguish between real danger and created fears. Build inner security instead of seeking external.',
  },
  7: {
    type: 7,
    name: 'The Enthusiast / Epicure',
    subtitle: 'Spontaneous, versatile, scattered and excessive',
    motivation: 'To be happy, free and to avoid pain',
    fear: 'Being in pain, deprived of freedom and trapped in suffering',
    integration: 5,
    disintegration: 1,
    strengths: [
      'Optimism and joy of life',
      'Creativity and visionary thinking',
      'Ability to enthuse others',
      'Flexibility and resourcefulness',
    ],
    weaknesses: [
      'Avoidance of pain and difficult emotions',
      'Superficiality and impatience',
      'Dependence on stimulation and novelty',
      'Inability to finish projects',
    ],
    growthPath:
      'Learn depth and focus (direction toward 5). Accept that pain is part of a full life. Finish things before starting new ones.',
  },
  8: {
    type: 8,
    name: 'The Challenger / Boss',
    subtitle: 'Self-confident, decisive, dominant and confrontational',
    motivation: 'To protect oneself, control one\'s environment and destiny',
    fear: 'Being controlled, vulnerable and subordinate to others',
    integration: 2,
    disintegration: 5,
    strengths: [
      'Courage and natural leadership',
      'Directness and protection of the vulnerable',
      'Exceptional energy and decisiveness',
      'Ability to drive change',
    ],
    weaknesses: [
      'Excessive control and dominance',
      'Insensitivity and harshness',
      'Difficulty showing vulnerability',
      'Tendency toward excessive self-assertion',
    ],
    growthPath:
      'Learn vulnerability and tenderness (direction toward 2). Strength is not in control, but in the ability to open your heart. Allow yourself to depend on others.',
  },
  9: {
    type: 9,
    name: 'The Peacemaker / Mediator',
    subtitle: 'Agreeable, calm, content and passive',
    motivation: 'To have inner peace, harmony and stability',
    fear: 'Loss of connection, fragmentation and conflict',
    integration: 3,
    disintegration: 6,
    strengths: [
      'Ability to see all perspectives',
      'Natural diplomacy and mediation',
      'Peaceful presence and stability',
      'Acceptance and unconditional embrace',
    ],
    weaknesses: [
      'Passivity and procrastination',
      'Losing contact with one\'s own desires',
      'Conflict avoidance at all costs',
      'Sloth and daydreaming (narcotization)',
    ],
    growthPath:
      'Learn to act and assert your own goals (direction toward 3). Realize that avoiding conflict is not true peace. Discover your own desires separate from the desires of others.',
  },
};

const dicts: Record<string, Record<number, EnneagramTypeData>> = { sk, en };

export function getEnneagramType(type: number, lang: Language = 'sk'): EnneagramTypeData {
  return dicts[lang]?.[type] ?? dicts.sk[type];
}

// Backward compat
export const enneagramTypes = sk;
