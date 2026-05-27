import type { Language } from '../store/useStore';

export const AFFIRMATIONS_POOL_SK: Record<number, string[]> = {
  1: ['Dnes začínam s odvahou a jasnosťou.', 'Moja energia nového začiatku je nezastaviteľná.', 'Som pripravený/á viesť svoj deň.', 'Dnes robím odvážny prvý krok.', 'Moja vôľa je jasná — konám.'],
  2: ['Dnes som otvorený/á hlbokému prepojeniu.', 'Moja trpezlivosť prináša vzácne plody.', 'Počúvam s celým srdcom.', 'Harmónia vo vzťahoch začína vo mne.', 'Dnes dávam priestor tichej spolupráci.'],
  3: ['Dnes tvorím a vyjadrujem svoju pravdu.', 'Moja kreativita nemá hranice.', 'Radosť je moja navigácia životom.', 'Zdieľam svoju autenticitu so svetom.', 'Dnes komunikujem s ľahkosťou a láskou.'],
  4: ['Dnes budujem s trpezlivosťou a láskou.', 'Moja disciplína je cesta k slobode.', 'Každý malý krok dnes má veľký zmysel.', 'Poriadok v mojom živote prináša pokoj.', 'Dokončujem veci s radosťou a precíznosťou.'],
  5: ['Dnes vítam nové s dôverou.', 'Zmena je moja spojenkyňa — nie nepriateľka.', 'Som flexibilný/á a otvorený/á prekvapeniu.', 'Každá nová skúsenosť ma obohacuje.', 'Dnes hovorím áno dobrodružstvu.'],
  6: ['Dnes milujem bezpodmienečne.', 'Vytváram harmóniu a krásu okolo seba.', 'Som tu pre tých, ktorí ma potrebujú.', 'Moja starostlivosť je moja sila.', 'Dnes sa postarám o niečo krásne.'],
  7: ['Dnes počúvam svoju vnútornú múdrosť.', 'V tichu nachádzam odpovede.', 'Moja introspekcia je cestou k pravde.', 'Dovolím si len byť — bez tlaku na výkon.', 'Moja vnútorná cesta je tá najdôležitejšia.'],
  8: ['Dnes manifestujem svoju víziu.', 'Konám s autoritou a integritou.', 'Hojnosť je môj prirodzený stav.', 'Som tvorca/tvorkyňa vlastnej reality.', 'Moja sila slúži vyššiemu dobru.'],
  9: ['Dnes púšťam staré a vytváram priestor.', 'Odpúšťam s ľahkosťou a vďakou.', 'Dokončujem veci s pokojom v srdci.', 'Som kanálom súcitu pre tento svet.', 'Moja múdrosť vie, kedy pustiť.'],
};

export const AFFIRMATIONS_POOL_EN: Record<number, string[]> = {
  1: ['Today I begin with courage and clarity.', 'My energy of new beginnings is unstoppable.', 'I am ready to lead my day.', 'Today I take a bold first step.', 'My will is clear — I act.'],
  2: ['Today I am open to deep connection.', 'My patience bears precious fruit.', 'I listen with my whole heart.', 'Harmony in relationships starts within me.', 'Today I make space for quiet collaboration.'],
  3: ['Today I create and express my truth.', 'My creativity knows no bounds.', 'Joy is my navigation through life.', 'I share my authenticity with the world.', 'Today I communicate with ease and love.'],
  4: ['Today I build with patience and love.', 'My discipline is the path to freedom.', 'Every small step today has great meaning.', 'Order in my life brings peace.', 'I complete things with joy and precision.'],
  5: ['Today I welcome the new with trust.', 'Change is my ally — not my enemy.', 'I am flexible and open to surprise.', 'Every new experience enriches me.', 'Today I say yes to adventure.'],
  6: ['Today I love unconditionally.', 'I create harmony and beauty around me.', 'I am here for those who need me.', 'My care is my strength.', 'Today I will tend to something beautiful.'],
  7: ['Today I listen to my inner wisdom.', 'In silence I find answers.', 'My introspection is a path to truth.', 'I allow myself to just be — without pressure to perform.', 'My inner journey is the most important one.'],
  8: ['Today I manifest my vision.', 'I act with authority and integrity.', 'Abundance is my natural state.', 'I am a creator of my own reality.', 'My power serves a higher good.'],
  9: ['Today I release the old and create space.', 'I forgive with ease and gratitude.', 'I complete things with peace in my heart.', 'I am a channel of compassion for this world.', 'My wisdom knows when to let go.'],
};

export interface DailyRitual {
  morning: string;
  evening: string;
  body: string;
}

export const DAILY_RITUALS_SK: Record<number, DailyRitual> = {
  1: { morning: 'Ranná meditácia zameraná na vizualizáciu nového začiatku. 5 minút dýchania ohňom (kapalabhati) pre aktiváciu energie.', evening: 'Čo nové som dnes začal/a? Kde som prejavil/a odvahu?', body: 'Kardio aktivita alebo rýchla prechádzka. Telo potrebuje pohyb a dynamiku.' },
  2: { morning: 'Ranná meditácia v páre alebo so zameraním na srdcovú čakru. Pomalé, hlboké dýchanie (4-7-8) pre upokojenie.', evening: 'Komu som dnes venoval/a pozornosť? Kde som prejavil/a trpezlivosť?', body: 'Jemný strečing alebo joga. Telo potrebuje jemnosť a láskavý dotyk.' },
  3: { morning: 'Ranná tvorivá meditácia – vizualizácia farieb a tvarov. Striedavé dýchanie nozdier (nadi shodhana) pre vyváženie.', evening: 'Čo som dnes vytvoril/a? Ako som sa vyjadril/a?', body: 'Tanec, spev alebo akákoľvek tvorivá pohybová aktivita. Telo chce tvoriť.' },
  4: { morning: 'Ranná meditácia na zakorenenie – vizualizácia koreňov do zeme. Boxové dýchanie (4-4-4-4) pre stabilitu.', evening: 'Čo som dnes vybudoval/a? Kde som prejavil/a disciplínu?', body: 'Silový tréning alebo práca v záhrade. Telo potrebuje pocit stability a sily.' },
  5: { morning: 'Ranná meditácia na otvorenosť – vizualizácia otvorených dverí a ciest. Energizujúce dýchanie (bhastrika) pre vitalitu.', evening: 'Čo nové som dnes zažil/a? Kde som bol/a flexibilný/á?', body: 'Nová pohybová aktivita – niečo, čo ste ešte neskúsili. Telo túži po novosti.' },
  6: { morning: 'Ranná meditácia na srdcovú čakru s mantrou lásky. Dýchanie do srdca (coherent breathing) pre harmóniu.', evening: 'Koho som dnes miloval/a? Kde som vytvoril/a harmóniu?', body: 'Párová aktivita alebo masáž. Telo potrebuje láskyplný kontakt a starostlivosť.' },
  7: { morning: 'Hlboká tichá meditácia – 10-15 minút v úplnom tichu. Pomalé brušné dýchanie pre vnútorný pokoj.', evening: 'Čo som sa dnes naučil/a? Aký vnútorný hlas som počul/a?', body: 'Prechádzka v prírode v tichu. Telo potrebuje pokoj a spojenie s prírodou.' },
  8: { morning: 'Ranná vizualizácia úspechu a hojnosti. Silové dýchanie (wim hof metóda) pre energiu a odhodlanie.', evening: 'Čo som dnes zmanifestoval/a? Kde som prejavil/a svoju silu?', body: 'Intenzívny tréning alebo výzva. Telo potrebuje cítiť svoju moc a schopnosti.' },
  9: { morning: 'Meditácia odpustenia a vďačnosti. Dýchanie s predĺženým výdychom pre uvoľnenie starého.', evening: 'Čo som dnes pustil/a? Komu som odpustil/a?', body: 'Jemná joga alebo plávanie. Telo potrebuje uvoľnenie a regeneráciu.' },
};

export const DAILY_RITUALS_EN: Record<number, DailyRitual> = {
  1: { morning: 'Morning meditation focused on visualizing a new beginning. 5 minutes of fire breathing (kapalabhati) to activate energy.', evening: 'What new thing did I start today? Where did I show courage?', body: 'Cardio activity or a brisk walk. The body needs movement and dynamism.' },
  2: { morning: 'Morning meditation in pairs or focused on the heart chakra. Slow, deep breathing (4-7-8) for calming.', evening: 'Who did I give attention to today? Where did I show patience?', body: 'Gentle stretching or yoga. The body needs gentleness and loving touch.' },
  3: { morning: 'Creative morning meditation — visualization of colors and shapes. Alternate nostril breathing (nadi shodhana) for balance.', evening: 'What did I create today? How did I express myself?', body: 'Dance, singing, or any creative movement activity. The body wants to create.' },
  4: { morning: 'Grounding morning meditation — visualization of roots into the earth. Box breathing (4-4-4-4) for stability.', evening: 'What did I build today? Where did I show discipline?', body: 'Strength training or gardening. The body needs a sense of stability and strength.' },
  5: { morning: 'Morning meditation on openness — visualization of open doors and paths. Energizing breathing (bhastrika) for vitality.', evening: 'What new thing did I experience today? Where was I flexible?', body: 'A new movement activity — something you have not tried yet. The body craves novelty.' },
  6: { morning: 'Morning heart chakra meditation with a love mantra. Heart breathing (coherent breathing) for harmony.', evening: 'Who did I love today? Where did I create harmony?', body: 'Partner activity or massage. The body needs loving contact and care.' },
  7: { morning: 'Deep silent meditation — 10-15 minutes in complete silence. Slow abdominal breathing for inner peace.', evening: 'What did I learn today? What inner voice did I hear?', body: 'A walk in nature in silence. The body needs peace and connection with nature.' },
  8: { morning: 'Morning visualization of success and abundance. Power breathing (Wim Hof method) for energy and determination.', evening: 'What did I manifest today? Where did I show my strength?', body: 'Intense training or challenge. The body needs to feel its power and capabilities.' },
  9: { morning: 'Meditation of forgiveness and gratitude. Breathing with extended exhale to release the old.', evening: 'What did I let go of today? Who did I forgive?', body: 'Gentle yoga or swimming. The body needs release and regeneration.' },
};

export function getAffirmationsPool(language: Language): Record<number, string[]> {
  return language === 'sk' ? AFFIRMATIONS_POOL_SK : AFFIRMATIONS_POOL_EN;
}

export function getDailyRituals(language: Language): Record<number, DailyRitual> {
  return language === 'sk' ? DAILY_RITUALS_SK : DAILY_RITUALS_EN;
}
