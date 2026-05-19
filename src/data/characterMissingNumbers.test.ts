import { describe, it, expect } from 'vitest';
import { characterMissingNumbers, findMissingCharacterNumbers } from './characterMissingNumbers';

describe('characterMissingNumbers', () => {
  it('má záznam pre každé číslo 1-9', () => {
    for (let i = 1; i <= 9; i++) {
      expect(characterMissingNumbers[i], `Chýba záznam pre číslo ${i}`).toBeDefined();
      expect(characterMissingNumbers[i].title).toContain('Bez');
      expect(characterMissingNumbers[i].description.length).toBeGreaterThan(20);
      expect(characterMissingNumbers[i].recommendation.length).toBeGreaterThan(20);
    }
  });

  it('findMissingCharacterNumbers vráti komentáre len pre prázdne políčka', () => {
    // mriežka kde 1, 3, 5 sú vyplnené, ostatné prázdne
    const grid: { value: number; isBase: boolean }[][] = Array.from({ length: 10 }, () => []);
    grid[1].push({ value: 1, isBase: true });
    grid[3].push({ value: 3, isBase: true });
    grid[5].push({ value: 5, isBase: true });

    const missing = findMissingCharacterNumbers(grid);
    const missingNumbers = missing.map(m => m.number);

    expect(missingNumbers).toEqual([2, 4, 6, 7, 8, 9]);
    expect(missingNumbers).not.toContain(1);
    expect(missingNumbers).not.toContain(3);
    expect(missingNumbers).not.toContain(5);
  });

  it('LOCK: 30.8.1979 → mriežka má 1,3,7,8,9 → chýbajúce 2,4,5,6', async () => {
    const { calculateFullNumerology } = await import('../engine/numerologyEngine');
    const num = calculateFullNumerology(30, 8, 1979);
    const missing = findMissingCharacterNumbers(num.grid);
    const missingNumbers = missing.map(m => m.number).sort();
    expect(missingNumbers).toEqual([2, 4, 5, 6]);
  });
});
