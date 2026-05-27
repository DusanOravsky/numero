import type { Language } from '../store/useStore';

type NameMap = Record<string, Record<Language, string>>;

export const ZODIAC_DISPLAY: NameMap = {
  'Baran': { sk: 'Baran', en: 'Aries' },
  'Býk': { sk: 'Býk', en: 'Taurus' },
  'Blíženci': { sk: 'Blíženci', en: 'Gemini' },
  'Rak': { sk: 'Rak', en: 'Cancer' },
  'Lev': { sk: 'Lev', en: 'Leo' },
  'Panna': { sk: 'Panna', en: 'Virgo' },
  'Váhy': { sk: 'Váhy', en: 'Libra' },
  'Škorpión': { sk: 'Škorpión', en: 'Scorpio' },
  'Strelec': { sk: 'Strelec', en: 'Sagittarius' },
  'Kozorožec': { sk: 'Kozorožec', en: 'Capricorn' },
  'Vodnár': { sk: 'Vodnár', en: 'Aquarius' },
  'Ryby': { sk: 'Ryby', en: 'Pisces' },
};

export const PLANET_DISPLAY: NameMap = {
  'Slnko': { sk: 'Slnko', en: 'Sun' },
  'Mesiac': { sk: 'Mesiac', en: 'Moon' },
  'Merkúr': { sk: 'Merkúr', en: 'Mercury' },
  'Venuša': { sk: 'Venuša', en: 'Venus' },
  'Mars': { sk: 'Mars', en: 'Mars' },
  'Jupiter': { sk: 'Jupiter', en: 'Jupiter' },
  'Saturn': { sk: 'Saturn', en: 'Saturn' },
  'Urán': { sk: 'Urán', en: 'Uranus' },
  'Neptún': { sk: 'Neptún', en: 'Neptune' },
  'Pluto': { sk: 'Pluto', en: 'Pluto' },
  'Lilith': { sk: 'Lilith', en: 'Lilith' },
  'Chiron': { sk: 'Chiron', en: 'Chiron' },
  'Severný uzol': { sk: 'Severný uzol', en: 'North Node' },
  'Južný uzol': { sk: 'Južný uzol', en: 'South Node' },
};

export const ELEMENT_DISPLAY: NameMap = {
  'Oheň': { sk: 'Oheň', en: 'Fire' },
  'Zem': { sk: 'Zem', en: 'Earth' },
  'Vzduch': { sk: 'Vzduch', en: 'Air' },
  'Voda': { sk: 'Voda', en: 'Water' },
};

export const QUALITY_DISPLAY: NameMap = {
  'Kardinálna': { sk: 'Kardinálna', en: 'Cardinal' },
  'Fixná': { sk: 'Fixná', en: 'Fixed' },
  'Mutabilná': { sk: 'Mutabilná', en: 'Mutable' },
  'Kardinálny': { sk: 'Kardinálny', en: 'Cardinal' },
  'Fixný': { sk: 'Fixný', en: 'Fixed' },
  'Mutabilný': { sk: 'Mutabilný', en: 'Mutable' },
};

export const HD_TYPE_DISPLAY: NameMap = {
  'Generátor': { sk: 'Generátor', en: 'Generator' },
  'Manifestujúci Generátor': { sk: 'Manifestujúci Generátor', en: 'Manifesting Generator' },
  'Projektor': { sk: 'Projektor', en: 'Projector' },
  'Manifestor': { sk: 'Manifestor', en: 'Manifestor' },
  'Reflektor': { sk: 'Reflektor', en: 'Reflector' },
};

export const HD_AUTHORITY_DISPLAY: NameMap = {
  'Emocionálna': { sk: 'Emocionálna', en: 'Emotional' },
  'Sakrálna': { sk: 'Sakrálna', en: 'Sacral' },
  'Slezina': { sk: 'Slezina', en: 'Splenic' },
  'Slezinová': { sk: 'Slezinová', en: 'Splenic' },
  'Srdce / Ego': { sk: 'Srdce / Ego', en: 'Heart / Ego' },
  'Ego': { sk: 'Ego', en: 'Ego' },
  'Sebaprojektovaná': { sk: 'Sebaprojektovaná', en: 'Self-Projected' },
  'G centrum': { sk: 'G centrum', en: 'G Center' },
  'G Centrum': { sk: 'G Centrum', en: 'G Center' },
  'Mentálna / Environmentálna': { sk: 'Mentálna / Environmentálna', en: 'Mental / Environmental' },
  'Mentálna/Environmentálna': { sk: 'Mentálna/Environmentálna', en: 'Mental / Environmental' },
  'Lunárna': { sk: 'Lunárna', en: 'Lunar' },
};

export const HD_CENTER_DISPLAY: NameMap = {
  'Hlava': { sk: 'Hlava', en: 'Head' },
  'Ajna': { sk: 'Ajna', en: 'Ajna' },
  'Hrdlo': { sk: 'Hrdlo', en: 'Throat' },
  'G': { sk: 'G', en: 'G' },
  'Srdce': { sk: 'Srdce', en: 'Heart' },
  'Solárny plexus': { sk: 'Solárny plexus', en: 'Solar Plexus' },
  'Sakrálne': { sk: 'Sakrálne', en: 'Sacral' },
  'Slezina': { sk: 'Slezina', en: 'Spleen' },
  'Koreň': { sk: 'Koreň', en: 'Root' },
};

export const HD_CHANNEL_DISPLAY: NameMap = {
  'Inšpirácia': { sk: 'Inšpirácia', en: 'Inspiration' },
  'Bubeník': { sk: 'Bubeník', en: 'The Beat' },
  'Mutácia': { sk: 'Mutácia', en: 'Mutation' },
  'Logika': { sk: 'Logika', en: 'Logic' },
  'Rytmus': { sk: 'Rytmus', en: 'Rhythm' },
  'Intimita': { sk: 'Intimita', en: 'Intimacy' },
  'Alfa': { sk: 'Alfa', en: 'The Alpha' },
  'Sústredenie': { sk: 'Sústredenie', en: 'Concentration' },
  'Prebudenie': { sk: 'Prebudenie', en: 'Awakening' },
  'Prieskum': { sk: 'Prieskum', en: 'Exploration' },
  'Dokonalosť formy': { sk: 'Dokonalosť formy', en: 'Perfected Form' },
  'Zvedavosť': { sk: 'Zvedavosť', en: 'Curiosity' },
  'Otvorenosť': { sk: 'Otvorenosť', en: 'Openness' },
  'Márnotratník': { sk: 'Márnotratník', en: 'The Prodigal' },
  'Talent': { sk: 'Talent', en: 'Talent' },
  'Prijatie': { sk: 'Prijatie', en: 'Acceptance' },
  'Súd': { sk: 'Súd', en: 'Judgment' },
  'Syntéza': { sk: 'Syntéza', en: 'Synthesis' },
  'Charizma': { sk: 'Charizma', en: 'Charisma' },
  'Mozgová vlna': { sk: 'Mozgová vlna', en: 'The Brainwave' },
  'Peňažný kanál': { sk: 'Peňažný kanál', en: 'The Money Line' },
  'Štruktúrovanie': { sk: 'Štruktúrovanie', en: 'Structuring' },
  'Uvedomenie': { sk: 'Uvedomenie', en: 'Awareness' },
  'Zasvätenie': { sk: 'Zasvätenie', en: 'Initiation' },
  'Odovzdanie': { sk: 'Odovzdanie', en: 'Surrender' },
  'Zachovanie': { sk: 'Zachovanie', en: 'Preservation' },
  'Bojovnosť': { sk: 'Bojovnosť', en: 'Struggle' },
  'Objavovanie': { sk: 'Objavovanie', en: 'Discovery' },
  'Uznanie': { sk: 'Uznanie', en: 'Recognition' },
  'Transformácia': { sk: 'Transformácia', en: 'Transformation' },
  'Sila': { sk: 'Sila', en: 'Power' },
  'Pominuteľnosť': { sk: 'Pominuteľnosť', en: 'Transitoriness' },
  'Komunita': { sk: 'Komunita', en: 'Community' },
  'Emocionalita': { sk: 'Emocionalita', en: 'Emotionality' },
  'Dozrievanie': { sk: 'Dozrievanie', en: 'Maturation' },
  'Abstrakcia': { sk: 'Abstrakcia', en: 'Abstraction' },
};

export const HD_STRATEGY_DISPLAY: NameMap = {
  'Reagovať': { sk: 'Reagovať', en: 'To respond' },
  'Reagovať a informovať': { sk: 'Reagovať a informovať', en: 'To respond & inform' },
  'Čakať na pozvanie': { sk: 'Čakať na pozvanie', en: 'Wait for invitation' },
  'Informovať': { sk: 'Informovať', en: 'To inform' },
  'Čakať 28 dní': { sk: 'Čakať 28 dní', en: 'Wait 28 days' },
};

export const HD_NOT_SELF_THEME_DISPLAY: NameMap = {
  'Hnev': { sk: 'Hnev', en: 'Anger' },
  'Frustrácia': { sk: 'Frustrácia', en: 'Frustration' },
  'Frustrácia a hnev': { sk: 'Frustrácia a hnev', en: 'Frustration & anger' },
  'Horkosť': { sk: 'Horkosť', en: 'Bitterness' },
  'Sklamanie': { sk: 'Sklamanie', en: 'Disappointment' },
};

export const CHAKRA_NAME_DISPLAY: NameMap = {
  'Koreňová čakra': { sk: 'Koreňová čakra', en: 'Root Chakra' },
  'Sakrálna čakra': { sk: 'Sakrálna čakra', en: 'Sacral Chakra' },
  'Čakra solárneho plexu': { sk: 'Čakra solárneho plexu', en: 'Solar Plexus Chakra' },
  'Srdcová čakra': { sk: 'Srdcová čakra', en: 'Heart Chakra' },
  'Krčná čakra': { sk: 'Krčná čakra', en: 'Throat Chakra' },
  'Čakra tretieho oka': { sk: 'Čakra tretieho oka', en: 'Third Eye Chakra' },
  'Korunná čakra': { sk: 'Korunná čakra', en: 'Crown Chakra' },
};

export const CHAKRA_LOCATION_DISPLAY: NameMap = {
  'Báza chrbtice': { sk: 'Báza chrbtice', en: 'Base of spine' },
  'Pod pupkom': { sk: 'Pod pupkom', en: 'Below navel' },
  'Solárny plexus': { sk: 'Solárny plexus', en: 'Solar plexus' },
  'Stred hrudníka': { sk: 'Stred hrudníka', en: 'Center of chest' },
  'Hrdlo': { sk: 'Hrdlo', en: 'Throat' },
  'Stred čela': { sk: 'Stred čela', en: 'Center of forehead' },
  'Temeno hlavy': { sk: 'Temeno hlavy', en: 'Crown of head' },
};

export const CHAKRA_ELEMENT_DISPLAY: NameMap = {
  'Zem': { sk: 'Zem', en: 'Earth' },
  'Voda': { sk: 'Voda', en: 'Water' },
  'Oheň': { sk: 'Oheň', en: 'Fire' },
  'Vzduch': { sk: 'Vzduch', en: 'Air' },
  'Éter': { sk: 'Éter', en: 'Ether' },
  'Svetlo': { sk: 'Svetlo', en: 'Light' },
  'Myšlienka': { sk: 'Myšlienka', en: 'Thought' },
};

export const CHAKRA_THEME_DISPLAY: NameMap = {
  'Bezpečie': { sk: 'Bezpečie', en: 'Safety' },
  'Prežitie': { sk: 'Prežitie', en: 'Survival' },
  'Stabilita': { sk: 'Stabilita', en: 'Stability' },
  'Zakorenenie': { sk: 'Zakorenenie', en: 'Grounding' },
  'Kreativita': { sk: 'Kreativita', en: 'Creativity' },
  'Emócie': { sk: 'Emócie', en: 'Emotions' },
  'Sexualita': { sk: 'Sexualita', en: 'Sexuality' },
  'Radosť': { sk: 'Radosť', en: 'Joy' },
  'Sila vôle': { sk: 'Sila vôle', en: 'Willpower' },
  'Sebavedomie': { sk: 'Sebavedomie', en: 'Self-confidence' },
  'Osobná moc': { sk: 'Osobná moc', en: 'Personal power' },
  'Hranice': { sk: 'Hranice', en: 'Boundaries' },
  'Láska': { sk: 'Láska', en: 'Love' },
  'Súcit': { sk: 'Súcit', en: 'Compassion' },
  'Odpustenie': { sk: 'Odpustenie', en: 'Forgiveness' },
  'Prijatie': { sk: 'Prijatie', en: 'Acceptance' },
  'Komunikácia': { sk: 'Komunikácia', en: 'Communication' },
  'Pravda': { sk: 'Pravda', en: 'Truth' },
  'Sebavyjadrenie': { sk: 'Sebavyjadrenie', en: 'Self-expression' },
  'Autenticita': { sk: 'Autenticita', en: 'Authenticity' },
  'Intuícia': { sk: 'Intuícia', en: 'Intuition' },
  'Vízia': { sk: 'Vízia', en: 'Vision' },
  'Múdrosť': { sk: 'Múdrosť', en: 'Wisdom' },
  'Vnútorné vedenie': { sk: 'Vnútorné vedenie', en: 'Inner guidance' },
  'Duchovnosť': { sk: 'Duchovnosť', en: 'Spirituality' },
  'Prepojenie': { sk: 'Prepojenie', en: 'Connection' },
  'Jednota': { sk: 'Jednota', en: 'Unity' },
  'Osvietenie': { sk: 'Osvietenie', en: 'Enlightenment' },
};

export const CHAKRA_STATUS_TEXT: Record<number, Record<'balanced' | 'blocked' | 'hyperactive', Record<Language, string>>> = {
  1: {
    balanced: { sk: 'Pocit bezpečia, stability, dôvery v život', en: 'Feeling of safety, stability, trust in life' },
    blocked: { sk: 'Strach, úzkosť, nestabilita, finančné problémy', en: 'Fear, anxiety, instability, financial problems' },
    hyperactive: { sk: 'Materializmus, chamtivosť, rigidita', en: 'Materialism, greed, rigidity' },
  },
  2: {
    balanced: { sk: 'Kreativita, zdravé vzťahy, radosť zo života', en: 'Creativity, healthy relationships, joy of life' },
    blocked: { sk: 'Vina, strata kreativity, emocionálna necitlivosť', en: 'Guilt, loss of creativity, emotional numbness' },
    hyperactive: { sk: 'Emocionálna závislosť, manipulácia', en: 'Emotional dependency, manipulation' },
  },
  3: {
    balanced: { sk: 'Sebadôvera, motivácia, zdravé hranice', en: 'Self-confidence, motivation, healthy boundaries' },
    blocked: { sk: 'Nízke sebavedomie, nerozhodnosť, obeť', en: 'Low self-esteem, indecisiveness, victim mentality' },
    hyperactive: { sk: 'Kontrola, agresia, perfekcionizmus', en: 'Control, aggression, perfectionism' },
  },
  4: {
    balanced: { sk: 'Bezpodmienečná láska, súcit, odpustenie', en: 'Unconditional love, compassion, forgiveness' },
    blocked: { sk: 'Uzavretosť, strach z intimity, žiarlivosť', en: 'Emotional closure, fear of intimacy, jealousy' },
    hyperactive: { sk: 'Obetovanie sa, závislosť od lásky', en: 'Self-sacrifice, love dependency' },
  },
  5: {
    balanced: { sk: 'Jasná komunikácia, autentické vyjadrenie', en: 'Clear communication, authentic expression' },
    blocked: { sk: 'Strach z vyjadrenia, klamstvo, tichosť', en: 'Fear of expression, dishonesty, silence' },
    hyperactive: { sk: 'Klebety, dominancia v konverzácii', en: 'Gossip, conversational dominance' },
  },
  6: {
    balanced: { sk: 'Jasná intuícia, vnútorné vedenie, múdrosť', en: 'Clear intuition, inner guidance, wisdom' },
    blocked: { sk: 'Zmätenosť, nedôvera intuícii, ilúzie', en: 'Confusion, distrust of intuition, illusions' },
    hyperactive: { sk: 'Odpojenie od reality, halucinácie', en: 'Disconnection from reality, hallucinations' },
  },
  7: {
    balanced: { sk: 'Duchovné prepojenie, vnútorný mier, jednota', en: 'Spiritual connection, inner peace, unity' },
    blocked: { sk: 'Oddelenie od duchovna, cynizmus, prázdnota', en: 'Disconnection from spirituality, cynicism, emptiness' },
    hyperactive: { sk: 'Duchovná posadnutosť, odpojenie od tela', en: 'Spiritual obsession, disconnection from body' },
  },
};

export const CHINESE_ANIMAL_DISPLAY: NameMap = {
  'Potkan': { sk: 'Potkan', en: 'Rat' },
  'Byvol': { sk: 'Byvol', en: 'Ox' },
  'Tiger': { sk: 'Tiger', en: 'Tiger' },
  'Zajac': { sk: 'Zajac', en: 'Rabbit' },
  'Drak': { sk: 'Drak', en: 'Dragon' },
  'Had': { sk: 'Had', en: 'Snake' },
  'Kôň': { sk: 'Kôň', en: 'Horse' },
  'Koza': { sk: 'Koza', en: 'Goat' },
  'Opica': { sk: 'Opica', en: 'Monkey' },
  'Kohút': { sk: 'Kohút', en: 'Rooster' },
  'Pes': { sk: 'Pes', en: 'Dog' },
  'Prasa': { sk: 'Prasa', en: 'Pig' },
};

export const CHINESE_ELEMENT_DISPLAY: NameMap = {
  'Drevo': { sk: 'Drevo', en: 'Wood' },
  'Oheň': { sk: 'Oheň', en: 'Fire' },
  'Zem': { sk: 'Zem', en: 'Earth' },
  'Kov': { sk: 'Kov', en: 'Metal' },
  'Voda': { sk: 'Voda', en: 'Water' },
};

export const TCM_ELEMENT_DISPLAY: NameMap = {
  'drevo': { sk: 'Drevo', en: 'Wood' },
  'ohen': { sk: 'Oheň', en: 'Fire' },
  'zem': { sk: 'Zem', en: 'Earth' },
  'kov': { sk: 'Kov', en: 'Metal' },
  'voda': { sk: 'Voda', en: 'Water' },
};

export const DOSHA_DISPLAY: NameMap = {
  'vata': { sk: 'Vata', en: 'Vata' },
  'pitta': { sk: 'Pitta', en: 'Pitta' },
  'kapha': { sk: 'Kapha', en: 'Kapha' },
};

export const MOON_PHASE_DISPLAY: NameMap = {
  'Nov': { sk: 'Nov', en: 'New Moon' },
  'Dorastajúci polmesiac': { sk: 'Dorastajúci polmesiac', en: 'Waxing Crescent' },
  'Dorastajúci kosáčik': { sk: 'Dorastajúci kosáčik', en: 'Waxing Crescent' },
  'Prvá štvrť': { sk: 'Prvá štvrť', en: 'First Quarter' },
  'Dorastajúci mesiac': { sk: 'Dorastajúci mesiac', en: 'Waxing Gibbous' },
  'Spln': { sk: 'Spln', en: 'Full Moon' },
  'Ubúdajúci mesiac': { sk: 'Ubúdajúci mesiac', en: 'Waning Gibbous' },
  'Posledná štvrť': { sk: 'Posledná štvrť', en: 'Last Quarter' },
  'Ubúdajúci polmesiac': { sk: 'Ubúdajúci polmesiac', en: 'Waning Crescent' },
  'Ubúdajúci kosáčik': { sk: 'Ubúdajúci kosáčik', en: 'Waning Crescent' },
};

export const LOVE_LANGUAGE_DISPLAY: NameMap = {
  'Fyzický dotyk': { sk: 'Fyzický dotyk', en: 'Physical touch' },
  'Slová uistenia': { sk: 'Slová uistenia', en: 'Words of affirmation' },
  'Kvalitný čas': { sk: 'Kvalitný čas', en: 'Quality time' },
  'Obdarovávanie': { sk: 'Obdarovávanie', en: 'Gift giving' },
  'Skutky služby': { sk: 'Skutky služby', en: 'Acts of service' },
};

export const HOUSE_THEME_DISPLAY: Record<number, Record<Language, string>> = {
  1: { sk: 'Ja, telo, prvý dojem, vitalita', en: 'Self, body, first impression, vitality' },
  2: { sk: 'Hodnoty, financie, hmotné zdroje, sebahodnota', en: 'Values, finances, material resources, self-worth' },
  3: { sk: 'Komunikácia, súrodenci, krátke cesty, učenie', en: 'Communication, siblings, short trips, learning' },
  4: { sk: 'Domov, rodina, korene, súkromie, otec/matka', en: 'Home, family, roots, privacy, father/mother' },
  5: { sk: 'Tvorba, deti, romantika, hra, sebavyjadrenie', en: 'Creation, children, romance, play, self-expression' },
  6: { sk: 'Práca, zdravie, denné rutiny, služba', en: 'Work, health, daily routines, service' },
  7: { sk: 'Partnerstvá, manželstvo, otvorené konflikty, "iný"', en: 'Partnerships, marriage, open conflicts, "the other"' },
  8: { sk: 'Transformácia, intimita, smrť/znovuzrodenie, zdieľané zdroje', en: 'Transformation, intimacy, death/rebirth, shared resources' },
  9: { sk: 'Filozofia, ďaleké cesty, vyššie štúdium, viera', en: 'Philosophy, long journeys, higher education, faith' },
  10: { sk: 'Kariéra, verejný obraz, ambície, autorita', en: 'Career, public image, ambitions, authority' },
  11: { sk: 'Priatelia, komunita, sny, kolektív', en: 'Friends, community, dreams, collective' },
  12: { sk: 'Podvedomie, izolácia, duchovno, skryté veci', en: 'Subconscious, isolation, spirituality, hidden things' },
};

export const CHINESE_ANIMAL_GENITIVE: Record<string, Record<Language, string>> = {
  'Potkan': { sk: 'Potkana', en: 'of the Rat' },
  'Byvol': { sk: 'Byvola', en: 'of the Ox' },
  'Tiger': { sk: 'Tigra', en: 'of the Tiger' },
  'Zajac': { sk: 'Zajaca', en: 'of the Rabbit' },
  'Drak': { sk: 'Draka', en: 'of the Dragon' },
  'Had': { sk: 'Hada', en: 'of the Snake' },
  'Kôň': { sk: 'Koňa', en: 'of the Horse' },
  'Koza': { sk: 'Kozy', en: 'of the Goat' },
  'Opica': { sk: 'Opice', en: 'of the Monkey' },
  'Kohút': { sk: 'Kohúta', en: 'of the Rooster' },
  'Pes': { sk: 'Psa', en: 'of the Dog' },
  'Prasa': { sk: 'Prasaťa', en: 'of the Pig' },
};

export const WEEKDAY_SHORT: Record<Language, string[]> = {
  sk: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const MONTH_NAMES: Record<Language, string[]> = {
  sk: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export function displayName(map: NameMap, skKey: string, lang: Language): string {
  return map[skKey]?.[lang] ?? skKey;
}
