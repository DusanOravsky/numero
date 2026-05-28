/**
 * Shared astronomy helper functions used by both astrologyEngine and humanDesignEngine.
 */

/**
 * True Node longitude with Meeus periodic corrections.
 * More precise than Mean Node — includes nutation terms.
 * Shift is typically ±1.5° which can move an HD gate.
 */
export function getTrueNodeLongitude(date: Date): number {
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

/**
 * CET/CEST timezone offset detection.
 * Handles DST transitions for Central European timezone.
 * The `hour` parameter enables precise transition detection on DST changeover days.
 * For HD calculations, hour defaults to 12 which is sufficient.
 */
export function getTimezoneOffset(day: number, month: number, year: number, baseOffset: number, hour: number = 12): number {
  if (baseOffset === 1 || baseOffset === 2) {
    if (year < 1979) return 1;
    const marchLast = new Date(year, 2, 31);
    const marchSunday = 31 - marchLast.getDay();
    const octLast = new Date(year, 9, 31);
    const octSunday = 31 - octLast.getDay();
    const dayOfYear = Math.floor((new Date(year, month - 1, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const marchSundayDOY = Math.floor((new Date(year, 2, marchSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const octSundayDOY = Math.floor((new Date(year, 9, octSunday).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    if (dayOfYear === marchSundayDOY) return hour >= 2 ? 2 : 1;
    if (dayOfYear === octSundayDOY) return hour >= 3 ? 1 : 2;
    if (dayOfYear > marchSundayDOY && dayOfYear < octSundayDOY) return 2; // CEST
    return 1; // CET
  }
  return baseOffset;
}
