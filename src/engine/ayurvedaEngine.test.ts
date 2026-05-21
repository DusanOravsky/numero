import { describe, it, expect } from 'vitest';
import { deriveDosha } from './ayurvedaEngine';
import { calculateFullNumerology } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';
import type { HumanDesignResult } from './humanDesignEngine';

function makeMinimalNumerology(lifePathNumber: number, fullPlanes: string[] = [], emptyPlanes: string[] = []) {
  const num = calculateFullNumerology(30, 8, 1979);
  return { ...num, lifePathNumber, fullPlanes, emptyPlanes };
}

describe('deriveDosha — valid output', () => {
  it('vracia jednu z troch dóš ako primary', () => {
    const num = makeMinimalNumerology(1);
    const result = deriveDosha(num, null, null);
    expect(['vata', 'pitta', 'kapha']).toContain(result.primary);
  });

  it('secondary je buď null alebo jedna z troch dóš', () => {
    const num = makeMinimalNumerology(5);
    const result = deriveDosha(num, null, null);
    if (result.secondary !== null) {
      expect(['vata', 'pitta', 'kapha']).toContain(result.secondary);
    }
  });

  it('balance je číslo medzi 0 a 100', () => {
    const num = makeMinimalNumerology(3);
    const result = deriveDosha(num, null, null);
    expect(result.balance).toBeGreaterThanOrEqual(0);
    expect(result.balance).toBeLessThanOrEqual(100);
  });

  it('primary a secondary sú rôzne (ak secondary nie je null)', () => {
    const num = makeMinimalNumerology(7);
    const result = deriveDosha(num, null, null);
    if (result.secondary !== null) {
      expect(result.primary).not.toBe(result.secondary);
    }
  });
});

describe('deriveDosha — numerologické ŽČ mapovanie', () => {
  it('ŽČ 1,3,8 → pitta dominuje (pri absencii astro/HD)', () => {
    for (const lp of [1, 3, 8]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveDosha(num, null, null);
      expect(result.primary).toBe('pitta');
    }
  });

  it('ŽČ 5,7,9 → vata dominuje (pri absencii astro/HD)', () => {
    for (const lp of [5, 7, 9]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveDosha(num, null, null);
      expect(result.primary).toBe('vata');
    }
  });

  it('ŽČ 2,4,6 → kapha dominuje (pri absencii astro/HD)', () => {
    for (const lp of [2, 4, 6]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveDosha(num, null, null);
      expect(result.primary).toBe('kapha');
    }
  });

  it('master numbers 11,22,33 → kapha +2', () => {
    for (const lp of [11, 22, 33]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveDosha(num, null, null);
      expect(result.primary).toBe('kapha');
    }
  });
});

describe('deriveDosha — astro element vplyv', () => {
  it('Oheň element → pitta +3', () => {
    const num = makeMinimalNumerology(2); // kapha +2 from LP
    const astro = { dominantElement: 'Oheň' } as Partial<AstrologyResult>;
    const result = deriveDosha(num, astro, null);
    // pitta=3, kapha=2 → pitta wins
    expect(result.primary).toBe('pitta');
  });

  it('Vzduch element → vata +3', () => {
    const num = makeMinimalNumerology(2); // kapha +2
    const astro = { dominantElement: 'Vzduch' } as Partial<AstrologyResult>;
    const result = deriveDosha(num, astro, null);
    // vata=3, kapha=2 → vata wins
    expect(result.primary).toBe('vata');
  });

  it('Zem element → kapha +2', () => {
    const num = makeMinimalNumerology(5); // vata +2
    const astro = { dominantElement: 'Zem' } as Partial<AstrologyResult>;
    const result = deriveDosha(num, astro, null);
    // vata=2, kapha=2 → tie, sorted by array order. kapha is last but primary depends on score
    // Actually both equal at 2, so first in sorted order wins
    expect(['vata', 'kapha']).toContain(result.primary);
  });
});

describe('deriveDosha — HD typ vplyv', () => {
  it('Generátor → pitta +2', () => {
    const num = makeMinimalNumerology(5); // vata +2
    const hd = { type: 'Generátor' } as Partial<HumanDesignResult>;
    const result = deriveDosha(num, null, hd);
    // vata=2, pitta=2 → tie
    expect(['vata', 'pitta']).toContain(result.primary);
  });

  it('Projektor → vata +2', () => {
    const num = makeMinimalNumerology(2); // kapha +2
    const hd = { type: 'Projektor' } as Partial<HumanDesignResult>;
    const result = deriveDosha(num, null, hd);
    // vata=2, kapha=2 → tie
    expect(['vata', 'kapha']).toContain(result.primary);
  });

  it('Reflektor → kapha +2', () => {
    const num = makeMinimalNumerology(1); // pitta +2
    const hd = { type: 'Reflektor' } as Partial<HumanDesignResult>;
    const result = deriveDosha(num, null, hd);
    // pitta=2, kapha=2 → tie
    expect(['pitta', 'kapha']).toContain(result.primary);
  });
});

describe('deriveDosha — roviny vplyv', () => {
  it('viac empty než full planes → vata +1', () => {
    const num = makeMinimalNumerology(2, ['Plane1'], ['Empty1', 'Empty2', 'Empty3']);
    const result = deriveDosha(num, null, null);
    // kapha=2 from LP, vata=1 from planes
    expect(result.primary).toBe('kapha');
  });

  it('viac full než empty planes → kapha +1', () => {
    const num = makeMinimalNumerology(1, ['Full1', 'Full2', 'Full3'], ['Empty1']);
    const result = deriveDosha(num, null, null);
    // pitta=2, kapha=1 → pitta wins
    expect(result.primary).toBe('pitta');
  });
});
