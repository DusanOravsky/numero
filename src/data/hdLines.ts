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
