import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import { cycleVibrationDescriptions } from '../../data/planetSignDescriptions';
import { cosmicAgeDescriptions } from '../../data/orvDescriptions';

interface KarmicTabProps {
  result: NumerologyResult;
}

export function KarmicTab({ result }: KarmicTabProps) {
  return (
    <div className="space-y-4">
      <GlassCard>
        <h3 className="font-medium text-white mb-2">Karmické trojuholníky</h3>
        <p className="text-sm text-slate-400 mb-2">
          Karmické trojuholníky udávajú životné smerovanie na obdobie 9 rokov. Čísla vo vrcholoch vyjadrujú vplyv, smerovanie a charakter obdobia daného cyklu. Život sa delí na Duchovné detstvo (príprava) a Duchovnú dospelosť (realizácia).
        </p>
        <p className="text-[11px] text-slate-500 italic mb-4">
          Zdroj: Robin Steinová – Numerológia: Čísla Lásky
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-300">VDD = 36 − ŽČ</p>
            <p className="text-lg font-bold text-white">{result.vdd} rokov</p>
            <p className="text-xs text-slate-400">Vek duchovnej dospelosti</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-purple-300">ODD = VDD ÷ 3</p>
            <p className="text-lg font-bold text-white">{result.oddPeriod} rokov</p>
            <p className="text-xs text-slate-400">Obdobie duch. detstva (1 cyklus)</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-amber-700 font-medium mb-3">Duchovné detstvo</h4>
        <p className="text-xs text-slate-500 mb-3">Obdobie, ktoré pripravuje človeka na plnenie životných úloh. Doplnkové čísla (D, M, R) určujú, pod akou vibráciou sa človek vyvíja.</p>
        <div className="space-y-2">
          {result.karmicTriangles.slice(0, 3).map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-xl bg-amber-50 border border-amber-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-800">{t.label}</span>
                <span className="text-xs text-amber-700">{t.fromAge}–{t.toAge} r.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-amber-700">{t.vibration}</span>
                <span className="text-xs text-slate-600">({t.influence})</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{t.description}</p>
              {cycleVibrationDescriptions[t.vibration] && (
                <p className="text-xs text-slate-600 mt-1 italic">{cycleVibrationDescriptions[t.vibration]}</p>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-green-700 font-medium mb-3">Duchovná dospelosť (K1–K4)</h4>
        <p className="text-xs text-slate-500 mb-3">Deväťročné cykly od veku duchovnej dospelosti. Prinášajú zmeny v energii, vzťahoch, zdraví a profesii.</p>
        <div className="space-y-2">
          {result.karmicTriangles.slice(3).map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-xl bg-green-50 border border-green-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-800">{t.label}</span>
                <span className="text-xs text-green-700">{t.fromAge}–{t.toAge ? t.toAge + ' r.' : '∞'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-700">{t.vibration}</span>
                <span className="text-xs text-slate-600">({t.influence})</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{t.description}</p>
              {cycleVibrationDescriptions[t.vibration] && (
                <p className="text-xs text-slate-600 mt-1 italic">{cycleVibrationDescriptions[t.vibration]}</p>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Pinnacles - 4 životné vrcholy */}
      <GlassCard>
        <h4 className="text-sm text-indigo-700 font-medium mb-2">Pinnacles – 4 životné vrcholy</h4>
        <p className="text-xs text-slate-500 mb-3">
          Pinnacles sú 4 hlavné životné cykly Pythagorovej numerológie. Každý prináša inú tému a trvá určitý počet rokov. Ukazujú, aká kvalita energie vás obklopuje v danom období.
        </p>
        <div className="space-y-2">
          {result.pinnacles.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-3 rounded-xl bg-indigo-50 border border-indigo-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-800">
                  {idx + 1}. vrchol – {p.theme}
                </span>
                <span className="text-xs text-indigo-700">
                  {p.fromAge}–{p.toAge !== null ? p.toAge + ' r.' : '∞'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-indigo-700">{p.number}</span>
                <span className="text-[11px] text-slate-500">{p.formula}</span>
              </div>
              <p className="text-xs text-slate-700">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Challenges - 4 životné výzvy */}
      <GlassCard>
        <h4 className="text-sm text-rose-700 font-medium mb-2">Challenges – 4 životné výzvy</h4>
        <p className="text-xs text-slate-500 mb-3">
          Challenges sú 4 hlavné výzvy, ktoré človek prekonáva. Tretia (hlavná) výzva je celoživotná a najdôležitejšia — je to vaša centrálna lekcia. Ostatné tri prichádzajú v súbehu s pinnacle obdobiami.
        </p>
        <div className="space-y-2">
          {result.challenges.map((c, idx) => {
            const isMain = idx === 2;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-3 rounded-xl border ${isMain ? 'bg-rose-100 border-rose-300' : 'bg-rose-50 border-rose-200'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    {isMain ? 'Hlavná (celoživotná) výzva' : `${idx + 1}. výzva`} – {c.theme}
                  </span>
                  <span className="text-xs text-rose-700">
                    {c.fromAge}–{c.toAge !== null ? c.toAge + ' r.' : '∞'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-rose-700">{c.number}</span>
                  <span className="text-[11px] text-slate-500">{c.formula}</span>
                </div>
                <p className="text-xs text-slate-700">{c.description}</p>
              </motion.div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 italic mt-3">
          Výzva 0 znamená univerzálnu slobodu — žiadna jediná oblasť nedominuje, máte plnú zodpovednosť za vlastné voľby.
        </p>
      </GlassCard>

      {/* Karmické dlhy 13/14/16/19 + bonusové čísla (B2/B3) */}
      <GlassCard>
        <h4 className="text-sm text-amber-300 font-medium mb-2">Karmické dlhy a bonusové čísla</h4>
        <p className="text-xs text-slate-400 mb-3">
          Karmický dlh sa objavuje, keď v dátume narodenia alebo v jednej zo súm vzniká číslo 13, 14, 16 alebo 19.
          Tieto čísla nesú špecifickú lekciu z minulých inkarnácií, ktorú duša musí v tomto živote vyriešiť.
        </p>
        {result.karmicDebts.length === 0 ? (
          <p className="text-sm text-emerald-700 font-medium">
            ✓ Žiadny karmický dlh — toto narodenie nenesie 13/14/16/19 v hlavných sumách.
          </p>
        ) : (
          <div className="space-y-2">
            {result.karmicDebts.map((kd, i) => (
              <div key={`${kd.number}-${kd.source}-${i}`} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-9 h-9 rounded-full bg-amber-500/30 text-amber-100 font-bold flex items-center justify-center">{kd.number}</span>
                  <span className="text-sm font-medium text-amber-700">→ redukuje sa na {kd.reducesTo}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {kd.source === 'lifePath' ? 'v ŽČ from-suma' : kd.source === 'birthDay' ? 'v dni narodenia' : 'v pinnacle súčte'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700">{kd.theme}</p>
                <p className="text-xs text-slate-600 mt-1">{kd.description}</p>
                <p className="text-xs text-amber-700 mt-1"><strong>Lekcia:</strong> {kd.lesson}</p>
              </div>
            ))}
          </div>
        )}

        {/* Maturity + Birthday number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-indigo-500/30 text-indigo-100 font-bold flex items-center justify-center">{result.maturityNumber}</span>
              <p className="text-xs text-indigo-300 uppercase font-semibold">Maturity number</p>
            </div>
            <p className="text-xs text-slate-600">
              ŽČ + redukcia dňa narodenia. Ukazuje, akú zrelosť a dar prinášate v druhej polovici života
              (zvyčajne sa aktivuje okolo veku 35–40 rokov).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-violet-500/30 text-violet-100 font-bold flex items-center justify-center">{result.birthdayNumber}</span>
              <p className="text-xs text-violet-300 uppercase font-semibold">Birthday number</p>
            </div>
            <p className="text-xs text-slate-600">
              Konkrétny deň v mesiaci kedy ste sa narodili. Vyjadruje vrodené talenty a unikátne dary,
              ktoré sú vám dané "darom".
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-cyan-300 font-medium mb-2">ΣT – Suma tarotu (Tarotové brány)</h4>
        <p className="text-xs text-slate-400 mb-3">Suma tarotu = súčet celého dátumu narodenia (deň + mesiac + rok bez redukcie). Určuje kozmický vek – aká kolektívna energia vás sprevádzala pri narodení.</p>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400">ΣT = D + M + R</p>
            <p className="text-2xl font-bold text-white">{result.sigmaT}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${result.age === 'aquarius' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
            {result.age === 'aquarius' ? 'Vek Vodnára (≥ 2000)' : 'Vek Rýb (< 2000)'}
          </div>
        </div>
        {(() => {
          const ageInfo = cosmicAgeDescriptions[result.age];
          return ageInfo ? (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-800">{ageInfo.title}</p>
              <p className="text-xs text-slate-600">{ageInfo.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-lg bg-white">
                  <p className="text-[10px] text-indigo-600 uppercase">Vlastnosti</p>
                  <p className="text-xs text-slate-600">{ageInfo.traits}</p>
                </div>
                <div className="p-2 rounded-lg bg-white">
                  <p className="text-[10px] text-rose-600 uppercase">Vzťahy</p>
                  <p className="text-xs text-slate-600">{ageInfo.relationship}</p>
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </GlassCard>
    </div>
  );
}
