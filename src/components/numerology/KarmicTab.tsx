import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import { getCycleVibrationDescription } from '../../data/planetSignDescriptions';
import { getCosmicAgeDescription } from '../../data/orvDescriptions';
import { useTranslation } from '../../i18n/useTranslation';

interface KarmicTabProps {
  result: NumerologyResult;
}

export function KarmicTab({ result }: KarmicTabProps) {
  const { language } = useTranslation();
  return (
    <div className="space-y-4">
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Karmické trojuholníky' : 'Karmic Triangles'}</h3>
        <p className="text-sm text-slate-400 mb-2">
          {language === 'sk'
            ? 'Karmické trojuholníky udávajú životné smerovanie na obdobie 9 rokov. Čísla vo vrcholoch vyjadrujú vplyv, smerovanie a charakter obdobia daného cyklu. Život sa delí na Duchovné detstvo (príprava) a Duchovnú dospelosť (realizácia).'
            : 'Karmic triangles indicate life direction for a period of 9 years. Numbers at the vertices express the influence, direction and character of the given cycle period. Life is divided into Spiritual Childhood (preparation) and Spiritual Maturity (realization).'}
        </p>
        <p className="text-[11px] text-slate-500 italic mb-4">
          {language === 'sk'
            ? 'Zdroj: Robin Steinová – Numerológia: Čísla Lásky'
            : 'Source: Robin Steinová – Numerology: Numbers of Love'}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-300">{language === 'sk' ? 'VDD = 36 − ŽČ' : 'ASM = 36 − LP'}</p>
            <p className="text-lg font-bold text-white">{result.vdd} {language === 'sk' ? 'rokov' : 'years'}</p>
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Vek duchovnej dospelosti' : 'Age of Spiritual Maturity'}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-purple-300">{language === 'sk' ? 'ODD = VDD ÷ 3' : 'SCP = ASM ÷ 3'}</p>
            <p className="text-lg font-bold text-white">{result.oddPeriod} {language === 'sk' ? 'rokov' : 'years'}</p>
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Obdobie duch. detstva (1 cyklus)' : 'Spiritual childhood period (1 cycle)'}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-amber-700 font-medium mb-3">{language === 'sk' ? 'Duchovné detstvo' : 'Spiritual Childhood'}</h4>
        <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Obdobie, ktoré pripravuje človeka na plnenie životných úloh. Doplnkové čísla (D, M, R) určujú, pod akou vibráciou sa človek vyvíja.' : 'A period that prepares a person for fulfilling life tasks. Supplementary numbers (D, M, Y) determine under which vibration a person develops.'}</p>
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
                <span className="text-xs text-amber-700">{t.fromAge}–{t.toAge} {language === 'sk' ? 'r.' : 'y.'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-amber-700">{t.vibration}</span>
                <span className="text-xs text-slate-600">({t.influence})</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{t.description}</p>
              {getCycleVibrationDescription(t.vibration, language) && (
                <p className="text-xs text-slate-600 mt-1 italic">{getCycleVibrationDescription(t.vibration, language)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-green-700 font-medium mb-3">{language === 'sk' ? 'Duchovná dospelosť (K1–K4)' : 'Spiritual Maturity (K1–K4)'}</h4>
        <p className="text-xs text-slate-500 mb-3">{language === 'sk' ? 'Deväťročné cykly od veku duchovnej dospelosti. Prinášajú zmeny v energii, vzťahoch, zdraví a profesii.' : 'Nine-year cycles from the age of spiritual maturity. They bring changes in energy, relationships, health and profession.'}</p>
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
                <span className="text-xs text-green-700">{t.fromAge}–{t.toAge ? t.toAge + (language === 'sk' ? ' r.' : ' y.') : '∞'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-700">{t.vibration}</span>
                <span className="text-xs text-slate-600">({t.influence})</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{t.description}</p>
              {getCycleVibrationDescription(t.vibration, language) && (
                <p className="text-xs text-slate-600 mt-1 italic">{getCycleVibrationDescription(t.vibration, language)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Pinnacles - 4 životné vrcholy */}
      <GlassCard>
        <h4 className="text-sm text-indigo-700 font-medium mb-2">{language === 'sk' ? 'Pinnacles – 4 životné vrcholy' : 'Pinnacles – 4 Life Peaks'}</h4>
        <p className="text-xs text-slate-500 mb-3">
          {language === 'sk'
            ? 'Pinnacles sú 4 hlavné životné cykly Pythagorovej numerológie. Každý prináša inú tému a trvá určitý počet rokov. Ukazujú, aká kvalita energie vás obklopuje v danom období.'
            : 'Pinnacles are 4 major life cycles of Pythagorean numerology. Each brings a different theme and lasts a certain number of years. They show what quality of energy surrounds you in a given period.'}
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
                  {language === 'sk' ? `${idx + 1}. vrchol` : `${idx + 1}. peak`} – {p.theme}
                </span>
                <span className="text-xs text-indigo-700">
                  {p.fromAge}–{p.toAge !== null ? p.toAge + (language === 'sk' ? ' r.' : ' y.') : '∞'}
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
        <h4 className="text-sm text-rose-700 font-medium mb-2">{language === 'sk' ? 'Challenges – 4 životné výzvy' : 'Challenges – 4 Life Challenges'}</h4>
        <p className="text-xs text-slate-500 mb-3">
          {language === 'sk'
            ? 'Challenges sú 4 hlavné výzvy, ktoré človek prekonáva. Tretia (hlavná) výzva je celoživotná a najdôležitejšia — je to vaša centrálna lekcia. Ostatné tri prichádzajú v súbehu s pinnacle obdobiami.'
            : 'Challenges are 4 main challenges a person overcomes. The third (main) challenge is lifelong and the most important — it is your central lesson. The other three come in parallel with pinnacle periods.'}
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
                    {isMain
                      ? (language === 'sk' ? 'Hlavná (celoživotná) výzva' : 'Main (lifelong) challenge')
                      : (language === 'sk' ? `${idx + 1}. výzva` : `${idx + 1}. challenge`)} – {c.theme}
                  </span>
                  <span className="text-xs text-rose-700">
                    {c.fromAge}–{c.toAge !== null ? c.toAge + (language === 'sk' ? ' r.' : ' y.') : '∞'}
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
          {language === 'sk'
            ? 'Výzva 0 znamená univerzálnu slobodu — žiadna jediná oblasť nedominuje, máte plnú zodpovednosť za vlastné voľby.'
            : 'Challenge 0 means universal freedom — no single area dominates, you have full responsibility for your own choices.'}
        </p>
      </GlassCard>

      {/* Karmické dlhy 13/14/16/19 + bonusové čísla (B2/B3) */}
      <GlassCard>
        <h4 className="text-sm text-amber-300 font-medium mb-2">{language === 'sk' ? 'Karmické dlhy a bonusové čísla' : 'Karmic Debts and Bonus Numbers'}</h4>
        <p className="text-xs text-slate-400 mb-3">
          {language === 'sk'
            ? 'Karmický dlh sa objavuje, keď v dátume narodenia alebo v jednej zo súm vzniká číslo 13, 14, 16 alebo 19. Tieto čísla nesú špecifickú lekciu z minulých inkarnácií, ktorú duša musí v tomto živote vyriešiť.'
            : 'A karmic debt appears when the number 13, 14, 16 or 19 arises in the birth date or in one of the sums. These numbers carry a specific lesson from past incarnations that the soul must resolve in this life.'}
        </p>
        {result.karmicDebts.length === 0 ? (
          <p className="text-sm text-emerald-700 font-medium">
            {language === 'sk'
              ? '✓ Žiadny karmický dlh — toto narodenie nenesie 13/14/16/19 v hlavných sumách.'
              : '✓ No karmic debt — this birth does not carry 13/14/16/19 in the main sums.'}
          </p>
        ) : (
          <div className="space-y-2">
            {result.karmicDebts.map((kd, i) => (
              <div key={`${kd.number}-${kd.source}-${i}`} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-9 h-9 rounded-full bg-amber-500/30 text-amber-100 font-bold flex items-center justify-center">{kd.number}</span>
                  <span className="text-sm font-medium text-amber-700">{language === 'sk' ? `→ redukuje sa na ${kd.reducesTo}` : `→ reduces to ${kd.reducesTo}`}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {language === 'sk'
                      ? (kd.source === 'lifePath' ? 'v ŽČ from-suma' : kd.source === 'birthDay' ? 'v dni narodenia' : 'v pinnacle súčte')
                      : (kd.source === 'lifePath' ? 'in LP from-sum' : kd.source === 'birthDay' ? 'in birth day' : 'in pinnacle sum')}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700">{kd.theme}</p>
                <p className="text-xs text-slate-600 mt-1">{kd.description}</p>
                <p className="text-xs text-amber-700 mt-1"><strong>{language === 'sk' ? 'Lekcia:' : 'Lesson:'}</strong> {kd.lesson}</p>
              </div>
            ))}
          </div>
        )}

        {/* Číslo zrelosti + Číslo dňa narodenia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-indigo-500/30 text-indigo-100 font-bold flex items-center justify-center">{result.maturityNumber}</span>
              <p className="text-xs text-indigo-300 uppercase font-semibold">{language === 'sk' ? 'Číslo zrelosti' : 'Maturity Number'}</p>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'sk'
                ? `Energia, ktorá sa „zapína" okolo 35–40. roku života. Kombinácia životného čísla a dňa narodenia (${result.lifePathNumber} + ${result.birthdayNumber > 9 ? `redukcia(${result.birthdayNumber})` : result.birthdayNumber} = ${result.maturityNumber}). Ukazuje, aký dar a smerovanie pribúda s vekom — čo dozrieva v druhej polovici života.`
                : `Energy that "activates" around age 35–40. A combination of the life path number and birth day (${result.lifePathNumber} + ${result.birthdayNumber > 9 ? `reduction(${result.birthdayNumber})` : result.birthdayNumber} = ${result.maturityNumber}). Shows what gift and direction grows with age — what matures in the second half of life.`}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-violet-500/30 text-violet-100 font-bold flex items-center justify-center">{result.birthdayNumber}</span>
              <p className="text-xs text-violet-300 uppercase font-semibold">{language === 'sk' ? 'Číslo dňa narodenia' : 'Birthday Number'}</p>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'sk'
                ? `Deň ${result.birthdayNumber}. — vrodený talent, s ktorým prichádzate na svet. Na rozdiel od životného čísla sa neredukuje. Je to vaša „špeciálna zručnosť" — niečo, čo vám ide prirodzene bez učenia.`
                : `Day ${result.birthdayNumber} — an innate talent you bring into the world. Unlike the life path number, it is not reduced. It is your "special skill" — something that comes naturally to you without learning.`}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-sm text-cyan-300 font-medium mb-2">{language === 'sk' ? 'ΣT – Suma tarotu (Tarotové brány)' : 'ΣT – Tarot Sum (Tarot Gates)'}</h4>
        <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Suma tarotu = súčet celého dátumu narodenia (deň + mesiac + rok bez redukcie). Určuje kozmický vek – aká kolektívna energia vás sprevádzala pri narodení.' : 'Tarot sum = sum of the entire birth date (day + month + year without reduction). Determines the cosmic age — what collective energy accompanied you at birth.'}</p>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400">{language === 'sk' ? 'ΣT = D + M + R' : 'ΣT = D + M + Y'}</p>
            <p className="text-2xl font-bold text-white">{result.sigmaT}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${result.age === 'aquarius' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
            {result.age === 'aquarius'
              ? (language === 'sk' ? 'Vek Vodnára (≥ 2000)' : 'Age of Aquarius (≥ 2000)')
              : (language === 'sk' ? 'Vek Rýb (< 2000)' : 'Age of Pisces (< 2000)')}
          </div>
        </div>
        {(() => {
          const ageInfo = getCosmicAgeDescription(result.age, language);
          return ageInfo ? (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-800">{ageInfo.title}</p>
              <p className="text-xs text-slate-600">{ageInfo.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-lg bg-white">
                  <p className="text-[10px] text-indigo-600 uppercase">{language === 'sk' ? 'Vlastnosti' : 'Traits'}</p>
                  <p className="text-xs text-slate-600">{ageInfo.traits}</p>
                </div>
                <div className="p-2 rounded-lg bg-white">
                  <p className="text-[10px] text-rose-600 uppercase">{language === 'sk' ? 'Vzťahy' : 'Relationships'}</p>
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
