import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0a2e]">
          <div className="glass rounded-2xl p-8 max-w-md text-center">
            <h1 className="font-serif text-2xl font-bold text-white mb-4">Niečo sa pokazilo</h1>
            <p className="text-slate-400 mb-4">
              Vyskytla sa neočakávaná chyba. Skúste obnoviť stránku.
            </p>
            <p className="text-xs text-slate-500 mb-6 font-mono break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium"
            >
              Obnoviť aplikáciu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
