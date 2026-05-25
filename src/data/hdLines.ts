import type { Language } from '../store/useStore';

// Human Design — popis šiestich línií (1-6) v profile.
// Každá línia má svoju archetypálnu energiu, ktorá sa prejavuje v hexagrame
// (gate × line) a tým aj v profile.
//
// Profil sa skladá z dvoch línií: vedomá (Slnko Personality) a nevedomá (Slnko Design).
// Spolu vytvárajú jedinečný spôsob, akým človek prichádza s lekciami a vplyvom na svet.

export interface HDLineInfo {
  line: number;
  archetype: string;
  shortLabel: string;
  conscious: string;
  unconscious: string;
  shadow: string;
  signature: string;
}

export const HD_LINES: Record<number, HDLineInfo> = {
  1: {
    line: 1,
    archetype: 'Investigator (Bádateľ)',
    shortLabel: 'Skúmajúci',
    conscious: 'Vedomá línia 1: Hľadáte pevné základy a istotu cez štúdium. Potrebujete vedieť „prečo" a „ako" — informácie sú pre vás bezpečie. Predtým, než sa angažujete, musíte byť dôkladne pripravení.',
    unconscious: 'Nevedomá línia 1: V tichosti si zhromažďujete vedomosti o svete a ľuďoch. Iní vás môžu vnímať ako tichého experta, ktorý vie viac, než hovorí.',
    shadow: 'Tieň: úzkosť z neistoty, prílišný perfekcionizmus, hromadenie informácií namiesto konania, blokovanie sa nedostatočnou prípravou.',
    signature: 'Pri zdravej línii 1: hlboké, autoritatívne poznanie, ktoré dáva základ ostatným. Stávate sa zdrojom pravdy a stability.',
  },
  2: {
    line: 2,
    archetype: 'Hermit (Pustovník)',
    shortLabel: 'Pustovník',
    conscious: 'Vedomá línia 2: Máte vrodený talent, ktorý vám príde prirodzene — nemusíte sa ho učiť. Potrebujete osamotenie, aby ste sa s tým talentom mohli stretnúť. Iní vás vyhľadávajú, vy nemusíte hľadať ich.',
    unconscious: 'Nevedomá línia 2: V hĺbke duše ste samotárski. Ostatní môžu cítiť vašu „magickú" prítomnosť — niečo, čo nie je viditeľné, ale je tam.',
    shadow: 'Tieň: vyhýbanie sa svetu, vina za svoju potrebu byť sám, ignorovanie pozvania od života, falošná skromnosť.',
    signature: 'Pri zdravej línii 2: prirodzený majster vo svojom odbore. Iní vás povolajú v správny čas — vy len musíte prijať pozvanie.',
  },
  3: {
    line: 3,
    archetype: 'Martyr (Mučeník)',
    shortLabel: 'Mučeník',
    conscious: 'Vedomá línia 3: Učíte sa cez pokus a omyl. Život vás vedie cez chaos a zmeny — to čo nefunguje, musíte zažiť, aby ste vedeli, čo funguje. Adaptabilita je vaša superschopnosť.',
    unconscious: 'Nevedomá línia 3: V hlbine duše ste experimentátor. Vstupujete do situácií bez záruky výsledku, lebo iba tak sa môžete naučiť.',
    shadow: 'Tieň: vinené sa za chyby, vyhýbanie sa skúsenostiam, neschopnosť vstať po páde, defetizmus.',
    signature: 'Pri zdravej línii 3: hlboká múdrosť získaná životom. Stávate sa autoritou v tom, „čo nefunguje", a tým pomáhate ostatným uspieť.',
  },
  4: {
    line: 4,
    archetype: 'Opportunist (Príležitostník / Diplomat)',
    shortLabel: 'Diplomat',
    conscious: 'Vedomá línia 4: Žijete cez sieť — priateľov, rodinu, komunity. Príležitosti k vám prichádzajú cez známych, nie cez náhodu. Potrebujete pevné základy v ľuďoch, aby ste mohli rásť.',
    unconscious: 'Nevedomá línia 4: V duši ste lojálni a hľadáte istotu vo vzťahoch. Bez „kmeňa" sa cítite stratení.',
    shadow: 'Tieň: prílišná závislosť na schvaľovaní, odpor k zmenám vo vzťahoch, manipulácia priateľstvami pre osobný zisk.',
    signature: 'Pri zdravej línii 4: srdce komunity. Stávate sa mostom, ktorý spája ľudí a otvára príležitosti pre všetkých.',
  },
  5: {
    line: 5,
    archetype: 'Heretic (Heretik)',
    shortLabel: 'Heretik',
    conscious: 'Vedomá línia 5: Iní na vás projektujú očakávania — vidia vo vás osvietenca, učiteľa, spasiteľa. Vašou úlohou je tieto projekcie nesplniť — viesť cez praktické riešenia, nie cez ideál.',
    unconscious: 'Nevedomá línia 5: V duši ste pragmatici s vízoiu. Vidíte, čo treba urobiť, a ak vás iní pozvú, viete priniesť riešenie.',
    shadow: 'Tieň: paranoja z toho, ako vás vidia ostatní, snaha napĺňať falošné očakávania, syndróm mesiáša alebo opačne — strach byť videný.',
    signature: 'Pri zdravej línii 5: praktický učiteľ a líder. Prichádzate v čase krízy s funkčným riešením — nie s teóriou.',
  },
  6: {
    line: 6,
    archetype: 'Role Model (Vzor / Pustovník na streche)',
    shortLabel: 'Vzor',
    conscious: 'Vedomá línia 6: Žijete tri fázy — do 30 rokov skúšate ako línia 3 (chyby + experiment), 30-50 sa stiahnete na "strechu" pozorovať svet, po 50 sa stávate vzorom autority. Túžite po vyššej pravde.',
    unconscious: 'Nevedomá línia 6: V hĺbke duše ste vidiacim — vidíte väčší obraz, väčšie vzorce, vyššie účely. Túto víziu nesiete potichu.',
    shadow: 'Tieň: cynizmus zo skúseností v 1. fáze, izolácia v 2. fáze, povýšenosť v 3. fáze, idealizmus odpútaný od reality.',
    signature: 'Pri zdravej línii 6: autentický vzor a múdrosť. Po 50. roku sa stávate inšpiráciou pre celé generácie.',
  },
};

const HD_LINES_EN: Record<number, HDLineInfo> = {
  1: {
    line: 1,
    archetype: 'Investigator',
    shortLabel: 'Investigator',
    conscious: 'Conscious Line 1: You seek solid foundations and certainty through study. You need to know "why" and "how" — information is security for you. Before engaging, you must be thoroughly prepared.',
    unconscious: 'Unconscious Line 1: You quietly gather knowledge about the world and people. Others may perceive you as a quiet expert who knows more than they say.',
    shadow: 'Shadow: anxiety from uncertainty, excessive perfectionism, hoarding information instead of acting, blocking yourself through inadequate preparation.',
    signature: 'Healthy Line 1: deep, authoritative knowledge that provides foundation for others. You become a source of truth and stability.',
  },
  2: {
    line: 2,
    archetype: 'Hermit',
    shortLabel: 'Hermit',
    conscious: 'Conscious Line 2: You have an innate talent that comes naturally — you don\'t need to learn it. You need solitude to connect with that talent. Others seek you out; you don\'t need to search for them.',
    unconscious: 'Unconscious Line 2: Deep in your soul, you are a loner. Others can feel your "magical" presence — something not visible, but present.',
    shadow: 'Shadow: avoiding the world, guilt about needing to be alone, ignoring life\'s invitations, false modesty.',
    signature: 'Healthy Line 2: a natural master in your field. Others call you at the right time — you just need to accept the invitation.',
  },
  3: {
    line: 3,
    archetype: 'Martyr',
    shortLabel: 'Martyr',
    conscious: 'Conscious Line 3: You learn through trial and error. Life guides you through chaos and changes — what doesn\'t work, you must experience to know what does. Adaptability is your superpower.',
    unconscious: 'Unconscious Line 3: Deep in your soul, you are an experimenter. You enter situations without guaranteed outcomes, because that is the only way you can learn.',
    shadow: 'Shadow: blaming yourself for mistakes, avoiding experiences, inability to rise after a fall, defeatism.',
    signature: 'Healthy Line 3: deep wisdom gained through life. You become an authority on "what doesn\'t work," helping others succeed.',
  },
  4: {
    line: 4,
    archetype: 'Opportunist (Diplomat)',
    shortLabel: 'Diplomat',
    conscious: 'Conscious Line 4: You live through your network — friends, family, communities. Opportunities come to you through acquaintances, not by chance. You need solid foundations in people to grow.',
    unconscious: 'Unconscious Line 4: At your core, you are loyal and seek certainty in relationships. Without a "tribe," you feel lost.',
    shadow: 'Shadow: excessive dependence on approval, resistance to changes in relationships, manipulating friendships for personal gain.',
    signature: 'Healthy Line 4: the heart of the community. You become a bridge connecting people and opening opportunities for all.',
  },
  5: {
    line: 5,
    archetype: 'Heretic',
    shortLabel: 'Heretic',
    conscious: 'Conscious Line 5: Others project expectations onto you — they see you as an enlightened one, teacher, savior. Your task is not to fulfill these projections — lead through practical solutions, not ideals.',
    unconscious: 'Unconscious Line 5: At your core, you are a pragmatist with vision. You see what needs to be done, and when others invite you, you can deliver solutions.',
    shadow: 'Shadow: paranoia about how others see you, trying to fulfill false expectations, messiah syndrome or conversely — fear of being seen.',
    signature: 'Healthy Line 5: a practical teacher and leader. You arrive in times of crisis with a functional solution — not theory.',
  },
  6: {
    line: 6,
    archetype: 'Role Model',
    shortLabel: 'Role Model',
    conscious: 'Conscious Line 6: You live three phases — until 30 you experiment like Line 3 (mistakes + experiments), 30-50 you retreat to the "roof" to observe the world, after 50 you become a model of authority. You long for higher truth.',
    unconscious: 'Unconscious Line 6: Deep in your soul, you are a seer — you see the bigger picture, larger patterns, higher purposes. You carry this vision quietly.',
    shadow: 'Shadow: cynicism from experiences in phase 1, isolation in phase 2, superiority in phase 3, idealism detached from reality.',
    signature: 'Healthy Line 6: an authentic role model and wisdom. After 50, you become an inspiration for entire generations.',
  },
};

export const HD_AUTHORITY_INFO: Record<string, { wave: string; how: string }> = {
  'Emocionálna': {
    wave: 'Emocionálna vlna sa hýbe v cykloch — od high cez nízke. Pravda neprichádza okamžite, ale postupne, počas celého cyklu.',
    how: 'Pri rozhodnutiach NIKDY nereagujte v okamihu vzrušenia ani depresie. Počkajte 24h-3 dni, nech vaša vlna prejde celým cyklom (high → mid → low → mid). Pravda je v strednej čistote.',
  },
  'Sakrálna': {
    wave: 'Sakrálne reakcie sú okamžité, telesné, instinktívne. Áno = "uh-huh", nie = "uh-uh" alebo ticho.',
    how: 'Hľadajte otázky áno/nie a počúvajte telo. Hrudník/brucho odpovedá pred mysľou. Ak musíte premýšľať, je to "nie".',
  },
  'Slezinová': {
    wave: 'Slezinová autorita hovorí raz a potichu. Inštinktívne varuje pred nebezpečenstvom alebo zelený svit pre príležitosť.',
    how: 'Naučte sa počuť ten prvý jemný hlas — neprehlasovať ho racionalizáciou. Ak vám slezina raz povedala "nie", neopytujte sa znovu.',
  },
  'Ego': {
    wave: 'Ego autorita reaguje cez srdce — ak to chcem, mám silu, je to dôležité pre mňa.',
    how: 'Spýtajte sa: "Mám na to chuť? Stojí mi za to?" Egoická pravda je o vlastnej vôli a osobnom záujme — bez viny.',
  },
  'Sebaprojektovaná': {
    wave: 'G centrum (identita) hovorí keď počujete sami seba hovoriť. Pravda sa prejaví v tom, čo poviete nahlas.',
    how: 'Hovorte nahlas — sami so sebou alebo dôveryhodnému poslucháčovi. V slovách budete počuť, kto ste a čo je pre vás správne.',
  },
  'Mentálna/Environmentálna': {
    wave: 'Mentálna autorita je závislá od prostredia — správne rozhodnutie sa prejaví v správnom mieste a s správnymi ľuďmi.',
    how: 'Žiadny zhon. Diskutujte rozhodnutie v rôznych prostrediach — kde sa cítite jasní, čistí, tam je pravda.',
  },
  'Lunárna': {
    wave: 'Lunárna autorita Reflektora trvá 28 dní — celý lunárny cyklus.',
    how: 'Pri akomkoľvek väčšom rozhodnutí počkajte celý lunárny mesiac. Hovorte o ňom s dôveryhodnými ľuďmi cez celých 28 dní — pravda sa vyformuje v cykle.',
  },
};

const HD_AUTHORITY_INFO_EN: Record<string, { wave: string; how: string }> = {
  'Emocionálna': {
    wave: 'The emotional wave moves in cycles — from highs through lows. Truth does not come instantly, but gradually, throughout the entire cycle.',
    how: 'When making decisions, NEVER react in a moment of excitement or depression. Wait 24h-3 days, let your wave pass through the full cycle (high → mid → low → mid). Truth is in the middle clarity.',
  },
  'Sakrálna': {
    wave: 'Sacral responses are immediate, bodily, instinctive. Yes = "uh-huh", no = "uh-uh" or silence.',
    how: 'Look for yes/no questions and listen to the body. Chest/belly responds before the mind. If you have to think, it\'s a "no".',
  },
  'Slezinová': {
    wave: 'Splenic authority speaks once and quietly. It instinctively warns of danger or gives a green light for opportunity.',
    how: 'Learn to hear that first gentle voice — don\'t drown it out with rationalization. If your spleen said "no" once, don\'t ask again.',
  },
  'Ego': {
    wave: 'Ego authority responds through the heart — if I want it, I have the strength, it matters to me.',
    how: 'Ask yourself: "Do I feel like it? Is it worth it to me?" Ego truth is about your own will and personal interest — without guilt.',
  },
  'Sebaprojektovaná': {
    wave: 'The G center (identity) speaks when you hear yourself talking. Truth manifests in what you say out loud.',
    how: 'Speak out loud — to yourself or to a trusted listener. In your words, you will hear who you are and what is right for you.',
  },
  'Mentálna/Environmentálna': {
    wave: 'Mental authority depends on environment — the right decision manifests in the right place with the right people.',
    how: 'No rush. Discuss the decision in different environments — where you feel clear and pure, there lies the truth.',
  },
  'Lunárna': {
    wave: 'Reflector\'s lunar authority takes 28 days — an entire lunar cycle.',
    how: 'For any major decision, wait a full lunar month. Talk about it with trusted people throughout all 28 days — truth forms within the cycle.',
  },
};

export const HD_DEFINITION_INFO: Record<string, { description: string; lesson: string }> = {
  'No Definition': {
    description: 'Žiadne definované centrá — všetko je otvorené, premenlivé. Toto je iba u Reflektorov.',
    lesson: 'Vaša múdrosť: zrkadlíte zdravie kolektívu. Ste citliví na všetko — vyberte si prostredie a ľudí veľmi pozorne.',
  },
  'Single': {
    description: 'Všetky vaše definované centrá sú vzájomne prepojené v jednej súvislej oblasti. Energia tečie hladko a koherentne.',
    lesson: 'Máte vnútornú konzistenciu — viete kto ste, vaša energia je jednotná. Potrebujete druhých skôr na zrkadlenie ako na spojenie.',
  },
  'Split': {
    description: 'Máte 2 oddelené oblasti definovaných centier. Energia neteče priamo medzi nimi — môžete sa cítiť „rozpoltení".',
    lesson: 'Hľadáte druhých ľudí ako most medzi vašimi 2 časťami. Vzťahy sú dôležité — pozor však aj na nezdravú závislosť. Kľúčom je nájsť seba prv než hľadáte druhých.',
  },
  'Triple Split': {
    description: 'Máte 3 oddelené oblasti definovaných centier. Vaše rozhodovanie je komplexnejšie, potrebujete viacero ľudí na rôzne aspekty.',
    lesson: 'Vaša komplexnosť je dar. Naučte sa byť trpezlivý sami so sebou — máte 3 rôzne perspektívy ktoré treba integrovať. Vzťahy s rôznymi ľuďmi vám pomáhajú sa zorientovať.',
  },
  'Quadruple Split': {
    description: 'Máte 4 oddelené oblasti definovaných centier. Veľmi vzácne — len ~1% populácie.',
    lesson: 'Mimoriadne unikátne energetické usporiadanie. Vaša úloha je naučiť sa žiť so 4 rôznymi vnútornými hlasmi. Sociálne ste schopní mostíť mnohé svety.',
  },
};

const HD_DEFINITION_INFO_EN: Record<string, { description: string; lesson: string }> = {
  'No Definition': {
    description: 'No defined centers — everything is open and variable. This occurs only in Reflectors.',
    lesson: 'Your wisdom: you mirror the health of the collective. You are sensitive to everything — choose your environment and people very carefully.',
  },
  'Single': {
    description: 'All your defined centers are interconnected in one continuous area. Energy flows smoothly and coherently.',
    lesson: 'You have inner consistency — you know who you are, your energy is unified. You need others more for mirroring than for connection.',
  },
  'Split': {
    description: 'You have 2 separate areas of defined centers. Energy does not flow directly between them — you may feel "split."',
    lesson: 'You seek other people as a bridge between your 2 parts. Relationships are important — but watch for unhealthy dependency. The key is finding yourself before seeking others.',
  },
  'Triple Split': {
    description: 'You have 3 separate areas of defined centers. Your decision-making is more complex; you need multiple people for different aspects.',
    lesson: 'Your complexity is a gift. Learn to be patient with yourself — you have 3 different perspectives to integrate. Relationships with various people help you orient yourself.',
  },
  'Quadruple Split': {
    description: 'You have 4 separate areas of defined centers. Very rare — only ~1% of the population.',
    lesson: 'An extraordinarily unique energetic arrangement. Your task is learning to live with 4 different inner voices. Socially, you are capable of bridging many worlds.',
  },
};

export const HD_PROFILE_PHASES: Record<string, string> = {
  '1/3': 'Profil 1/3 – Skúmajúci Mučeník: Hľadáte základ skrz štúdium (1) a potom ho overujete v praxi cez pokus-omyl (3). Vaše chyby sú vašou najsilnejšou múdrosťou.',
  '1/4': 'Profil 1/4 – Skúmajúci Diplomat: Hľadáte základ skrz štúdium (1) a zdieľate ho cez svoju sieť priateľov a komunity (4).',
  '2/4': 'Profil 2/4 – Pustovník Diplomat: Vrodené dary (2) ktoré sa prejavujú cez sociálnu sieť priateľov (4). Iní vás povolávajú.',
  '2/5': 'Profil 2/5 – Pustovník Heretik: Vrodené dary (2) v ústraní + projekcie ostatných (5). Karmický profil — iní vás vidia ako spasiteľa.',
  '3/5': 'Profil 3/5 – Mučeník Heretik: Učenie sa cez chyby (3) + projekcie ostatných (5). Ste pragmatický experimentátor — fixácia na praktické riešenia.',
  '3/6': 'Profil 3/6 – Mučeník Vzor: Mladosť plná experimentov (3), zrelosť pozorovaním (6). 3-fázový život.',
  '4/6': 'Profil 4/6 – Diplomat Vzor: Sieť (4) + vzor pre druhých (6). Po 50tke sa stávate autoritou cez vzťahy.',
  '4/1': 'Profil 4/1 – Fixovaný osud: Líder vlastným príkladom. Veľmi pevný profil — vaša pravda nemení.',
  '5/1': 'Profil 5/1 – Heretik Skúmajúci: Pragmatický líder s pevným základom. Riešite krízy cez praktické vedomosti.',
  '5/2': 'Profil 5/2 – Heretik Pustovník: Projekcie + vrodený talent. Vy ste samotár ktorý prichádza s riešením.',
  '6/2': 'Profil 6/2 – Vzor Pustovník: Múdry pozorovateľ s prirodzeným talentom.',
  '6/3': 'Profil 6/3 – Vzor Mučeník: Múdry experimentátor — vaša múdrosť pochádza zo života plného skúseností.',
};

const HD_PROFILE_PHASES_EN: Record<string, string> = {
  '1/3': 'Profile 1/3 – Investigator Martyr: You seek foundation through study (1) and then verify it in practice through trial and error (3). Your mistakes are your greatest wisdom.',
  '1/4': 'Profile 1/4 – Investigator Diplomat: You seek foundation through study (1) and share it through your network of friends and community (4).',
  '2/4': 'Profile 2/4 – Hermit Diplomat: Innate gifts (2) that manifest through a social network of friends (4). Others call upon you.',
  '2/5': 'Profile 2/5 – Hermit Heretic: Innate gifts (2) in seclusion + projections of others (5). A karmic profile — others see you as a savior.',
  '3/5': 'Profile 3/5 – Martyr Heretic: Learning through mistakes (3) + projections of others (5). You are a pragmatic experimenter — focused on practical solutions.',
  '3/6': 'Profile 3/6 – Martyr Role Model: Youth full of experiments (3), maturity through observation (6). A 3-phase life.',
  '4/6': 'Profile 4/6 – Diplomat Role Model: Network (4) + role model for others (6). After 50, you become an authority through relationships.',
  '4/1': 'Profile 4/1 – Fixed Destiny: A leader by own example. A very firm profile — your truth does not change.',
  '5/1': 'Profile 5/1 – Heretic Investigator: A pragmatic leader with solid foundation. You solve crises through practical knowledge.',
  '5/2': 'Profile 5/2 – Heretic Hermit: Projections + innate talent. You are a loner who arrives with solutions.',
  '6/2': 'Profile 6/2 – Role Model Hermit: A wise observer with natural talent.',
  '6/3': 'Profile 6/3 – Role Model Martyr: A wise experimenter — your wisdom comes from a life full of experiences.',
};

export function getHDLine(line: number, lang: Language = 'sk'): HDLineInfo {
  if (lang === 'en') {
    return HD_LINES_EN[line] || HD_LINES[line];
  }
  return HD_LINES[line];
}

export function getHDAuthorityInfo(skKey: string, lang: Language = 'sk'): { wave: string; how: string } {
  if (lang === 'en') {
    return HD_AUTHORITY_INFO_EN[skKey] || HD_AUTHORITY_INFO[skKey];
  }
  return HD_AUTHORITY_INFO[skKey];
}

export function getHDDefinitionInfo(skKey: string, lang: Language = 'sk'): { description: string; lesson: string } {
  if (lang === 'en') {
    return HD_DEFINITION_INFO_EN[skKey] || HD_DEFINITION_INFO[skKey];
  }
  return HD_DEFINITION_INFO[skKey];
}

export function getHDProfilePhase(skKey: string, lang: Language = 'sk'): string {
  if (lang === 'en') {
    return HD_PROFILE_PHASES_EN[skKey] || HD_PROFILE_PHASES[skKey];
  }
  return HD_PROFILE_PHASES[skKey];
}
