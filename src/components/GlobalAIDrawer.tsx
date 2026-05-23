import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { AIChat } from './AIChat';
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
import { generateInterpretation } from '../engine/interpretationEngine';
import { hasApiKey } from '../engine/aiInterpretation';
import { getTimezoneFromCoords } from '../data/cities';

export function GlobalAIDrawer() {
  const [open, setOpen] = useState(false);
  const { profiles, activeProfileId, numerologyMethod } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const context = useMemo(() => {
    if (!profile || !open) return null;
    const numerology = calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const developmental = calculateDevelopmentalNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const lat = profile.birthLatitude ?? 48.15;
    const lon = profile.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    const astrology = calculateAstrology(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, lat, lon, tz);
    const humanDesign = calculateHumanDesign(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, tz);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(profile.birthDay));
    const theta = calculateThetaHealing(lp);
    const enneagram = deriveEnneagramType(numerology, developmental, numerologyMethod);
    const dosha = deriveDosha(numerology, astrology, humanDesign);
    const tcm = deriveTCMElement(numerology, astrology);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const interpretation = generateInterpretation(numerology, astrology, humanDesign, chakras, kabalah, theta);
    return {
      name: profile.name,
      gender: profile.gender,
      birth: {
        day: profile.birthDay,
        month: profile.birthMonth,
        year: profile.birthYear,
        hour: profile.birthHour,
        minute: profile.birthMinute,
        place: profile.birthPlace,
      },
      numerology,
      developmental,
      astrology,
      humanDesign,
      kabalah,
      theta,
      enneagram,
      dosha: { primary: dosha.primary, secondary: dosha.secondary },
      tcm,
      chakras: chakras?.map(c => ({ name: c.chakra.name, status: c.status, score: c.score })),
      loveLanguages: numerology.loveLanguages.slice(0, 3),
      interpretation: {
        mainLifeTheme: interpretation.mainLifeTheme,
        currentLesson: interpretation.currentLesson,
        gift: interpretation.gift,
        shadow: interpretation.shadow,
        themes: interpretation.themes.slice(0, 3).map(t => t.theme),
      },
    };
  }, [profile?.id, profile?.birthDay, profile?.birthMonth, profile?.birthYear, profile?.birthHour, profile?.birthMinute, profile?.birthLatitude, profile?.birthLongitude, profile?.name, profile?.gender, profile?.birthPlace, numerologyMethod, open]);

  if (!profile || !hasApiKey()) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-[55] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="AI asistent"
      >
        <span className="text-lg">✦</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-[80]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-[90] shadow-2xl flex flex-col overflow-hidden mobile-sheet"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h2 className="font-medium text-slate-800 text-sm">✦ AI asistent</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zavrieť AI asistenta"
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {context && (
                  <AIChat
                    context={context}
                    title=""
                    storageKey={`global-${profile.id}`}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
