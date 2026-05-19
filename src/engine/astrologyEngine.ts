import * as Astronomy from 'astronomy-engine';
import { memoize, birthKey } from './engineCache';

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'Oheň' | 'Zem' | 'Vzduch' | 'Voda';
  quality: 'Kardinálny' | 'Fixný' | 'Mutabilný';
  ruler: string;
  startDeg: number;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Baran', symbol: '♈', element: 'Oheň', quality: 'Kardinálny', ruler: 'Mars', startDeg: 0 },
  { name: 'Býk', symbol: '♉', element: 'Zem', quality: 'Fixný', ruler: 'Venuša', startDeg: 30 },
  { name: 'Blíženci', symbol: '♊', element: 'Vzduch', quality: 'Mutabilný', ruler: 'Merkúr', startDeg: 60 },
  { name: 'Rak', symbol: '♋', element: 'Voda', quality: 'Kardinálny', ruler: 'Mesiac', startDeg: 90 },
  { name: 'Lev', symbol: '♌', element: 'Oheň', quality: 'Fixný', ruler: 'Slnko', startDeg: 120 },
  { name: 'Panna', symbol: '♍', element: 'Zem', quality: 'Mutabilný', ruler: 'Merkúr', startDeg: 150 },
  { name: 'Váhy', symbol: '♎', element: 'Vzduch', quality: 'Kardinálny', ruler: 'Venuša', startDeg: 180 },
  { name: 'Škorpión', symbol: '♏', element: 'Voda', quality: 'Fixný', ruler: 'Pluto', startDeg: 210 },
  { name: 'Strelec', symbol: '♐', element: 'Oheň', quality: 'Mutabilný', ruler: 'Jupiter', startDeg: 240 },
  { name: 'Kozorožec', symbol: '♑', element: 'Zem', quality: 'Kardinálny', ruler: 'Saturn', startDeg: 270 },
  { name: 'Vodnár', symbol: '♒', element: 'Vzduch', quality: 'Fixný', ruler: 'Urán', startDeg: 300 },
  { name: 'Ryby', symbol: '♓', element: 'Voda', quality: 'Mutabilný', ruler: 'Neptún', startDeg: 330 },
];

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSign;
  degree: number;
  retrograde: boolean;
}

export interface House {
  number: number;
  sign: ZodiacSign;
  cuspDegree: number; // pre Whole Sign vždy 0
  theme: string;
}

export interface AstrologyResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
  ascendantDegree: number;
  planets: PlanetPosition[];
  houses: House[];
  /** Mapa: planéta → číslo domu */
  planetHouses: Record<string, number>;
  dominantElement: string;
  dominantQuality: string;
  dominantPlanet: string;
  moonPhase: string;
  northNode: ZodiacSign;
  southNode: ZodiacSign;
}

const HOUSE_THEMES: Record<number, string> = {
  1: 'Ja, telo, prvý dojem, vitalita',
  2: 'Hodnoty, financie, hmotné zdroje, sebahodnota',
  3: 'Komunikácia, súrodenci, krátke cesty, učenie',
  4: 'Domov, rodina, korene, súkromie, otec/matka',
  5: 'Tvorba, deti, romantika, hra, sebavyjadrenie',
  6: 'Práca, zdravie, denné rutiny, služba',
  7: 'Partnerstvá, manželstvo, otvorené konflikty, "iný"',
  8: 'Transformácia, intimita, smrť/znovuzrodenie, zdieľané zdroje',
  9: 'Filozofia, ďaleké cesty, vyššie štúdium, viera',
  10: 'Kariéra, verejný obraz, ambície, autorita',
  11: 'Priatelia, komunita, sny, kolektív',
  12: 'Podvedomie, izolácia, duchovno, skryté veci',
};

function getSignFromLongitude(longitude: number): { sign: ZodiacSign; degree: number } {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degree = normalizedLong % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree };
}

function getSunLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const ecl = Astronomy.SunPosition(time);
  return ecl.elon;
}

function getPlanetLongitudeAtDate(body: Astronomy.Body, date: Date): number {
  const time = Astronomy.MakeTime(date);
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return ecl.elon;
}

function getMoonLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const vec = Astronomy.GeoMoon(time);
  const ecl = Astronomy.Ecliptic(vec);
  return ecl.elon;
}

function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;
  const dayMs = 24 * 60 * 60 * 1000;
  const lonBefore = getPlanetLongitudeAtDate(body, new Date(date.getTime() - dayMs));
  const lonAfter = getPlanetLongitudeAtDate(body, new Date(date.getTime() + dayMs));
  let diff = lonAfter - lonBefore;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function calculateAscendant(date: Date, latitude: number, longitude: number): number {
  const time = Astronomy.MakeTime(date);
  const lst = Astronomy.SiderealTime(time);
  const localST = ((lst + longitude / 15) % 24 + 24) % 24;
  const RAMC = localST * 15;
  const obliquity = 23.4393;
  const oblRad = obliquity * Math.PI / 180;
  const ramcRad = RAMC * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;

  let asc = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  ) * 180 / Math.PI;

  if (asc < 0) asc += 360;
  return asc;
}

function getTrueNodeLongitude(date: Date): number {
  // True Node = Mean Node + periodické korekcie. Astronomická prax preferuje
  // True Node pred Mean Node (Mean = lineárny priemer, True = skutočná pozícia
  // s nutáciou). Posun je typicky ±1.5°, čo môže pri HD posunúť bránu.
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  // Mean Node (Meeus, kapitola 47)
  const meanOmega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  // Hlavné periodické termíny (zjednodušené)
  const D = 297.8501921 + 445267.1114034 * T;     // Mean elongation Moon-Sun
  const M = 357.5291092 + 35999.0502909 * T;       // Sun mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T;     // Moon mean anomaly
  const F = 93.2720950 + 483202.0175233 * T;       // Moon argument of latitude
  const deg = Math.PI / 180;
  // Najväčší termín pre korekciu uzla (Meeus tabuľka 47.A vybrané najsilnejšie)
  const correction =
    -1.4979 * Math.sin((2 * D - 2 * F) * deg) +
    -0.1500 * Math.sin(M * deg) +
    -0.1226 * Math.sin((2 * D) * deg) +
    0.1176 * Math.sin((2 * F) * deg) +
    -0.0801 * Math.sin((2 * Mp - 2 * F) * deg);
  const trueOmega = meanOmega + correction;
  return ((trueOmega % 360) + 360) % 360;
}

function getMoonPhase(date: Date): string {
  const time = Astronomy.MakeTime(date);
  const phase = Astronomy.MoonPhase(time);

  if (phase < 22.5) return 'Nov';
  if (phase < 67.5) return 'Dorastajúci kosáčik';
  if (phase < 112.5) return 'Prvá štvrť';
  if (phase < 157.5) return 'Dorastajúci mesiac';
  if (phase < 202.5) return 'Spln';
  if (phase < 247.5) return 'Ubúdajúci mesiac';
  if (phase < 292.5) return 'Posledná štvrť';
  if (phase < 337.5) return 'Ubúdajúci kosáčik';
  return 'Nov';
}

function getTimezoneOffset(day: number, month: number, year: number, baseOffset: number): number {
  // CET/CEST: letný čas od poslednej nedele marca do poslednej nedele októbra
  if (baseOffset === 1 || baseOffset === 2) {
    const marchLast = new Date(year, 2, 31);
    const marchSunday = 31 - marchLast.getDay();
    const octLast = new Date(year, 9, 31);
    const octSunday = 31 - octLast.getDay();
    const dayOfYear = Math.floor((new Date(year, month - 1, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const marchSundayDOY = Math.floor((new Date(year, 2, marchSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const octSundayDOY = Math.floor((new Date(year, 9, octSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    if (dayOfYear >= marchSundayDOY && dayOfYear < octSundayDOY) return 2; // CEST
    return 1; // CET
  }
  return baseOffset;
}

function _calculateAstrologyImpl(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  latitude: number = 48.15, longitude: number = 17.11,
  timezoneOffsetHours: number = 1
): AstrologyResult {
  // Auto-detect summer/winter time for CET/CEST
  const tz = getTimezoneOffset(day, month, year, timezoneOffsetHours);
  const utcHour = hour - tz;
  const date = new Date(Date.UTC(year, month - 1, day, utcHour, minute));

  const sunLong = getSunLongitude(date);
  const moonLong = getMoonLongitude(date);
  const ascLong = calculateAscendant(date, latitude, longitude);

  const sunInfo = getSignFromLongitude(sunLong);
  const moonInfo = getSignFromLongitude(moonLong);
  const ascInfo = getSignFromLongitude(ascLong);

  const planetBodies: { name: string; symbol: string; body: Astronomy.Body }[] = [
    { name: 'Slnko', symbol: '☉', body: Astronomy.Body.Sun },
    { name: 'Mesiac', symbol: '☽', body: Astronomy.Body.Moon },
    { name: 'Merkúr', symbol: '☿', body: Astronomy.Body.Mercury },
    { name: 'Venuša', symbol: '♀', body: Astronomy.Body.Venus },
    { name: 'Mars', symbol: '♂', body: Astronomy.Body.Mars },
    { name: 'Jupiter', symbol: '♃', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', symbol: '♄', body: Astronomy.Body.Saturn },
    { name: 'Urán', symbol: '♅', body: Astronomy.Body.Uranus },
    { name: 'Neptún', symbol: '♆', body: Astronomy.Body.Neptune },
    { name: 'Pluto', symbol: '♇', body: Astronomy.Body.Pluto },
  ];

  const planets: PlanetPosition[] = planetBodies.map(p => {
    let long: number;
    if (p.body === Astronomy.Body.Sun) {
      long = sunLong;
    } else if (p.body === Astronomy.Body.Moon) {
      long = moonLong;
    } else {
      long = getPlanetLongitudeAtDate(p.body, date);
    }
    const info = getSignFromLongitude(long);
    return {
      name: p.name,
      symbol: p.symbol,
      longitude: long,
      sign: info.sign,
      degree: info.degree,
      retrograde: isRetrograde(p.body, date),
    };
  });

  const elementCounts: Record<string, number> = { 'Oheň': 0, 'Zem': 0, 'Vzduch': 0, 'Voda': 0 };
  const qualityCounts: Record<string, number> = { 'Kardinálny': 0, 'Fixný': 0, 'Mutabilný': 0 };
  const planetRulerCounts: Record<string, number> = {};

  planets.forEach(p => {
    elementCounts[p.sign.element]++;
    qualityCounts[p.sign.quality]++;
    planetRulerCounts[p.sign.ruler] = (planetRulerCounts[p.sign.ruler] || 0) + 1;
  });

  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0];
  const dominantQuality = Object.entries(qualityCounts).sort((a, b) => b[1] - a[1])[0][0];
  const dominantPlanet = Object.entries(planetRulerCounts).sort((a, b) => b[1] - a[1])[0][0];

  const northNodeLong = getTrueNodeLongitude(date);
  const southNodeLong = (northNodeLong + 180) % 360;
  const northNodeInfo = getSignFromLongitude(northNodeLong);
  const southNodeInfo = getSignFromLongitude(southNodeLong);

  // Whole Sign domy: celé znamenie ascendentu = 1. dom, ďalšie znamenia = 2., 3. dom...
  const ascSignIdx = ZODIAC_SIGNS.indexOf(ascInfo.sign);
  const houses: House[] = [];
  for (let i = 0; i < 12; i++) {
    const signIdx = (ascSignIdx + i) % 12;
    houses.push({
      number: i + 1,
      sign: ZODIAC_SIGNS[signIdx],
      cuspDegree: 0,
      theme: HOUSE_THEMES[i + 1],
    });
  }

  // Mapovanie planét do domov podľa znamení
  const planetHouses: Record<string, number> = {};
  planets.forEach(p => {
    const planetSignIdx = ZODIAC_SIGNS.indexOf(p.sign);
    const houseNumber = ((planetSignIdx - ascSignIdx + 12) % 12) + 1;
    planetHouses[p.name] = houseNumber;
  });

  return {
    sunSign: sunInfo.sign,
    moonSign: moonInfo.sign,
    ascendant: ascInfo.sign,
    ascendantDegree: ascInfo.degree,
    planets,
    houses,
    planetHouses,
    dominantElement,
    dominantQuality,
    dominantPlanet,
    moonPhase: getMoonPhase(date),
    northNode: northNodeInfo.sign,
    southNode: southNodeInfo.sign,
  };
}

const _memoAstro = memoize(
  _calculateAstrologyImpl,
  (day, month, year, hour, minute, lat, lon, tz) =>
    `astro:${birthKey(day, month, year, hour, minute, lat, lon, tz)}`
);

export function calculateAstrology(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  latitude: number = 48.15, longitude: number = 17.11,
  timezoneOffsetHours: number = 1
): AstrologyResult {
  return _memoAstro(day, month, year, hour, minute, latitude, longitude, timezoneOffsetHours);
}

// ============================================
// SYNASTRIA – aspekty medzi dvoma horoskopmi
// ============================================

export type SynastryAspectName = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

export interface SynastryAspect {
  planet1: string;
  planet2: string;
  aspect: SynastryAspectName;
  exactDegrees: number; // ideálny uhol
  actualDegrees: number; // skutočný uhol medzi planétami
  orb: number; // odchýlka od ideálu
  symbol: string;
  nature: 'harmonic' | 'tense' | 'neutral';
  description: string;
}

const ASPECT_DEFINITIONS: Record<SynastryAspectName, { angle: number; orb: number; symbol: string; nature: 'harmonic' | 'tense' | 'neutral'; description: string }> = {
  conjunction: { angle: 0, orb: 8, symbol: '☌', nature: 'neutral', description: 'spojenie – energie sa miešajú a zosilňujú' },
  opposition: { angle: 180, orb: 8, symbol: '☍', nature: 'tense', description: 'opozícia – výzva, napätie, hľadanie rovnováhy' },
  trine: { angle: 120, orb: 7, symbol: '△', nature: 'harmonic', description: 'trigón – plynulý tok, prirodzená harmónia' },
  square: { angle: 90, orb: 7, symbol: '□', nature: 'tense', description: 'kvadratúra – tlak, potreba aktívne riešiť' },
  sextile: { angle: 60, orb: 5, symbol: '⚹', nature: 'harmonic', description: 'sextil – príležitosť, mierna podpora' },
};

function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Vypočíta synastrické aspekty medzi dvoma natálnymi horoskopmi.
 * Používa skutočné ekliptické dĺžky planét pre presnejšie aspekty (s orbisom).
 */
export function calculateSynastryAspects(r1: AstrologyResult, r2: AstrologyResult): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  r1.planets.forEach(p1 => {
    r2.planets.forEach(p2 => {
      const distance = angularDistance(p1.longitude, p2.longitude);

      (Object.entries(ASPECT_DEFINITIONS) as Array<[SynastryAspectName, typeof ASPECT_DEFINITIONS[SynastryAspectName]]>).forEach(([name, def]) => {
        const orb = Math.abs(distance - def.angle);
        if (orb <= def.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: name,
            exactDegrees: def.angle,
            actualDegrees: distance,
            orb,
            symbol: def.symbol,
            nature: def.nature,
            description: def.description,
          });
        }
      });
    });
  });

  // Najpresnejšie aspekty (najmenší orb) najvyššie
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}

/** Súhrnné štatistiky synastrie */
export interface SynastrySummary {
  total: number;
  harmonic: number;
  tense: number;
  neutral: number;
  /** Skóre 0..100: prevaha harmonických nad napäťovými */
  score: number;
  topAspects: SynastryAspect[];
}

export function summarizeSynastry(aspects: SynastryAspect[]): SynastrySummary {
  const harmonic = aspects.filter(a => a.nature === 'harmonic').length;
  const tense = aspects.filter(a => a.nature === 'tense').length;
  const neutral = aspects.filter(a => a.nature === 'neutral').length;
  const total = aspects.length;
  const score = total === 0 ? 50 : Math.round(50 + ((harmonic - tense) / total) * 50);
  return {
    total,
    harmonic,
    tense,
    neutral,
    score: Math.max(0, Math.min(100, score)),
    topAspects: aspects.slice(0, 12),
  };
}
