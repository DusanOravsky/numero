import type { NumerologyResult } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';

export interface TCMResult {
  primary: string;
  secondary: string;
}

/**
 * Derivuje primárny a sekundárny TCM element z numerológie a astrológie.
 * Čistá funkcia, žiadne side effects.
 */
export function deriveTCMElement(
  numerology: NumerologyResult,
  astrology: AstrologyResult | null
): TCMResult {
  let drevo = 0;
  let ohen = 0;
  let zem = 0;
  let kov = 0;
  let voda = 0;

  // 1. Astro dominantný element
  if (astrology) {
    const el = astrology.dominantElement;
    if (el === 'Oheň') ohen += 3;
    else if (el === 'Vzduch') kov += 3;
    else if (el === 'Zem') zem += 3;
    else if (el === 'Voda') voda += 3;
  }

  // 2. ŽČ mapovanie
  const lp = numerology.lifePathNumber;
  if (lp === 1 || lp === 9) drevo += 2;
  else if (lp === 3 || lp === 7) ohen += 2;
  else if (lp === 2 || lp === 5) zem += 2;
  else if (lp === 4 || lp === 8) kov += 2;
  else if (lp === 6) voda += 2;
  // Master numbers
  else if (lp === 11) drevo += 2; // base 2 → but 11 is master — drevo (intuícia, rast)
  else if (lp === 22) zem += 2;   // master builder
  else if (lp === 33) ohen += 2;  // master teacher

  // Determine primary and secondary
  const scores: [number, string][] = [
    [drevo, 'drevo'],
    [ohen, 'ohen'],
    [zem, 'zem'],
    [kov, 'kov'],
    [voda, 'voda'],
  ];
  scores.sort((a, b) => b[0] - a[0]);

  return {
    primary: scores[0][1],
    secondary: scores[1][1],
  };
}
