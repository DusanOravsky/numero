import type { Language } from '../store/useStore';

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

const CRYSTALS_BY_CHAKRA_EN: Record<number, Crystal[]> = {
  1: [
    { name: 'Red Jasper', color: '#dc2626', chakra: 1, properties: 'Grounding, stability, perseverance', usage: 'Carry in your pocket or place on the root chakra during meditation.' },
    { name: 'Obsidian', color: '#1c1917', chakra: 1, properties: 'Protection, truth, shadow transformation', usage: 'Hold in your hands during reflection or place beside your bed.' },
    { name: 'Hematite', color: '#57534e', chakra: 1, properties: 'Grounding, strength, concentration', usage: 'Wear as a ring or bracelet for daily stability.' },
  ],
  2: [
    { name: 'Carnelian', color: '#ea580c', chakra: 2, properties: 'Creativity, vitality, joy of life', usage: 'Place on the lower abdomen during meditation or wear as a pendant.' },
    { name: 'Moonstone', color: '#e2e8f0', chakra: 2, properties: 'Intuition, feminine energy, emotional balance', usage: 'Wear close to the body, especially during full moon.' },
    { name: 'Orange Calcite', color: '#fb923c', chakra: 2, properties: 'Optimism, creativity, emotional release', usage: 'Hold during creative work or meditation.' },
  ],
  3: [
    { name: 'Citrine', color: '#ca8a04', chakra: 3, properties: 'Self-confidence, abundance, personal power', usage: 'Carry in your wallet for abundance or place on the solar plexus.' },
    { name: 'Tiger\'s Eye', color: '#92400e', chakra: 3, properties: 'Courage, protection, clear decision-making', usage: 'Wear as a bracelet for strength during important decisions.' },
    { name: 'Pyrite', color: '#a16207', chakra: 3, properties: 'Manifestation, willpower, energy protection', usage: 'Place on your desk for concentration and manifestation.' },
  ],
  4: [
    { name: 'Rose Quartz', color: '#fb7185', chakra: 4, properties: 'Unconditional love, self-love, forgiveness', usage: 'Wear close to your heart or place in the bedroom.' },
    { name: 'Green Aventurine', color: '#16a34a', chakra: 4, properties: 'Growth, happiness, emotional healing', usage: 'Carry in your left pocket (heart side) for openness.' },
    { name: 'Malachite', color: '#065f46', chakra: 4, properties: 'Transformation, heart protection, deep healing', usage: 'Meditate with it on the heart chakra. Do not wear during sleep.' },
  ],
  5: [
    { name: 'Lapis Lazuli', color: '#1d4ed8', chakra: 5, properties: 'Truthful communication, wisdom, intuition', usage: 'Wear as a necklace close to the throat.' },
    { name: 'Aquamarine', color: '#06b6d4', chakra: 5, properties: 'Clear communication, peace, courage to speak', usage: 'Wear during important conversations and presentations.' },
    { name: 'Turquoise', color: '#0891b2', chakra: 5, properties: 'Self-expression confidence, protection, wisdom', usage: 'Wear as a pendant near the throat chakra.' },
  ],
  6: [
    { name: 'Amethyst', color: '#7c3aed', chakra: 6, properties: 'Intuition, spirituality, peace of mind', usage: 'Place on your forehead during meditation or on your nightstand.' },
    { name: 'Labradorite', color: '#4338ca', chakra: 6, properties: 'Transformation, aura protection, awakening', usage: 'Wear as a pendant to strengthen intuition.' },
    { name: 'Fluorite', color: '#8b5cf6', chakra: 6, properties: 'Mental clarity, focus, mind cleansing', usage: 'Place on your desk during intellectual work.' },
  ],
  7: [
    { name: 'Clear Quartz', color: '#f1f5f9', chakra: 7, properties: 'Energy amplification, clarity, connection to higher self', usage: 'Place on crown during meditation or wear as a pendant.' },
    { name: 'Selenite', color: '#e2e8f0', chakra: 7, properties: 'Energy cleansing, spirituality, angelic guidance', usage: 'Place in your space for cleansing or hold in your hands.' },
    { name: 'Amethyst (dark)', color: '#581c87', chakra: 7, properties: 'Deep meditation, cosmic consciousness, transformation', usage: 'Use during deep meditation practice.' },
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

const CRYSTALS_BY_NUMBER_EN: Record<number, Crystal> = {
  1: { name: 'Ruby', color: '#dc2626', chakra: 1, properties: 'Vitality, leadership, passion', usage: 'Wear during important beginnings and decisions.' },
  2: { name: 'Moonstone', color: '#e2e8f0', chakra: 2, properties: 'Intuition, partnership, emotional balance', usage: 'Wear during collaboration and relationship situations.' },
  3: { name: 'Citrine', color: '#ca8a04', chakra: 3, properties: 'Joy, creativity, self-expression', usage: 'Wear during creative work and communication.' },
  4: { name: 'Emerald', color: '#059669', chakra: 4, properties: 'Stability, building, patience', usage: 'Wear during work requiring discipline and perseverance.' },
  5: { name: 'Aquamarine', color: '#06b6d4', chakra: 5, properties: 'Freedom, change, adaptability', usage: 'Wear during travel and times of change.' },
  6: { name: 'Rose Quartz', color: '#fb7185', chakra: 4, properties: 'Love, harmony, caring', usage: 'Wear to strengthen relationships and self-love.' },
  7: { name: 'Amethyst', color: '#7c3aed', chakra: 6, properties: 'Wisdom, introspection, spiritual growth', usage: 'Wear during meditation and study.' },
  8: { name: 'Pyrite', color: '#a16207', chakra: 3, properties: 'Abundance, manifestation, personal power', usage: 'Wear during financial decisions and manifestation.' },
  9: { name: 'Tourmaline', color: '#1c1917', chakra: 1, properties: 'Protection, closure, transformation', usage: 'Wear when releasing the old and closing cycles.' },
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

const CRYSTALS_BY_ZODIAC_EN: Record<string, Crystal[]> = {
  'Baran': [
    { name: 'Diamond', color: '#f1f5f9', chakra: 7, properties: 'Clarity, strength, indestructibility', usage: 'Wear to strengthen courage and decisiveness.' },
    { name: 'Carnelian', color: '#ea580c', chakra: 2, properties: 'Vitality, courage, action', usage: 'Wear for energy and motivation to act.' },
  ],
  'Býk': [
    { name: 'Emerald', color: '#059669', chakra: 4, properties: 'Abundance, patience, loyalty', usage: 'Wear for stability and attracting abundance.' },
    { name: 'Rose Quartz', color: '#fb7185', chakra: 4, properties: 'Self-love, sensuality, peace', usage: 'Wear close to the heart for emotional balance.' },
  ],
  'Blíženci': [
    { name: 'Agate', color: '#64748b', chakra: 5, properties: 'Balance, communication, flexibility', usage: 'Wear for clearer communication and focus.' },
    { name: 'Citrine', color: '#ca8a04', chakra: 3, properties: 'Optimism, mental clarity, adaptability', usage: 'Wear during learning and conversations.' },
  ],
  'Rak': [
    { name: 'Moonstone', color: '#e2e8f0', chakra: 2, properties: 'Emotional protection, intuition, motherhood', usage: 'Wear close to the body for emotional stability.' },
    { name: 'Pearl', color: '#f8fafc', chakra: 7, properties: 'Purity, wisdom, emotional depth', usage: 'Wear as jewelry for inner harmony.' },
  ],
  'Lev': [
    { name: 'Sunstone', color: '#f59e0b', chakra: 3, properties: 'Joy, vitality, self-confidence', usage: 'Wear to boost charisma and positive energy.' },
    { name: 'Ruby', color: '#dc2626', chakra: 1, properties: 'Passion, leadership, generosity', usage: 'Wear for strength and royal energy.' },
  ],
  'Panna': [
    { name: 'Green Jasper', color: '#16a34a', chakra: 4, properties: 'Healing, order, patience', usage: 'Wear for grounding and analytical clarity.' },
    { name: 'Amazonite', color: '#06b6d4', chakra: 5, properties: 'Communication, balance, inner peace', usage: 'Wear to ease perfectionism.' },
  ],
  'Váhy': [
    { name: 'Rose Quartz', color: '#fda4af', chakra: 4, properties: 'Harmony, love, diplomatic strength', usage: 'Wear to balance relationships and inner peace.' },
    { name: 'Lapis Lazuli', color: '#1d4ed8', chakra: 5, properties: 'Truth, balance, justice', usage: 'Wear during decision-making for clarity.' },
  ],
  'Škorpión': [
    { name: 'Obsidian', color: '#1c1917', chakra: 1, properties: 'Transformation, protection, truth', usage: 'Wear for deep inner work and protection.' },
    { name: 'Malachite', color: '#065f46', chakra: 4, properties: 'Pain transformation, deep healing', usage: 'Meditate with it to release old emotions.' },
  ],
  'Strelec': [
    { name: 'Turquoise', color: '#0891b2', chakra: 5, properties: 'Wisdom, travel protection, optimism', usage: 'Wear during travel and learning.' },
    { name: 'Lapis Lazuli', color: '#1d4ed8', chakra: 6, properties: 'Vision, wisdom, spiritual seeking', usage: 'Wear to expand perspective.' },
  ],
  'Kozorožec': [
    { name: 'Garnet', color: '#7f1d1d', chakra: 1, properties: 'Perseverance, loyalty, success through work', usage: 'Wear for stability and long-term motivation.' },
    { name: 'Onyx', color: '#292524', chakra: 1, properties: 'Discipline, protection, inner strength', usage: 'Wear for strength during challenging tasks.' },
  ],
  'Vodnár': [
    { name: 'Amethyst', color: '#7c3aed', chakra: 6, properties: 'Innovation, intuition, free thinking', usage: 'Wear for connection with higher consciousness.' },
    { name: 'Aquamarine', color: '#06b6d4', chakra: 5, properties: 'Freedom, clear communication, vision', usage: 'Wear for authentic self-expression.' },
  ],
  'Ryby': [
    { name: 'Fluorite', color: '#8b5cf6', chakra: 6, properties: 'Spiritual protection, intuition, cleansing', usage: 'Wear to protect sensitive energy.' },
    { name: 'Amethyst', color: '#7c3aed', chakra: 7, properties: 'Spirituality, peace, connection to higher self', usage: 'Wear for meditation and spiritual practice.' },
  ],
};

export function getCrystalsByChakra(chakra: number, lang: Language = 'sk'): Crystal[] {
  if (lang === 'en') {
    return CRYSTALS_BY_CHAKRA_EN[chakra] || CRYSTALS_BY_CHAKRA[chakra] || [];
  }
  return CRYSTALS_BY_CHAKRA[chakra] || [];
}

export function getCrystalByNumber(num: number, lang: Language = 'sk'): Crystal {
  if (lang === 'en') {
    return CRYSTALS_BY_NUMBER_EN[num] || CRYSTALS_BY_NUMBER[num] || CRYSTALS_BY_NUMBER[1];
  }
  return CRYSTALS_BY_NUMBER[num] || CRYSTALS_BY_NUMBER[1];
}

export function getCrystalsByZodiac(skZodiacKey: string, lang: Language = 'sk'): Crystal[] {
  if (lang === 'en') {
    return CRYSTALS_BY_ZODIAC_EN[skZodiacKey] || CRYSTALS_BY_ZODIAC[skZodiacKey] || [];
  }
  return CRYSTALS_BY_ZODIAC[skZodiacKey] || [];
}

export function getDailyCrystal(odv: number, lang: Language = 'sk'): Crystal {
  if (lang === 'en') {
    return CRYSTALS_BY_NUMBER_EN[odv] || CRYSTALS_BY_NUMBER_EN[1];
  }
  return CRYSTALS_BY_NUMBER[odv] || CRYSTALS_BY_NUMBER[1];
}

export function getZodiacCrystals(sunSign: string, lang: Language = 'sk'): Crystal[] {
  if (lang === 'en') {
    return CRYSTALS_BY_ZODIAC_EN[sunSign] || [];
  }
  return CRYSTALS_BY_ZODIAC[sunSign] || [];
}

export function getBlockedChakraCrystals(blockedChakras: number[], lang: Language = 'sk'): Crystal[] {
  if (lang === 'en') {
    return blockedChakras.flatMap(ch => CRYSTALS_BY_CHAKRA_EN[ch]?.slice(0, 1) || []);
  }
  return blockedChakras.flatMap(ch => CRYSTALS_BY_CHAKRA[ch]?.slice(0, 1) || []);
}
