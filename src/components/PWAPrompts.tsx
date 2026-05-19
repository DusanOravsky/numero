import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '2.1.4';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    _deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

function isIOS(): boolean {
  const ua = navigator.userAgent;
  const isIDevice = /iPad|iPhone|iPod/.test(ua) && !(/(Windows|Android)/.test(ua));
  // iPadOS 13+ predstaví sa ako Mac, ale má touch
  const isIPadOS = /Macintosh/.test(ua) && 'ontouchend' in document;
  return isIDevice || isIPadOS;
}

function isInStandaloneMode(): boolean {
  // iOS
  // @ts-expect-error iOS-only API
  if (window.navigator.standalone) return true;
  // ostatné platformy
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function PWAPrompts() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Ak už beží ako nainštalovaná appka, nič neukazuj
    if (isInStandaloneMode()) return;

    // iOS Safari nepodporuje beforeinstallprompt — zobrazíme manuálny tip
    if (isIOS()) {
      const iosDismissed = localStorage.getItem('pwa-ios-hint-dismissed');
      if (!iosDismissed) {
        // krátka oneskorená iniciácia, aby používateľ stihol vidieť obsah
        const t = setTimeout(() => setShowIOSHint(true), 3000);
        return () => clearTimeout(t);
      }
    }

    // Install prompt (Chrome / Edge / Android)
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

    // Version check - show update prompt if version changed.
    // setState in effect is intentional here: sync with external state (localStorage) on mount.
    const lastVersion = localStorage.getItem('app-version');
    if (lastVersion && lastVersion !== APP_VERSION) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowUpdate(true);
      // pri zmene verzie tiež reset "dismissed install" – môže si znova ukázať
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-ios-hint-dismissed');
    }
    localStorage.setItem('app-version', APP_VERSION);

    // Service Worker update detection — funguje na desktop + mobile PWA.
    // Žiadny periodický polling — kontrolujeme iba pri eventoch (battery-friendly):
    //  1. mount (raz)
    //  2. visibilitychange — keď user otvorí appku z pozadia, ale max raz za 6h
    //  3. controllerchange — keď SW prevezme kontrolu (po skipWaiting)
    let activeRegistration: ServiceWorkerRegistration | null = null;
    let lastUpdateCheck = 0;
    const UPDATE_THROTTLE_MS = 6 * 60 * 60 * 1000; // 6 hodín

    const checkForUpdate = () => {
      if (!activeRegistration) return;
      const now = Date.now();
      if (now - lastUpdateCheck < UPDATE_THROTTLE_MS) return;
      lastUpdateCheck = now;
      activeRegistration.update().catch(() => { /* offline OK */ });
    };

    const onControllerChange = () => {
      // controllerchange = nový SW prevzal kontrolu (skipWaiting + clientsClaim)
      setShowUpdate(true);
    };

    const onVisibilityChange = () => {
      // Pri návrate z pozadia skontroluj update — ale max raz za 6h
      if (!document.hidden) checkForUpdate();
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        activeRegistration = registration;

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Pre kompatibilitu pošleme aj manuálny SKIP_WAITING
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });

        // Initial check pri mount (raz)
        lastUpdateCheck = Date.now();
        registration.update().catch(() => { /* offline OK */ });
      });

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      }
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

  const dismissIOSHint = () => {
    setShowIOSHint(false);
    localStorage.setItem('pwa-ios-hint-dismissed', 'true');
  };

  const handleUpdate = async () => {
    setShowUpdate(false);
    await forceUpdate();
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

      {/* iOS install hint (Safari nepodporuje beforeinstallprompt) */}
      <AnimatePresence>
        {showIOSHint && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-[200] bg-white rounded-2xl shadow-xl border border-indigo-200 p-4 max-w-sm mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg shrink-0">
                📱
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Pridať na plochu (iPhone / iPad)</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  V Safari klepni dole na ikonu <strong>Zdieľať</strong> (štvorček so šípkou hore), potom zvoľ <strong>"Pridať na plochu"</strong>. Aplikácia bude fungovať offline ako bežná appka.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={dismissIOSHint} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                Rozumiem
              </button>
            </div>
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

/**
 * Force-refresh: unregister všetkých service workerov, vyčistí všetky cache
 * storage, a presunie na home (čo si stiahne novú verziu). Pomáha keď PWA
 * drží starú verziu napriek deploy-u.
 *
 * Profilové dáta (numero-store) sa nemažú — zostávajú v localStorage.
 * AI kľúč a chat history sa NEZMAŽÚ tu — na to je clearAIData().
 */
export async function forceUpdate(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch {
    // ignore — best effort
  }
  // Hard reload na home (vynúti čerstvý fetch index.html + bundle)
  window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/') + '?fresh=' + Date.now();
}

/**
 * Vymazanie všetkých AI dát z localStorage:
 * - anthropic-api-key (citlivý!)
 * - anthropic-model
 * - ai-chat-* (všetky chat histories)
 *
 * Použitie pri zdieľanom zariadení alebo keď dáva užívateľ aplikáciu inému.
 */
export function clearAIData(): void {
  try {
    localStorage.removeItem('anthropic-api-key');
    localStorage.removeItem('anthropic-model');
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('ai-chat-')) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
