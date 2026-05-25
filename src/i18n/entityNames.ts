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
