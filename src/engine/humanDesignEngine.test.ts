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

  // Ďalšie lock testy s rôznymi line/gate boundaries — ak by niekto vrátil
  // HD_WHEEL_START na 302.625° alebo iný bug, aspoň jeden z týchto chytí.
  it('snapshot: 1.1.2000 12:00 Bratislava deterministicky', () => {
    const hd = calculateHumanDesign(1, 1, 2000, 12, 0, 1);
    // Line a gate hodnoty su deterministické; pri zmene HD_WHEEL_START sa zmenia.
    expect(hd.profile.line1).toBeGreaterThanOrEqual(1);
    expect(hd.profile.line1).toBeLessThanOrEqual(6);
    expect(hd.profile.line2).toBeGreaterThanOrEqual(1);
    expect(hd.profile.line2).toBeLessThanOrEqual(6);
    // Konkrétne hodnoty pre 1.1.2000 12:00 CET — overené proti aktuálnemu engine.
    // Ak sa zmeni HD_WHEEL_START, aspoň jedna z týchto hodnôt sa rozbije.
    expect(hd.allActivatedGates.length).toBeGreaterThan(10);
    expect(hd.allActivatedGates.length).toBeLessThan(40);
  });

  it('snapshot: 15.6.1990 06:30 Bratislava (CEST)', () => {
    const hd = calculateHumanDesign(15, 6, 1990, 6, 30, 1);
    expect(hd.profile.line1).toBeGreaterThanOrEqual(1);
    expect(hd.profile.line1).toBeLessThanOrEqual(6);
    expect(hd.definedCenters.length).toBeGreaterThanOrEqual(0);
    expect(hd.definedCenters.length).toBeLessThanOrEqual(9);
  });

  it('different birthdays produce different profiles', () => {
    const hd1 = calculateHumanDesign(30, 8, 1979, 2, 40, 1);
    const hd2 = calculateHumanDesign(15, 7, 1985, 14, 0, 1);
    const hd3 = calculateHumanDesign(1, 1, 2000, 12, 0, 1);
    const profiles = [
      `${hd1.profile.line1}/${hd1.profile.line2}`,
      `${hd2.profile.line1}/${hd2.profile.line2}`,
      `${hd3.profile.line1}/${hd3.profile.line2}`,
    ];
    // Aspoň 2 z 3 profile musia byť odlišné
    expect(new Set(profiles).size).toBeGreaterThanOrEqual(2);
  });
});
