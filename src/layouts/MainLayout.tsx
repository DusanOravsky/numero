import { useState } from 'react';
import { Outlet, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, type TranslationKey } from '../i18n/useTranslation';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { APP_VERSION } from '../components/PWAPrompts';
import { GlobalAIDrawer } from '../components/GlobalAIDrawer';
import { SubjectPicker } from '../components/SubjectPicker';

const NAV_DEFS: { path: string; labelKey: TranslationKey; icon: string }[] = [
  { path: '/', labelKey: 'nav.dashboard', icon: '⬡' },
  { path: '/numerology', labelKey: 'nav.numerology', icon: '✦' },
  { path: '/astrology', labelKey: 'nav.astrology', icon: '☆' },
  { path: '/human-design', labelKey: 'nav.humanDesign', icon: '◎' },
  { path: '/relationships', labelKey: 'nav.relationships', icon: '♡' },
  { path: '/chakras', labelKey: 'nav.chakras', icon: '◈' },
  { path: '/kabalah', labelKey: 'nav.kabalah', icon: '⚘' },
  { path: '/theta-healing', labelKey: 'nav.theta', icon: '∞' },
  { path: '/modality', labelKey: 'nav.modality', icon: '☘' },
  { path: '/clients', labelKey: 'nav.clients', icon: '♟' },
  { path: '/settings', labelKey: 'nav.settings', icon: '⚙' },
];

// Pre mobilnú spodnú navigáciu vyberieme len najpoužívanejšie položky.
const MOBILE_PRIMARY = ['/', '/numerology', '/human-design', '/relationships', '/clients'];

export function MainLayout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const presentMode = searchParams.get('present') === '1';
  const { t } = useTranslation();
  const logoSrc = `${import.meta.env.BASE_URL}icons/logo.svg`;
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const { themeMode, setThemeMode, language, setLanguage } = useStore(
    useShallow(s => ({ themeMode: s.themeMode, setThemeMode: s.setThemeMode, language: s.language, setLanguage: s.setLanguage }))
  );

  const togglePresent = () => {
    const next = new URLSearchParams(searchParams);
    if (presentMode) next.delete('present'); else next.set('present', '1');
    setSearchParams(next, { replace: true });
  };

  const navItems = NAV_DEFS.map(d => ({ path: d.path, label: t(d.labelKey), icon: d.icon }));
  const mobilePrimaryItems = navItems.filter(i => MOBILE_PRIMARY.includes(i.path));
  const mobileMoreItems = navItems.filter(i => !MOBILE_PRIMARY.includes(i.path));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {!presentMode && (
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white chakra-border-right fixed h-full z-40">
        <div className="p-6 border-b border-slate-100 text-center">
          <img src={logoSrc} alt="" aria-hidden="true" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="font-serif text-lg font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent landing-title">
            Integrálna mapa bytia
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
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
        <div className="p-4 border-t border-slate-100 space-y-2.5">
          {/* Theme picker — segmented control (Light / Dark) */}
          <div className="grid grid-cols-2 gap-0 p-0.5 bg-slate-100 rounded-lg">
            {([
              { id: 'light', svg: <SunIcon />, label: language === 'sk' ? 'Svetlá' : 'Light' },
              { id: 'dark', svg: <MoonIcon />, label: language === 'sk' ? 'Tmavá' : 'Dark' },
            ] as const).map(opt => (
              <button
                key={opt.id}
                onClick={() => setThemeMode(opt.id)}
                title={opt.label}
                aria-label={opt.label}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  themeMode === opt.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.svg}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          {/* Language picker — segmented control */}
          <div className="grid grid-cols-2 gap-0 p-0.5 bg-slate-100 rounded-lg">
            {([
              { id: 'sk', label: 'SK' },
              { id: 'en', label: 'EN' },
            ] as const).map(opt => (
              <button
                key={opt.id}
                onClick={() => setLanguage(opt.id)}
                className={`py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  language === opt.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={togglePresent}
            className="w-full py-1.5 rounded-md text-xs font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
            title={language === 'sk' ? 'Skryje navigáciu pre prezentáciu klientovi' : 'Hides navigation for client presentation'}
          >
            {language === 'sk' ? '▶ Prezentačný režim' : '▶ Presentation mode'}
          </button>
          <button
            onClick={() => {
              navigator.share?.({
                title: 'Integrálna mapa bytia',
                text: language === 'sk' ? 'Objavte svoju integrálnu mapu bytia — numerológia, astrológia, Human Design a ďalšie systémy na jednom mieste.' : 'Discover your integral map of being — numerology, astrology, Human Design and more systems in one place.',
                url: 'https://dusanoravsky.github.io/numero/',
              }).catch(() => {});
            }}
            className="w-full py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            {language === 'sk' ? '💌 Pozvi priateľa' : '💌 Invite a friend'}
          </button>
          <p className="text-[10px] text-slate-400 text-center">v{APP_VERSION}</p>
        </div>
      </aside>
      )}

      <main className={`flex-1 ${presentMode ? '' : 'lg:ml-64 pb-20 lg:pb-0'}`}>
        {!presentMode && (
        /* Mobilný header s logom – iba na mobile */
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <img src={logoSrc} alt="" aria-hidden="true" className="w-10 h-10 shrink-0" />
          <h1 className="font-serif text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent flex-1 truncate landing-title">
            {language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being'}
          </h1>
          <SubjectPicker />
        </header>
        )}

        {/* Desktop subject picker bar */}
        {!presentMode && (
        <div className="hidden lg:flex justify-end px-8 pt-6">
          <SubjectPicker />
        </div>
        )}

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

      {!presentMode && (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50" aria-label={language === 'sk' ? 'Hlavná navigácia' : 'Main navigation'}>
        <div className="grid grid-cols-6 items-center py-1.5 px-1">
          {mobilePrimaryItems.map(item => (
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
            aria-label={t('nav.more')}
            className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-slate-400 hover:text-indigo-600"
          >
            <span className="text-lg">⋯</span>
            <span className="text-[9px]">{t('nav.more')}</span>
          </button>
        </div>
      </nav>
      )}

      {presentMode && (
        <button
          onClick={togglePresent}
          className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-violet-600 text-white text-xs font-medium shadow-lg hover:bg-violet-500 transition-colors"
          title={language === 'sk' ? 'Vypnúť prezentačný režim' : 'Disable presentation mode'}
        >
          {language === 'sk' ? '✕ Ukončiť prezentáciu' : '✕ Exit presentation'}
        </button>
      )}

      {!presentMode && <GlobalAIDrawer />}

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
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] p-6 pb-8 shadow-2xl mobile-sheet"
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
              <h3 className="font-medium text-slate-800 mb-4">{t('nav.more')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoreItems.map(item => (
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
                {t('common.close')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
