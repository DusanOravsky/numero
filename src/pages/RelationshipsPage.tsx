import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateFullNumerology } from '../engine/numerologyEngine';
import { calculatePartnerCompatibility, calculateParentChild } from '../engine/compatibilityEngine';
import type { CompatibilityResult, ParentChildResult } from '../engine/compatibilityEngine';
import { motion } from 'framer-motion';

type Mode = 'partner' | 'child';

export function RelationshipsPage() {
  const [mode, setMode] = useState<Mode>('partner');
  const [person1Data, setPerson1Data] = useState<{ day: number; month: number; year: number } | null>(null);
  const [person2Data, setPerson2Data] = useState<{ day: number; month: number; year: number } | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [parentChild, setParentChild] = useState<ParentChildResult | null>(null);

  const handlePerson1 = (day: number, month: number, year: number) => {
    setPerson1Data({ day, month, year });
  };

  const handlePerson2 = (day: number, month: number, year: number) => {
    setPerson2Data({ day, month, year });
    if (person1Data) {
      const p1 = calculateFullNumerology(person1Data.day, person1Data.month, person1Data.year);
      const p2 = calculateFullNumerology(day, month, year);
      if (mode === 'partner') {
        setCompatibility(calculatePartnerCompatibility(p1, p2, 'Partner 1', 'Partner 2'));
      } else {
        setParentChild(calculateParentChild(p1, p2));
      }
    }
  };

  const reset = () => {
    setPerson1Data(null);
    setPerson2Data(null);
    setCompatibility(null);
    setParentChild(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Vzťahy</h1>
        <p className="text-slate-400 mt-1">Partnerská a rodinná kompatibilita</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setMode('partner'); reset(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'partner' ? 'bg-indigo-600 text-white glow' : 'glass text-slate-400'}`}
        >
          Partnerský výklad
        </button>
        <button
          onClick={() => { setMode('child'); reset(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'child' ? 'bg-indigo-600 text-white glow' : 'glass text-slate-400'}`}
        >
          Rodič a dieťa
        </button>
      </div>

      {!person1Data && (
        <GlassCard>
          <DateInput onSubmit={handlePerson1} label={mode === 'partner' ? 'Dátum narodenia – Partner 1' : 'Dátum narodenia – Rodič'} />
        </GlassCard>
      )}

      {person1Data && !person2Data && (
        <GlassCard>
          <DateInput onSubmit={handlePerson2} label={mode === 'partner' ? 'Dátum narodenia – Partner 2' : 'Dátum narodenia – Dieťa'} />
        </GlassCard>
      )}

      {compatibility && mode === 'partner' && (
        <div className="space-y-6">
          <GlassCard glow>
            <div className="text-center">
              <p className="text-sm text-slate-400">Celkové skóre kompatibility</p>
              <div className="relative w-32 h-32 mx-auto my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}`}
                    initial={{ strokeDasharray: '0 283' }}
                    animate={{ strokeDasharray: `${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-serif font-bold text-white">{compatibility.overallScore}%</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard>
              <h4 className="text-sm text-slate-400 mb-2">Životné čísla</h4>
              <p className="text-lg font-medium text-white">{compatibility.lifePathCompatibility.score}%</p>
              <p className="text-sm text-slate-300 mt-1">{compatibility.lifePathCompatibility.description}</p>
            </GlassCard>
            <GlassCard>
              <h4 className="text-sm text-slate-400 mb-2">Jazyky lásky</h4>
              <p className="text-lg font-medium text-white">{compatibility.loveLanguageMatch.score}%</p>
              {compatibility.loveLanguageMatch.matched.length > 0 && (
                <p className="text-sm text-green-300 mt-1">Zhodné: {compatibility.loveLanguageMatch.matched.join(', ')}</p>
              )}
            </GlassCard>
          </div>

          {compatibility.strengths.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Silné stránky vzťahu</h3>
              <div className="space-y-2">
                {compatibility.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">+</span>
                    <span className="text-sm text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {compatibility.challenges.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Výzvy</h3>
              <div className="space-y-2">
                {compatibility.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">!</span>
                    <span className="text-sm text-slate-300">{c}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Odporúčania</h3>
            <div className="space-y-2">
              {compatibility.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">→</span>
                  <span className="text-sm text-slate-300">{r}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Rituály pre pár</h3>
            <div className="space-y-2">
              {compatibility.rituals.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">♡</span>
                  <span className="text-sm text-slate-300">{r}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white">
            Nový výpočet
          </button>
        </div>
      )}

      {parentChild && mode === 'child' && (
        <div className="space-y-6">
          <GlassCard glow>
            <div className="text-center">
              <p className="text-sm text-slate-400">Kompatibilita rodič-dieťa</p>
              <p className="text-4xl font-serif font-bold text-white mt-2">{parentChild.compatibility}%</p>
              <p className="text-sm text-indigo-300 mt-2">{parentChild.parentRole}</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Emocionálne potreby dieťaťa</h3>
            <div className="space-y-2">
              {parentChild.emotionalNeeds.map((need, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">◈</span>
                  <span className="text-sm text-slate-300">{need}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Komunikácia</h3>
            <p className="text-sm text-slate-300">{parentChild.communicationStyle}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Hranice</h3>
            <div className="space-y-2">
              {parentChild.boundaries.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">⊡</span>
                  <span className="text-sm text-slate-300">{b}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Potreby dieťaťa</h3>
            <div className="space-y-2">
              {parentChild.childNeeds.map((need, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">★</span>
                  <span className="text-sm text-slate-300">{need}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Odporúčania</h3>
            <div className="space-y-2">
              {parentChild.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">→</span>
                  <span className="text-sm text-slate-300">{r}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white">
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
