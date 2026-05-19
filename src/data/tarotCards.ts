// Mapovanie ODV → veľká arkána Tarotu.
// Pythagoras + Crowley/Waite-Smith systém. Každé číslo 1-9 zodpovedá jednej
// hlavnej karte (čísla 1-9, redukované z čísel od 0-21).
// Na deň ponúka archetypálnu energiu.

export interface TarotCard {
  number: number;
  name: string;
  arcana: 'major';
  symbol: string;
  meaning: string;
  shadow: string;
  advice: string;
}

export const TAROT_BY_ODV: Record<number, TarotCard> = {
  1: {
    number: 1,
    name: 'Mág',
    arcana: 'major',
    symbol: '🜂',
    meaning: 'Začiatok, vôľa, manifestácia. Máte všetky nástroje na ruky — len ich použite.',
    shadow: 'Manipulácia, klam sám seba, prehnaná sebadôvera.',
    advice: 'Iniciuj. Nečakaj. Tvoj zámer je dnes silnejší ako bývajú prekážky.',
  },
  2: {
    number: 2,
    name: 'Vysoká kňažka',
    arcana: 'major',
    symbol: '🜃',
    meaning: 'Intuícia, vnútorná múdrosť, podvedomie. Tichá pravda hovorí cez tvoju citlivosť.',
    shadow: 'Tajnostkárstvo, izolácia, ignorovanie reality.',
    advice: 'Počúvaj svoju intuíciu. Dnes nie je deň pre racionálne výpočty.',
  },
  3: {
    number: 3,
    name: 'Cisárovná',
    arcana: 'major',
    symbol: '🜁',
    meaning: 'Plodnosť, kreativita, hojnosť, ženský princíp. Tvor a krš plodov.',
    shadow: 'Posadnutosť materiálnym, nadmerné rozmaznávanie.',
    advice: 'Tvor s láskou. Nech sa tvoja kreativita prelieva do toho, čo dnes robíš.',
  },
  4: {
    number: 4,
    name: 'Cisár',
    arcana: 'major',
    symbol: '🜔',
    meaning: 'Štruktúra, autorita, stabilita, mužský princíp. Postav základy.',
    shadow: 'Tyrania, rigidita, nepriateľstvo voči zmenám.',
    advice: 'Buď organizovaný/á a disciplinovaný/á. Štruktúra ti dnes prinesie pokoj.',
  },
  5: {
    number: 5,
    name: 'Veľkňaz',
    arcana: 'major',
    symbol: '🜍',
    meaning: 'Tradícia, učenie, duchovná autorita, vyššie hodnoty.',
    shadow: 'Dogma, slepá poslušnosť, nestrávené presvedčenia.',
    advice: 'Hľadaj učiteľa alebo tradíciu, ktorá ti dnes ponúka múdrosť. Otázky pred odpoveďami.',
  },
  6: {
    number: 6,
    name: 'Milenci',
    arcana: 'major',
    symbol: '🜂🜃',
    meaning: 'Voľba, partnerstvo, harmónia opačných polarít, srdcové rozhodnutie.',
    shadow: 'Nerozhodnosť, kompromis zo strachu, povrchná láska.',
    advice: 'Rozhoduj zo srdca. Dnešná voľba má dlhodobý dopad — pozri sa, čo skutočne miluješ.',
  },
  7: {
    number: 7,
    name: 'Voz',
    arcana: 'major',
    symbol: '🜨',
    meaning: 'Víťazstvo, odvaha, kontrola, smer. Drž opraty pevne.',
    shadow: 'Agresia, prehnaná ambícia, strata smeru.',
    advice: 'Daj jasný smer svojej energii. Vyhrávaš keď sú tvoje protiklady v rovnováhe.',
  },
  8: {
    number: 8,
    name: 'Sila',
    arcana: 'major',
    symbol: '∞',
    meaning: 'Vnútorná sila, súcit, ovládanie inštinktov cez lásku, nie cez násilie.',
    shadow: 'Pochybnosti o sebe, potlačovanie inštinktov, slabosť.',
    advice: 'Buď nežne silný/á. Tvoja vnútorná stabilita prekoná každú vonkajšiu výzvu.',
  },
  9: {
    number: 9,
    name: 'Pustovník',
    arcana: 'major',
    symbol: '🜸',
    meaning: 'Introspekcia, hľadanie pravdy v ústraní, vnútorné vedenie, svetlo lampy.',
    shadow: 'Izolácia, melanchólia, nedôvera v ľudí.',
    advice: 'Stiahni sa, počúvaj. Pravda dnes prichádza v tichu, nie v davu.',
  },
};

export function getDailyTarot(odv: number): TarotCard {
  return TAROT_BY_ODV[odv] || TAROT_BY_ODV[1];
}
