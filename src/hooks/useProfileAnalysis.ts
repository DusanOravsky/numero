import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '../i18n/useTranslation';
import { calculateFullNumerology, reduceToSingle, getGridCount } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculateKabalah } from '../engine/kabalahEngine';
import { calculateThetaHealing } from '../engine/thetaHealingEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import { getTimezoneFromCoords } from '../data/cities';

export function useProfileAnalysis(enabled: boolean = true) {
  const { profiles, activeProfileId, numerologyMethod } = useStore(
    useShallow(s => ({ profiles: s.profiles, activeProfileId: s.activeProfileId, numerologyMethod: s.numerologyMethod }))
  );
  const { language } = useTranslation();
  const profile = profiles.find(p => p.id === activeProfileId);

  return useMemo(() => {
    if (!profile || !enabled) return null;
    const numerology = calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const developmental = calculateDevelopmentalNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const lat = profile.birthLatitude ?? 48.15;
    const lon = profile.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    const astrology = calculateAstrology(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, lat, lon, tz);
    const humanDesign = calculateHumanDesign(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, tz);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(profile.birthDay), language);
    const theta = calculateThetaHealing(lp, language);
    const enneagram = deriveEnneagramType(numerology, developmental, numerologyMethod);
    const dosha = deriveDosha(numerology, astrology, humanDesign);
    const tcm = deriveTCMElement(numerology, astrology);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement, language);
    return { numerology, developmental, astrology, humanDesign, kabalah, theta, enneagram, dosha, tcm, chakras };
  }, [profile, numerologyMethod, language, enabled]);
}
