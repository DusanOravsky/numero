// Komentáre pre chýbajúce čísla v Charakterovej (Pythagorovskej) mriežke.
// Vychádza zo Steinovej tradície (kniha Numerológia: Čísla Lásky).
// Vlastné syntézy, nie doslovné citácie.

export interface MissingNumberInfo {
  number: number;
  title: string;
  description: string;
  recommendation: string;
}

export const characterMissingNumbers: Record<number, MissingNumberInfo> = {
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

/**
 * Vráti komentáre pre všetky chýbajúce čísla v Charakterovej mriežke.
 */
export function findMissingCharacterNumbers(grid: { value: number; isBase: boolean }[][]): MissingNumberInfo[] {
  const missing: MissingNumberInfo[] = [];
  for (let i = 1; i <= 9; i++) {
    const count = grid[i]?.length || 0;
    if (count === 0) {
      missing.push(characterMissingNumbers[i]);
    }
  }
  return missing;
}
