import { describe, it, expect } from 'vitest';
import { calculateKabalah, SEFIROT } from './kabalahEngine';

describe('calculateKabalah — normal numbers 1-9', () => {
  it('lifePathNumber=1 → primarySefira = Keter (1)', () => {
    const result = calculateKabalah(1, 5);
    expect(result.primarySefira.name).toBe('Keter');
    expect(result.primarySefira.number).toBe(1);
  });

  it('lifePathNumber=9 → primarySefira = Jesod (9)', () => {
    const result = calculateKabalah(9, 3);
    expect(result.primarySefira.name).toBe('Jesod');
    expect(result.primarySefira.number).toBe(9);
  });

  it('dayNumber=6 → secondarySefira = Tiferet (6)', () => {
    const result = calculateKabalah(1, 6);
    expect(result.secondarySefira.name).toBe('Tiferet');
    expect(result.secondarySefira.number).toBe(6);
  });

  it('správne mapuje všetky sefiry 1-9', () => {
    const expectedNames = ['Keter', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiferet', 'Necach', 'Hod', 'Jesod'];
    for (let i = 1; i <= 9; i++) {
      const result = calculateKabalah(i, 1);
      expect(result.primarySefira.name).toBe(expectedNames[i - 1]);
    }
  });
});

describe('calculateKabalah — master numbers', () => {
  it('11 → reduceForSefira → 2 → Chokmah', () => {
    const result = calculateKabalah(11, 5);
    expect(result.primarySefira.name).toBe('Chokmah');
    expect(result.primarySefira.number).toBe(2);
  });

  it('22 → reduceForSefira → 4 → Chesed', () => {
    const result = calculateKabalah(22, 3);
    expect(result.primarySefira.name).toBe('Chesed');
    expect(result.primarySefira.number).toBe(4);
  });

  it('33 → reduceForSefira → 6 → Tiferet', () => {
    const result = calculateKabalah(33, 7);
    expect(result.primarySefira.name).toBe('Tiferet');
    expect(result.primarySefira.number).toBe(6);
  });

  it('master number v dayNumber: 11 → secondarySefira = Chokmah', () => {
    const result = calculateKabalah(5, 11);
    expect(result.secondarySefira.name).toBe('Chokmah');
  });
});

describe('calculateKabalah — výstupná štruktúra', () => {
  it('path obsahuje mená oboch sefír + Malchut', () => {
    const result = calculateKabalah(3, 7);
    expect(result.path).toContain('Binah');
    expect(result.path).toContain('Necach');
    expect(result.path).toContain('Malchut');
  });

  it('lifeLessons má 4 položky', () => {
    const result = calculateKabalah(5, 2);
    expect(result.lifeLessons).toHaveLength(4);
  });

  it('integration text je neprázdny string', () => {
    const result = calculateKabalah(1, 9);
    expect(result.integration.length).toBeGreaterThan(10);
  });

  it('malchutAction zodpovedá primarySefira.action', () => {
    const result = calculateKabalah(4, 8);
    expect(result.malchutAction).toBe(SEFIROT[3].action); // index 3 = Chesed (number 4)
  });
});

describe('calculateKabalah — edge cases', () => {
  it('rovnaký lifePathNumber a dayNumber → primary === secondary', () => {
    const result = calculateKabalah(5, 5);
    expect(result.primarySefira.name).toBe(result.secondarySefira.name);
  });

  it('hodnota > 9 bez master → Math.min(n, 9) → Jesod', () => {
    // reduceForSefira(10) → Math.min(10, 9) = 9 → Jesod
    const result = calculateKabalah(10, 1);
    expect(result.primarySefira.name).toBe('Jesod');
  });
});
