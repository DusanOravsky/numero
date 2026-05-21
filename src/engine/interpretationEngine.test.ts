import { describe, it, expect } from 'vitest';
import { generateInterpretation } from './interpretationEngine';
import { calculateFullNumerology } from './numerologyEngine';

describe('generateInterpretation', () => {
  const numerology = calculateFullNumerology(30, 8, 1979);

  it('vracia všetky povinné polia FullInterpretation', () => {
    const result = generateInterpretation(numerology);
    expect(result).toHaveProperty('mainLifeTheme');
    expect(result).toHaveProperty('currentLesson');
    expect(result).toHaveProperty('gift');
    expect(result).toHaveProperty('shadow');
    expect(result).toHaveProperty('themes');
    expect(result).toHaveProperty('emotionalFocus');
    expect(result).toHaveProperty('relationshipDynamic');
    expect(result).toHaveProperty('todayRecommendation');
    expect(result).toHaveProperty('dailyGuidance');
    expect(result).toHaveProperty('question');
    expect(result).toHaveProperty('miniStep');
  });

  it('mainLifeTheme je neprázdny string', () => {
    const result = generateInterpretation(numerology);
    expect(result.mainLifeTheme).toBeTruthy();
    expect(typeof result.mainLifeTheme).toBe('string');
  });

  it('gift a shadow sú neprázdne stringy', () => {
    const result = generateInterpretation(numerology);
    expect(result.gift.length).toBeGreaterThan(0);
    expect(result.shadow.length).toBeGreaterThan(0);
  });

  it('themes je pole InterpretationTheme objektov', () => {
    const result = generateInterpretation(numerology);
    expect(Array.isArray(result.themes)).toBe(true);
    result.themes.forEach(t => {
      expect(t).toHaveProperty('theme');
      expect(t).toHaveProperty('weight');
      expect(t).toHaveProperty('sources');
      expect(t).toHaveProperty('description');
      expect(t.weight).toBeGreaterThan(0);
      expect(t.sources.length).toBeGreaterThan(0);
    });
  });

  it('themes sú zoradené podľa weight zostupne', () => {
    const result = generateInterpretation(numerology);
    for (let i = 1; i < result.themes.length; i++) {
      expect(result.themes[i - 1].weight).toBeGreaterThanOrEqual(result.themes[i].weight);
    }
  });

  it('dailyGuidance má všetky polia', () => {
    const result = generateInterpretation(numerology);
    const dg = result.dailyGuidance;
    expect(dg.mainTheme).toBeTruthy();
    expect(dg.affirmation).toBeTruthy();
    expect(dg.question).toBeTruthy();
    expect(dg.consciousStep).toBeTruthy();
    expect(dg.bodyRecommendation).toBeTruthy();
    expect(dg.relationshipTip).toBeTruthy();
    expect(dg.ritual).toBeTruthy();
  });

  it('je deterministický (rovnaký vstup = rovnaký výstup)', () => {
    const r1 = generateInterpretation(numerology);
    const r2 = generateInterpretation(numerology);
    expect(r1).toEqual(r2);
  });

  it('funguje len s numerológiou (bez voliteľných parametrov)', () => {
    const result = generateInterpretation(numerology);
    expect(result.mainLifeTheme).toBeTruthy();
    expect(result.currentLesson).toBeTruthy();
  });

  it('pre rôzne ŽČ vracia rôzne gift/shadow', () => {
    const num1 = calculateFullNumerology(1, 1, 2000); // ŽČ 4
    const num9 = calculateFullNumerology(9, 9, 1999); // ŽČ 9 (9+9+28=46→10→1? overíme)
    const r1 = generateInterpretation(num1);
    const r9 = generateInterpretation(num9);
    // Rôzne ŽČ → rôzne gift/shadow (aspoň jeden by mal byť iný)
    if (num1.lifePathNumber !== num9.lifePathNumber) {
      expect(r1.gift).not.toBe(r9.gift);
    }
  });

  it('question a miniStep sú neprázdne stringy', () => {
    const result = generateInterpretation(numerology);
    expect(result.question.length).toBeGreaterThan(0);
    expect(result.miniStep.length).toBeGreaterThan(0);
  });
});
