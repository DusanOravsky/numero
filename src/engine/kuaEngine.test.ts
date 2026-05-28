import { describe, it, expect } from 'vitest';
import { calculateKua } from './kuaEngine';

describe('kuaEngine', () => {
  describe('pre-2000 male', () => {
    it('1979 male → kua=4, East, Drevo', () => {
      const result = calculateKua(1979, 'male');
      // lastTwo=79, 7+9=16, 1+6=7, 11-7=4
      expect(result.kuaNumber).toBe(4);
      expect(result.group).toBe('east');
      expect(result.element).toBe('Drevo');
    });
  });

  describe('pre-2000 female', () => {
    it('1979 female → kua=2, West, Zem', () => {
      const result = calculateKua(1979, 'female');
      // lastTwo=79, 7+9=16, 1+6=7, 7+4=11, 11-9=2
      expect(result.kuaNumber).toBe(2);
      expect(result.group).toBe('west');
      expect(result.element).toBe('Zem');
    });
  });

  describe('post-2000 male', () => {
    it('2000 male → kua=9, East, Oheň', () => {
      const result = calculateKua(2000, 'male');
      // lastTwo=0, sum=0, 9-0=9
      expect(result.kuaNumber).toBe(9);
      expect(result.group).toBe('east');
      expect(result.element).toBe('Oheň');
    });
  });

  describe('post-2000 female', () => {
    it('2011 female → kua=8, West, Zem', () => {
      const result = calculateKua(2011, 'female');
      // lastTwo=11, 1+1=2, 2+6=8
      expect(result.kuaNumber).toBe(8);
      expect(result.group).toBe('west');
      expect(result.element).toBe('Zem');
    });
  });

  describe('kua 5 substitution', () => {
    it('2004 male → formula gives 5, substituted to 2', () => {
      const result = calculateKua(2004, 'male');
      // lastTwo=4, sum=4, 9-4=5 → male kua5 becomes 2
      expect(result.kuaNumber).toBe(2);
      expect(result.group).toBe('west');
      expect(result.element).toBe('Zem');
    });

    it('1910 female → formula gives 5, substituted to 8', () => {
      const result = calculateKua(1910, 'female');
      // lastTwo=10, 1+0=1, 1+4=5 → female kua5 becomes 8
      expect(result.kuaNumber).toBe(8);
      expect(result.group).toBe('west');
      expect(result.element).toBe('Zem');
    });
  });

  describe('favorable directions', () => {
    it('kua=1 → 4 favorable directions (SK)', () => {
      // 1944 male: lastTwo=44, 4+4=8, 11-8=3... no
      // Need a year that gives kua=1 for male pre-2000: 11-sum=1 → sum=10→1 (reduce to single first)
      // Actually sum is already single digit. 11-sum=1 → sum=10, but sum max is 9
      // Wait: sum must be single digit (while sum>9 reduce). So 11-sum where sum in 1..9
      // 11-1=10... hmm, but kua>9 → kua-=9 → 1. So sum=1 works.
      // Year with digit sum 1: lastTwo=10 → 1+0=1. So 1910 male: 11-1=10, 10>9 → 10-9=1
      const result = calculateKua(1910, 'male');
      expect(result.kuaNumber).toBe(1);
      expect(result.favorable).toHaveLength(4);
      expect(result.favorable.map(d => d.direction)).toEqual(['Sever', 'Juh', 'Východ', 'Juhovýchod']);
    });
  });

  describe('language parameter', () => {
    it('lang=en returns English direction names and elements', () => {
      const result = calculateKua(1979, 'male', 'en');
      expect(result.kuaNumber).toBe(4);
      expect(result.element).toBe('Wood');
      expect(result.favorable[0].direction).toBe('North');
      expect(result.favorable.map(d => d.direction)).toEqual(['North', 'South', 'East', 'Southeast']);
    });

    it('lang=en returns English meanings', () => {
      const result = calculateKua(1910, 'male', 'en');
      expect(result.kuaNumber).toBe(1);
      expect(result.favorable[0].meaning).toBe('Personal growth and career');
    });
  });

  describe('edge case year 2000', () => {
    it('2000 male → kua=9', () => {
      const result = calculateKua(2000, 'male');
      expect(result.kuaNumber).toBe(9);
    });

    it('2000 female → kua=6', () => {
      const result = calculateKua(2000, 'female');
      // lastTwo=0, sum=0, 0+6=6
      expect(result.kuaNumber).toBe(6);
      expect(result.group).toBe('west');
      expect(result.element).toBe('Kov');
    });
  });

  describe('result structure', () => {
    it('favorable has 4 entries, unfavorable has 4 entries', () => {
      const result = calculateKua(1979, 'male');
      expect(result.favorable).toHaveLength(4);
      expect(result.unfavorable).toHaveLength(4);
    });

    it('bestForSleep, bestForWork, bestForEntrance are strings', () => {
      const result = calculateKua(1979, 'male');
      expect(typeof result.bestForSleep).toBe('string');
      expect(typeof result.bestForWork).toBe('string');
      expect(typeof result.bestForEntrance).toBe('string');
      expect(result.bestForSleep.length).toBeGreaterThan(0);
      expect(result.bestForWork.length).toBeGreaterThan(0);
      expect(result.bestForEntrance.length).toBeGreaterThan(0);
    });

    it('each Direction has direction, meaning, use fields', () => {
      const result = calculateKua(1979, 'male');
      for (const dir of result.favorable) {
        expect(dir).toHaveProperty('direction');
        expect(dir).toHaveProperty('meaning');
        expect(dir).toHaveProperty('use');
        expect(typeof dir.direction).toBe('string');
        expect(typeof dir.meaning).toBe('string');
        expect(typeof dir.use).toBe('string');
      }
      for (const dir of result.unfavorable) {
        expect(dir).toHaveProperty('direction');
        expect(dir).toHaveProperty('meaning');
        expect(dir).toHaveProperty('use');
      }
    });

    it('bestForWork = first favorable, bestForEntrance = second favorable', () => {
      const result = calculateKua(1979, 'male');
      expect(result.bestForWork).toBe(result.favorable[0].direction);
      expect(result.bestForEntrance).toBe(result.favorable[1].direction);
    });

    it('bestForSleep = fourth favorable direction', () => {
      const result = calculateKua(1979, 'male');
      expect(result.bestForSleep).toBe(result.favorable[3].direction);
    });
  });
});
