import { describe, it, expect } from 'vitest';
import { calculateThetaHealing, BELIEF_TEMPLATES } from './thetaHealingEngine';

describe('calculateThetaHealing', () => {
  it('vracia 3 primaryBeliefs a 3 diggingResults pre každé číslo 1-9', () => {
    for (let lp = 1; lp <= 9; lp++) {
      const result = calculateThetaHealing(lp);
      expect(result.primaryBeliefs).toHaveLength(3);
      expect(result.diggingResults).toHaveLength(3);
    }
  });

  it('vracia neprázdne healingWorkflow a recommendations', () => {
    const result = calculateThetaHealing(5);
    expect(result.healingWorkflow.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('diggingResult obsahuje newBelief s belief, affirmation, feeling', () => {
    const result = calculateThetaHealing(3);
    result.diggingResults.forEach(dr => {
      expect(dr.newBelief.belief).toBeTruthy();
      expect(dr.newBelief.affirmation).toBeTruthy();
      expect(dr.newBelief.feeling).toBeTruthy();
    });
  });

  it('primaryBeliefs majú level, origin, emotion, bodyArea', () => {
    const result = calculateThetaHealing(7);
    result.primaryBeliefs.forEach(b => {
      expect(['core', 'genetic', 'history', 'soul']).toContain(b.level);
      expect(b.origin).toBeTruthy();
      expect(b.emotion).toBeTruthy();
      expect(b.bodyArea).toBeTruthy();
    });
  });

  it('je deterministický', () => {
    const r1 = calculateThetaHealing(4);
    const r2 = calculateThetaHealing(4);
    expect(r1).toEqual(r2);
  });

  // === Master numbers 11, 22, 33 ===

  it('master number 11 vracia vlastný template (nie fallback na 1)', () => {
    const result = calculateThetaHealing(11);
    expect(result.primaryBeliefs).toHaveLength(3);
    expect(result.diggingResults).toHaveLength(3);
    // 11 template má soul-level belief o víziách
    const soulBelief = result.primaryBeliefs.find(b => b.level === 'soul');
    expect(soulBelief).toBeDefined();
    expect(soulBelief!.belief).toContain('vízie');
  });

  it('master number 22 vracia vlastný template (nie fallback na 1)', () => {
    const result = calculateThetaHealing(22);
    expect(result.primaryBeliefs).toHaveLength(3);
    expect(result.diggingResults).toHaveLength(3);
    // 22 template má belief o zodpovednosti
    const coreBelief = result.primaryBeliefs.find(b => b.level === 'core');
    expect(coreBelief).toBeDefined();
    expect(coreBelief!.belief).toContain('Zodpovednosť');
  });

  it('master number 33 vracia vlastný template (nie fallback na 1)', () => {
    const result = calculateThetaHealing(33);
    expect(result.primaryBeliefs).toHaveLength(3);
    expect(result.diggingResults).toHaveLength(3);
    // 33 template má soul-level belief o utrpení
    const soulBelief = result.primaryBeliefs.find(b => b.level === 'soul');
    expect(soulBelief).toBeDefined();
    expect(soulBelief!.belief).toContain('utrpenie');
  });

  it('master numbers 11/22/33 sú odlišné od key 1 fallbacku', () => {
    const fallback = calculateThetaHealing(1);
    const m11 = calculateThetaHealing(11);
    const m22 = calculateThetaHealing(22);
    const m33 = calculateThetaHealing(33);

    expect(m11.primaryBeliefs[0].belief).not.toBe(fallback.primaryBeliefs[0].belief);
    expect(m22.primaryBeliefs[0].belief).not.toBe(fallback.primaryBeliefs[0].belief);
    expect(m33.primaryBeliefs[0].belief).not.toBe(fallback.primaryBeliefs[0].belief);
  });

  it('BELIEF_TEMPLATES má entries pre 1-9 a 11, 22, 33', () => {
    const expectedKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
    expectedKeys.forEach(k => {
      expect(BELIEF_TEMPLATES[k]).toBeDefined();
      expect(BELIEF_TEMPLATES[k].beliefs).toHaveLength(3);
      expect(BELIEF_TEMPLATES[k].newBeliefs).toHaveLength(3);
    });
  });

  // Edge case: neznáme číslo fallbackuje na key 1
  it('neznáme číslo (napr. 44) fallbackuje na template 1', () => {
    const result = calculateThetaHealing(44);
    const fallback = calculateThetaHealing(1);
    expect(result.primaryBeliefs).toEqual(fallback.primaryBeliefs);
  });
});
