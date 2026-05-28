import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { AIChat } from './AIChat';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileAnalysis } from '../hooks/useProfileAnalysis';
import { generateInterpretation } from '../engine/interpretationEngine';
import { hasApiKey } from '../engine/aiInterpretation';

export function GlobalAIDrawer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { profiles, activeProfileId } = useStore(
    useShallow(s => ({ profiles: s.profiles, activeProfileId: s.activeProfileId }))
  );
  const profile = profiles.find(p => p.id === activeProfileId);
  const analysis = useProfileAnalysis(open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const context = useMemo(() => {
    if (!profile || !analysis) return null;
    const { numerology, developmental, astrology, humanDesign, kabalah, theta, enneagram, dosha, tcm, chakras } = analysis;
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
  }, [profile, analysis]);

  if (!profile || !hasApiKey()) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-[55] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={t('ai.drawerLabel')}
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
                <h2 className="font-medium text-slate-800 text-sm">{t('ai.drawerTitle')}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('ai.closeDrawer')}
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
