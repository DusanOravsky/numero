import { describe, it, expect } from 'vitest';
import { calculatePartnerCompatibility, calculateParentChild } from './compatibilityEngine';
import { calculateFullNumerology } from './numerologyEngine';

describe('calculatePartnerCompatibility', () => {
  const person1 = calculateFullNumerology(30, 8, 1979);
  const person2 = calculateFullNumerology(15, 7, 1985);

  it('vracia overallScore v rozsahu 0-100', () => {
    const result = calculatePartnerCompatibility(person1, person2);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('vracia všetky povinné polia', () => {
    const result = calculatePartnerCompatibility(person1, person2);
    expect(result).toHaveProperty('overallScore');
    expect(result).toHaveProperty('lifePathCompatibility');
    expect(result).toHaveProperty('planeCompatibility');
    expect(result).toHaveProperty('loveLanguageMatch');
    expect(result).toHaveProperty('energeticConnection');
    expect(result).toHaveProperty('challenges');
    expect(result).toHaveProperty('strengths');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('rituals');
  });

  it('sub-scores sú v rozsahu 0-100', () => {
    const result = calculatePartnerCompatibility(person1, person2);
    expect(result.lifePathCompatibility.score).toBeGreaterThanOrEqual(0);
    expect(result.lifePathCompatibility.score).toBeLessThanOrEqual(100);
    expect(result.planeCompatibility.score).toBeGreaterThanOrEqual(0);
    expect(result.planeCompatibility.score).toBeLessThanOrEqual(100);
    expect(result.loveLanguageMatch.score).toBeGreaterThanOrEqual(0);
    expect(result.loveLanguageMatch.score).toBeLessThanOrEqual(100);
    expect(result.energeticConnection.score).toBeGreaterThanOrEqual(0);
    expect(result.energeticConnection.score).toBeLessThanOrEqual(100);
  });

  it('je deterministický', () => {
    const r1 = calculatePartnerCompatibility(person1, person2);
    const r2 = calculatePartnerCompatibility(person1, person2);
    expect(r1).toEqual(r2);
  });

  it('je symetrický v celkovom skóre (poradie osôb nemení výsledok)', () => {
    const r1 = calculatePartnerCompatibility(person1, person2);
    const r2 = calculatePartnerCompatibility(person2, person1);
    expect(r1.overallScore).toBe(r2.overallScore);
  });

  it('recommendations a rituals sú neprázdne pole', () => {
    const result = calculatePartnerCompatibility(person1, person2);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.rituals.length).toBeGreaterThan(0);
  });

  it('neskrachuje pri rovnakej osobe (self-compatibility)', () => {
    const result = calculatePartnerCompatibility(person1, person1);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });
});

describe('calculateParentChild', () => {
  const parent = calculateFullNumerology(30, 8, 1979);
  const child = calculateFullNumerology(15, 7, 1985);

  it('vracia compatibility v rozsahu 40-100', () => {
    const result = calculateParentChild(parent, child);
    expect(result.compatibility).toBeGreaterThanOrEqual(40);
    expect(result.compatibility).toBeLessThanOrEqual(100);
  });

  it('vracia všetky povinné polia', () => {
    const result = calculateParentChild(parent, child);
    expect(result).toHaveProperty('compatibility');
    expect(result).toHaveProperty('emotionalNeeds');
    expect(result).toHaveProperty('communicationStyle');
    expect(result).toHaveProperty('boundaries');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('parentRole');
    expect(result).toHaveProperty('childNeeds');
  });

  it('emotionalNeeds, boundaries, recommendations, childNeeds sú neprázdne', () => {
    const result = calculateParentChild(parent, child);
    expect(result.emotionalNeeds.length).toBeGreaterThan(0);
    expect(result.boundaries.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.childNeeds.length).toBeGreaterThan(0);
  });

  it('communicationStyle a parentRole sú neprázdne stringy', () => {
    const result = calculateParentChild(parent, child);
    expect(result.communicationStyle.length).toBeGreaterThan(0);
    expect(result.parentRole.length).toBeGreaterThan(0);
  });

  it('je deterministický', () => {
    const r1 = calculateParentChild(parent, child);
    const r2 = calculateParentChild(parent, child);
    expect(r1).toEqual(r2);
  });

  it('neskrachuje keď rodič === dieťa', () => {
    const result = calculateParentChild(parent, parent);
    expect(result.compatibility).toBeGreaterThanOrEqual(40);
    expect(result.compatibility).toBeLessThanOrEqual(100);
  });

  it('rôzne smery (rodič-dieťa vs dieťa-rodič) dávajú rôzny parentRole', () => {
    const r1 = calculateParentChild(parent, child);
    const r2 = calculateParentChild(child, parent);
    // Ak majú rôzne ŽČ, parentRole bude rôzny
    if (parent.lifePathNumber !== child.lifePathNumber) {
      expect(r1.parentRole).not.toBe(r2.parentRole);
    }
  });
});
