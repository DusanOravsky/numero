import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useStore } from '../store/useStore';
import { calculateFullNumerology } from '../engine/numerologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import { getLifePath } from '../data/lifePaths';

const STORAGE_KEY = 'onboarding-completed';
const TOTAL_CARDS = 5;

const ELEMENT_EMOJI: Record<string, string> = {
  'Oheň': '\u{1F525}', 'Vzduch': '\u{1F4A8}', 'Zem': '\u{1F30D}', 'Voda': '\u{1F4A7}',
  'Fire': '\u{1F525}', 'Air': '\u{1F4A8}', 'Earth': '\u{1F30D}', 'Water': '\u{1F4A7}',
};

export function OnboardingReveal() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profiles = useStore(s => s.profiles);
  const activeProfileId = useStore(s => s.activeProfileId);
  const [card, setCard] = useState(0);
  const [visible, setVisible] = useState(false);

  const profile = useMemo(() => {
    if (activeProfileId) return profiles.find(p => p.id === activeProfileId);
    return profiles[0];
  }, [profiles, activeProfileId]);

  const numerology = useMemo(() => {
    if (!profile) return null;
    return calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
  }, [profile]);

  const hd = useMemo(() => {
    if (!profile) return null;
    return calculateHumanDesign(
      profile.birthDay, profile.birthMonth, profile.birthYear,
      profile.birthHour ?? 12, profile.birthMinute ?? 0
    );
  }, [profile]);

  const astro = useMemo(() => {
    if (!profile) return null;
    return calculateAstrology(
      profile.birthDay, profile.birthMonth, profile.birthYear,
      profile.birthHour ?? 12, profile.birthMinute ?? 0,
      profile.birthLatitude ?? 48.15, profile.birthLongitude ?? 17.11
    );
  }, [profile]);

  const chakras = useMemo(() => {
    if (!profile || !numerology || !hd || !astro) return null;
    const gridCounts = new Map<number, number>();
    for (const cell of numerology.gridNumbers) {
      if (cell.value > 0) {
        gridCounts.set(cell.value, (gridCounts.get(cell.value) || 0) + 1);
      }
    }
    return evaluateChakras(
      numerology.lifePathNumber,
      gridCounts,
      numerology.isolatedNumbers,
      hd.definedCenters,
      astro.dominantElement
    );
  }, [profile, numerology, hd, astro]);

  const missingNumbers = useMemo(() => {
    if (!numerology) return [];
    const present = new Set(numerology.gridNumbers.filter(c => c.value > 0).map(c => c.value));
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !present.has(n));
  }, [numerology]);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const next = () => {
    if (card < TOTAL_CARDS - 1) {
      setCard(card + 1);
    } else {
      dismiss();
      navigate('/numerology');
    }
  };

  const skip = () => {
    dismiss();
  };

  if (!visible || !profile || !numerology) return null;

  const isDark = document.documentElement.classList.contains('dark');
  const lifePathInfo = getLifePath(String(numerology.lifePathNumber), language);
  const blockedChakras = chakras?.filter(c => c.status === 'blocked').slice(0, 2) ?? [];
  const sunSign = String(astro?.planets[0]?.sign ?? '');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: isDark ? 'rgba(15,11,46,0.85)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        onClick={skip}
      >
        <motion.div
          key={card}
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(30,27,75,0.95), rgba(49,46,129,0.9))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(238,242,255,0.95))',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(199,210,254,0.5)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === card ? 32 : 6,
                  background: i === card ? 'linear-gradient(to right, #4f46e5, #7c3aed)' : i < card ? '#a5b4fc' : (isDark ? '#4b5563' : '#cbd5e1'),
                }}
              />
            ))}
          </div>

          {/* Card content */}
          <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
            {card === 0 && <Card1 numerology={numerology} lifePathInfo={lifePathInfo} isDark={isDark} language={language} />}
            {card === 1 && hd && <Card2 hd={hd} isDark={isDark} language={language} />}
            {card === 2 && astro && <Card3 element={astro.dominantElement} sunSign={sunSign} isDark={isDark} language={language} />}
            {card === 3 && <Card4 blockedChakras={blockedChakras} missingNumbers={missingNumbers} isDark={isDark} language={language} />}
            {card === 4 && <Card5 odv={numerology.odv} isDark={isDark} language={language} />}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              onClick={skip}
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              className="text-sm hover:opacity-80"
            >
              {t('onboarding.skip')}
            </button>
            <button
              onClick={next}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-medium"
              style={{ background: 'linear-gradient(to right, #4f46e5, #7c3aed)' }}
            >
              {card === TOTAL_CARDS - 1
                ? (language === 'sk' ? 'Objavuj svoj profil →' : 'Explore your profile →')
                : (language === 'sk' ? 'Ďalej' : 'Next')}
            </button>
          </div>

          <span className="absolute top-4 right-4 text-[11px]" style={{ color: isDark ? '#6b7280' : '#94a3b8' }}>
            {card + 1} / {TOTAL_CARDS}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ===== Card 1: Life Path Number ===== */
function Card1({ numerology, lifePathInfo, isDark, language }: {
  numerology: { lifePathNumber: number };
  lifePathInfo: { title: string } | undefined;
  isDark: boolean;
  language: string;
}) {
  return (
    <>
      <h2 className="font-serif text-lg font-bold mb-4" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
        {language === 'sk' ? 'Tvoje životné číslo' : 'Your Life Path Number'}
      </h2>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
        className="text-6xl font-bold mb-3"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {numerology.lifePathNumber}
      </motion.div>
      {lifePathInfo && (
        <p className="text-base font-medium" style={{ color: isDark ? '#c7d2fe' : '#4338ca' }}>
          {lifePathInfo.title}
        </p>
      )}
    </>
  );
}

/* ===== Card 2: Human Design ===== */
function Card2({ hd, isDark, language }: {
  hd: { type: string; strategy: string; authority: string };
  isDark: boolean;
  language: string;
}) {
  const lines = [hd.type, hd.strategy, hd.authority];
  return (
    <>
      <h2 className="font-serif text-lg font-bold mb-4" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
        {language === 'sk' ? 'Tvoj Human Design' : 'Your Human Design'}
      </h2>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.2, type: 'spring', damping: 20 }}
            className="text-xl font-semibold"
            style={{ color: isDark ? '#e0e7ff' : '#312e81' }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </>
  );
}

/* ===== Card 3: Dominant Element ===== */
function Card3({ element, sunSign, isDark, language }: {
  element: string;
  sunSign: string;
  isDark: boolean;
  language: string;
}) {
  const emoji = ELEMENT_EMOJI[element] || '';
  return (
    <>
      <h2 className="font-serif text-lg font-bold mb-4" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
        {language === 'sk' ? 'Tvoj element' : 'Your Element'}
      </h2>
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 150, delay: 0.2 }}
        className="text-5xl mb-3"
      >
        {emoji}
      </motion.div>
      <p className="text-2xl font-bold mb-1" style={{ color: isDark ? '#e0e7ff' : '#312e81' }}>
        {element}
      </p>
      <p className="text-sm" style={{ color: isDark ? '#a5b4fc' : '#6366f1' }}>
        {language === 'sk' ? `Slnko v ${sunSign}` : `Sun in ${sunSign}`}
      </p>
    </>
  );
}

/* ===== Card 4: Challenges ===== */
function Card4({ blockedChakras, missingNumbers, isDark, language }: {
  blockedChakras: { chakra: { name: string } }[];
  missingNumbers: number[];
  isDark: boolean;
  language: string;
}) {
  return (
    <>
      <h2 className="font-serif text-lg font-bold mb-4" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
        {language === 'sk' ? 'Tvoje výzvy' : 'Your Challenges'}
      </h2>
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="space-y-3 w-full"
      >
        {blockedChakras.length > 0 ? (
          <div className="rounded-xl px-4 py-3" style={{ background: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.08)', border: isDark ? '1px solid rgba(244,63,94,0.25)' : '1px solid rgba(244,63,94,0.2)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#fda4af' : '#be123c' }}>
              {language === 'sk' ? 'Blokované čakry' : 'Blocked chakras'}
            </p>
            <p className="text-base font-semibold" style={{ color: isDark ? '#fecdd3' : '#9f1239' }}>
              {blockedChakras.map(c => c.chakra.name).join(', ')}
            </p>
          </div>
        ) : (
          <div className="rounded-xl px-4 py-3" style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)', border: isDark ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-sm font-medium" style={{ color: isDark ? '#6ee7b7' : '#047857' }}>
              {language === 'sk' ? 'Žiadne blokované čakry' : 'No blocked chakras'}
            </p>
          </div>
        )}
        {missingNumbers.length > 0 && (
          <div className="rounded-xl px-4 py-3" style={{ background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)', border: isDark ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#fcd34d' : '#92400e' }}>
              {language === 'sk' ? 'Chýbajúce čísla v mriežke' : 'Missing numbers in grid'}
            </p>
            <p className="text-lg font-bold" style={{ color: isDark ? '#fde68a' : '#78350f' }}>
              {missingNumbers.slice(0, 3).join(', ')}{missingNumbers.length > 3 ? ` +${missingNumbers.length - 3}` : ''}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}

/* ===== Card 5: Energy Today (ODV) ===== */
function Card5({ odv, isDark, language }: {
  odv: number;
  isDark: boolean;
  language: string;
}) {
  const tips: Record<string, { sk: string; en: string }> = {
    '1': { sk: 'Deň začiatkov a iniciatívy', en: 'A day for beginnings and initiative' },
    '2': { sk: 'Deň spolupráce a intuície', en: 'A day for cooperation and intuition' },
    '3': { sk: 'Deň kreativity a vyjadrenia', en: 'A day for creativity and expression' },
    '4': { sk: 'Deň stability a práce', en: 'A day for stability and work' },
    '5': { sk: 'Deň slobody a zmeny', en: 'A day for freedom and change' },
    '6': { sk: 'Deň lásky a zodpovednosti', en: 'A day for love and responsibility' },
    '7': { sk: 'Deň introspekcii a múdrosti', en: 'A day for introspection and wisdom' },
    '8': { sk: 'Deň sily a manifestácie', en: 'A day for power and manifestation' },
    '9': { sk: 'Deň zavŕšenia a súcitu', en: 'A day for completion and compassion' },
  };
  const tip = tips[String(odv)] ?? tips['1'];

  return (
    <>
      <h2 className="font-serif text-lg font-bold mb-4" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
        {language === 'sk' ? 'Tvoja energia dnes' : 'Your Energy Today'}
      </h2>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
        className="text-5xl font-bold mb-2"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {odv}
      </motion.div>
      <p className="text-sm mb-4" style={{ color: isDark ? '#c4b5fd' : '#5b21b6' }}>
        {language === 'sk' ? tip.sk : tip.en}
      </p>
      <motion.div
        animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 20px rgba(124,58,237,0.4)', '0 0 0px rgba(124,58,237,0)'] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="rounded-xl px-4 py-2"
        style={{ background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)' }}
      >
        <p className="text-xs" style={{ color: isDark ? '#a5b4fc' : '#6366f1' }}>
          ODV = {language === 'sk' ? 'Osobná denná vibrácia' : 'Personal Daily Vibration'}
        </p>
      </motion.div>
    </>
  );
}
