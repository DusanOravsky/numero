import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import type { NumerologyResult } from '../engine/numerologyEngine';
import { loveLanguageDescriptions, loveLanguageScoringExplanation } from '../data/orvDescriptions';

interface Props {
  numerology: NumerologyResult;
  /** kompaktný režim – menej textu, vhodné do dashboardu */
  compact?: boolean;
  /** voliteľný titulok – default: "Vaše jazyky lásky" */
  title?: string;
}

export function LoveLanguagesCard({ numerology, compact = false, title }: Props) {
  const langs = numerology.loveLanguages;
  if (!langs || langs.length === 0) return null;

  const top = langs[0];
  const topInfo = top ? loveLanguageDescriptions[top.language] : undefined;

  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-white">{title ?? 'Jazyky lásky'}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Čo najhlbšie prijímate ako prejav lásky (numerologický profil).
          </p>
        </div>
        <span className="text-xl text-rose-400">♡</span>
      </div>

      {/* Primárny jazyk – výrazne */}
      {top && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold">
              Primárny jazyk
            </span>
            <span className="text-xs text-rose-700">{top.score} bodov</span>
          </div>
          <p className="font-medium text-slate-800 text-base">{top.language}</p>
          {topInfo && (
            <>
              <p className="text-xs text-slate-600 mt-1.5">{topInfo.description}</p>
              {!compact && (
                <>
                  <p className="text-xs text-slate-500 mt-1.5">
                    <strong className="text-slate-700">Príklady:</strong> {topInfo.examples}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong className="text-rose-700">Ako prejaviť:</strong> {topInfo.howToShow}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Rebríček všetkých jazykov */}
      <div className="space-y-2">
        {langs.map((lang, idx) => {
          // Mapovanie -5..15 → 0..100 % šírka pruhu
          const widthPct = Math.max(0, Math.min(100, (lang.score + 5) * 8));
          const isPrimary = idx === 0;
          return (
            <motion.div
              key={lang.language}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={isPrimary ? 'text-slate-800 font-medium' : 'text-slate-600'}>
                  {idx + 1}. {lang.language}
                </span>
                <span className="text-slate-500">{lang.score}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.6 }}
                  className={`h-full rounded-full ${
                    isPrimary
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                      : 'bg-gradient-to-r from-indigo-400 to-violet-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {!compact && (
        <details className="mt-3">
          <summary className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800 select-none">
            Ako sa skóre vypočítava?
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p>{loveLanguageScoringExplanation}</p>
            <p>
              <strong>Krátko:</strong> každý jazyk lásky zodpovedá určitej numerologickej rovine
              (napr. „Slová uistenia" = rovina 3-6-9 Empatia, „Kvalitný čas" = 2-5-8 Vášeň,
              „Skutky služby" = 1-4-7 Zručnosti + 4-5-6 Vytrvalosť, „Fyzický dotyk" = 7-8-9 Energia,
              „Obdarovávanie" = 2-6-8). Skóre rastie, ak sú čísla z týchto rovín v mriežke,
              klesá pri prázdnych alebo izolovaných číslach.
            </p>
            <p className="text-slate-500 italic">
              Záporné skóre neznamená neschopnosť — len to, že daný jazyk vyžaduje vedomé úsilie.
            </p>
          </div>
        </details>
      )}
    </GlassCard>
  );
}
