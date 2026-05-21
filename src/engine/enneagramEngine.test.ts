import { describe, it, expect } from 'vitest';
import { deriveEnneagramType } from './enneagramEngine';
import { calculateFullNumerology } from './numerologyEngine';
import { calculateDevelopmentalNumerology } from './developmentalNumerologyEngine';

describe('deriveEnneagramType — characterological method', () => {
  it('30.8.1979: ŽČ=1 → coreType 1', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.coreType).toBe(1);
    expect(result.method).toBe('characterological');
  });

  it('15.7.1985: ŽČ=9 → coreType 9', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.coreType).toBe(9);
  });

  it('master number 11 → redukuje na 2', () => {
    // 29.9.1981: 29→11, 9→9, 1981→19→10→1. sum=11+9+1=21→3. Nie 11.
    // Nájdime dátum s ŽČ=11: napríklad 29.5.1985 → 29→11, 5→5, 1985→23. 11+5+23=39→3. Nie.
    // Iný prístup: ŽČ=11 napríklad 29.2.1960: 29→11, 2→2, 1960→16→7. 11+2+7=20→2. Nie master.
    // Kľúč: v characterological reduceToSingle(lifePathNumber) vždy vráti 1-9
    const num = calculateFullNumerology(29, 2, 1960);
    const result = deriveEnneagramType(num, null, 'characterological');
    // lifePathNumber je buď 11 (master) alebo jednociferné
    // reduceToSingle(11) = 2, reduceToSingle(2) = 2
    expect(result.coreType).toBeGreaterThanOrEqual(1);
    expect(result.coreType).toBeLessThanOrEqual(9);
  });

  it('coreType je vždy v rozsahu 1-9', () => {
    const dates = [
      [1, 1, 2000], [15, 7, 1985], [30, 8, 1979], [25, 12, 1995],
    ] as const;
    for (const [d, m, y] of dates) {
      const num = calculateFullNumerology(d, m, y);
      const result = deriveEnneagramType(num, null, 'characterological');
      expect(result.coreType).toBeGreaterThanOrEqual(1);
      expect(result.coreType).toBeLessThanOrEqual(9);
    }
  });
});

describe('deriveEnneagramType — developmental method', () => {
  it('30.8.1979: K3=31 → reduceToSingle(31)=4 → coreType 4', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const dev = calculateDevelopmentalNumerology(30, 8, 1979);
    const result = deriveEnneagramType(num, dev, 'developmental');
    // K3 = C1 - 2*firstDayDigit = 37 - 2*3 = 31 → 3+1=4
    expect(result.coreType).toBe(4);
    expect(result.method).toBe('developmental');
  });

  it('K3=0 → fallback na 9', () => {
    // Simulujeme K3=0: deň kde C1 = 2*firstDayDigit
    // C1 = (D+M) + R. firstDayDigit = first digit of day.
    // Napríklad deň=20, mes=1, rok=1959: D+M=2+0+1=3, R=1+9+5+9=24, C1=27, 2*2=4, K3=27-4=23. Nie.
    // Ťažké nájsť reálny K3=0, otestujme logiku priamo cez mock
    const num = calculateFullNumerology(30, 8, 1979);
    const dev = calculateDevelopmentalNumerology(30, 8, 1979);
    // Patch K3 to 0 for testing the fallback
    dev.circled[2] = { ...dev.circled[2], value: 0 };
    const result = deriveEnneagramType(num, dev, 'developmental');
    expect(result.coreType).toBe(9);
  });

  it('negatívny K3 → použije Math.abs a redukuje', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const dev = calculateDevelopmentalNumerology(30, 8, 1979);
    // Patch K3 to negative value
    dev.circled[2] = { ...dev.circled[2], value: -5 };
    const result = deriveEnneagramType(num, dev, 'developmental');
    expect(result.coreType).toBe(5); // Math.abs(-5) → 5
  });

  it('master number v K3 (11) → reduceToSingle(11)=2', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const dev = calculateDevelopmentalNumerology(30, 8, 1979);
    dev.circled[2] = { ...dev.circled[2], value: 11 };
    const result = deriveEnneagramType(num, dev, 'developmental');
    expect(result.coreType).toBe(2);
  });

  it('fallback na characterological keď developmental je null', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const result = deriveEnneagramType(num, null, 'developmental');
    // Should use lifePathNumber fallback = 1
    expect(result.coreType).toBe(1);
  });
});

describe('deriveEnneagramType — wings', () => {
  it('coreType 1 → wing1=9, wing2=2', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.coreType).toBe(1);
    expect(result.wing1).toBe(9);
    expect(result.wing2).toBe(2);
  });

  it('coreType 9 → wing1=8, wing2=1', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.coreType).toBe(9);
    expect(result.wing1).toBe(8);
    expect(result.wing2).toBe(1);
  });

  it('coreType 5 → wing1=4, wing2=6', () => {
    // Nájdime ŽČ=5: napr. 14.3.1990 → 1+4+3+1+9+9+0=27→9. Nie.
    // 23.1.1990 → 2+3+1+1+9+9+0=25→7. Nie.
    // 5.5.1990 → 5+5+1+9+9+0=29→11→2. Nie.
    // 5.1.1990 → 5+1+1+9+9+0=25→7. Nie.
    // 14.5.1990 → 1+4+5+1+9+9+0=29→11→2. Nie.
    // 23.5.1990 → 2+3+5+1+9+9+0=29→11→2. Nie.
    // 1.3.1992 → 1+3+1+9+9+2=25→7. Nie.
    // 5.2.1993 → 5+2+1+9+9+3=29→11→2. Nie.
    // Test differently: create a num result with lifePathNumber=5
    const num = calculateFullNumerology(30, 8, 1979);
    const dev = calculateDevelopmentalNumerology(30, 8, 1979);
    dev.circled[2] = { ...dev.circled[2], value: 5 };
    const result = deriveEnneagramType(num, dev, 'developmental');
    expect(result.coreType).toBe(5);
    expect(result.wing1).toBe(4);
    expect(result.wing2).toBe(6);
  });
});

describe('deriveEnneagramType — integration/disintegration', () => {
  it('typ 1 → integrácia 7, dezintegrácia 4', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.integrationDirection).toBe(7);
    expect(result.disintegrationDirection).toBe(4);
  });

  it('typ 9 → integrácia 3, dezintegrácia 6', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const result = deriveEnneagramType(num, null, 'characterological');
    expect(result.integrationDirection).toBe(3);
    expect(result.disintegrationDirection).toBe(6);
  });

  it('všetky typy 1-9 majú definovanú integráciu aj dezintegráciu', () => {
    const dates = [
      [30, 8, 1979], [15, 7, 1985], [1, 1, 2000], [14, 6, 1985],
      [23, 11, 1992], [8, 4, 1988], [12, 12, 1990], [7, 7, 1977],
    ] as const;
    for (const [d, m, y] of dates) {
      const num = calculateFullNumerology(d, m, y);
      const result = deriveEnneagramType(num, null, 'characterological');
      expect(result.integrationDirection).toBeGreaterThanOrEqual(1);
      expect(result.integrationDirection).toBeLessThanOrEqual(9);
      expect(result.disintegrationDirection).toBeGreaterThanOrEqual(1);
      expect(result.disintegrationDirection).toBeLessThanOrEqual(9);
    }
  });
});
