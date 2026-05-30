import { useEffect } from 'react';
import { useStore, type ThemeMode } from '../store/useStore';
import { safeGet, safeSet } from '../utils/safeStorage';

/** Synchrónny cache themeMode v localStorage — IndexedDB store je async a pri
 *  boote by inak blikol light theme (FOUC) skôr než dobehne rehydrácia. */
const THEME_CACHE_KEY = 'numero-theme';

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return false;
}

/** Aplikuje uloženú tému synchrónne pri boote (volané z main.tsx pred renderom). */
export function applyStoredTheme(): void {
  const cached = safeGet(THEME_CACHE_KEY);
  const mode: ThemeMode = (cached === 'dark' || cached === 'light' || cached === 'system') ? cached : 'light';
  document.documentElement.classList.toggle('dark', resolveDark(mode));
}

/**
 * Sleduje themeMode v storeve a aplikuje class="dark" na <html>
 * - 'light' → bez triedy
 * - 'dark' → trieda 'dark'
 * - 'system' → podľa prefers-color-scheme
 */
export function useTheme() {
  const themeMode = useStore(s => s.themeMode);

  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      root.classList.toggle('dark', resolveDark(themeMode));
    };

    apply();
    // Zrkadlí do synchrónneho cache pre ďalší boot (anti-FOUC).
    safeSet(THEME_CACHE_KEY, themeMode);

    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply();
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [themeMode]);
}
