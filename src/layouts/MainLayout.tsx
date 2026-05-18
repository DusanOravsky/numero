import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 fixed h-full z-40">
        <div className="p-6 border-b border-slate-100 text-center">
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
      </aside>

      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
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
        <div className="flex overflow-x-auto items-center py-2 px-1 gap-1 scrollbar-none">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-400'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
