/**
 * Aplikačné konštanty.
 */

/**
 * Plná base URL aplikácie (origin + base path).
 * Príklady:
 *   - Dev: 'http://localhost:5173/'
 *   - GitHub Pages: 'https://dusanoravsky.github.io/numero/'
 *   - TWA / iná doména: derivuje sa automaticky z window.location.
 *
 * Použitie:
 *   - Share linky (`/share?data=...`)
 *   - Web Share API URL
 *   - Story canvas footer
 */
export function getAppUrl(): string {
  if (typeof window === 'undefined') return '/';
  const base = import.meta.env.BASE_URL || '/';
  return window.location.origin + (base.endsWith('/') ? base : base + '/');
}

/**
 * Display verzia URL bez https:// pre user-facing texty (story karty atď.).
 * Pre 'https://dusanoravsky.github.io/numero/' vráti 'dusanoravsky.github.io/numero'.
 */
export function getAppUrlDisplay(): string {
  const url = getAppUrl();
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
