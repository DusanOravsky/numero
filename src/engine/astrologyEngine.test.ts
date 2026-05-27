import { describe, it, expect } from 'vitest';
import {
  calculateAstrology,
  calculateNatalAspects,
  calculateProgressions,
  calculateSolarReturn,
  calculateSynastryAspects,
  summarizeSynastry,
} from './astrologyEngine';

describe('astrologyEngine — reference profile lock (30.8.1979 02:40 Bratislava)', () => {
  const REF = { day: 30, month: 8, year: 1979, hour: 2, minute: 40, lat: 48.15, lon: 17.11, tz: 1 };

  it('Slnko v Panne, Mesiac v Škorpiónovi, Asc v Rakovi', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    expect(r.sunSign.name).toBe('Panna');
    expect(r.moonSign.name).toBe('Škorpión');
    expect(r.ascendant.name).toBe('Rak');
  });

  it('Slnko ~6° Panny (±1°), Mesiac ~27° Škorpióna (±1°)', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    const sun = r.planets.find(p => p.name === 'Slnko')!;
    const moon = r.planets.find(p => p.name === 'Mesiac')!;
    expect(sun.degree).toBeGreaterThanOrEqual(5);
    expect(sun.degree).toBeLessThan(8);
    expect(moon.degree).toBeGreaterThanOrEqual(26);
    expect(moon.degree).toBeLessThan(29);
  });

  it('vracia 12 domov a aspoň 10 planét vrátane Slnka, Mesiaca, ascendentu', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    expect(r.houses.length).toBe(12);
    expect(r.planets.length).toBeGreaterThanOrEqual(10);
    expect(r.planets.find(p => p.name === 'Slnko')).toBeDefined();
    expect(r.planets.find(p => p.name === 'Mesiac')).toBeDefined();
  });

  it('dominantElement, dominantQuality, dominantPlanet sú definované', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    expect(['Oheň', 'Zem', 'Vzduch', 'Voda']).toContain(r.dominantElement);
    expect(r.dominantQuality.length).toBeGreaterThan(0);
    expect(r.dominantPlanet.length).toBeGreaterThan(0);
  });

  it('uzly: severný a južný sú v opačných znameniach', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    const opposites: Record<string, string> = {
      Baran: 'Váhy', Býk: 'Škorpión', Blíženci: 'Strelec', Rak: 'Kozorožec',
      Lev: 'Vodnár', Panna: 'Ryby', Váhy: 'Baran', Škorpión: 'Býk',
      Strelec: 'Blíženci', Kozorožec: 'Rak', Vodnár: 'Lev', Ryby: 'Panna',
    };
    expect(r.southNode.name).toBe(opposites[r.northNode.name]);
  });

  it('moonPhase je vyplnená neprázdna stringom', () => {
    const r = calculateAstrology(REF.day, REF.month, REF.year, REF.hour, REF.minute, REF.lat, REF.lon, REF.tz);
    expect(r.moonPhase.length).toBeGreaterThan(0);
  });
});

describe('astrologyEngine — invariants', () => {
  it('rôzne dátumy → rôzne sun signs', () => {
    const r1 = calculateAstrology(30, 8, 1979, 12, 0);
    const r2 = calculateAstrology(15, 1, 1990, 12, 0);
    const r3 = calculateAstrology(1, 5, 2000, 12, 0);
    const signs = [r1.sunSign.name, r2.sunSign.name, r3.sunSign.name];
    expect(new Set(signs).size).toBeGreaterThanOrEqual(2);
  });

  it('memoizácia — opakované volanie vracia identický objekt', () => {
    const a = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    const b = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    expect(a).toBe(b);
  });

  it('všetky planéty majú validný sign + degree 0..30', () => {
    const r = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    for (const p of r.planets) {
      expect(p.sign).toBeDefined();
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
    }
  });

  it('planetHouses mapuje každú planétu na 1-12', () => {
    const r = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    for (const p of r.planets) {
      const house = r.planetHouses[p.name];
      if (house !== undefined) {
        expect(house).toBeGreaterThanOrEqual(1);
        expect(house).toBeLessThanOrEqual(12);
      }
    }
  });
});

describe('astrologyEngine — derivácie', () => {
  it('calculateNatalAspects vracia nejaké aspekty pre referenčný profil', () => {
    const r = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    const aspects = calculateNatalAspects(r);
    expect(Array.isArray(aspects)).toBe(true);
    expect(aspects.length).toBeGreaterThan(0);
  });

  it('calculateProgressions(35) vracia progressed Slnko + Mesiac', () => {
    const prog = calculateProgressions(30, 8, 1979, 2, 40, 35);
    const progSun = prog.find(p => p.planetName === 'Slnko');
    const progMoon = prog.find(p => p.planetName === 'Mesiac');
    expect(progSun).toBeDefined();
    expect(progMoon).toBeDefined();
  });

  it('calculateSolarReturn(2024) vracia plný AstrologyResult', () => {
    const sr = calculateSolarReturn(30, 8, 1979, 2, 40, 48.15, 17.11, 2024, 1);
    expect(sr).not.toBeNull();
    expect(sr!.result.sunSign).toBeDefined();
    expect(sr!.result.planets.length).toBeGreaterThan(5);
  });

  it('calculateSynastryAspects + summarizeSynastry medzi dvoma profilmi', () => {
    const r1 = calculateAstrology(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    const r2 = calculateAstrology(15, 7, 1985, 14, 0, 48.15, 17.11, 1);
    const aspects = calculateSynastryAspects(r1, r2);
    const summary = summarizeSynastry(aspects);
    expect(aspects.length).toBeGreaterThan(0);
    expect(summary).toBeDefined();
  });
});
