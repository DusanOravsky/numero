// Jednoduchá LRU cache pre drahé engine výpočty (calculateAstrology, calculateHumanDesign).
// Kľúč: deterministický string z dátumu narodenia + času.
// Prečo: Dashboard, ClientDashboard, ChakrasPage každý spúšťa rovnaký výpočet znova.
// HD je drahé (SearchSunLongitude → ~50–100ms), astrology trochu menej. Pri prepínaní stránok
// to citeľne pomáha.

// Per-cache limit. Pri multi-client comparison + synastry workflow používateľ
// ľahko prejde 30 entries a začne strácať vlastný profil. 100 entries × ~5KB
// = ~500KB v každej cache, total <1MB.
const MAX_ENTRIES_PER_CACHE = 100;

const MISS = Symbol('cache-miss');

class LRUCache<V> {
  private map = new Map<string, V>();

  get(key: string): V | typeof MISS {
    if (!this.map.has(key)) return MISS;
    const v = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }

  set(key: string, value: V) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > MAX_ENTRIES_PER_CACHE) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }
}

export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  keyFn: (...args: Args) => string
): (...args: Args) => R {
  const cache = new LRUCache<R>();
  return (...args: Args) => {
    const key = keyFn(...args);
    const hit = cache.get(key);
    if (hit !== MISS) return hit;
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

/** Helper na zostavenie kľúča z dátumu narodenia + voliteľného času */
export function birthKey(day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number, tz?: number): string {
  return `${day}-${month}-${year}-${hour ?? 'x'}-${minute ?? 'x'}-${lat ?? 'x'}-${lon ?? 'x'}-${tz ?? 'x'}`;
}
