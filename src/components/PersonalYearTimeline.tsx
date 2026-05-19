import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { calculateORV } from '../engine/numerologyEngine';
import { orvDescriptions } from '../data/orvDescriptions';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  /** Koľko rokov dozadu zobraziť (default 5). */
  yearsBack?: number;
  /** Koľko rokov dopredu zobraziť (default 5). */
  yearsAhead?: number;
}

/**
 * Chronologický zoznam ORV pre roky [-yearsBack ... +yearsAhead] od dnešného roku.
 * Každý riadok obsahuje rok, vek osoby v danom roku, ORV číslo a krátky sumár.
 */
export function PersonalYearTimeline({
  birthDay,
  birthMonth,
  birthYear,
  yearsBack = 5,
  yearsAhead = 5,
}: Props) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const rows: { year: number; age: number; orv: number; isCurrent: boolean; isPast: boolean }[] = [];
  for (let y = currentYear - yearsBack; y <= currentYear + yearsAhead; y++) {
    // ORV pre rok y po narodeninách
    const orv = calculateORV(birthDay, birthMonth, y, birthMonth, birthDay);
    const age = y - birthYear;
    const isCurrent = y === currentYear || (y === currentYear - 1 && (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)));
    const isPast = y < currentYear;
    rows.push({ year: y, age, orv, isCurrent, isPast });
  }

  const orvColor: Record<number, string> = {
    1: 'bg-red-500/15 text-red-700 border-red-300',
    2: 'bg-orange-500/15 text-orange-700 border-orange-300',
    3: 'bg-yellow-500/15 text-yellow-700 border-yellow-300',
    4: 'bg-green-500/15 text-green-700 border-green-300',
    5: 'bg-cyan-500/15 text-cyan-700 border-cyan-300',
    6: 'bg-blue-500/15 text-blue-700 border-blue-300',
    7: 'bg-indigo-500/15 text-indigo-700 border-indigo-300',
    8: 'bg-purple-500/15 text-purple-700 border-purple-300',
    9: 'bg-rose-500/15 text-rose-700 border-rose-300',
  };

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Personal Year cycle — chronologická história</h3>
      <p className="text-xs text-slate-500 mb-3">
        ORV {yearsBack} rokov dozadu, súčasný rok a {yearsAhead} dopredu. Každý rok prináša inú energiu — keď viete, čo je pred vami, môžete sa pripraviť.
      </p>

      <div className="space-y-2">
        {rows.map(r => {
          const desc = orvDescriptions[r.orv];
          const colorCls = orvColor[r.orv] || 'bg-slate-500/10 text-slate-700 border-slate-300';
          return (
            <motion.div
              key={r.year}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                r.isCurrent
                  ? 'border-2 border-indigo-500 bg-indigo-500/10 shadow-md'
                  : r.isPast
                    ? 'border border-slate-200 opacity-60'
                    : 'border border-slate-200'
              }`}
            >
              <div className="text-right shrink-0 w-12">
                <p className={`text-sm font-medium ${r.isCurrent ? 'text-indigo-700' : r.isPast ? 'text-slate-500' : 'text-slate-700'}`}>
                  {r.year}
                </p>
                <p className="text-[10px] text-slate-500">{r.age}. r.</p>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shrink-0 ${colorCls}`}>
                {r.orv}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${r.isCurrent ? 'text-white' : 'text-slate-700'}`}>
                  {desc?.title || `ORV ${r.orv}`}
                  {r.isCurrent && <span className="ml-2 text-[10px] uppercase text-indigo-300">aktuálny</span>}
                </p>
                <p className="text-xs text-slate-500 truncate">{desc?.theme || ''}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 italic mt-3">
        ORV 1 = nový začiatok · 2 = trpezlivosť · 3 = tvorivosť · 4 = stabilita · 5 = zmena · 6 = láska · 7 = introspekcia · 8 = manifestácia · 9 = ukončenie.
      </p>
    </GlassCard>
  );
}
