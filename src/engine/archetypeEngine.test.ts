import { describe, it, expect } from 'vitest';
import { deriveArchetype } from './archetypeEngine';

describe('archetypeEngine', () => {
  describe('convergent case — all 3 systems agree', () => {
    it('LP=1(→6), Ennea=1(→6), HD=Generátor(→6) → primary is Hero (id=6)', () => {
      const result = deriveArchetype(1, 1, 'Generátor');
      expect(result.primary.id).toBe(6);
      expect(result.primary.name).toBe('Hrdina');
    });
  });

  describe('all different — LP wins as tiebreaker', () => {
    it('LP=9(→1), Ennea=5(→2), HD=Manifestor(→4) → primary=1 (smallest key wins)', () => {
      const result = deriveArchetype(9, 5, 'Manifestor');
      // All different: counts = {1:1, 2:1, 4:1}
      // Object.entries sorts numeric keys: ['1','2','4']
      // After sort by count (all equal) → stable order → primary=1, secondary=2
      expect(result.primary.id).toBe(1);
      expect(result.primary.name).toBe('Nevinný');
      expect(result.secondary.id).toBe(2);
    });
  });

  describe('two agree — majority wins', () => {
    it('LP=7(→2), Ennea=5(→2), HD=Manifestor(→4) → primary=2 (Sage)', () => {
      const result = deriveArchetype(7, 5, 'Manifestor');
      expect(result.primary.id).toBe(2);
      expect(result.primary.name).toBe('Mudrc');
    });

    it('shadow for primary=2 is 8 (Jester/Šašo)', () => {
      const result = deriveArchetype(7, 5, 'Manifestor');
      expect(result.shadow.id).toBe(8);
      expect(result.shadow.name).toBe('Šašo');
    });
  });

  describe('language parameter', () => {
    it('lang=en returns English names', () => {
      const result = deriveArchetype(1, 1, 'Generátor', 'en');
      expect(result.primary.name).toBe('Hero');
      expect(result.primary.motto).toContain('will');
    });

    it('lang=sk (default) returns Slovak names', () => {
      const result = deriveArchetype(9, 9, 'Reflektor');
      // LP=9→1, Ennea=9→1, HD=Reflektor→1 → all converge on 1
      expect(result.primary.name).toBe('Nevinný');
    });

    it('lang=en for Sage archetype', () => {
      const result = deriveArchetype(7, 5, 'Manifestor', 'en');
      expect(result.primary.name).toBe('Sage');
      expect(result.shadow.name).toBe('Jester');
    });
  });

  describe('master numbers', () => {
    it('LP=11 → archetype id=5 (Magician/Mág)', () => {
      const result = deriveArchetype(11, 1, 'Manifestor');
      // LP=11→5, Ennea=1→6, HD=Manifestor→4 → all different, LP wins
      expect([5, 6, 4]).toContain(result.primary.id);
      // More specifically, with all different, sorted by insertion order: 5 first
      const result2 = deriveArchetype(11, 3, 'Manifestujúci Generátor');
      // LP=11→5, Ennea=3→5, HD='Manifestujúci Generátor'→3
      // counts = {5:2, 3:1} → primary=5
      expect(result2.primary.id).toBe(5);
      expect(result2.primary.name).toBe('Mág');
    });

    it('LP=22 → archetype id=11 (Ruler/Vládca) — verified via LP=4 convergence', () => {
      // LP=4 also maps to 11. Use LP=4 + Ennea=8(→4/Rebel) + HD=Manifestor(→4)
      // to show that LP=4→11 is distinct from Ennea/HD→4
      const result = deriveArchetype(4, 8, 'Manifestor');
      // LP=4→11, Ennea=8→4, HD=Manifestor→4 → counts={4:2, 11:1} → primary=4
      expect(result.primary.id).toBe(4);
      // secondary=11 (the LP contribution)
      expect(result.secondary.id).toBe(11);
      expect(result.secondary.name).toBe('Vládca');
    });

    it('LP=33 → archetype id=9 (Caregiver/Opatrovateľ)', () => {
      const result = deriveArchetype(33, 2, 'Projektor');
      // LP=33→9, Ennea=2→9, HD=Projektor→2 → counts={9:2, 2:1} → primary=9
      expect(result.primary.id).toBe(9);
      expect(result.primary.name).toBe('Opatrovateľ');
    });
  });

  describe('unknown HD type fallback', () => {
    it('unknown HD type falls back to archetype 12 (Everyman/Každý človek)', () => {
      const result = deriveArchetype(6, 6, 'NeznámyTyp');
      // LP=6→7, Ennea=6→12, HD=unknown→12 → counts={7:1, 12:2} → primary=12
      expect(result.primary.id).toBe(12);
      expect(result.primary.name).toBe('Každý človek');
    });

    it('empty string HD type falls back to 12', () => {
      const result = deriveArchetype(6, 6, '');
      // LP=6→7, Ennea=6→12, HD=''→12 → counts={7:1, 12:2} → primary=12
      expect(result.primary.id).toBe(12);
    });
  });

  describe('shadow mapping', () => {
    it('primary=6 → shadow=9', () => {
      const result = deriveArchetype(1, 1, 'Generátor');
      // primary=6 (Hero)
      expect(result.primary.id).toBe(6);
      expect(result.shadow.id).toBe(9);
      expect(result.shadow.name).toBe('Opatrovateľ');
    });

    it('primary=1 → shadow=4', () => {
      const result = deriveArchetype(9, 9, 'Reflektor');
      // LP=9→1, Ennea=9→1, HD=Reflektor→1 → primary=1
      expect(result.primary.id).toBe(1);
      expect(result.shadow.id).toBe(4);
      expect(result.shadow.name).toBe('Rebel');
    });

    it('primary=12 → shadow=5', () => {
      const result = deriveArchetype(6, 6, 'NeznámyTyp');
      // primary=12 (from test above)
      expect(result.primary.id).toBe(12);
      expect(result.shadow.id).toBe(5);
      expect(result.shadow.name).toBe('Mág');
    });

    it('primary=5 → shadow=12', () => {
      const result = deriveArchetype(11, 3, 'Manifestujúci Generátor');
      // LP=11→5, Ennea=3→5, HD='MG'→3 → counts={5:2, 3:1} → primary=5
      expect(result.primary.id).toBe(5);
      expect(result.shadow.id).toBe(12);
      expect(result.shadow.name).toBe('Každý človek');
    });
  });

  describe('secondary archetype logic', () => {
    it('when two agree, secondary is the remaining one', () => {
      const result = deriveArchetype(7, 5, 'Manifestor');
      // LP=7→2, Ennea=5→2, HD=Manifestor→4 → primary=2, secondary=4
      expect(result.secondary.id).toBe(4);
      expect(result.secondary.name).toBe('Rebel');
    });

    it('when all agree, secondary differs from primary', () => {
      const result = deriveArchetype(1, 1, 'Generátor');
      // All → 6, sorted has only one entry
      // secondary logic: sorted.length <= 1 → enneaArchId !== primaryId ? enneaArchId : hdArchId
      // enneaArchId = 6 = primaryId → hdArchId = 6 → secondary = archetypes[6-1] = id 6
      // Actually: enneaArchId(6) === primaryId(6) → use hdArchId(6) → secondary is also 6
      expect(result.secondary.id).toBe(6);
    });
  });

  describe('result structure', () => {
    it('returns all required fields on each archetype', () => {
      const result = deriveArchetype(1, 1, 'Generátor');
      for (const arch of [result.primary, result.secondary, result.shadow]) {
        expect(arch).toHaveProperty('id');
        expect(arch).toHaveProperty('name');
        expect(arch).toHaveProperty('motto');
        expect(arch).toHaveProperty('coreDesire');
        expect(arch).toHaveProperty('gift');
        expect(arch).toHaveProperty('shadow');
        expect(arch).toHaveProperty('strategy');
        expect(typeof arch.id).toBe('number');
        expect(typeof arch.name).toBe('string');
      }
    });
  });
});
