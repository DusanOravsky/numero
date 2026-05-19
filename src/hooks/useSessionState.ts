import { useState, useEffect } from 'react';

/**
 * Hook ako useState, ale stav prežije navigáciu medzi stránkami počas
 * session (sessionStorage). Po zatvorení záložky sa stav vyčistí.
 *
 * Použitie: const [day, setDay] = useSessionState('numerology:day', '');
 */
export function useSessionState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {
      /* ignore */
    }
    return initial;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [key, value]);

  return [value, setValue];
}
