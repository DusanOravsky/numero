export interface Crystal {
  name: string;
  color: string;
  chakra: number;
  properties: string;
  usage: string;
}

export const CRYSTALS_BY_CHAKRA: Record<number, Crystal[]> = {
  1: [
    { name: 'Červený jaspis', color: '#dc2626', chakra: 1, properties: 'Uzemnenie, stabilita, vytrvalosť', usage: 'Nos v vrecku alebo polož na koreňovú čakru pri meditácii.' },
    { name: 'Obsidián', color: '#1c1917', chakra: 1, properties: 'Ochrana, pravda, transformácia tieňov', usage: 'Drž v rukách pri reflexii alebo polož vedľa postele.' },
    { name: 'Hematit', color: '#57534e', chakra: 1, properties: 'Zakorenenie, sila, koncentrácia', usage: 'Nos ako prsteň alebo náramok pre dennú stabilitu.' },
  ],
  2: [
    { name: 'Karneol', color: '#ea580c', chakra: 2, properties: 'Kreativita, vitalita, radosť zo života', usage: 'Polož na podbriežok pri meditácii alebo nos ako prívesok.' },
    { name: 'Mesačný kameň', color: '#e2e8f0', chakra: 2, properties: 'Intuícia, ženská energia, emocionálna rovnováha', usage: 'Nos blízko tela, obzvlášť počas splnu.' },
    { name: 'Oranžový kalcit', color: '#fb923c', chakra: 2, properties: 'Optimizmus, tvorivosť, uvoľnenie emócií', usage: 'Drž pri tvorivej práci alebo meditácii.' },
  ],
  3: [
    { name: 'Citrín', color: '#ca8a04', chakra: 3, properties: 'Sebadôvera, hojnosť, osobná moc', usage: 'Nos v peňaženke pre hojnosť alebo na solar plexus.' },
    { name: 'Tigrie oko', color: '#92400e', chakra: 3, properties: 'Odvaha, ochrana, jasné rozhodovanie', usage: 'Nos ako náramok pre silu pri dôležitých rozhodnutiach.' },
    { name: 'Pyrit', color: '#a16207', chakra: 3, properties: 'Manifestácia, vôľa, ochrana energie', usage: 'Polož na pracovný stôl pre koncentráciu a manifestáciu.' },
  ],
  4: [
    { name: 'Ružový kremeň', color: '#fb7185', chakra: 4, properties: 'Bezpodmienečná láska, sebaláska, odpustenie', usage: 'Nos blízko srdca alebo polož do spálne.' },
    { name: 'Zelený aventurín', color: '#16a34a', chakra: 4, properties: 'Rast, šťastie, emocionálne uzdravenie', usage: 'Nos v ľavom vrecku (srdcová strana) pre otvorenosť.' },
    { name: 'Malachit', color: '#065f46', chakra: 4, properties: 'Transformácia, ochrana srdca, hlboké liečenie', usage: 'Medituj s ním na srdcovej čakre. Nenosiť pri spánku.' },
  ],
  5: [
    { name: 'Lapis lazuli', color: '#1d4ed8', chakra: 5, properties: 'Pravdivá komunikácia, múdrosť, intuícia', usage: 'Nos ako náhrdelník blízko hrdla.' },
    { name: 'Akvamarín', color: '#06b6d4', chakra: 5, properties: 'Jasná komunikácia, pokoj, odvaha hovoriť', usage: 'Nos pri dôležitých rozhovoroch a prezentáciách.' },
    { name: 'Tyrkys', color: '#0891b2', chakra: 5, properties: 'Sebaistota vo vyjadrení, ochrana, múdrosť', usage: 'Nos ako prívesok pri hrdlovej čakre.' },
  ],
  6: [
    { name: 'Ametyst', color: '#7c3aed', chakra: 6, properties: 'Intuícia, duchovnosť, pokoj mysle', usage: 'Polož na čelo pri meditácii alebo na nočný stolík.' },
    { name: 'Labradorit', color: '#4338ca', chakra: 6, properties: 'Transformácia, ochrana aury, prebudenie', usage: 'Nos ako prívesok pre zosilnenie intuície.' },
    { name: 'Fluorit', color: '#8b5cf6', chakra: 6, properties: 'Mentálna jasnosť, focus, očista mysle', usage: 'Polož na pracovný stôl pri intelektuálnej práci.' },
  ],
  7: [
    { name: 'Číry kremeň', color: '#f1f5f9', chakra: 7, properties: 'Zosilnenie energie, jasnosť, prepojenie s vyšším ja', usage: 'Polož na temeno pri meditácii alebo nos ako prívesok.' },
    { name: 'Selenit', color: '#e2e8f0', chakra: 7, properties: 'Čistenie energie, duchovno, anjelské vedenie', usage: 'Polož do priestoru pre očistu alebo drž v rukách.' },
    { name: 'Ametyst (tmavý)', color: '#581c87', chakra: 7, properties: 'Hlboká meditácia, kozmické vedomie, transformácia', usage: 'Používaj pri hlbokej meditačnej praxi.' },
  ],
};

export const CRYSTALS_BY_NUMBER: Record<number, Crystal> = {
  1: { name: 'Rubín', color: '#dc2626', chakra: 1, properties: 'Vitalita, vodcovstvo, vášeň', usage: 'Nos pri dôležitých začiatkoch a rozhodnutiach.' },
  2: { name: 'Mesačný kameň', color: '#e2e8f0', chakra: 2, properties: 'Intuícia, partnerstvo, emocionálna rovnováha', usage: 'Nos pri spolupráci a vzťahových situáciách.' },
  3: { name: 'Citrín', color: '#ca8a04', chakra: 3, properties: 'Radosť, kreativita, sebavyjadrenie', usage: 'Nos pri tvorivej práci a komunikácii.' },
  4: { name: 'Smaragd', color: '#059669', chakra: 4, properties: 'Stabilita, budovanie, trpezlivosť', usage: 'Nos pri práci vyžadujúcej disciplínu a vytrvalosť.' },
  5: { name: 'Akvamarín', color: '#06b6d4', chakra: 5, properties: 'Sloboda, zmena, adaptabilita', usage: 'Nos pri cestovaní a v časoch zmien.' },
  6: { name: 'Ružový kremeň', color: '#fb7185', chakra: 4, properties: 'Láska, harmónia, starostlivosť', usage: 'Nos pre posilnenie vzťahov a sebalásky.' },
  7: { name: 'Ametyst', color: '#7c3aed', chakra: 6, properties: 'Múdrosť, introspekcia, duchovný rast', usage: 'Nos pri meditácii a štúdiu.' },
  8: { name: 'Pyrit', color: '#a16207', chakra: 3, properties: 'Hojnosť, manifestácia, osobná moc', usage: 'Nos pri finančných rozhodnutiach a manifestácii.' },
  9: { name: 'Turmalín', color: '#1c1917', chakra: 1, properties: 'Ochrana, uzatváranie, transformácia', usage: 'Nos pri púšťaní starého a uzatváraní cyklov.' },
};

export const CRYSTALS_BY_ZODIAC: Record<string, Crystal[]> = {
  'Baran': [
    { name: 'Diamant', color: '#f1f5f9', chakra: 7, properties: 'Jasnosť, sila, nezničiteľnosť', usage: 'Nos pre posilnenie odvahy a rozhodnosti.' },
    { name: 'Karneol', color: '#ea580c', chakra: 2, properties: 'Vitalita, odvaha, akcia', usage: 'Nos pre energiu a motiváciu k činom.' },
  ],
  'Býk': [
    { name: 'Smaragd', color: '#059669', chakra: 4, properties: 'Hojnosť, trpezlivosť, vernosť', usage: 'Nos pre stabilitu a priťahovanie hojnosti.' },
    { name: 'Ružový kremeň', color: '#fb7185', chakra: 4, properties: 'Sebaláska, zmyselnosť, pokoj', usage: 'Nos blízko srdca pre emocionálnu rovnováhu.' },
  ],
  'Blíženci': [
    { name: 'Achát', color: '#64748b', chakra: 5, properties: 'Rovnováha, komunikácia, flexibilita', usage: 'Nos pre jasnejšiu komunikáciu a sústredenie.' },
    { name: 'Citrín', color: '#ca8a04', chakra: 3, properties: 'Optimizmus, mentálna jasnosť, adaptabilita', usage: 'Nos pri učení a rozhovoroch.' },
  ],
  'Rak': [
    { name: 'Mesačný kameň', color: '#e2e8f0', chakra: 2, properties: 'Emocionálna ochrana, intuícia, materstvo', usage: 'Nos blízko tela pre emocionálnu stabilitu.' },
    { name: 'Perla', color: '#f8fafc', chakra: 7, properties: 'Čistota, múdrosť, emocionálna hĺbka', usage: 'Nos ako šperk pre vnútornú harmóniu.' },
  ],
  'Lev': [
    { name: 'Slnečný kameň', color: '#f59e0b', chakra: 3, properties: 'Radosť, vitalita, sebadôvera', usage: 'Nos pre zvýšenie charizmy a pozitívnej energie.' },
    { name: 'Rubín', color: '#dc2626', chakra: 1, properties: 'Vášeň, vodcovstvo, veľkorysosť', usage: 'Nos pre silu a kráľovskú energiu.' },
  ],
  'Panna': [
    { name: 'Zelený jaspis', color: '#16a34a', chakra: 4, properties: 'Uzdravenie, poriadok, trpezlivosť', usage: 'Nos pre uzemnenie a analytickú jasnosť.' },
    { name: 'Amazonit', color: '#06b6d4', chakra: 5, properties: 'Komunikácia, rovnováha, vnútorný mier', usage: 'Nos pre zmiernenie perfekcionizmu.' },
  ],
  'Váhy': [
    { name: 'Ruženín', color: '#fda4af', chakra: 4, properties: 'Harmónia, láska, diplomatická sila', usage: 'Nos pre vyváženie vzťahov a vnútorný pokoj.' },
    { name: 'Lapis lazuli', color: '#1d4ed8', chakra: 5, properties: 'Pravda, rovnováha, spravodlivosť', usage: 'Nos pri rozhodovaní pre jasnosť.' },
  ],
  'Škorpión': [
    { name: 'Obsidián', color: '#1c1917', chakra: 1, properties: 'Transformácia, ochrana, pravda', usage: 'Nos pre hlbokú vnútornú prácu a ochranu.' },
    { name: 'Malachit', color: '#065f46', chakra: 4, properties: 'Transformácia bolesti, hlboké liečenie', usage: 'Medituj s ním pre uvoľnenie starých emócií.' },
  ],
  'Strelec': [
    { name: 'Tyrkys', color: '#0891b2', chakra: 5, properties: 'Múdrosť, ochrana na cestách, optimizmus', usage: 'Nos pri cestovaní a učení.' },
    { name: 'Lapis lazuli', color: '#1d4ed8', chakra: 6, properties: 'Vízia, múdrosť, duchovné hľadanie', usage: 'Nos pre rozšírenie perspektívy.' },
  ],
  'Kozorožec': [
    { name: 'Granát', color: '#7f1d1d', chakra: 1, properties: 'Vytrvalosť, vernosť, úspech cez prácu', usage: 'Nos pre stabilitu a dlhodobú motiváciu.' },
    { name: 'Ónyx', color: '#292524', chakra: 1, properties: 'Disciplína, ochrana, vnútorná sila', usage: 'Nos pre silu pri náročných úlohách.' },
  ],
  'Vodnár': [
    { name: 'Ametyst', color: '#7c3aed', chakra: 6, properties: 'Inovatívnosť, intuícia, slobodné myslenie', usage: 'Nos pre prepojenie s vyšším vedomím.' },
    { name: 'Akvamarín', color: '#06b6d4', chakra: 5, properties: 'Sloboda, jasná komunikácia, vízia', usage: 'Nos pre autentické sebavyjadrenie.' },
  ],
  'Ryby': [
    { name: 'Fluorit', color: '#8b5cf6', chakra: 6, properties: 'Duchovná ochrana, intuícia, čistenie', usage: 'Nos pre ochranu citlivej energie.' },
    { name: 'Ametyst', color: '#7c3aed', chakra: 7, properties: 'Duchovno, pokoj, prepojenie s vyšším ja', usage: 'Nos pre meditáciu a duchovnú prax.' },
  ],
};

export function getDailyCrystal(odv: number): Crystal {
  return CRYSTALS_BY_NUMBER[odv] || CRYSTALS_BY_NUMBER[1];
}

export function getZodiacCrystals(sunSign: string): Crystal[] {
  return CRYSTALS_BY_ZODIAC[sunSign] || [];
}

export function getBlockedChakraCrystals(blockedChakras: number[]): Crystal[] {
  return blockedChakras.flatMap(ch => CRYSTALS_BY_CHAKRA[ch]?.slice(0, 1) || []);
}
