import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

const ERROR_LOG_KEY = 'numero-error-log';
const ERROR_LOG_MAX = 20;

interface ErrorLogEntry {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
}

function appendToErrorLog(entry: ErrorLogEntry): void {
  try {
    const raw = localStorage.getItem(ERROR_LOG_KEY);
    const log: ErrorLogEntry[] = raw ? JSON.parse(raw) : [];
    log.unshift(entry);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(log.slice(0, ERROR_LOG_MAX)));
  } catch {
    // localStorage may be full or disabled — best-effort.
  }
}

export function getErrorLog(): ErrorLogEntry[] {
  try {
    const raw = localStorage.getItem(ERROR_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearErrorLog(): void {
  try { localStorage.removeItem(ERROR_LOG_KEY); } catch { /* ignore */ }
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
    appendToErrorLog({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack ?? undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    });
  }

  copyDetails = async () => {
    const { error, errorInfo } = this.state;
    if (!error) return;
    const details = [
      `Message: ${error.message}`,
      `Stack:\n${error.stack || '(no stack)'}`,
      `Component stack:\n${errorInfo?.componentStack || '(no component stack)'}`,
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Timestamp: ${new Date().toISOString()}`,
    ].join('\n\n');
    try {
      await navigator.clipboard.writeText(details);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // fallback: show in a prompt
      prompt('Skopírujte chybu manuálne:', details);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0a2e]">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full">
            <h1 className="font-serif text-2xl font-bold text-white mb-4">Niečo sa pokazilo</h1>
            <p className="text-slate-400 mb-4">
              Vyskytla sa neočakávaná chyba. Detail je uložený v lokálnom logu.
              Skúste obnoviť aplikáciu — vaše dáta zostávajú v poriadku.
            </p>
            <details className="mb-4">
              <summary className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 select-none">
                Zobraziť technické detaily
              </summary>
              <div className="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700 max-h-60 overflow-auto">
                <p className="text-xs text-rose-300 font-mono mb-2">{this.state.error?.message}</p>
                {this.state.error?.stack && (
                  <pre className="text-[10px] text-slate-400 font-mono whitespace-pre-wrap leading-tight">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            </details>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { this.setState({ hasError: false, error: null, errorInfo: null }); window.location.href = '/'; }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium"
              >
                Obnoviť aplikáciu
              </button>
              <button
                onClick={this.copyDetails}
                className="px-6 py-3 rounded-xl border border-slate-500 text-slate-300 hover:bg-slate-700/50 font-medium"
              >
                {this.state.copied ? '✓ Skopírované' : '📋 Skopírovať detail'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
