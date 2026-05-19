// Statické dáta pre 9 enneagram typov (slovenčina)
// Integrácia/dezintegrácia podľa Riso-Hudson modelu

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

export const enneagramTypes: Record<number, EnneagramTypeData> = {
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
