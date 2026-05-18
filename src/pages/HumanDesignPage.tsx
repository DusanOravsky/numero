import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateHumanDesign, CENTER_THEMES } from '../engine/humanDesignEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { motion } from 'framer-motion';

export function HumanDesignPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<HumanDesignResult | null>(null);

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number) => {
    setResult(calculateHumanDesign(day, month, year, hour || 12, minute || 0));
  };

  useEffect(() => {
    if (profile && !result) {
      setResult(calculateHumanDesign(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour || 12, profile.birthMinute || 0));
    }
  }, [profile, result]);

  const typeColors: Record<string, string> = {
    'Manifestor': 'from-red-500/20 to-rose-500/20',
    'Generátor': 'from-orange-500/20 to-amber-500/20',
    'Manifestujúci Generátor': 'from-yellow-500/20 to-orange-500/20',
    'Projektor': 'from-blue-500/20 to-indigo-500/20',
    'Reflektor': 'from-white/10 to-slate-500/20',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Human Design</h1>
        <p className="text-slate-400 mt-1">Váš energetický plán</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime label="Dátum a čas narodenia (pre presný HD)" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <GlassCard glow>
            <div className={`p-6 rounded-xl bg-gradient-to-br ${typeColors[result.type] || typeColors['Generátor']}`}>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Váš typ</p>
              <h2 className="font-serif text-3xl font-bold text-white mt-1">{result.type}</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Stratégia</p>
                  <p className="text-sm font-medium text-white">{result.strategy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Autorita</p>
                  <p className="text-sm font-medium text-white">{result.authority}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Nie-ja téma</p>
                  <p className="text-sm font-medium text-rose-300">{result.notSelfTheme}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnergyCard title="Profil" value={`${result.profile.line1}/${result.profile.line2}`} subtitle={result.profile.name} color="indigo" delay={0.1} />
            <EnergyCard title="Inkarnačný kríž" value="✝" subtitle={result.incarnationCross} color="gold" delay={0.2} />
            <EnergyCard title="Definované centrá" value={result.definedCenters.length} subtitle={`z 9 centier`} color="cyan" delay={0.3} />
            <EnergyCard title="Kanály" value={result.channels.length} subtitle="aktívne kanály" color="purple" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-4">Definované centrá</h3>
              <div className="space-y-2">
                {result.definedCenters.map((center, idx) => (
                  <motion.div
                    key={center}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <span className="text-sm font-medium text-green-300">{center}</span>
                    <span className="text-xs text-slate-400">{CENTER_THEMES[center] || ''}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-4">Otvorené centrá</h3>
              <p className="text-xs text-slate-400 mb-3">Oblasti učenia a múdrosti – nie slabosti</p>
              <div className="space-y-2">
                {result.openCenters.map((center, idx) => (
                  <motion.div
                    key={center}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <span className="text-sm font-medium text-amber-300">{center}</span>
                    <span className="text-xs text-slate-400">Oblasť múdrosti</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {result.channels.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-4">Aktívne kanály</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.channels.map((channel, idx) => (
                  <motion.div
                    key={`${channel.gates[0]}-${channel.gates[1]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl glass-light"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{channel.name}</span>
                      <span className="text-xs text-indigo-300">{channel.gates[0]}-{channel.gates[1]}</span>
                    </div>
                    <span className="text-xs text-slate-400">{channel.centers[0]} → {channel.centers[1]}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Profil: {result.profile.line1}/{result.profile.line2} – {result.profile.name}</h3>
            <p className="text-sm text-slate-300">{result.profile.description}</p>
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
