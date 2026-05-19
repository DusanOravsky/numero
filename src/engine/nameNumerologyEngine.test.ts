import { describe, it, expect } from 'vitest';
import { calculateNameNumerology } from './nameNumerologyEngine';

describe('calculateNameNumerology', () => {
  it('vracia 3 hlavné čísla a rozklad písmen', () => {
    const r = calculateNameNumerology('Adam Novak');
    expect(r.expressionNumber).toBeGreaterThan(0);
    expect(r.soulNumber).toBeGreaterThan(0);
    expect(r.personalityNumber).toBeGreaterThan(0);
    expect(r.letters.length).toBeGreaterThan(0);
  });

  it('rozdeľuje samohlásky a spoluhlásky', () => {
    const r = calculateNameNumerology('Eva');
    const vowels = r.letters.filter(l => l.isVowel);
    const consonants = r.letters.filter(l => !l.isVowel);
    expect(vowels.length).toBe(2); // E, a
    expect(consonants.length).toBe(1); // v
  });

  it('handluje digraf "ch" ako jedno písmeno', () => {
    const r = calculateNameNumerology('Chyba');
    // "ch" je 1 písmeno, potom y, b, a → 4 zápisy
    expect(r.letters.length).toBe(4);
    expect(r.letters[0].letter).toBe('ch');
  });

  it('ignoruje medzery a pomlčky', () => {
    const r1 = calculateNameNumerology('Anna Maria');
    const r2 = calculateNameNumerology('Anna-Maria');
    const r3 = calculateNameNumerology('AnnaMaria');
    expect(r1.expressionNumber).toBe(r2.expressionNumber);
    expect(r1.expressionNumber).toBe(r3.expressionNumber);
  });

  it('expression + soul + personality redukuje na jednociferné (alebo master)', () => {
    const r = calculateNameNumerology('Test Name');
    const allValid = (n: number) => n >= 1 && (n <= 9 || n === 11 || n === 22 || n === 33);
    expect(allValid(r.expressionNumber)).toBe(true);
    expect(allValid(r.soulNumber)).toBe(true);
    expect(allValid(r.personalityNumber)).toBe(true);
  });

  it('descripcia výrazu sa naplní pre redukovanú bázu', () => {
    const r = calculateNameNumerology('Adam');
    expect(r.expressionDescription).toBeTruthy();
    expect(r.soulDescription).toBeTruthy();
    expect(r.personalityDescription).toBeTruthy();
  });
});
