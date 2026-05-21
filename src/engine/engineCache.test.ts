import { describe, it, expect, vi } from 'vitest';
import { memoize, birthKey } from './engineCache';

describe('memoize', () => {
  it('cache hit — volá funkciu len raz pre rovnaký kľúč', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn, (x) => `key:${x}`);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cache miss — rôzne kľúče volajú funkciu zakaždým', () => {
    const fn = vi.fn((x: number) => x * 3);
    const memoized = memoize(fn, (x) => `key:${x}`);

    expect(memoized(1)).toBe(3);
    expect(memoized(2)).toBe(6);
    expect(memoized(3)).toBe(9);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('LRU eviction — po 100 entries sa najstaršia vyhodí', () => {
    const fn = vi.fn((x: number) => x);
    const memoized = memoize(fn, (x) => `key:${x}`);

    // Naplníme cache 101 entries (0..100) → entry 0 je eviktovaná
    for (let i = 0; i <= 100; i++) {
      memoized(i);
    }
    expect(fn).toHaveBeenCalledTimes(101);

    // Entry 0 mala byť eviktovaná (najstaršia)
    memoized(0);
    expect(fn).toHaveBeenCalledTimes(102); // znova zavolaná (cache miss)

    // Entry 50 by mala byť stále v cache
    memoized(50);
    expect(fn).toHaveBeenCalledTimes(102); // cache hit
  });

  it('undefined return values sú korektne cachované (MISS sentinel fix)', () => {
    let callCount = 0;
    const fn = vi.fn((_x: number): undefined => {
      callCount++;
      return undefined;
    });
    const memoized = memoize(fn, (x) => `key:${x}`);

    const result1 = memoized(42);
    const result2 = memoized(42);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
    expect(callCount).toBe(1); // Zavolaná len raz, undefined bol cachovaný
  });

  it('null return values sú korektne cachované', () => {
    const fn = vi.fn((_x: number): null => null);
    const memoized = memoize(fn, (x) => `key:${x}`);

    memoized(1);
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('LRU refresh — pristúpenie k entry ju posunie na koniec (nie je eviktovaná)', () => {
    const fn = vi.fn((x: number) => x);
    const memoized = memoize(fn, (x) => `key:${x}`);

    // Naplníme 100 entries (0..99)
    for (let i = 0; i < 100; i++) {
      memoized(i);
    }
    expect(fn).toHaveBeenCalledTimes(100);

    // Pristúpime k entry 0 (refreshneme ju v LRU)
    memoized(0);
    expect(fn).toHaveBeenCalledTimes(100); // cache hit, nezvýši sa

    // Pridáme novú entry 100 → mala by eviktovať entry 1 (teraz najstaršiu)
    memoized(100);
    expect(fn).toHaveBeenCalledTimes(101);

    // Entry 0 by mala byť stále v cache (bola refreshnutá)
    memoized(0);
    expect(fn).toHaveBeenCalledTimes(101); // stále cache hit

    // Entry 1 by mala byť eviktovaná
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(102); // cache miss
  });

  it('funguje s viacerými argumentmi', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn, (a, b) => `${a}:${b}`);

    expect(memoized(2, 3)).toBe(5);
    expect(memoized(2, 3)).toBe(5);
    expect(memoized(3, 2)).toBe(5); // rôzny kľúč, rovnaký výsledok
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('birthKey', () => {
  it('generuje deterministický kľúč z dátumu', () => {
    const key = birthKey(30, 8, 1979, 2, 40, 48.15, 17.11, 1);
    expect(key).toBe('30-8-1979-2-40-48.15-17.11-1');
  });

  it('voliteľné parametre sú "x" ak chýbajú', () => {
    const key = birthKey(15, 7, 1985);
    expect(key).toBe('15-7-1985-x-x-x-x-x');
  });

  it('rôzne vstupy → rôzne kľúče', () => {
    const k1 = birthKey(30, 8, 1979);
    const k2 = birthKey(15, 7, 1985);
    expect(k1).not.toBe(k2);
  });

  it('rovnaké vstupy → rovnaké kľúče', () => {
    const k1 = birthKey(30, 8, 1979, 2, 40);
    const k2 = birthKey(30, 8, 1979, 2, 40);
    expect(k1).toBe(k2);
  });
});
