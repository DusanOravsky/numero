/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import { safeGet, safeSet, safeRemove } from '../utils/safeStorage';

declare const __APP_VERSION__: string;
const APP_VERSION = __APP_VERSION__;

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
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);
  const updateFoundRef = useRef<(() => void) | null>(null);
  const stateChangeSwRef = useRef<ServiceWorker | null>(null);
  const onStateChangeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Online/offline detection — vždy aktívne (aj v standalone mode)
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Auto-update prompt: porovná lokálnu APP_VERSION s version.json na serveri.
    // Ak sú rôzne → zobrazí popup. Toto funguje aj s CacheFirst stratégiou,
    // lebo version.json fetchujeme s cache: 'no-store'.
    const lastVersion = safeGet('app-version');
    if (lastVersion && lastVersion !== APP_VERSION) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowUpdate(true);
      safeRemove('pwa-install-dismissed');
      safeRemove('pwa-ios-hint-dismissed');
    } else {
      if (!lastVersion) safeSet('app-version', APP_VERSION);
      // Network check — fetch version.json aby sme zistili či je nová verzia (3 pokusy)
      const fetchVersion = (attempt: number) => {
        fetch(`${import.meta.env.BASE_URL}version.json`, { cache: 'no-store' })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.version && data.version !== APP_VERSION) {
              setShowUpdate(true);
            }
          })
          .catch(() => {
            if (attempt < 3) setTimeout(() => fetchVersion(attempt + 1), attempt * 2000);
          });
      };
      fetchVersion(1);
    }

    // SW lifecycle detection — keď prehliadač nájde nový SW waiting na aktiváciu
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;
        if (reg.waiting) {
          setShowUpdate(true);
          return;
        }
        const onStateChange = () => {
          const sw = reg.installing;
          if (sw?.state === 'installed' && navigator.serviceWorker.controller) {
            setShowUpdate(true);
          }
        };
        onStateChangeRef.current = onStateChange;
        const onUpdateFound = () => {
          const newSW = reg.installing;
          if (!newSW) return;
          stateChangeSwRef.current = newSW;
          newSW.addEventListener('statechange', onStateChange);
        };
        updateFoundRef.current = onUpdateFound;
        reg.addEventListener('updatefound', onUpdateFound);
        swRegRef.current = reg;
        reg.update().catch(() => {});
      });
    }

    const cleanupSW = () => {
      if (swRegRef.current && updateFoundRef.current) {
        swRegRef.current.removeEventListener('updatefound', updateFoundRef.current);
      }
      if (stateChangeSwRef.current && onStateChangeRef.current) {
        stateChangeSwRef.current.removeEventListener('statechange', onStateChangeRef.current);
      }
    };

    // Install hints — iba ak appka NIE JE už nainštalovaná
    if (isInStandaloneMode()) {
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
        cleanupSW();
      };
    }

    // iOS Safari nepodporuje beforeinstallprompt — zobrazíme manuálny tip
    let iosTimer: ReturnType<typeof setTimeout> | null = null;
    if (isIOS()) {
      const iosDismissed = safeGet('pwa-ios-hint-dismissed');
      if (!iosDismissed) {
        iosTimer = setTimeout(() => setShowIOSHint(true), 3000);
      }
    }

    // Install prompt (Chrome / Edge / Android)
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      window._deferredInstallPrompt = promptEvent;
      const dismissed = safeGet('pwa-install-dismissed');
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      if (iosTimer) clearTimeout(iosTimer);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      cleanupSW();
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    setShowInstall(false);
  };

  const dismissInstall = () => {
    setShowInstall(false);
    safeSet('pwa-install-dismissed', 'true');
  };

  const dismissIOSHint = () => {
    setShowIOSHint(false);
    safeSet('pwa-ios-hint-dismissed', 'true');
  };

  const handleUpdate = async () => {
    setShowUpdate(false);
    safeSet('app-version', APP_VERSION);

    // Ak je nový SW v waiting state, aktivujeme ho cez SKIP_WAITING + reload
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
        return;
      }
    }

    // Fallback — online check + cache wipe + reload
    const result = await checkForUpdate();
    if (!result.online) {
      alert(t('settings.githubOffline'));
    }
  };

  const dismissUpdate = () => {
    setShowUpdate(false);
    // Synchronizujeme verziu — prompt sa znova neukáže pri ďalšom otvorení
    safeSet('app-version', APP_VERSION);
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
            {t('pwa.offlineMode')}
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
                <p className="font-medium text-slate-800 text-sm">{t('pwa.iosInstallTitle')}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t('pwa.iosInstallDesc')}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={dismissIOSHint} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                {t('pwa.understand')}
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
                <p className="font-medium text-slate-800 text-sm">{t('pwa.installTitle')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('pwa.installDesc')}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleInstall} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                {t('common.install')}
              </button>
              <button onClick={dismissInstall} className="px-4 py-2 rounded-xl text-slate-500 text-sm">
                {t('common.later')}
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
                <p className="font-medium text-slate-800 text-sm">{t('pwa.newVersion')} {APP_VERSION}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('pwa.newVersionDesc')}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleUpdate} className="flex-1 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-500">
                {t('common.update')}
              </button>
              <button onClick={dismissUpdate} className="px-4 py-2 rounded-xl text-slate-500 text-sm hover:bg-slate-50">
                {t('common.later')}
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
 * Bezpečná manuálna kontrola update.
 *
 *  1. Ping na index.html (HEAD, no-store) — overíme online stav
 *  2. Ak server offline → return { online: false }, žiadne mazanie cache
 *     → app beží ďalej, user vidí alert
 *  3. Ak online → vyčistíme cache + unregister SW + reload
 *     (CacheFirst stratégia by inak vrátila starý HTML; bez wipe-u by
 *     manuálny check nemal žiadny efekt keď je nový SW v "waiting" state)
 *
 *  Profilové dáta (numero-store, klienti, AI history) sú v localStorage,
 *  ktorý cache wipe nemaže — zostávajú zachované.
 */
export async function checkForUpdate(): Promise<{ online: boolean; updated: boolean }> {
  // Ping serveru (s cache: 'no-store' aby sme dostali skutočný stav siete)
  try {
    const indexUrl = window.location.origin + (import.meta.env.BASE_URL || '/');
    const response = await fetch(indexUrl, { cache: 'no-store', method: 'HEAD' });
    if (!response.ok) return { online: false, updated: false };
  } catch {
    return { online: false, updated: false };
  }

  // Server je online — bezpečne môžeme vyčistiť cache (app sa po reload
  // dokáže nabootovať z čerstvej siete).
  try {
    safeSet('app-version', APP_VERSION);
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
    safeSet('app-version', APP_VERSION);
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
