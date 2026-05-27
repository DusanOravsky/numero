/**
 * Bezpečné wrappery okolo localStorage.
 *
 * Prečo: iOS Safari v privátnom móde, Firefox s blokovanými cookies, alebo
 * vyčerpaná quota → `localStorage.setItem` hodí exception. Bez try/catch
 * akýkoľvek mount-time read/write zhodí komponent → ErrorBoundary → degraded UX.
 *
 * Tieto helpery vrátia null/false namiesto vyhadzovania.
 */

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
