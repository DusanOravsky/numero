import { describe, it, expect } from 'vitest';
import { calculateHumanDesign } from './humanDesignEngine';

describe('humanDesignEngine — reference profiles (LOCK)', () => {
  // LOCK: 30.8.1979 02:40 Bratislava (CET base offset 1 → CEST handler picks +2)
  // Reference profile from Jovian Archive / MyBodyGraph: 1/3 — Skúmajúci Mučeník
  // This test ensures HD_WHEEL_START stays correct (302.0°, not 302.625°).
  it('30.8.1979 02:40 Bratislava → profile 1/3', () => {
    const hd = calculateHumanDesign(30, 8, 1979, 2, 40, 1);
    expect(hd.profile.line1).toBe(1);
    expect(hd.profile.line2).toBe(3);
  });

  it('returns a Generátor / Manifestujúci Generátor for 30.8.1979 02:40', () => {
    const hd = calculateHumanDesign(30, 8, 1979, 2, 40, 1);
    expect(['Generátor', 'Manifestujúci Generátor']).toContain(hd.type);
  });
});
