// Jednoduchá LRU cache pre drahé engine výpočty (calculateAstrology, calculateHumanDesign).
// Kľúč: deterministický string z dátumu narodenia + času.
// Prečo: Dashboard, ClientDashboard, ChakrasPage každý spúšťa rovnaký výpočet znova.
// HD je drahé (SearchSunLongitude → ~50–100ms), astrology trochu menej. Pri prepínaní stránok
// to citeľne pomáha.

const MAX_ENTRIES = 30;

class LRUCache<V> {
  private map = new Map<string, V>();

  get(key: string): V | undefined {
    const v = this.map.get(key);
    if (v !== undefined) {
      // refresh recency
      this.map.delete(key);
      this.map.set(key, v);
    }
    return v;
  }

  set(key: string, value: V) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > MAX_ENTRIES) {
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
    if (hit !== undefined) return hit;
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

/** Helper na zostavenie kľúča z dátumu narodenia + voliteľného času */
export function birthKey(day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number, tz?: number): string {
  return `${day}-${month}-${year}-${hour ?? 'x'}-${minute ?? 'x'}-${lat ?? 'x'}-${lon ?? 'x'}-${tz ?? 'x'}`;
}
