import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '2.2.2';

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

    // Auto-update prompt: zobrazí sa IBA raz po reálnom upgrade — keď sa
    // localStorage.app-version (zo starej verzie) líši od aktuálne načítanej
    // APP_VERSION. Po zatvorení promptu (Aktualizovať alebo Neskôr) sa verzia
    // synchronizuje a prompt sa už znova nezobrazí pre rovnakú verziu.
    const lastVersion = localStorage.getItem('app-version');
    if (lastVersion && lastVersion !== APP_VERSION) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowUpdate(true);
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-ios-hint-dismissed');
    } else if (!lastVersion) {
      // First load — uložíme aktuálnu verziu
      localStorage.setItem('app-version', APP_VERSION);
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

  const dismissIOSHint = () => {
    setShowIOSHint(false);
    localStorage.setItem('pwa-ios-hint-dismissed', 'true');
  };

  const handleUpdate = async () => {
    // Online check pred reloadom — ak je server offline, nerobíme nič
    // (appka beží ďalej z cache, prompt zatvoríme).
    setShowUpdate(false);
    localStorage.setItem('app-version', APP_VERSION);  // sync, aby sa neukázal znova
    const result = await checkForUpdate();
    if (!result.online) {
      alert('GitHub je offline. Aplikácia beží ďalej z lokálnej cache. Skús neskôr cez Settings → Skontrolovať update.');
    }
    // Ak online, checkForUpdate sám vykoná reload
  };

  const dismissUpdate = () => {
    setShowUpdate(false);
    // Synchronizujeme verziu — prompt sa znova neukáže pri ďalšom otvorení
    localStorage.setItem('app-version', APP_VERSION);
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

      {/* Update prompt — zobrazí sa raz po reálnom upgrade */}
      <AnimatePresence>
        {showUpdate && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-[200] bg-white rounded-2xl shadow-xl border border-indigo-200 p-4 max-w-sm mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">↑</div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 text-sm">Nová verzia {APP_VERSION}</p>
                <p className="text-xs text-slate-500 mt-0.5">Stiahni najnovšiu verziu zo serveru. Bez internetu sa appka nezmení.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleUpdate} className="flex-1 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-500">
                Aktualizovať
              </button>
              <button onClick={dismissUpdate} className="px-4 py-2 rounded-xl text-slate-500 text-sm hover:bg-slate-50">
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
 * Bezpečná manuálna kontrola update — Dušok-style.
 *
 *  1. Najprv ping na index.html (nech zistíme či je server online)
 *  2. Ak je server online → SW.update() stiahne nové assety → reload
 *  3. Ak je server OFFLINE → vrátime { online: false } bez zmeny cache
 *     → user vidí dialog "GitHub je offline, skús neskôr" a app
 *       NIČ NESTRATÍ, beží ďalej z cache.
 *
 *  Profilové dáta (numero-store) sa NIKDY nemažú — sú v localStorage,
 *  ktorý SW vôbec nečíta.
 */
export async function checkForUpdate(): Promise<{ online: boolean; updated: boolean }> {
  // Ping serveru (s cache: 'no-store' aby sme dostali skutočný stav siete,
  // nie cached HTML). Ak fail → server offline alebo CORS issue.
  try {
    const indexUrl = window.location.origin + (import.meta.env.BASE_URL || '/');
    const response = await fetch(indexUrl, { cache: 'no-store', method: 'HEAD' });
    if (!response.ok) return { online: false, updated: false };
  } catch {
    return { online: false, updated: false };
  }

  // Server je online. Necháme SW skontrolovať update bez mazania cache.
  // Ak je k dispozícii nová verzia, SW sa nainštaluje na pozadí. Reload
  // potom použije novú verziu.
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.update()));
    }
  } catch {
    // SW update zlyhal, ale server je online — pravdepodobne CSP issue.
    // Pokračujeme s reloadom — browser stiahne čerstvé HTML a assety.
  }

  // Označ že sme schválili update (no-op ak verzia ostala rovnaká)
  localStorage.setItem('app-version', APP_VERSION);
  // Hard reload — vynúti fetch index.html (HTML sa stiahne čerstvý ak je
  // bundle hash iný; ak je rovnaký, SW vráti cached → app sa neaktualizuje
  // lebo nie je čo aktualizovať).
  window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/') + '?check=' + Date.now();
  return { online: true, updated: true };
}

/**
 * Tvrdá force-update: unregister všetkých SW + zmazanie všetkej cache.
 * Použiť IBA ak checkForUpdate() opakovane zlyhá (PWA cache corrupted).
 *
 * **POZOR:** Ak je server offline pri tomto úkonu, app sa po reload
 * nemôže načítať. Funkcia kontroluje server pred zmazaním cache.
 */
export async function forceUpdate(): Promise<{ online: boolean }> {
  // Najprv overíme online stav — ak je server unreachable, nemažeme cache!
  try {
    const indexUrl = window.location.origin + (import.meta.env.BASE_URL || '/');
    const response = await fetch(indexUrl, { cache: 'no-store', method: 'HEAD' });
    if (!response.ok) return { online: false };
  } catch {
    return { online: false };
  }

  try {
    localStorage.setItem('app-version', APP_VERSION);
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch {
    // ignore
  }
  window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/') + '?fresh=' + Date.now();
  return { online: true };
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
