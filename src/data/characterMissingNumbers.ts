// Komentáre pre chýbajúce čísla v Charakterovej (Pythagorovskej) mriežke.
// Vychádza zo Steinovej tradície (kniha Numerológia: Čísla Lásky).
// Vlastné syntézy, nie doslovné citácie.

import type { Language } from '../store/useStore';

export interface MissingNumberInfo {
  number: number;
  title: string;
  description: string;
  recommendation: string;
}

const sk: Record<number, MissingNumberInfo> = {
  1: {
    number: 1,
    title: 'Bez 1 — slabšie sebavyjadrenie a iniciatíva',
    description:
      'Chýba ti prirodzená energia priekopníka. Možno ti je ťažké začínať veci sám/sama, presadiť svoj vlastný pohľad alebo viesť ostatných. Skôr nasleduješ ako iniciuješ, čo nie je slabosť — len iný rytmus.',
    recommendation:
      'Cvič si malé denné rozhodnutia bez toho, aby si sa pýtal/a iných. „Dnes si vyberiem ja, čo budeme robiť." Postupne sa buduje sebavyjadrenie a vlastný hlas.',
  },
  2: {
    number: 2,
    title: 'Bez 2 — slabšia intuícia a citlivosť na druhých',
    description:
      'Chýba ti vrodená empatia a jemnocit pre nálady iných. Môžeš pôsobiť priamejšie, ale niekedy mimo emocionálneho kontextu situácie. Ťažšie sa ti čítajú medzi-riadky.',
    recommendation:
      'Vedome si všímaj telesné signály druhých — výraz tváre, držanie tela, tón hlasu. Pýtaj sa „ako sa cítiš?" namiesto domnienok. Postupne sa intuícia rozvinie.',
  },
  3: {
    number: 3,
    title: 'Bez 3 — kreativita potrebuje stimuláciu',
    description:
      'Chýba ti vrodená tvorivá iskra a ľahkosť sebavyjadrenia. Možno máš bloky pri hovorení o sebe, písaní alebo umení. Často to súvisí s prísnou výchovou alebo strachom z hodnotenia.',
    recommendation:
      'Skús denne vytvoriť malú vec — vetu, kresbu, melódiu — bez sebakritiky. Nemusí to byť „dobré", stačí že existuje. Kreativita sa rozvíja praxou, nie talentom.',
  },
  4: {
    number: 4,
    title: 'Bez 4 — chýba prirodzená disciplína',
    description:
      'Chýba ti vrodený zmysel pre štruktúru, poriadok a systematickú prácu. Môžeš mať tendenciu nedokončovať, žiť v chaose alebo prokrastinovať. Praktické záležitosti sú tvojou výzvou, nie silou.',
    recommendation:
      'Pomôžu ti externé systémy — kalendáre, plánovače, rituály. To, čo iní robia intuitívne, ty si potrebuješ vedome stavať. Malé denné návyky budujú veľké výsledky.',
  },
  5: {
    number: 5,
    title: 'Bez 5 — sloboda nie je vrodená potreba',
    description:
      'Chýba ti vrodená túžba po zmene a dobrodružstve. Môžeš byť skôr stabilný/á, predvídateľný/á, máš rád/a rutinu. Zmeny ťa môžu rozhodiť, riziko ti nie je príjemné.',
    recommendation:
      'Vedome zaraď do života malé zmeny — iná cesta domov, nové jedlo, neznámy človek. Stabilita je tvoj dar, ale stagnácia by ti zobrala životnosť. Mikro-dobrodružstvá ti pomôžu.',
  },
  6: {
    number: 6,
    title: 'Bez 6 — láska a domov vyžadujú vedomé úsilie',
    description:
      'Chýba ti vrodená energia opatrovníka a tvorcu harmónie. Možno máš ťažkosti s rodinnou rolou, opaterou blízkych alebo s estetikou prostredia. Zodpovednosť ti môže pripadať ako bremeno, nie radosť.',
    recommendation:
      'Postupne objavuj službu druhým ako dar pre seba — varenie pre niekoho, drobné pozornosti, zariadenie domova. Pravá láska nie je obetovanie, je to plynutie.',
  },
  7: {
    number: 7,
    title: 'Bez 7 — duchovno cez vonkajšie zdroje',
    description:
      'Chýba ti vrodená tichosť a hĺbka introspekcie. Si skôr extrovertný/á, akčný/á, neradi tráviš čas sám/sama. Duchovné a filozofické otázky ťa nelákajú prirodzene — uprednostňuješ konkrétne.',
    recommendation:
      'Skús krátku tichú meditáciu (5 min) alebo prechádzku v lese sám/sama. Nemusíš byť mystik — stačí občas sa zastaviť a pýtať sa „prečo?", nielen „čo robím".',
  },
  8: {
    number: 8,
    title: 'Bez 8 — sila a hojnosť ako lekcia',
    description:
      'Chýba ti vrodená energia manifestácie a osobnej autority. Možno máš zložitý vzťah k peniazom, moci alebo k vlastnému úspechu. Niekedy si ho podvedome sabotuješ alebo odmietaš.',
    recommendation:
      'Pracuj s presvedčeniami o peniazoch a úspechu. „Zaslúžim si hojnosť" je dôležitý prvý krok. Investuj do svojho rozvoja, nauč sa žiadať o to, čo chceš. Sila je v službe, nie v hromadení.',
  },
  9: {
    number: 9,
    title: 'Bez 9 — múdrosť cez dlhšiu cestu',
    description:
      'Chýba ti vrodená kapacita širšieho nadhľadu a univerzálnej múdrosti. Môžeš byť skôr orientovaný/á na detail a vlastný príbeh ako na celok. Filozofické súvislosti sa ti odhaľujú postupne, cez vlastnú skúsenosť.',
    recommendation:
      'Čítaj biografie ľudí z iných kultúr, sleduj dlhodobé trendy. Pýtaj sa „aký to bude mať dopad za 10 rokov?". Postupne sa rozvinie schopnosť vidieť celok, nie len kúsky.',
  },
};

const en: Record<number, MissingNumberInfo> = {
  1: {
    number: 1,
    title: 'Without 1 — weaker self-expression and initiative',
    description:
      'You lack the natural energy of a pioneer. You may find it difficult to start things on your own, assert your own perspective or lead others. You tend to follow rather than initiate — which is not a weakness, just a different rhythm.',
    recommendation:
      'Practice small daily decisions without asking others. "Today I will choose what we do." Self-expression and your own voice build gradually.',
  },
  2: {
    number: 2,
    title: 'Without 2 — weaker intuition and sensitivity to others',
    description:
      'You lack innate empathy and subtlety for others\' moods. You may come across as more direct, but sometimes miss the emotional context of a situation. Reading between the lines is harder for you.',
    recommendation:
      'Consciously observe others\' body signals — facial expressions, posture, tone of voice. Ask "how do you feel?" instead of assuming. Intuition develops gradually.',
  },
  3: {
    number: 3,
    title: 'Without 3 — creativity needs stimulation',
    description:
      'You lack innate creative spark and ease of self-expression. You may have blocks around speaking about yourself, writing or art. Often connected to strict upbringing or fear of being judged.',
    recommendation:
      'Try creating a small thing daily — a sentence, a sketch, a melody — without self-criticism. It doesn\'t have to be "good", it just needs to exist. Creativity develops through practice, not talent.',
  },
  4: {
    number: 4,
    title: 'Without 4 — lacking natural discipline',
    description:
      'You lack an innate sense of structure, order and systematic work. You may tend to leave things unfinished, live in chaos or procrastinate. Practical matters are your challenge, not your strength.',
    recommendation:
      'External systems help — calendars, planners, rituals. What others do intuitively, you need to build consciously. Small daily habits produce big results.',
  },
  5: {
    number: 5,
    title: 'Without 5 — freedom is not an innate need',
    description:
      'You lack an innate desire for change and adventure. You tend to be more stable, predictable, and enjoy routine. Changes can throw you off, risk does not feel comfortable.',
    recommendation:
      'Consciously include small changes in life — a different route home, new food, an unknown person. Stability is your gift, but stagnation would steal your vitality. Micro-adventures help.',
  },
  6: {
    number: 6,
    title: 'Without 6 — love and home require conscious effort',
    description:
      'You lack the innate energy of a caretaker and creator of harmony. You may have difficulties with family roles, caring for loved ones or aesthetics of your surroundings. Responsibility may feel like a burden, not a joy.',
    recommendation:
      'Gradually discover service to others as a gift to yourself — cooking for someone, small gestures, decorating a home. True love is not sacrifice, it is flow.',
  },
  7: {
    number: 7,
    title: 'Without 7 — spirituality through external sources',
    description:
      'You lack innate quietude and depth of introspection. You tend to be more extroverted, action-oriented, and dislike spending time alone. Spiritual and philosophical questions do not attract you naturally — you prefer the concrete.',
    recommendation:
      'Try a short silent meditation (5 min) or a walk in the forest alone. You don\'t have to be a mystic — just occasionally stop and ask "why?", not just "what am I doing".',
  },
  8: {
    number: 8,
    title: 'Without 8 — strength and abundance as a lesson',
    description:
      'You lack the innate energy of manifestation and personal authority. You may have a complicated relationship with money, power or your own success. Sometimes you subconsciously sabotage or refuse it.',
    recommendation:
      'Work with beliefs about money and success. "I deserve abundance" is an important first step. Invest in your development, learn to ask for what you want. Strength is in service, not in hoarding.',
  },
  9: {
    number: 9,
    title: 'Without 9 — wisdom through a longer path',
    description:
      'You lack the innate capacity for broader perspective and universal wisdom. You tend to be more oriented toward detail and your own story than the whole. Philosophical connections reveal themselves gradually, through your own experience.',
    recommendation:
      'Read biographies of people from other cultures, follow long-term trends. Ask "what impact will this have in 10 years?". The ability to see the whole, not just pieces, develops gradually.',
  },
};

const dicts: Record<string, Record<number, MissingNumberInfo>> = { sk, en };

export function getMissingNumberInfo(num: number, lang: Language = 'sk'): MissingNumberInfo {
  return dicts[lang]?.[num] ?? dicts.sk[num];
}

// Backward compat
export const characterMissingNumbers = sk;

/**
 * Vráti komentáre pre všetky chýbajúce čísla v Charakterovej mriežke.
 */
export function findMissingCharacterNumbers(grid: { value: number; isBase: boolean }[][], lang: Language = 'sk'): MissingNumberInfo[] {
  const dict = dicts[lang] ?? dicts.sk;
  const missing: MissingNumberInfo[] = [];
  for (let i = 1; i <= 9; i++) {
    const count = grid[i]?.length || 0;
    if (count === 0) {
      missing.push(dict[i]);
    }
  }
  return missing;
}
