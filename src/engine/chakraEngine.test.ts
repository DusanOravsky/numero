import { describe, it, expect } from 'vitest';
import { evaluateChakras } from './chakraEngine';
import { calculateFullNumerology } from './numerologyEngine';

describe('evaluateChakras', () => {
  it('vracia 7 čakier pre každý vstup', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const result = evaluateChakras(
      num.lifePathNumber,
      new Map([1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [n, num.grid[n]?.length || 0])),
      num.isolatedNumbers,
      [],
      'Oheň'
    );
    expect(result).toHaveLength(7);
  });

  it('je deterministický — rovnaký vstup vždy rovnaký výstup', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const counts = new Map([1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [n, num.grid[n]?.length || 0]));
    const r1 = evaluateChakras(num.lifePathNumber, counts, num.isolatedNumbers, ['Sakrálne'], 'Oheň');
    const r2 = evaluateChakras(num.lifePathNumber, counts, num.isolatedNumbers, ['Sakrálne'], 'Oheň');
    expect(r1).toEqual(r2);
  });

  it('skóre je v rozsahu 0-100', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const counts = new Map([1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [n, num.grid[n]?.length || 0]));
    const result = evaluateChakras(num.lifePathNumber, counts, num.isolatedNumbers, [], 'Oheň');
    result.forEach(r => {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    });
  });

  it('bez podporujúcich faktorov by čakra mala mať nižšie skóre', () => {
    // Profil bez čísel pre koreňovú čakru (numerologyNumbers: 1, 4)
    // → mal by byť blokovaná
    const counts = new Map<number, number>();
    counts.set(1, 0);
    counts.set(4, 0);
    const result = evaluateChakras(7, counts, [], [], 'Voda');
    const root = result.find(r => r.chakra.number === 1)!;
    // 50 - 15 (žiadna 1) - 15 (žiadna 4) = 20 → blokovaná
    expect(root.score).toBeLessThan(50);
    expect(root.status).toBe('blocked');
  });

  it('plná korešpondencia (ŽČ + def. centrum + element + viacnásobné čísla) = vyrazena/hyperaktívna', () => {
    const counts = new Map<number, number>();
    counts.set(1, 2); // koreňová má 1, 4 ako numerologyNumbers
    counts.set(4, 2);
    const result = evaluateChakras(1, counts, [], ['Koreň'], 'Zem');
    const root = result.find(r => r.chakra.number === 1)!;
    // 50 + 10 (1×2) + 10 (4×2) + 10 (HD Koreň) + 10 (Zem element) + 15 (ŽČ=1) = 105 → cap 100
    expect(root.score).toBe(100);
    expect(['hyperactive', 'balanced']).toContain(root.status);
  });

  // === LOCK testy (zmrazia konkrétne hodnoty pre konkrétne profily) ===
  // Tieto testy zlyhajú, ak niekto v budúcnosti zmení čakrový algoritmus
  // alebo prahy bez vedomého rozhodnutia. Sú to "snapshots" pre odporúčateľné dátumy.

  it('LOCK: 30.8.1979 + Slezina/Sakrálne/Solárny plexus def. + Oheň', () => {
    const num = calculateFullNumerology(30, 8, 1979);
    const counts = new Map([1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [n, num.grid[n]?.length || 0]));
    const result = evaluateChakras(
      num.lifePathNumber,
      counts,
      num.isolatedNumbers,
      ['Slezina', 'Sakrálne', 'Solárny plexus'],
      'Oheň'
    );

    // ŽČ = 1, mriežka má 1×4 (3,3,3 z dňa+doplnku+medzisúčtu), 8 (mesiac), 9, 9, 7 (rok), redukcie
    // Test si len uzamkne počet status-ov: nemali by byť všetky "balanced"
    const balanced = result.filter(r => r.status === 'balanced').length;
    const blocked = result.filter(r => r.status === 'blocked').length;

    // Aspoň jedna by mala byť blokovaná (chýba 4 alebo 5 alebo 6 v mriežke)
    expect(blocked + balanced).toBe(7); // všetky sú v týchto dvoch kategóriách (alebo aj hyperaktívne)
    // Nemajú byť všetky vyvážené:
    expect(balanced).toBeLessThan(7);
  });

  it('LOCK: 15.7.1985 + bez HD centier + Voda', () => {
    const num = calculateFullNumerology(15, 7, 1985);
    const counts = new Map([1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [n, num.grid[n]?.length || 0]));
    const result = evaluateChakras(num.lifePathNumber, counts, num.isolatedNumbers, [], 'Voda');

    // 15.7.1985: cifry 1,5,7,1,9,8,5 + redukcie 6 (z 15) + 5 (z 1985→23→5) + medzisúčet 2,3
    // mriežka: 1=2×, 2=1×, 3=1×, 5=3×, 6=1×, 7=1×, 8=1×, 9=1×, 4=0×
    // ŽČ = 9
    // Test uzamkne: koreňová čakra (1,4) má 1=2×, 4=0× → 50 +10 -15 = 45 → blokovaná
    const root = result.find(r => r.chakra.number === 1)!;
    expect(root.score).toBe(45);
    expect(root.status).toBe('blocked');
  });
});
