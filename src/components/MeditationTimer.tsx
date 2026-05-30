import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../i18n/useTranslation';

const PRESETS = [
  { label: '3 min', seconds: 3 * 60 },
  { label: '5 min', seconds: 5 * 60 },
  { label: '10 min', seconds: 10 * 60 },
  { label: '15 min', seconds: 15 * 60 },
  { label: '20 min', seconds: 20 * 60 },
];

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Jednoduchý meditácia timer s preset dĺžkami a 1Hz tikavanim.
 * Pri konci spustí krátky tón pomocou Web Audio.
 */
export function MeditationTimer() {
  const { language } = useTranslation();
  const [duration, setDuration] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Tikanie: interval iba dekrementuje, nikdy nevolá side-effecty (chime) ani
  // setRunning vnútri updatera — to porušuje React purity (v StrictMode 2× tón).
  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Koniec časomiery rieši separátny efekt — zastaví beh a zahrá gong práve raz.
  // setState v efekte je tu legitímny side-effect (reakcia na dosiahnutie nuly),
  // nie state-derivation; chime sa musí spustiť mimo render/updater.
  useEffect(() => {
    if (running && remaining === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRunning(false);
      playEndChime();
    }
  }, [running, remaining]);

  const setPreset = (sec: number) => {
    setDuration(sec);
    setRemaining(sec);
    setRunning(false);
  };

  const reset = () => {
    setRemaining(duration);
    setRunning(false);
  };

  const progress = duration > 0 ? (1 - remaining / duration) * 100 : 0;

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">{language === 'sk' ? 'Meditácia / Timer' : 'Meditation / Timer'}</h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk' ? 'Vyber dĺžku a stlač Štart. Po skončení zaznie jemný gong (Web Audio).' : 'Choose duration and press Start. A gentle gong sounds when done (Web Audio).'}
      </p>

      <div className="flex flex-col items-center gap-3">
        {/* Veľký časomierač */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(99 102 241 / 0.2)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 289} 289`}
              style={{ transition: 'stroke-dasharray 1s linear' }}
            />
          </svg>
          <span className="text-3xl font-mono text-white">{fmt(remaining)}</span>
        </div>

        {/* Presety */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PRESETS.map(p => (
            <button
              key={p.seconds}
              onClick={() => setPreset(p.seconds)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                duration === p.seconds
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            disabled={remaining === 0}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (language === 'sk' ? '⏸ Pauza' : '⏸ Pause') : remaining === 0 ? (language === 'sk' ? '✓ Hotovo' : '✓ Done') : (language === 'sk' ? '▶ Štart' : '▶ Start')}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function playEndChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 528; // 528 Hz "Solfeggio love frequency"
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
    setTimeout(() => ctx.close(), 3000);
  } catch {
    // ignore — audio may be blocked
  }
}
