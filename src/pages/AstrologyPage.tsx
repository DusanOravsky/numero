import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateAstrology } from '../engine/astrologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import { motion } from 'framer-motion';

export function AstrologyPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<AstrologyResult | null>(null);

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number) => {
    setResult(calculateAstrology(day, month, year, hour || 12, minute || 0));
  };

  useEffect(() => {
    if (profile && !result) {
      setResult(calculateAstrology(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour || 12, profile.birthMinute || 0));
    }
  }, [profile, result]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Astrológia</h1>
        <p className="text-slate-400 mt-1">Astrologický profil a analýza</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime label="Dátum a čas narodenia" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnergyCard
              title="Slnečné znamenie"
              value={`${result.sunSign.symbol} ${result.sunSign.name}`}
              subtitle={`${result.sunSign.element} | ${result.sunSign.quality}`}
              color="gold"
              delay={0.1}
            />
            <EnergyCard
              title="Mesačné znamenie"
              value={`${result.moonSign.symbol} ${result.moonSign.name}`}
              subtitle={`${result.moonSign.element} | ${result.moonSign.quality}`}
              color="purple"
              delay={0.2}
            />
            <EnergyCard
              title="Ascendent"
              value={`${result.ascendant.symbol} ${result.ascendant.name}`}
              subtitle={`${result.ascendant.element} | ${result.ascendant.quality}`}
              color="cyan"
              delay={0.3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-4">Planéty v znameniach</h3>
              <div className="space-y-3">
                {result.planets.map((planet, idx) => (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl glass-light"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{planet.symbol}</span>
                      <span className="text-sm font-medium text-white">{planet.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-indigo-300">{planet.sign.symbol} {planet.sign.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{planet.degree.toFixed(1)}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <div className="space-y-4">
              <GlassCard>
                <h3 className="font-medium text-white mb-3">Dominantné energie</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <span className="text-sm text-slate-300">Dominantný živel</span>
                    <span className="font-medium text-white">{result.dominantElement}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-sm text-slate-300">Dominantná kvalita</span>
                    <span className="font-medium text-white">{result.dominantQuality}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <span className="text-sm text-slate-300">Dominantná planéta</span>
                    <span className="font-medium text-white">{result.dominantPlanet}</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-3">Mesačná fáza pri narodení</h3>
                <p className="text-lg text-indigo-300 font-serif">{result.moonPhase}</p>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-3">Karmické uzly</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Severný uzol (budúcnosť)</span>
                    <span className="text-sm text-indigo-300">{result.northNode.symbol} {result.northNode.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Južný uzol (minulosť)</span>
                    <span className="text-sm text-purple-300">{result.southNode.symbol} {result.southNode.name}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

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
