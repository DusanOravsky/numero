import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '1.4.0';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    _deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export function PWAPrompts() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      window._deferredInstallPrompt = promptEvent;
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Online/offline detection
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Version check - show update prompt if version changed
    const lastVersion = localStorage.getItem('app-version');
    if (lastVersion && lastVersion !== APP_VERSION) {
      setShowUpdate(true);
    }
    localStorage.setItem('app-version', APP_VERSION);

    // Service Worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    setShowInstall(false);
  };

  const dismissInstall = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleUpdate = () => {
    setShowUpdate(false);
    window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/');
  };

  return (
    <>
      {/* Offline indicator */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-amber-900 text-center py-1.5 text-xs font-medium"
          >
            Offline režim – všetky dáta sú uložené lokálne
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install prompt */}
      <AnimatePresence>
        {showInstall && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-[200] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 max-w-sm mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
                +
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Pridať na plochu</p>
                <p className="text-xs text-slate-500 mt-0.5">Nainštalujte si aplikáciu pre rýchly prístup a offline použitie</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleInstall} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                Nainštalovať
              </button>
              <button onClick={dismissInstall} className="px-4 py-2 rounded-xl text-slate-500 text-sm">
                Neskôr
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update prompt */}
      <AnimatePresence>
        {showUpdate && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-[200] bg-white rounded-2xl shadow-xl border border-indigo-200 p-4 max-w-sm mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">
                ↑
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Nová verzia {APP_VERSION}</p>
                <p className="text-xs text-slate-500 mt-0.5">Dostupná aktualizácia s novými funkciami a opravami</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleUpdate} className="flex-1 py-2 rounded-xl bg-green-600 text-white text-sm font-medium">
                Aktualizovať
              </button>
              <button onClick={() => setShowUpdate(false)} className="px-4 py-2 rounded-xl text-slate-500 text-sm">
                Neskôr
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { APP_VERSION };
