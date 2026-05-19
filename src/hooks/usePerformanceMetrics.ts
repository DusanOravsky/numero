import { useEffect } from 'react';

interface PerfEntry {
  name: string;
  duration: number;
  timestamp: string;
}

const PERF_LOG_KEY = 'numero-perf-log';
const PERF_LOG_MAX = 50;

function appendPerfEntry(entry: PerfEntry): void {
  try {
    const raw = localStorage.getItem(PERF_LOG_KEY);
    const log: PerfEntry[] = raw ? JSON.parse(raw) : [];
    log.unshift(entry);
    localStorage.setItem(PERF_LOG_KEY, JSON.stringify(log.slice(0, PERF_LOG_MAX)));
  } catch {
    // ignore — localStorage may be full or disabled
  }
}

export function getPerfLog(): PerfEntry[] {
  try {
    const raw = localStorage.getItem(PERF_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearPerfLog(): void {
  try { localStorage.removeItem(PERF_LOG_KEY); } catch { /* ignore */ }
}

/**
 * Mount-time performance hook.
 * Records mount→commit duration of the named component to localStorage
 * (capped at 50 entries) and `console.debug`. Useful for spotting which
 * route/component is slow on real devices.
 *
 * Usage: usePerformanceMetrics('NumerologyPage') in the page component.
 */
export function usePerformanceMetrics(name: string): void {
  useEffect(() => {
    if (typeof performance === 'undefined') return;
    const start = performance.now();
    // Record on next paint, after the component has actually rendered.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        const duration = performance.now() - start;
        appendPerfEntry({
          name,
          duration: Math.round(duration * 100) / 100,
          timestamp: new Date().toISOString(),
        });
        if (typeof console !== 'undefined' && 'debug' in console) {
          console.debug(`[perf] ${name} ready in ${duration.toFixed(1)}ms`);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
}

/**
 * One-shot Web Vitals capture using PerformanceObserver.
 * Logs LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift)
 * to console once for diagnostics. Call once on app boot.
 */
export function captureWebVitals(): void {
  if (typeof PerformanceObserver === 'undefined') return;
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        appendPerfEntry({
          name: 'LCP',
          duration: Math.round(last.startTime),
          timestamp: new Date().toISOString(),
        });
        console.debug(`[perf] LCP = ${Math.round(last.startTime)}ms`);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        // @ts-expect-error LayoutShift not in DOM lib types yet
        if (!entry.hadRecentInput) {
          // @ts-expect-error LayoutShift.value
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // After 10 seconds, capture CLS snapshot
    setTimeout(() => {
      appendPerfEntry({
        name: 'CLS',
        duration: Math.round(clsValue * 1000) / 1000,
        timestamp: new Date().toISOString(),
      });
      console.debug(`[perf] CLS = ${clsValue.toFixed(3)}`);
    }, 10000);
  } catch {
    // Browser doesn't support these — no-op
  }
}
