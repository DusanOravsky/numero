import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
  { path: '/numerology', label: 'Numerológia', icon: '✦' },
  { path: '/astrology', label: 'Astrológia', icon: '☆' },
  { path: '/human-design', label: 'Human Design', icon: '◎' },
  { path: '/relationships', label: 'Vzťahy', icon: '♡' },
  { path: '/chakras', label: 'Čakry', icon: '◈' },
  { path: '/kabalah', label: 'Kabala', icon: '⚘' },
  { path: '/theta-healing', label: 'Theta', icon: '∞' },
  { path: '/clients', label: 'Klienti', icon: '♟' },
  { path: '/settings', label: 'Nastavenia', icon: '⚙' },
];

// Pre mobilnú spodnú navigáciu vyberieme len najpoužívanejšie položky.
// Zvyšok sa zobrazí v bottom-sheet po klepnutí na "Viac".
const MOBILE_PRIMARY = ['/', '/numerology', '/astrology', '/human-design', '/relationships'];
const MOBILE_PRIMARY_ITEMS = NAV_ITEMS.filter(i => MOBILE_PRIMARY.includes(i.path));
const MOBILE_MORE_ITEMS = NAV_ITEMS.filter(i => !MOBILE_PRIMARY.includes(i.path));

export function MainLayout() {
  const location = useLocation();
  const logoSrc = `${import.meta.env.BASE_URL}icons/logo.svg`;
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white chakra-border-right fixed h-full z-40">
        <div className="p-6 border-b border-slate-100 text-center">
          <img src={logoSrc} alt="" aria-hidden="true" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="font-serif text-lg font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Integrálna mapa bytia
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">v1.5.0</p>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {/* Mobilný header s logom – iba na mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <img src={logoSrc} alt="" aria-hidden="true" className="w-10 h-10 shrink-0" />
          <h1 className="font-serif text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Integrálna mapa bytia
          </h1>
        </header>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-8 max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50" aria-label="Hlavná navigácia">
        <div className="grid grid-cols-6 items-center py-1.5 px-1">
          {MOBILE_PRIMARY_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all ${
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-400'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px]">{item.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setShowMoreSheet(true)}
            aria-label="Viac"
            className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-slate-400 hover:text-indigo-600"
          >
            <span className="text-lg">⋯</span>
            <span className="text-[9px]">Viac</span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet pre "Viac" položky */}
      <AnimatePresence>
        {showMoreSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreSheet(false)}
              className="lg:hidden fixed inset-0 bg-black/30 z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] p-6 pb-8 shadow-2xl"
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
              <h3 className="font-medium text-slate-800 mb-4">Viac sekcií</h3>
              <div className="grid grid-cols-2 gap-3">
                {MOBILE_MORE_ITEMS.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMoreSheet(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isActive ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowMoreSheet(false)}
                className="w-full mt-4 py-2 text-sm text-slate-500"
              >
                Zavrieť
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
