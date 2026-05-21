import { describe, it, expect } from 'vitest';
import { calculateChineseZodiac } from './chineseZodiacEngine';

describe('calculateChineseZodiac — known years', () => {
  it('1979, mesiac 8, deň 30 → Koza/Zem/Yin', () => {
    // LNY 1979 = 28. januára → 30.8. je PO LNY → rok 1979
    const result = calculateChineseZodiac(1979, 8, 30);
    expect(result.animal).toBe('Koza');
    expect(result.element).toBe('Zem');
    expect(result.polarity).toBe('Yin');
  });

  it('2000 → Drak', () => {
    // LNY 2000 = 5. februára → narodenie v marci → rok 2000
    const result = calculateChineseZodiac(2000, 3, 15);
    expect(result.animal).toBe('Drak');
  });

  it('2024 → Drak (LNY 10. feb)', () => {
    const result = calculateChineseZodiac(2024, 6, 1);
    expect(result.animal).toBe('Drak');
  });

  it('1985 → Byvol (LNY 20. feb)', () => {
    // Narodenie po 20.2.1985
    const result = calculateChineseZodiac(1985, 3, 1);
    expect(result.animal).toBe('Byvol');
  });
});

describe('calculateChineseZodiac — lunar correction', () => {
  it('január 1979 pred LNY (28.1.) → predchádzajúci rok = Kôň', () => {
    // LNY 1979 = 28. jan. Narodenie 15. jan → effectiveYear = 1978
    const result = calculateChineseZodiac(1979, 1, 15);
    // 1978 % 12 = 10 → ANIMALS[10] = Kôň
    expect(result.animal).toBe('Kôň');
  });

  it('presne deň LNY → je už nový rok', () => {
    // LNY 1979 = 28. jan. Narodenie 28.1. → effectiveYear = 1979 (NIE pred LNY)
    const result = calculateChineseZodiac(1979, 1, 28);
    expect(result.animal).toBe('Koza');
  });

  it('deň pred LNY → predchádzajúci rok', () => {
    // LNY 1979 = 28. jan. Narodenie 27.1. → effectiveYear = 1978
    const result = calculateChineseZodiac(1979, 1, 27);
    expect(result.animal).toBe('Kôň');
  });

  it('február pred LNY 2000 (5. feb) → predchádzajúci rok Zajac', () => {
    // LNY 2000 = 5. feb. Narodenie 4. feb → effectiveYear = 1999
    const result = calculateChineseZodiac(2000, 2, 4);
    // 1999 % 12 = 7 → ANIMALS[7] = Zajac
    expect(result.animal).toBe('Zajac');
  });
});

describe('calculateChineseZodiac — approximate flag', () => {
  it('rok v rozsahu 1940-2030 → žiadny approximate', () => {
    const result = calculateChineseZodiac(1979, 8, 30);
    expect(result.approximate).toBeUndefined();
  });

  it('rok mimo 1940-2030 s mesiacom → approximate: true', () => {
    const result = calculateChineseZodiac(1935, 3, 15);
    expect(result.approximate).toBe(true);
  });

  it('rok mimo 1940-2030 bez mesiaca → žiadny approximate (len rok)', () => {
    const result = calculateChineseZodiac(1935);
    // No birthMonth provided → approximate is NOT set
    expect(result.approximate).toBeUndefined();
  });

  it('rok 2031 s mesiacom → approximate: true', () => {
    const result = calculateChineseZodiac(2031, 5, 10);
    expect(result.approximate).toBe(true);
  });

  it('rok 1940 (hraničný) → žiadny approximate', () => {
    const result = calculateChineseZodiac(1940, 6, 1);
    expect(result.approximate).toBeUndefined();
  });

  it('rok 2030 (hraničný) → žiadny approximate', () => {
    const result = calculateChineseZodiac(2030, 6, 1);
    expect(result.approximate).toBeUndefined();
  });
});

describe('calculateChineseZodiac — výstupná štruktúra', () => {
  it('vracia všetky povinné polia', () => {
    const result = calculateChineseZodiac(1979, 8, 30);
    expect(result.animal).toBeDefined();
    expect(result.animalGenitive).toBeDefined();
    expect(result.element).toBeDefined();
    expect(result.polarity).toBeDefined();
    expect(result.animalEmoji).toBeDefined();
    expect(result.elementEmoji).toBeDefined();
    expect(result.nextYear).toBeDefined();
  });

  it('nextYear je v budúcnosti', () => {
    const result = calculateChineseZodiac(1979, 8, 30);
    const currentYear = new Date().getFullYear();
    expect(result.nextYear).toBeGreaterThan(currentYear);
  });

  it('animalGenitive pre Kozu je "Kozy"', () => {
    const result = calculateChineseZodiac(1979, 8, 30);
    expect(result.animalGenitive).toBe('Kozy');
  });

  it('polarity je buď Yin alebo Yang', () => {
    const result = calculateChineseZodiac(1980, 3, 1);
    expect(['Yin', 'Yang']).toContain(result.polarity);
    // 1980 je párny → Yang
    expect(result.polarity).toBe('Yang');
  });

  it('element je jeden z 5 elementov', () => {
    const validElements = ['Kov', 'Voda', 'Drevo', 'Oheň', 'Zem'];
    for (let year = 1970; year <= 1980; year++) {
      const result = calculateChineseZodiac(year, 6, 15);
      expect(validElements).toContain(result.element);
    }
  });
});

describe('calculateChineseZodiac — bez mesiaca/dňa', () => {
  it('bez mesiaca a dňa → používa priamo rok', () => {
    const result = calculateChineseZodiac(1979);
    expect(result.animal).toBe('Koza');
  });

  it('bez mesiaca → žiadna lunárna korekcia', () => {
    // Aj keby bol január, bez mesiaca sa neaplikuje korekcia
    const result = calculateChineseZodiac(1979);
    expect(result.animal).toBe('Koza');
  });
});
