import { NumerologyResult, reduceToSingle } from './numerologyEngine';
import { DevelopmentalNumerologyResult } from './developmentalNumerologyEngine';

export interface EnneagramResult {
  coreType: number; // 1-9
  wing1: number; // adjacent type (lower)
  wing2: number; // adjacent type (higher)
  dominantWing: number | null; // which wing is stronger, or null if balanced
  integrationDirection: number;
  disintegrationDirection: number;
  method: 'characterological' | 'developmental';
}

/** Integration arrows (Riso-Hudson) */
const INTEGRATION_MAP: Record<number, number> = {
  1: 7,
  2: 4,
  3: 6,
  4: 1,
  5: 8,
  6: 9,
  7: 5,
  8: 2,
  9: 3,
};

/** Disintegration arrows (Riso-Hudson) */
const DISINTEGRATION_MAP: Record<number, number> = {
  1: 4,
  2: 8,
  3: 9,
  4: 2,
  5: 7,
  6: 3,
  7: 1,
  8: 5,
  9: 6,
};

/**
 * Get adjacent types on the enneagram circle (wings).
 * Type 1 → wings 9, 2. Type 9 → wings 8, 1.
 */
function getWings(coreType: number): { wing1: number; wing2: number } {
  const wing1 = coreType === 1 ? 9 : coreType - 1;
  const wing2 = coreType === 9 ? 1 : coreType + 1;
  return { wing1, wing2 };
}

/**
 * Count occurrences of a digit (1-9) in the numerological grid.
 */
function countDigitInGrid(
  grid: { value: number; isBase: boolean }[][],
  digit: number
): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.value === digit) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Count occurrences of a digit in developmental grid counts.
 */
function countDigitInDevelopmental(
  counts: Record<number, number>,
  digit: number
): number {
  return counts[digit] ?? 0;
}

/**
 * Derive enneagram type from numerological data.
 *
 * Pure function — no side effects, no localStorage, no API calls.
 */
export function deriveEnneagramType(
  numerology: NumerologyResult,
  developmental: DevelopmentalNumerologyResult | null,
  method: 'characterological' | 'developmental'
): EnneagramResult {
  let coreType: number;

  if (method === 'developmental' && developmental !== null) {
    // Core type = K3 (životné poslanie) reduced to 1-9
    const k3Value = developmental.circled[2].value;
    coreType = reduceToSingle(Math.abs(k3Value));
  } else {
    // Core type = Life Path number reduced to 1-9
    // Master numbers: 11→2, 22→4, 33→6
    coreType = reduceToSingle(numerology.lifePathNumber);
  }

  const { wing1, wing2 } = getWings(coreType);

  // Determine dominant wing
  let wing1Strength: number;
  let wing2Strength: number;

  if (method === 'developmental' && developmental !== null) {
    // From K1 and K4 reduced to single digits — map to adjacent types
    const k1Reduced = reduceToSingle(Math.abs(developmental.circled[0].value));
    const k4Reduced = reduceToSingle(Math.abs(developmental.circled[3].value));

    // Count how many of K1/K4 reduced values match each wing
    wing1Strength = (k1Reduced === wing1 ? 1 : 0) + (k4Reduced === wing1 ? 1 : 0);
    wing2Strength = (k1Reduced === wing2 ? 1 : 0) + (k4Reduced === wing2 ? 1 : 0);

    // If neither K1 nor K4 maps to a wing directly, use grid counts as fallback
    if (wing1Strength === 0 && wing2Strength === 0) {
      wing1Strength = countDigitInDevelopmental(developmental.counts, wing1);
      wing2Strength = countDigitInDevelopmental(developmental.counts, wing2);
    }
  } else {
    // Characterological: grid energy counts for adjacent types
    wing1Strength = countDigitInGrid(numerology.grid, wing1);
    wing2Strength = countDigitInGrid(numerology.grid, wing2);
  }

  let dominantWing: number | null;
  if (wing1Strength > wing2Strength) {
    dominantWing = wing1;
  } else if (wing2Strength > wing1Strength) {
    dominantWing = wing2;
  } else {
    dominantWing = null;
  }

  return {
    coreType,
    wing1,
    wing2,
    dominantWing,
    integrationDirection: INTEGRATION_MAP[coreType],
    disintegrationDirection: DISINTEGRATION_MAP[coreType],
    method,
  };
}
