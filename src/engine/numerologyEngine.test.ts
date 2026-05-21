import { describe, it, expect } from 'vitest';
import {
  reduceToSingle,
  reduceDigits,
  calculateLifePath,
  buildGrid,
  calculatePlanes,
  findIsolatedNumbers,
  calculateORV,
  calculateOMV,
  calculateODV,
  calculateVDD,
  calculateSigmaT,
  isValidDate,
  calculateFullNumerology,
} from './numerologyEngine';

describe('reduceToSingle', () => {
  it('vracia jednociferné čísla bez zmeny', () => {
    expect(reduceToSingle(1)).toBe(1);
    expect(reduceToSingle(9)).toBe(9);
  });
  it('redukuje viacciferné čísla na jednociferné', () => {
    expect(reduceToSingle(10)).toBe(1);
    expect(reduceToSingle(28)).toBe(1); // 2+8=10 -> 1
    expect(reduceToSingle(123)).toBe(6);
  });
  it('preserveMaster zachováva 11, 22, 33', () => {
    expect(reduceToSingle(11, true)).toBe(11);
    expect(reduceToSingle(22, true)).toBe(22);
    expect(reduceToSingle(33, true)).toBe(33);
    expect(reduceToSingle(11)).toBe(2);
  });
  it('záporné vracia 1 (fallback), 0 vracia 0', () => {
    expect(reduceToSingle(0)).toBe(0);
    expect(reduceToSingle(-5)).toBe(1);
  });
});

describe('reduceDigits', () => {
  it('jednorazová redukcia (nie iteratívna)', () => {
    expect(reduceDigits(28)).toBe(10);
    expect(reduceDigits(9)).toBe(9);
    expect(reduceDigits(1979)).toBe(26);
  });
});

describe('calculateLifePath (PDF Numero pravidlo)', () => {
  it('15.7.1985 → ŽČ 9 z 36', () => {
    const r = calculateLifePath(15, 7, 1985);
    // 15→6, 7→7, 1985→23. spolu 6+7+23 = 36 → 9
    expect(r.from).toBe(36);
    expect(r.number).toBe(9);
    expect(r.isMaster).toBe(false);
  });
  it('30.8.1979 → ŽČ 1 z 37', () => {
    const r = calculateLifePath(30, 8, 1979);
    // 30→3, 8→8, 1979→26. spolu 3+8+26 = 37 → 1
    expect(r.from).toBe(37);
    expect(r.number).toBe(1);
  });
  it('1.1.2000 → ŽČ 4 z 4', () => {
    const r = calculateLifePath(1, 1, 2000);
    // 1+1+(2+0+0+0)=4
    expect(r.from).toBe(4);
    expect(r.number).toBe(4);
  });
  it('zachová master number 11', () => {
    const r = calculateLifePath(29, 5, 1985);
    // 29→11, 5→5, 1985→23 = 39 → 12 → 3. Toto nie je master.
    expect(r.from).toBe(39);
    expect(r.number).toBe(3);
  });
  it('formula obsahuje rozklad', () => {
    const r = calculateLifePath(15, 7, 1985);
    expect(r.formula).toContain('(15→6)');
    expect(r.formula).toContain('(7→7)');
    expect(r.formula).toContain('(1985→23)');
  });
});

describe('buildGrid', () => {
  it('15.7.1985: cifry dátumu + doplnkové redukcie', () => {
    const grid = buildGrid(15, 7, 1985);
    // dateStr "1571985" → cifry 1,5,7,1,9,8,5 (žiadne nuly)
    // doplnkové: deň 15→6, mesiac 7 (jednociferné, žiadny doplnok), rok 1985→5 (23→5)
    const flat = grid.flat();
    expect(flat.filter(x => x.value === 1)).toHaveLength(2); // 2× v dátume
    expect(flat.filter(x => x.value === 5)).toHaveLength(3); // 2× v dátume + nič z doplnkov
    expect(flat.filter(x => x.value === 6)).toHaveLength(1); // doplnok dňa
  });
  it('odfiltruje 0 z dátumu', () => {
    const grid = buildGrid(1, 1, 2000);
    const flat = grid.flat();
    expect(flat.filter(x => x.value === 0)).toHaveLength(0);
  });
});

describe('calculatePlanes', () => {
  it('detekuje plnú rovinu Empatia (3-6-9) ak sú všetky 3 prítomné', () => {
    const grid = buildGrid(3, 6, 1990); // mám 3, 6, 1, 9, 9, 0
    const planes = calculatePlanes(grid);
    expect(planes.full).toContain('3-6-9 Empatia');
  });
  it('detekuje prázdnu rovinu ak žiadne číslo z trojice nie je prítomné', () => {
    // dátum 1.1.2000 → mriežka má len 1, 2 (a možno 4 z roku)
    const grid = buildGrid(1, 1, 2000);
    const planes = calculatePlanes(grid);
    // 7-8-9 by mala byť prázdna (žiadne 7, 8, 9 v 1.1.2000)
    expect(planes.empty).toContain('7-8-9 Oddanosť veci');
  });
});

describe('findIsolatedNumbers', () => {
  it('izolovaná 9 keď nie je 5, 6, 8 v mriežke', () => {
    // 1.1.2009 → cifry 1,1,2,9 (rok 2+9=11→2 doplnok)
    // 9 má susedov 5, 6, 8 — žiadny nie je v mriežke → izolovaná
    const grid = buildGrid(1, 1, 2009);
    const isolated = findIsolatedNumbers(grid);
    expect(isolated).toContain(9);
  });
});

describe('calculateORV', () => {
  it('15.7.1985 + 17.5.2024 (po narodeninách): ORV', () => {
    // ORV používa rok 2024 (po narodeninách)
    const orv = calculateORV(15, 7, 2024, 8, 20);
    // deň 15→6, mesiac 7→7, rok 2024→8 (2+0+2+4=8)
    // 6+7+8=21→3
    expect(orv).toBe(3);
  });
  it('15.7.1985 + 17.5.2024 (PRED narodeninami): ORV používa rok 2023', () => {
    const orv = calculateORV(15, 7, 2024, 5, 17);
    // before birthday → year=2023
    // deň 15→6, mesiac 7→7, rok 2023→7 (2+0+2+3=7)
    // 6+7+7=20→2
    expect(orv).toBe(2);
  });
});

describe('calculateOMV / calculateODV', () => {
  it('OMV = aktuálny mesiac + ORV (redukované)', () => {
    expect(calculateOMV(3, 5)).toBe(8); // 5+3=8
    expect(calculateOMV(7, 11)).toBe(9); // 11+7=18→9
  });
  it('ODV = deň + mesiac + ORV (redukované)', () => {
    expect(calculateODV(3, 15, 5)).toBe(5); // 15+5+3=23→5
  });
});

describe('calculateVDD', () => {
  it('VDD = 36 - ŽČ', () => {
    const r = calculateVDD(9);
    expect(r.vdd).toBe(27);
    expect(r.oddPeriod).toBe(9); // 27/3
  });
  it('VDD pre master number použije redukovanú verziu', () => {
    const r = calculateVDD(11); // 11 → 2 → 36-2 = 34
    expect(r.vdd).toBe(34);
  });
});

describe('calculateSigmaT', () => {
  it('súčet < 2000 = pisces', () => {
    // potrebujem deň+mesiac+rok < 2000, takže rok < ~1992
    const r = calculateSigmaT(1, 1, 1990);
    expect(r.value).toBe(1992);
    expect(r.age).toBe('pisces');
  });
  it('súčet >= 2000 = aquarius', () => {
    const r = calculateSigmaT(15, 7, 1985);
    expect(r.value).toBe(2007); // 15+7+1985
    expect(r.age).toBe('aquarius');
  });
  it('1.1.2000 → ΣT 2002 (aquarius)', () => {
    const r = calculateSigmaT(1, 1, 2000);
    expect(r.value).toBe(2002);
    expect(r.age).toBe('aquarius');
  });
});

describe('isValidDate', () => {
  it('akceptuje platné dátumy', () => {
    expect(isValidDate(29, 2, 2024)).toBe(true); // priestupný rok
    expect(isValidDate(31, 12, 1985)).toBe(true);
  });
  it('odmieta neplatné', () => {
    expect(isValidDate(31, 2, 2024)).toBe(false); // 31. február
    expect(isValidDate(29, 2, 2023)).toBe(false); // 2023 nie je priestupný
    expect(isValidDate(0, 1, 2024)).toBe(false);
    expect(isValidDate(1, 13, 2024)).toBe(false);
    expect(isValidDate(1, 1, 1899)).toBe(false); // mimo rozsah
    expect(isValidDate(1, 1, 2101)).toBe(false);
  });
});

describe('calculateFullNumerology integration', () => {
  it('vracia konzistentný objekt pre 15.7.1985', () => {
    const r = calculateFullNumerology(15, 7, 1985);
    expect(r.lifePathNumber).toBe(9);
    expect(r.lifePathFrom).toBe(36);
    expect(r.vdd).toBe(27);
    expect(r.sigmaT).toBe(2007);
    expect(r.age).toBe('aquarius');
    expect(r.karmicTriangles).toHaveLength(7);
    expect(r.loveLanguages.length).toBeGreaterThan(0);
  });
});

describe('karmic debts (B2)', () => {
  it('detekuje 13 v dni narodenia', () => {
    const r = calculateFullNumerology(13, 5, 1990);
    expect(r.karmicDebts.some(d => d.number === 13 && d.source === 'birthDay')).toBe(true);
  });
  it('detekuje 14 v dni narodenia', () => {
    const r = calculateFullNumerology(14, 6, 1985);
    expect(r.karmicDebts.some(d => d.number === 14)).toBe(true);
  });
  it('detekuje 16 v dni narodenia', () => {
    const r = calculateFullNumerology(16, 8, 1980);
    expect(r.karmicDebts.some(d => d.number === 16)).toBe(true);
  });
  it('detekuje 19 v dni narodenia', () => {
    const r = calculateFullNumerology(19, 3, 1975);
    expect(r.karmicDebts.some(d => d.number === 19)).toBe(true);
  });
  it('30.8.1979 detekuje 16 v pinnacle súčte M(8)+R(8)', () => {
    const r = calculateFullNumerology(30, 8, 1979);
    expect(r.karmicDebts.some(d => d.number === 16 && d.source === 'pinnacle')).toBe(true);
  });
});

describe('maturity & birthday number (B3)', () => {
  it('30.8.1979: maturity = LP(1) + dayRed(3) = 4', () => {
    const r = calculateFullNumerology(30, 8, 1979);
    expect(r.maturityNumber).toBe(4);
    expect(r.birthdayNumber).toBe(30);
  });
});
