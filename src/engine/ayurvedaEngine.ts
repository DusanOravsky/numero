import type { NumerologyResult } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';
import type { HumanDesignResult } from './humanDesignEngine';
import type { DoshaProfile } from '../data/ayurveda';

/**
 * Derivuje ayurvédsky dóša profil z existujúcich systémov.
 * Čistá funkcia, žiadne side effects.
 */
export function deriveDosha(
  numerology: NumerologyResult,
  astrology: AstrologyResult | null,
  humanDesign: HumanDesignResult | null
): DoshaProfile {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  // 1. Astro dominantný element
  if (astrology) {
    const el = astrology.dominantElement;
    if (el === 'Oheň') pitta += 3;
    else if (el === 'Vzduch') vata += 3;
    else if (el === 'Zem') kapha += 2;
    else if (el === 'Voda') { kapha += 1; pitta += 1; }
  }

  // 2. HD typ
  if (humanDesign) {
    const t = humanDesign.type;
    if (t === 'Generátor' || t === 'Manifestujúci Generátor') pitta += 2;
    else if (t === 'Projektor') vata += 2;
    else if (t === 'Manifestor') { pitta += 1; vata += 1; }
    else if (t === 'Reflektor') kapha += 2;
  }

  // 3. Numerológia ŽČ
  const lp = numerology.lifePathNumber;
  if (lp === 1 || lp === 3 || lp === 8) pitta += 2;
  else if (lp === 5 || lp === 7 || lp === 9) vata += 2;
  else if (lp === 2 || lp === 4 || lp === 6) kapha += 2;
  // Master numbers: 11 → base 2 (kapha), 22 → base 4 (kapha), 33 → base 6 (kapha)
  else if (lp === 11 || lp === 22 || lp === 33) kapha += 2;

  // 4. Numerológia mriežka energy — roviny
  if (numerology.emptyPlanes.length > numerology.fullPlanes.length) vata += 1;
  if (numerology.fullPlanes.length > numerology.emptyPlanes.length) kapha += 1;

  // Determine primary and secondary
  const scores: [number, 'vata' | 'pitta' | 'kapha'][] = [
    [vata, 'vata'],
    [pitta, 'pitta'],
    [kapha, 'kapha'],
  ];
  scores.sort((a, b) => b[0] - a[0]);

  const primary = scores[0][1];
  const primaryScore = scores[0][0];
  const secondaryScore = scores[1][0];
  const secondary = secondaryScore >= primaryScore * 0.5 ? scores[1][1] : null;

  // Balance: koľko % je primárna dominantná (0-100)
  const total = vata + pitta + kapha;
  const balance = total > 0 ? Math.round((primaryScore / total) * 100) : 33;

  return { primary, secondary, balance };
}
