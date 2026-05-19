import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { calculateORV } from '../engine/numerologyEngine';
import { orvDescriptions } from '../data/orvDescriptions';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  /** Maximálny vek do ktorého zobraziť históriu (default 90) */
  maxAge?: number;
}

/**
 * Histogram ORV cez celý život — 9-ročné cykly farebne odlíšené.
 * Aktuálny rok je výrazne označený a obohatený o krátky popis.
 */
export function ORVLifeHistogram({ birthDay, birthMonth, birthYear, maxAge = 90 }: Props) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const endYear = birthYear + maxAge;

  // Farby podľa ORV (rovnaká paleta ako v ODV kalendári)
  const orvColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    2: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
    3: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
    4: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    5: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
    6: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    7: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
    8: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    9: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
  };

  // Pre každý rok od narodenia po endYear vyrátame ORV pre obdobie po narodeninách
  const years: Array<{ year: number; age: number; orv: number; isCurrent: boolean; isPast: boolean; isFuture: boolean }> = [];
  for (let y = birthYear; y <= endYear; y++) {
    // ORV pre tento rok = ORV po narodeninách v tomto roku
    // calculateORV bere current dátum — použijeme deň/mesiac narodenia + 1 deň po, aby sme dostali ORV roka po narodeninách
    const orv = calculateORV(birthDay, birthMonth, y, birthMonth, birthDay);
    const age = y - birthYear;
    const isCurrent = y === currentYear || (y === currentYear - 1 && (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)));
    const isPast = y < currentYear - 1 || (y === currentYear - 1 && !isCurrent);
    const isFuture = y > currentYear || (y === currentYear && !isCurrent);
    years.push({ year: y, age, orv, isCurrent, isPast, isFuture });
  }

  // Rozdeľíme na 9-ročné bloky (cykly)
  const cycles: Array<typeof years> = [];
  for (let i = 0; i < years.length; i += 9) {
    cycles.push(years.slice(i, i + 9));
  }

  // Aktuálny rok pre detail
  const currentEntry = years.find(y => y.isCurrent);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-medium text-white">Histogram ORV — celý život</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            9-ročné cykly osobnej ročnej vibrácie od narodenia po vek {maxAge}.
          </p>
        </div>
        {currentEntry && (
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-500">Aktuálny rok</p>
            <p className="text-sm font-medium text-slate-800">
              {currentEntry.age}. r. života · ORV {currentEntry.orv}
            </p>
          </div>
        )}
      </div>

      {/* Aktuálny rok detail */}
      {currentEntry && orvDescriptions[currentEntry.orv] && (
        <div className={`p-3 rounded-xl border-2 mb-4 ${orvColors[currentEntry.orv].bg} ${orvColors[currentEntry.orv].border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-white border-2 ${orvColors[currentEntry.orv].border} flex items-center justify-center shrink-0`}>
              <span className={`text-2xl font-bold ${orvColors[currentEntry.orv].text}`}>{currentEntry.orv}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${orvColors[currentEntry.orv].text}`}>
                {orvDescriptions[currentEntry.orv].title}
              </p>
              <p className="text-xs text-slate-700 mt-0.5">{orvDescriptions[currentEntry.orv].theme}</p>
            </div>
          </div>
        </div>
      )}

      {/* 9-ročné cykly */}
      <div className="space-y-3">
        {cycles.map((cycle, cycleIdx) => {
          const cycleStartAge = cycleIdx * 9;
          const cycleEndAge = Math.min(cycleStartAge + 8, maxAge);
          return (
            <div key={cycleIdx}>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">
                {cycleIdx + 1}. cyklus · {cycleStartAge}–{cycleEndAge} r. života
              </p>
              <div className="grid grid-cols-9 gap-1">
                {cycle.map(y => {
                  const colors = orvColors[y.orv];
                  return (
                    <motion.div
                      key={y.year}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: cycleIdx * 0.05 + (y.age % 9) * 0.01 }}
                      className={`aspect-square rounded-md border ${colors.bg} ${colors.border} flex flex-col items-center justify-center transition-all ${
                        y.isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : y.isPast ? 'opacity-50' : ''
                      }`}
                      title={`${y.age}. rok života (${y.year}) — ORV ${y.orv} · ${orvDescriptions[y.orv]?.title || ''}`}
                    >
                      <span className={`text-[8px] ${y.isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                        {y.age}
                      </span>
                      <span className={`text-xs font-bold ${colors.text}`}>{y.orv}</span>
                    </motion.div>
                  );
                })}
                {/* Doplňme prázdne bunky ak posledný cyklus má menej ako 9 rokov */}
                {Array.from({ length: 9 - cycle.length }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
          const c = orvColors[n];
          return (
            <div key={n} className={`text-center py-1 rounded ${c.bg} ${c.border} border`}>
              <span className={`text-[10px] font-bold ${c.text}`}>{n}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
        <span>1 = nový začiatok</span>
        <span>9 = ukončenie</span>
      </div>
    </GlassCard>
  );
}
