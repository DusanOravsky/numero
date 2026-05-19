import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'onboarding-completed';

interface Step {
  title: string;
  body: string;
  cta: string;
  navigate?: string;
}

const STEPS: Step[] = [
  {
    title: 'Vitaj v Integrálnej mape bytia',
    body: 'Aplikácia spája numerológiu, astrológiu, Human Design, čakry, kabalu a Theta Healing do jedného uceleného profilu. Všetky výpočty bežia lokálne — žiadne dáta neopúšťajú tvoje zariadenie.',
    cta: 'Ďalej',
  },
  {
    title: 'Dva pohľady na numerológiu',
    body: 'Aplikácia má dve numerologické metódy — Charakterovú (Robin Steinová) a Vývojovú (Lívia Mičková). Default je Vývojová. Prepnúť ich môžeš v Nastaveniach. Sekcie, ktoré nepatria k aktívnej metóde, sú automaticky skryté.',
    cta: 'Ďalej',
  },
  {
    title: 'Začni v Numerológii',
    body: 'V záložke Numerológia uvidíš svoju mriežku, životné číslo, vibrácie (ORV/OMV/ODV) a kalendár. Klepnutím na číslo v mriežke získaš detail. Vibrácie ukazujú aktuálne energie pre dnešný deň.',
    cta: 'Otvoriť Numerológiu',
    navigate: '/numerology',
  },
];

export function OnboardingTour() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Krátky delay aby sa stránka načítala
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const next = () => {
    const current = STEPS[step];
    if (current.navigate) {
      dismiss();
      navigate(current.navigate);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const skip = () => {
    dismiss();
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={skip}
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-8 bg-indigo-600' : i < step ? 'w-1.5 bg-indigo-300' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-slate-800 mb-3">
            {current.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {current.body}
          </p>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={skip}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Preskočiť
            </button>
            <button
              onClick={next}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-violet-500"
            >
              {current.cta}
            </button>
          </div>

          {/* Krok counter v rohu */}
          <span className="absolute top-4 right-4 text-[11px] text-slate-400">
            {step + 1} / {STEPS.length}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
