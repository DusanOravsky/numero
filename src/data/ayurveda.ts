export interface DoshaProfile {
  primary: 'vata' | 'pitta' | 'kapha';
  secondary: 'vata' | 'pitta' | 'kapha' | null;
  balance: number; // 0-100, koľko je primárna dominantná
}

export interface DoshaInfo {
  name: string;
  element: string;
  qualities: string[];
  strengths: string[];
  imbalanceSigns: string[];
  balanceTips: string[];
  bodyType: string;
  mind: string;
  season: string;
}

export const DOSHA_INFO: Record<'vata' | 'pitta' | 'kapha', DoshaInfo> = {
  vata: {
    name: 'Vata',
    element: 'Éter + Vzduch',
    qualities: ['ľahký', 'suchý', 'chladný', 'pohyblivý', 'jemný', 'drsný'],
    strengths: [
      'Kreatívny a inšpiratívny',
      'Rýchle myslenie a učenie',
      'Nadšený a vitálny keď je v rovnováhe',
      'Flexibilný a prispôsobivý',
      'Prirodzený umelec a vizionár',
    ],
    imbalanceSigns: [
      'Úzkosť a nervozita',
      'Nespavosť a nepokojný spánok',
      'Suchá koža a vlasy',
      'Zápcha a nadúvanie',
      'Roztržitosť a zábudlivosť',
      'Chladné končatiny',
    ],
    balanceTips: [
      'Pravidelný denný režim — jedz a spávaj v rovnakom čase',
      'Teplé jedlá a nápoje, vyhýbaj sa studenému a surovému',
      'Olejovania tela (abhyanga) sezamovým olejom',
      'Pomalá a uzemňujúca jóga, nie príliš dynamická',
      'Meditácia a hlboké dýchanie na upokojenie mysle',
      'Vyhýbaj sa stimulantom (kofeín, cukor)',
    ],
    bodyType: 'Štíhly, ľahký, úzke kosti, suchá koža',
    mind: 'Rýchly, kreatívny, nestabilný, skáče medzi nápadmi',
    season: 'Jeseň a začiatok zimy (suchá, chladná, veterná)',
  },
  pitta: {
    name: 'Pitta',
    element: 'Oheň + Voda',
    qualities: ['horúci', 'ostrý', 'ľahký', 'olejovitý', 'tekutý', 'kyslý'],
    strengths: [
      'Prirodzený líder a organizátor',
      'Silný intelekt a sústredenie',
      'Odvážny a rozhodný',
      'Výborné trávenie a metabolizmus',
      'Charizmatický a motivujúci pre ostatných',
    ],
    imbalanceSigns: [
      'Podráždenosť a hnev',
      'Zápal a kyslý žalúdok',
      'Kožné problémy (akné, ekzém)',
      'Prehriatie a nadmerné potenie',
      'Perfekcionizmus a kritickosť',
      'Pálenie záhy a hnačka',
    ],
    balanceTips: [
      'Chladivé potraviny — uhorky, kokos, mäta, koriander',
      'Vyhýbaj sa príliš korenistému, kyslému a slanému',
      'Prechádzky v prírode, pri vode',
      'Naučiť sa pustiť kontrolu — delegovať',
      'Kreatívne hobby bez súťaženia',
      'Mesačné svetlo a chladivá meditácia',
    ],
    bodyType: 'Stredná postava, atletický, teplá koža, jemné vlasy',
    mind: 'Ostrý, analytický, cieľavedomý, náchylný na kritiku',
    season: 'Leto (horúca, intenzívna)',
  },
  kapha: {
    name: 'Kapha',
    element: 'Zem + Voda',
    qualities: ['ťažký', 'pomalý', 'stabilný', 'vlhký', 'hladký', 'mäkký'],
    strengths: [
      'Stabilný a spoľahlivý',
      'Silná pamäť a vytrvalosť',
      'Starostlivý a lojálny',
      'Fyzická sila a odolnosť',
      'Trpezlivý a pokojný',
    ],
    imbalanceSigns: [
      'Lenivosť a apatia',
      'Nadváha a pomalý metabolizmus',
      'Nadmerný spánok',
      'Hlieny a kongescia',
      'Pripútanosť a majetníctvo',
      'Depresia a ťažoba',
    ],
    balanceTips: [
      'Dynamický pohyb — beh, tanec, HIIT',
      'Ľahké a teplé jedlá, pikantné korenie',
      'Vstávaj skoro ráno (pred 6:00)',
      'Nové výzvy a zmeny v rutine',
      'Suchý kefkový masáž tela',
      'Obmedzenie sladkého, ťažkého a mastného',
    ],
    bodyType: 'Robustný, silný, zaoblený, hydratovaná koža',
    mind: 'Pokojný, trpezlivý, pomalý ale dôkladný, lojálny',
    season: 'Koniec zimy a jar (vlhká, chladná, ťažká)',
  },
};
