import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateKabalah, SEFIROT } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { motion } from 'framer-motion';

export function KabalahPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<KabalahResult | null>(null);

  const handleCalculate = (day: number, month: number, year: number) => {
    const lifePath = reduceToSingle(day + month + year);
    const dayNum = reduceToSingle(day);
    setResult(calculateKabalah(lifePath, dayNum));
  };

  useEffect(() => {
    if (profile && !result) {
      const lifePath = reduceToSingle(profile.birthDay + profile.birthMonth + profile.birthYear);
      const dayNum = reduceToSingle(profile.birthDay);
      setResult(calculateKabalah(lifePath, dayNum));
    }
  }, [profile, result]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Kabala</h1>
        <p className="text-slate-400 mt-1">Strom života a sefírotický systém</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Dátum narodenia" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <GlassCard glow>
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Vaša primárna sefira</p>
              <h2 className="font-serif text-3xl font-bold text-white mt-2">{result.primarySefira.name}</h2>
              <p className="text-lg text-indigo-300">{result.primarySefira.meaning}</p>
              <p className="text-sm text-slate-400 mt-1">{result.primarySefira.hebrewName}</p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Primárna sefira: {result.primarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Témy</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.primarySefira.themes.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">Dar</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">Tieň</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.shadow}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pilier</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.pillar}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Planéta</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.planet}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-3">Sekundárna sefira: {result.secondarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Témy</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.secondarySefira.themes.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">Dar</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">Tieň</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.shadow}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Cesta</h3>
            <p className="text-sm text-indigo-300 font-serif italic mb-3">{result.path}</p>
            <p className="text-sm text-slate-300">{result.integration}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Životné lekcie</h3>
            <div className="space-y-2">
              {result.lifeLessons.map((lesson, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-amber-400 mt-0.5">◆</span>
                  <span className="text-sm text-slate-300">{lesson}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="font-medium text-white mb-2">Čin v Malchut (Kráľovstvo)</h3>
            <p className="text-xs text-slate-400 mb-3">Konkrétny krok pre dnešný deň</p>
            <p className="text-sm text-indigo-300 font-serif">{result.malchutAction}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4">Strom života – 10 Sefír</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEFIROT.map((sefira, idx) => (
                <motion.div
                  key={sefira.number}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-xl border ${
                    sefira.name === result.primarySefira.name ? 'border-indigo-500/50 bg-indigo-500/10' :
                    sefira.name === result.secondarySefira.name ? 'border-purple-500/50 bg-purple-500/10' :
                    'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{sefira.number}</span>
                    <span className="text-sm font-medium text-white">{sefira.name}</span>
                    <span className="text-xs text-slate-500">({sefira.meaning})</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
