import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { getTimezoneFromCoords } from '../data/cities';

/**
 * Subject = osoba, pre ktorú sa robí výpočet na stránke (Numerology, Astrology,
 * Human Design, Chakras). Štandardne je to aktívny profil. Ak je v URL
 * `?client=<id>`, použijeme namiesto neho daného klienta. Vďaka tomu môže
 * používateľ preklikať z Klient detail → "Human Design" a uvidí HD klientov,
 * nie svoj.
 *
 * Vracia objekt s rovnakými birth* poľami ako profil/klient — komponenty
 * pristupujú k nim rovnako.
 */
export interface Subject {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
  birthPlace?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  /** True ak ide o klienta (nie o vlastný aktívny profil). */
  isClient: boolean;
  /**
   * Odhadnutý timezone offset (hodín) z lat/lon. Default 1 (CET) ak chýbajú
   * súradnice. Astrology a HD engines aplikujú DST handling sami.
   */
  timezoneOffset: number;
}

export function useSubject(): Subject | null {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const { profiles, activeProfileId, clients } = useStore(
    useShallow(s => ({ profiles: s.profiles, activeProfileId: s.activeProfileId, clients: s.clients }))
  );

  return useMemo<Subject | null>(() => {
    if (clientId) {
      const c = clients.find(x => x.id === clientId);
      if (c) {
        return {
          id: c.id,
          name: c.name,
          gender: c.gender,
          birthDay: c.birthDay,
          birthMonth: c.birthMonth,
          birthYear: c.birthYear,
          birthHour: c.birthHour,
          birthMinute: c.birthMinute,
          birthPlace: c.birthPlace,
          birthLatitude: c.birthLatitude,
          birthLongitude: c.birthLongitude,
          isClient: true,
          timezoneOffset: c.birthLatitude !== undefined && c.birthLongitude !== undefined
            ? getTimezoneFromCoords(c.birthLatitude, c.birthLongitude)
            : 1,
        };
      }
    }

    const p = profiles.find(x => x.id === activeProfileId);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      gender: p.gender,
      birthDay: p.birthDay,
      birthMonth: p.birthMonth,
      birthYear: p.birthYear,
      birthHour: p.birthHour,
      birthMinute: p.birthMinute,
      birthPlace: p.birthPlace,
      birthLatitude: p.birthLatitude,
      birthLongitude: p.birthLongitude,
      isClient: false,
      timezoneOffset: p.birthLatitude !== undefined && p.birthLongitude !== undefined
        ? getTimezoneFromCoords(p.birthLatitude, p.birthLongitude)
        : 1,
    };
  }, [clientId, profiles, activeProfileId, clients]);
}
