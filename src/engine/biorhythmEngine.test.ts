import { describe, it, expect } from 'vitest';
import { calculateBiorhythm, getBiorhythmForDays } from './biorhythmEngine';

describe('biorhythmEngine', () => {
  describe('calculateBiorhythm', () => {
    it('returns all zeros on birthday (day 0) with all phases critical', () => {
      // sin(0) = 0 for all cycles
      const result = calculateBiorhythm(30, 8, 1979, new Date(1979, 7, 30));
      expect(result.physical).toBe(0);
      expect(result.emotional).toBe(0);
      expect(result.intellectual).toBe(0);
      expect(result.physicalPhase).toBe('critical');
      expect(result.emotionalPhase).toBe('critical');
      expect(result.intellectualPhase).toBe('critical');
    });

    it('calculates correct values for reference profile 30.8.1979 on 2024-01-01', () => {
      // daysSince = floor((Date.UTC(2024,0,1) - Date.UTC(1979,7,30)) / 86400000)
      // Date.UTC(2024,0,1) = 1704067200000
      // Date.UTC(1979,7,30) = 304819200000
      // diff = 1399248000000, days = 16195
      const days = 16195;
      const expectedPhysical = Math.round(Math.sin((2 * Math.PI * days) / 23) * 100);
      const expectedEmotional = Math.round(Math.sin((2 * Math.PI * days) / 28) * 100);
      const expectedIntellectual = Math.round(Math.sin((2 * Math.PI * days) / 33) * 100);

      const result = calculateBiorhythm(30, 8, 1979, new Date(2024, 0, 1));
      expect(result.physical).toBe(expectedPhysical);
      expect(result.emotional).toBe(expectedEmotional);
      expect(result.intellectual).toBe(expectedIntellectual);
    });

    it('phase detection: positive value → high', () => {
      // Day 6 of physical cycle: sin(2*PI*6/23) ~ sin(1.638) ~ 0.998 → ~100
      // That's well above 10 → 'high'
      const result = calculateBiorhythm(30, 8, 1979, new Date(1979, 8, 5)); // day 6
      expect(result.physical).toBeGreaterThan(10);
      expect(result.physicalPhase).toBe('high');
    });

    it('phase detection: negative value → low', () => {
      // Day 17 of physical cycle: sin(2*PI*17/23) ~ sin(4.642) ~ -0.998 → ~-100
      const result = calculateBiorhythm(30, 8, 1979, new Date(1979, 8, 16)); // day 17
      expect(result.physical).toBeLessThan(-10);
      expect(result.physicalPhase).toBe('low');
    });

    it('phase detection: value near zero → critical', () => {
      // Day 0 → sin(0) = 0 → critical (already tested above)
      // Also test at half cycle: day 23 → sin(2*PI*23/23) = sin(2*PI) = 0
      const result = calculateBiorhythm(30, 8, 1979, new Date(1979, 8, 22)); // day 23
      expect(Math.abs(result.physical)).toBeLessThan(10);
      expect(result.physicalPhase).toBe('critical');
    });

    it('all values are within -100 to 100 range', () => {
      // Test across many dates
      const testDates = [
        new Date(2000, 0, 1),
        new Date(2010, 5, 15),
        new Date(2024, 11, 31),
        new Date(1990, 3, 20),
        new Date(2024, 6, 4),
      ];

      for (const date of testDates) {
        const result = calculateBiorhythm(30, 8, 1979, date);
        expect(result.physical).toBeGreaterThanOrEqual(-100);
        expect(result.physical).toBeLessThanOrEqual(100);
        expect(result.emotional).toBeGreaterThanOrEqual(-100);
        expect(result.emotional).toBeLessThanOrEqual(100);
        expect(result.intellectual).toBeGreaterThanOrEqual(-100);
        expect(result.intellectual).toBeLessThanOrEqual(100);
      }
    });

    it('at exactly 23 days physical completes one full cycle (back to ~0)', () => {
      // sin(2*PI*23/23) = sin(2*PI) ≈ 0 (floating point may yield -0)
      const result = calculateBiorhythm(1, 1, 2000, new Date(2000, 0, 24)); // day 23
      expect(Math.abs(result.physical)).toBe(0);
      expect(result.physicalPhase).toBe('critical');
    });

    it('at exactly 28 days emotional completes one full cycle (back to ~0)', () => {
      // sin(2*PI*28/28) = sin(2*PI) ≈ 0 (floating point may yield -0)
      const result = calculateBiorhythm(1, 1, 2000, new Date(2000, 0, 29)); // day 28
      expect(Math.abs(result.emotional)).toBe(0);
      expect(result.emotionalPhase).toBe('critical');
    });

    it('at exactly 33 days intellectual completes one full cycle (back to ~0)', () => {
      // sin(2*PI*33/33) = sin(2*PI) ≈ 0 (floating point may yield -0)
      const result = calculateBiorhythm(1, 1, 2000, new Date(2000, 1, 3)); // day 33
      expect(Math.abs(result.intellectual)).toBe(0);
      expect(result.intellectualPhase).toBe('critical');
    });
  });

  describe('getBiorhythmForDays', () => {
    it('returns correct length with default days (30) → 37 entries (-7 to +29)', () => {
      const result = getBiorhythmForDays(30, 8, 1979);
      // Loop runs from i = -7 to i < 30, that's 37 iterations
      expect(result).toHaveLength(37);
    });

    it('returns correct length with custom days parameter', () => {
      const result = getBiorhythmForDays(30, 8, 1979, 14);
      // Loop runs from i = -7 to i < 14, that's 21 iterations
      expect(result).toHaveLength(21);
    });

    it('dates are sequential (each day follows the previous)', () => {
      const result = getBiorhythmForDays(30, 8, 1979, 10);
      for (let i = 1; i < result.length; i++) {
        const diff = result[i].date.getTime() - result[i - 1].date.getTime();
        // Should be approximately 1 day (86400000ms)
        expect(diff).toBe(86400000);
      }
    });

    it('each entry has physical, emotional, intellectual within valid range', () => {
      const result = getBiorhythmForDays(30, 8, 1979, 10);
      for (const entry of result) {
        expect(entry.physical).toBeGreaterThanOrEqual(-100);
        expect(entry.physical).toBeLessThanOrEqual(100);
        expect(entry.emotional).toBeGreaterThanOrEqual(-100);
        expect(entry.emotional).toBeLessThanOrEqual(100);
        expect(entry.intellectual).toBeGreaterThanOrEqual(-100);
        expect(entry.intellectual).toBeLessThanOrEqual(100);
      }
    });

    it('each entry has a date property', () => {
      const result = getBiorhythmForDays(30, 8, 1979, 5);
      for (const entry of result) {
        expect(entry.date).toBeInstanceOf(Date);
      }
    });
  });
});
