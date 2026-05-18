import * as Astronomy from 'astronomy-engine';

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

export interface AstrologyResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
  planets: PlanetPosition[];
  dominantElement: string;
  dominantQuality: string;
  dominantPlanet: string;
  moonPhase: string;
  northNode: ZodiacSign;
  southNode: ZodiacSign;
}

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

function getMoonLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const eq = Astronomy.Equator(Astronomy.Body.Moon, time, null as unknown as Astronomy.Observer, true, true);
  const ecl = Astronomy.Ecliptic(eq.vec);
  return ecl.elon;
}

function getPlanetLongitude(body: Astronomy.Body, date: Date): number {
  const time = Astronomy.MakeTime(date);
  const eq = Astronomy.Equator(body, time, null as unknown as Astronomy.Observer, true, true);
  const ecl = Astronomy.Ecliptic(eq.vec);
  return ecl.elon;
}

function calculateAscendant(date: Date, latitude: number, longitude: number): number {
  const time = Astronomy.MakeTime(date);
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const lst = Astronomy.SiderealTime(time);
  const localST = (lst + longitude / 15) % 24;
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
  void observer;
  return asc;
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

export function calculateAstrology(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0,
  latitude: number = 48.15, longitude: number = 17.11
): AstrologyResult {
  const date = new Date(year, month - 1, day, hour, minute);

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
      long = getPlanetLongitude(p.body, date);
    }
    const info = getSignFromLongitude(long);
    return {
      name: p.name,
      symbol: p.symbol,
      longitude: long,
      sign: info.sign,
      degree: info.degree,
      retrograde: false,
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

  const northNodeLong = (sunLong + 180) % 360;
  const southNodeLong = sunLong;
  const northNodeInfo = getSignFromLongitude(northNodeLong);
  const southNodeInfo = getSignFromLongitude(southNodeLong);

  return {
    sunSign: sunInfo.sign,
    moonSign: moonInfo.sign,
    ascendant: ascInfo.sign,
    planets,
    dominantElement,
    dominantQuality,
    dominantPlanet,
    moonPhase: getMoonPhase(date),
    northNode: northNodeInfo.sign,
    southNode: southNodeInfo.sign,
  };
}
