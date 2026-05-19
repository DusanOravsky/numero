import { useEffect } from 'react';
import { useStore } from '../store/useStore';

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
      let dark = false;
      if (themeMode === 'dark') dark = true;
      else if (themeMode === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      root.classList.toggle('dark', dark);
    };

    apply();

    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply();
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [themeMode]);
}
