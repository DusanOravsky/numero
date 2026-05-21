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

function getMeanLilithLongitude(date: Date): number {
  // Mean Black Moon Lilith — apogee perigeum lunárnej dráhy.
  // Meeus 47: Π (mean perigee) = 83.3532465 + 4069.0137287·T - 0.01032·T² - T³/80053.
  // Lilith (Mean apogee) = perigeum + 180°.
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T * T * T) / 80053;
  const lilith = perigee + 180;
  return ((lilith % 360) + 360) % 360;
}

// Chiron — výpočet cez orbitálne elementy (Kepler equation).
// Orbitálne elementy epoch J2000.0 (JPL Small-Body Database):
//   a = 13.648 AU, e = 0.37911, i = 6.938°, Ω = 209.385°, ω = 339.557°, M0 = 28.478°
// Presnosť: ±1-2° pre 1940-2030 (vs JPL Horizons). Dostatočné pre znamenie.
function getChironLongitude(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const days = jd - 2451545.0;

  const a = 13.648;
  const e = 0.37911;
  const i = 6.938 * Math.PI / 180;
  const omega_big = (209.385 + 0.01297 * T) * Math.PI / 180;
  const omega_small = (339.557 + 0.01956 * T) * Math.PI / 180;

  const n = 360 / (a ** 1.5 * 365.25);
  const M = ((28.478 + n * days) % 360 + 360) % 360;
  const Mrad = M * Math.PI / 180;

  // Kepler equation: E - e*sin(E) = M (Newton-Raphson)
  let E = Mrad;
  for (let iter = 0; iter < 15; iter++) {
    const dE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-10) break;
  }

  // True anomaly
  const sinV = Math.sqrt(1 - e * e) * Math.sin(E) / (1 - e * Math.cos(E));
  const cosV = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const v = Math.atan2(sinV, cosV);

  // Heliocentric ecliptic longitude
  const u = v + omega_small;
  const lon_helio = Math.atan2(
    Math.sin(u) * Math.cos(i),
    Math.cos(u)
  ) + omega_big;

  // Geocentric correction (simplified — Earth longitude subtraction for parallax)
  const earthL = (280.46646 + 36000.76983 * T) * Math.PI / 180;
  const r_chiron = a * (1 - e * Math.cos(E));
  // For distant objects (r >> 1 AU), heliocentric ≈ geocentric with small parallax
  // Apply approximate parallax correction
  const parallax = Math.asin(Math.sin(earthL - lon_helio) / r_chiron);
  const lon_geo = lon_helio + parallax;

  const deg = ((lon_geo * 180 / Math.PI) % 360 + 360) % 360;
  return deg;
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
  // CET/CEST: Československo nemalo letný čas pred 1979
  if (baseOffset === 1 || baseOffset === 2) {
    if (year < 1979) return 1;
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

  // Lilith (Mean Black Moon) a Chiron — analytické / aproximované body.
  // Pridávame ich PO výpočte dominantElement / dominantPlanet, aby tieto
  // sekundárne body neovplyvňovali tradičnú dominantnú analýzu.
  const lilithLong = getMeanLilithLongitude(date);
  const lilithInfo = getSignFromLongitude(lilithLong);
  planets.push({
    name: 'Lilith',
    symbol: '⚸',
    longitude: lilithLong,
    sign: lilithInfo.sign,
    degree: lilithInfo.degree,
    retrograde: false,
  });
  const chironLong = getChironLongitude(date);
  const chironInfo = getSignFromLongitude(chironLong);
  const dayMs = 24 * 60 * 60 * 1000;
  const chironBefore = getChironLongitude(new Date(date.getTime() - dayMs));
  const chironAfter = getChironLongitude(new Date(date.getTime() + dayMs));
  let chironDiff = chironAfter - chironBefore;
  if (chironDiff > 180) chironDiff -= 360;
  if (chironDiff < -180) chironDiff += 360;
  planets.push({
    name: 'Chiron',
    symbol: '⚷',
    longitude: chironLong,
    sign: chironInfo.sign,
    degree: chironInfo.degree,
    retrograde: chironDiff < 0,
  });

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
// SEKUNDÁRNE PROGRESIE — "1 deň = 1 rok"
// ============================================

export interface ProgressedPosition {
  planetName: string;
  symbol: string;
  natalSign: string;
  natalDegree: number;
  progressedSign: string;
  progressedDegree: number;
  signChanged: boolean;
}

/**
 * Sekundárne progresie: pozícia planét N dní po narodení = pozícia v N. roku života.
 * Štandardná Pythagorova / klasická prediktívna technika.
 *
 * @param targetAge - vek pre ktorý chceme progresie (napr. 47 rokov)
 */
export function calculateProgressions(
  birthDay: number, birthMonth: number, birthYear: number,
  birthHour: number, birthMinute: number,
  targetAge: number,
  timezoneOffsetHours: number = 1
): ProgressedPosition[] {
  const tz = getTimezoneOffset(birthDay, birthMonth, birthYear, timezoneOffsetHours);
  const utcHour = birthHour - tz;
  const birthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay, utcHour, birthMinute));
  // Progressed date = birth + N days (where N = age in years)
  const progressedDate = new Date(birthDate.getTime() + targetAge * 86400000);

  // Natálne pozície
  const natalPlanets: { name: string; symbol: string; body: Astronomy.Body | 'Moon' | 'Sun' }[] = [
    { name: 'Slnko', symbol: '☉', body: 'Sun' },
    { name: 'Mesiac', symbol: '☽', body: 'Moon' },
    { name: 'Merkúr', symbol: '☿', body: Astronomy.Body.Mercury },
    { name: 'Venuša', symbol: '♀', body: Astronomy.Body.Venus },
    { name: 'Mars', symbol: '♂', body: Astronomy.Body.Mars },
  ];

  const result: ProgressedPosition[] = [];
  for (const p of natalPlanets) {
    let natalLon: number;
    let progLon: number;
    if (p.body === 'Sun') {
      natalLon = getSunLongitude(birthDate);
      progLon = getSunLongitude(progressedDate);
    } else if (p.body === 'Moon') {
      natalLon = getMoonLongitude(birthDate);
      progLon = getMoonLongitude(progressedDate);
    } else {
      natalLon = getPlanetLongitudeAtDate(p.body, birthDate);
      progLon = getPlanetLongitudeAtDate(p.body, progressedDate);
    }
    const natal = getSignFromLongitude(natalLon);
    const prog = getSignFromLongitude(progLon);
    result.push({
      planetName: p.name,
      symbol: p.symbol,
      natalSign: natal.sign.name,
      natalDegree: natal.degree,
      progressedSign: prog.sign.name,
      progressedDegree: prog.degree,
      signChanged: natal.sign.name !== prog.sign.name,
    });
  }
  return result;
}

// ============================================
// SOLAR RETURN — výročný horoskop
// ============================================

/**
 * Solar return: presný okamih, keď Slnko opäť dosiahne natálnu longitúdu.
 * Vracia AstrologyResult pre tento okamih + dátum solárneho návratu.
 *
 * @param targetYear - rok, pre ktorý chceme výročný horoskop (default: aktuálny)
 */
export function calculateSolarReturn(
  birthDay: number, birthMonth: number, birthYear: number,
  birthHour: number, birthMinute: number,
  latitude: number = 48.15, longitude: number = 17.11,
  targetYear?: number,
  timezoneOffsetHours: number = 1
): { date: Date; result: AstrologyResult; ageAtReturn: number } | null {
  const tz = getTimezoneOffset(birthDay, birthMonth, birthYear, timezoneOffsetHours);
  const utcHour = birthHour - tz;
  const birthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay, utcHour, birthMinute));
  const natalSunLon = getSunLongitude(birthDate);

  const year = targetYear ?? new Date().getFullYear();
  // Hľadáme od ~30 dní pred výročím
  const searchStart = Astronomy.MakeTime(new Date(Date.UTC(year, birthMonth - 1, birthDay - 30)));
  const result = Astronomy.SearchSunLongitude(natalSunLon, searchStart, 60);
  if (!result) return null;

  const returnDate = result.date;
  const returnY = returnDate.getUTCFullYear();
  const returnM = returnDate.getUTCMonth() + 1;
  const returnD = returnDate.getUTCDate();
  const returnHr = returnDate.getUTCHours();
  const returnMin = returnDate.getUTCMinutes();
  // calculateAstrology očakáva LOCAL čas a applikuje getTimezoneOffset()
  // sám. Konvertujeme UTC → local cez TEN ISTÝ tz parameter ktorý použil
  // birth chart (rieši DST drift pri narodeniach v inom časovom pásme).
  const returnTz = getTimezoneOffset(returnD, returnM, returnY, timezoneOffsetHours);
  const localHr = returnHr + returnTz;
  return {
    date: returnDate,
    result: calculateAstrology(returnD, returnM, returnY, localHr, returnMin, latitude, longitude, timezoneOffsetHours),
    ageAtReturn: year - birthYear,
  };
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

/**
 * Vypočíta natálne aspekty (medzi planétami v rámci jedného horoskopu).
 * Eliminuje seba-aspekty (planéta s ňou samou) a duplicity (A-B vs B-A).
 */
const PLANET_PAIR_MEANINGS: Record<string, string> = {
  'Slnko-Mesiac': 'Vaša vedomá vôľa a emočné potreby — kľúčový vzťah medzi tým, kto CHCETE byť a čo CÍTITE.',
  'Slnko-Merkúr': 'Myslenie a sebavyjadrenie — ako komunikujete svoju identitu svetu.',
  'Slnko-Venuša': 'Vaše hodnoty a to, čo milujete — priťahuje krásu a harmóniu do vášho života.',
  'Slnko-Mars': 'Vaša energia a iniciatíva — ako presadzujete svoju vôľu a bojujete za ciele.',
  'Slnko-Jupiter': 'Rast a šťastie — kde vám život prináša príležitosti a expanziu.',
  'Slnko-Saturn': 'Disciplína a obmedzenia — kde musíte pracovať tvrdšie, ale dosiahnete trvalé výsledky.',
  'Slnko-Urán': 'Originalita a zmena — kde ste iní než ostatní a potrebujete slobodu.',
  'Slnko-Neptún': 'Intuícia a ideály — kde sníte, tvoríte a hľadáte duchovný zmysel.',
  'Slnko-Pluto': 'Transformácia a moc — hlboká vnútorná sila, regenerácia a vplyv.',
  'Mesiac-Merkúr': 'Emočná inteligencia — ako spracovávate pocity cez rozum a slová.',
  'Mesiac-Venuša': 'Citová pohoda — potreba lásky, bezpečia a krásneho prostredia.',
  'Mesiac-Mars': 'Emočná energia — ako reagujete pod tlakom, vášeň vs. impulzívnosť.',
  'Mesiac-Jupiter': 'Emočná veľkorysosť — optimizmus, štedrá nátura a vnútorná dôvera.',
  'Mesiac-Saturn': 'Emočná zrelosť — zodpovednosť voči sebe, niekedy nadmerná sebakontrola.',
  'Mesiac-Urán': 'Emočná nestálosť — potreba nezávislosti, nekonvenčné citové vzorce.',
  'Mesiac-Neptún': 'Hlboká citlivosť — empatia, intuícia, ale aj sklon k ilúziám v citoch.',
  'Mesiac-Pluto': 'Intenzívne emócie — transformatívne citové zážitky, hĺbka vzťahov.',
  'Merkúr-Venuša': 'Diplomatická komunikácia — šarm, umelecké vyjadrovanie, estetický vkus.',
  'Merkúr-Mars': 'Ostrá myseľ — rýchle rozhodovanie, argumentačná sila, mentálna energia.',
  'Merkúr-Jupiter': 'Múdre myslenie — šírka pohľadu, optimistické vnímanie, učiteľský talent.',
  'Merkúr-Saturn': 'Metodické myslenie — koncentrácia, systematickosť, niekedy pesimizmus.',
  'Merkúr-Urán': 'Brilantná myseľ — originálne nápady, blesky inšpirácie, netrpezlivosť.',
  'Merkúr-Neptún': 'Intuitívne myslenie — umelecký talent, vizionárstvo, niekedy zmätok.',
  'Merkúr-Pluto': 'Prenikavý intelekt — schopnosť ísť pod povrch, výskumný duch.',
  'Venuša-Mars': 'Priťahovanie a vášeň — dynamika vzťahov, sexuálna energia, tvorivý ťah.',
  'Venuša-Jupiter': 'Radosť a hojnosť — šťastie v láske, umelecký talent, veľkorysosť.',
  'Venuša-Saturn': 'Verná láska — seriózne vzťahy, zodpovednosť, niekedy emočná zdržanlivosť.',
  'Venuša-Urán': 'Nekonvenčná láska — priťahujete sa k nezvyčajnému, potreba voľnosti vo vzťahoch.',
  'Venuša-Neptún': 'Romantický idealizmus — hlboká láska, umelecká duša, niekedy ilúzie o partnerovi.',
  'Venuša-Pluto': 'Magnetická príťažlivosť — intenzívne vzťahy, transformácia cez lásku.',
  'Mars-Jupiter': 'Podnikavý duch — odvaha, veľké plány, entuziazmus a fyzická energia.',
  'Mars-Saturn': 'Kontrolovaná sila — disciplína, vytrvalosť, niekedy frustrácia z obmedzení.',
  'Mars-Urán': 'Výbušná energia — neočakávané zmeny, potreba adrenalínu a slobody v akcii.',
  'Mars-Neptún': 'Idealistická akcia — boj za vízie, ale aj riziko vyčerpania z nejasných cieľov.',
  'Mars-Pluto': 'Obrovská sila vôle — transformácia cez akciu, intenzívna energia, kontrola.',
  'Jupiter-Saturn': 'Rast v štruktúre — optimizmus ukotvený realizmom, dlhodobý úspech.',
  'Jupiter-Urán': 'Náhle príležitosti — šťastné náhody, inovácie, duchovné prebudenie.',
  'Jupiter-Neptún': 'Vízia a viera — hlboká duchovnosť, idealizmus, kreatívna imaginácia.',
  'Jupiter-Pluto': 'Moc a expanzia — ambícia, schopnosť veľkých premien, vplyv.',
  'Saturn-Urán': 'Staré vs. nové — napätie medzi tradíciou a inováciou, postupná revolúcia.',
  'Saturn-Neptún': 'Štruktúra sna — uskutočnenie ideálov alebo rozčarovanie z reality.',
  'Saturn-Pluto': 'Hlboká transformácia — krízy ako katalyzátor rastu, odolnosť.',
  'Urán-Neptún': 'Generačná duchovnosť — kolektívne prebudenie (generačný aspekt).',
  'Urán-Pluto': 'Revolučná premena — hlboké spoločenské zmeny (generačný aspekt).',
  'Neptún-Pluto': 'Duchovná evolúcia — najpomalší cyklus, generačný základ (generačný aspekt).',
};

function getAspectMeaning(planet1: string, planet2: string, aspect: SynastryAspectName): string {
  const key = `${planet1}-${planet2}`;
  const reverseKey = `${planet2}-${planet1}`;
  const pairMeaning = PLANET_PAIR_MEANINGS[key] || PLANET_PAIR_MEANINGS[reverseKey];
  if (!pairMeaning) return ASPECT_DEFINITIONS[aspect].description;
  return pairMeaning;
}

export function calculateNatalAspects(result: AstrologyResult): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  const APPROX_BODIES = new Set(['Lilith', 'Chiron']);
  const planets = result.planets.filter(p => !APPROX_BODIES.has(p.name));

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
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
            description: getAspectMeaning(p1.name, p2.name, name),
          });
        }
      });
    }
  }

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

export interface TransitAspect {
  transitPlanet: string;
  transitSign: string;
  natalPlanet: string;
  natalSign: string;
  aspect: SynastryAspectName;
  orb: number;
  symbol: string;
  nature: 'harmonic' | 'tense' | 'neutral';
  description: string;
  meaning: string;
}

const TRANSIT_MEANINGS: Record<string, Record<SynastryAspectName, string>> = {
  'Slnko': { conjunction: 'Zvýšená energia a vitalita v tejto oblasti', opposition: 'Napätie medzi tým, čo chceš a čo svet vyžaduje', trine: 'Plynulá podpora a kreatívna energia', square: 'Výzva na akciu — niečo treba zmeniť', sextile: 'Príležitosť na sebavyjadrenie' },
  'Mesiac': { conjunction: 'Emočná intenzita, citlivosť', opposition: 'Emocionálne napätie vo vzťahoch', trine: 'Emocionálna harmónia a pohodlie', square: 'Vnútorný nepokoj, potreba starostlivosti', sextile: 'Jemná emocionálna podpora' },
  'Merkúr': { conjunction: 'Mentálna jasnosť, dôležitá komunikácia', opposition: 'Nedorozumenia, potreba pozorného počúvania', trine: 'Jasné myslenie, dobré rozhovory', square: 'Mentálny tlak, rozhodovacia únava', sextile: 'Nové nápady a intelektuálne podnety' },
  'Venuša': { conjunction: 'Krása, láska, príťažlivosť', opposition: 'Vzťahové zrkadlenie — vidíš v druhom seba', trine: 'Harmónia vo vzťahoch a financiách', square: 'Hodnotový konflikt, pokušenie', sextile: 'Spoločenská príležitosť, tvorivá iskra' },
  'Mars': { conjunction: 'Energia, vôľa, akcia — iniciuj!', opposition: 'Konflikty, potreba asertivity', trine: 'Produktívna energia, fyzická sila', square: 'Frustrácia, impulzívnosť — spomali', sextile: 'Motivácia a odvaha konať' },
  'Jupiter': { conjunction: 'Expanzia, šťastie, rast', opposition: 'Prehnaný optimizmus, pozor na excesy', trine: 'Hojnosť a príležitosti prichádzajú', square: 'Rast cez prekonanie pohodlnosti', sextile: 'Šťastná náhoda, učenie sa' },
  'Saturn': { conjunction: 'Vážnosť, zodpovednosť, štruktúra', opposition: 'Konfrontácia s realitou a limitmi', trine: 'Disciplinovaný rast, uznanie', square: 'Obmedzenie, lekcia trpezlivosti', sextile: 'Stabilizácia a dozrievanie' },
};

/**
 * Vypočíta tranzitné aspekty — aktuálne planéty vs natálny horoskop.
 * Používa zúžené orby (tranzity sú presnejšie ako synastria).
 */
export function calculateTransitAspects(natal: AstrologyResult, transitDate?: Date): TransitAspect[] {
  const now = transitDate || new Date();
  const transitChart = calculateAstrology(now.getDate(), now.getMonth() + 1, now.getFullYear(), now.getHours(), now.getMinutes());
  const results: TransitAspect[] = [];

  const outerPlanets = ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'];
  const transitOrbs: Record<string, number> = {
    'Slnko': 2, 'Mesiac': 2, 'Merkúr': 2, 'Venuša': 2, 'Mars': 3,
    'Jupiter': 4, 'Saturn': 4, 'Urán': 3, 'Neptún': 3, 'Pluto': 3,
  };

  transitChart.planets.forEach(tp => {
    if (tp.name === 'Lilith' || tp.name === 'Chiron') return;
    const maxOrb = transitOrbs[tp.name] || 3;

    natal.planets.forEach(np => {
      if (np.name === 'Lilith' || np.name === 'Chiron') return;
      if (tp.name === 'Mesiac' && !outerPlanets.includes(np.name) && np.name !== 'Slnko') return;

      const distance = angularDistance(tp.longitude, np.longitude);

      (Object.entries(ASPECT_DEFINITIONS) as Array<[SynastryAspectName, typeof ASPECT_DEFINITIONS[SynastryAspectName]]>).forEach(([name, def]) => {
        const orb = Math.abs(distance - def.angle);
        if (orb <= maxOrb) {
          const meanings = TRANSIT_MEANINGS[tp.name];
          const meaning = meanings?.[name] || def.description;
          results.push({
            transitPlanet: tp.name,
            transitSign: tp.sign.name,
            natalPlanet: np.name,
            natalSign: np.sign.name,
            aspect: name,
            orb,
            symbol: def.symbol,
            nature: def.nature,
            description: def.description,
            meaning,
          });
        }
      });
    });
  });

  results.sort((a, b) => {
    const priorityA = outerPlanets.includes(a.transitPlanet) ? 0 : 1;
    const priorityB = outerPlanets.includes(b.transitPlanet) ? 0 : 1;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.orb - b.orb;
  });

  return results;
}
