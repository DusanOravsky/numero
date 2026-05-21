import { describe, it, expect } from 'vitest';
import { deriveTCMElement } from './tcmEngine';
import { calculateFullNumerology } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';

function makeMinimalNumerology(lifePathNumber: number) {
  const num = calculateFullNumerology(30, 8, 1979);
  return { ...num, lifePathNumber };
}

const VALID_ELEMENTS = ['drevo', 'ohen', 'zem', 'kov', 'voda'];

describe('deriveTCMElement — valid output', () => {
  it('primary je platný TCM element', () => {
    const num = makeMinimalNumerology(1);
    const result = deriveTCMElement(num, null);
    expect(VALID_ELEMENTS).toContain(result.primary);
  });

  it('secondary je platný TCM element', () => {
    const num = makeMinimalNumerology(3);
    const result = deriveTCMElement(num, null);
    expect(VALID_ELEMENTS).toContain(result.secondary);
  });

  it('primary a secondary sú rôzne (pri jedinom zdroji)', () => {
    const num = makeMinimalNumerology(1);
    const result = deriveTCMElement(num, null);
    // S jedným zdrojom: drevo=2, ostatné=0. Secondary bude prvý z 0-score (stabilný sort)
    // Ale: sort je podľa score desc, pri rovnosti závisí od stability sortu
    // Primárny by mal byť jasný, secondary môže byť hocičo s 0
    expect(result.primary).not.toBe(result.secondary);
  });
});

describe('deriveTCMElement — ŽČ mapovanie', () => {
  it('ŽČ 1 alebo 9 → drevo', () => {
    for (const lp of [1, 9]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveTCMElement(num, null);
      expect(result.primary).toBe('drevo');
    }
  });

  it('ŽČ 3 alebo 7 → ohen', () => {
    for (const lp of [3, 7]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveTCMElement(num, null);
      expect(result.primary).toBe('ohen');
    }
  });

  it('ŽČ 2 alebo 5 → zem', () => {
    for (const lp of [2, 5]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveTCMElement(num, null);
      expect(result.primary).toBe('zem');
    }
  });

  it('ŽČ 4 alebo 8 → kov', () => {
    for (const lp of [4, 8]) {
      const num = makeMinimalNumerology(lp);
      const result = deriveTCMElement(num, null);
      expect(result.primary).toBe('kov');
    }
  });

  it('ŽČ 6 → voda', () => {
    const num = makeMinimalNumerology(6);
    const result = deriveTCMElement(num, null);
    expect(result.primary).toBe('voda');
  });

  it('master ŽČ 11 → drevo', () => {
    const num = makeMinimalNumerology(11);
    const result = deriveTCMElement(num, null);
    expect(result.primary).toBe('drevo');
  });

  it('master ŽČ 22 → zem', () => {
    const num = makeMinimalNumerology(22);
    const result = deriveTCMElement(num, null);
    expect(result.primary).toBe('zem');
  });

  it('master ŽČ 33 → ohen', () => {
    const num = makeMinimalNumerology(33);
    const result = deriveTCMElement(num, null);
    expect(result.primary).toBe('ohen');
  });
});

describe('deriveTCMElement — astro element vplyv', () => {
  it('Oheň → ohen +3', () => {
    const num = makeMinimalNumerology(6); // voda +2
    const astro = { dominantElement: 'Oheň' } as unknown as AstrologyResult;
    const result = deriveTCMElement(num, astro);
    expect(result.primary).toBe('ohen');
  });

  it('Vzduch → kov +2, drevo +1', () => {
    const num = makeMinimalNumerology(6); // voda +2
    const astro = { dominantElement: 'Vzduch' } as unknown as AstrologyResult;
    const result = deriveTCMElement(num, astro);
    // kov=2, drevo=1, voda=2 → tie kov/voda
    expect(['kov', 'voda']).toContain(result.primary);
  });

  it('Zem → zem +3', () => {
    const num = makeMinimalNumerology(1); // drevo +2
    const astro = { dominantElement: 'Zem' } as unknown as AstrologyResult;
    const result = deriveTCMElement(num, astro);
    expect(result.primary).toBe('zem');
  });

  it('Voda → voda +3', () => {
    const num = makeMinimalNumerology(1); // drevo +2
    const astro = { dominantElement: 'Voda' } as unknown as AstrologyResult;
    const result = deriveTCMElement(num, astro);
    expect(result.primary).toBe('voda');
  });
});

describe('deriveTCMElement — rôzne dátumy vracajú platné elementy', () => {
  it('viac rôznych dátumov → vždy platný výstup', () => {
    const dates = [
      [30, 8, 1979], [15, 7, 1985], [1, 1, 2000], [25, 12, 1995], [14, 2, 1966],
    ] as const;
    for (const [d, m, y] of dates) {
      const num = calculateFullNumerology(d, m, y);
      const result = deriveTCMElement(num, null);
      expect(VALID_ELEMENTS).toContain(result.primary);
      expect(VALID_ELEMENTS).toContain(result.secondary);
    }
  });
});
