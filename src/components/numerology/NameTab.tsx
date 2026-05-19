import { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { EnergyCard } from '../EnergyCard';
import { calculateNameNumerology } from '../../engine/nameNumerologyEngine';
import type { NameNumerologyResult } from '../../engine/nameNumerologyEngine';

export function NameTab() {
  const [nameResult, setNameResult] = useState<NameNumerologyResult | null>(null);
  const [nameInput, setNameInput] = useState('');

  return (
    <div className="space-y-4">
      <GlassCard>
        <h3 className="font-medium text-white mb-3">Numerológia mena</h3>
        <p className="text-sm text-slate-400 mb-4">Zadajte celé meno (krstné + priezvisko) pre výpočet čísla výrazu, duše a osobnosti.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (nameInput.trim()) setNameResult(calculateNameNumerology(nameInput)); }} className="flex gap-3">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Meno a priezvisko"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
          />
          <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500">
            Vypočítať
          </button>
        </form>
      </GlassCard>

      {nameResult && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnergyCard title="Číslo výrazu" value={nameResult.expressionNumber} subtitle="Celé meno – životná cesta" icon="✦" color="indigo" delay={0.1} />
            <EnergyCard title="Číslo duše" value={nameResult.soulNumber} subtitle="Samohlásky – vnútorná túžba" icon="♡" color="rose" delay={0.2} />
            <EnergyCard title="Číslo osobnosti" value={nameResult.personalityNumber} subtitle="Spoluhlásky – vonkajší prejav" icon="◎" color="cyan" delay={0.3} />
          </div>

          <GlassCard>
            <h4 className="text-sm text-slate-400 mb-3">Rozklad písmen</h4>
            <div className="flex flex-wrap gap-1">
              {nameResult.letters.map((l, i) => (
                <div key={i} className={`w-8 h-10 rounded-lg flex flex-col items-center justify-center text-xs ${l.isVowel ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'}`}>
                  <span className="text-white font-medium uppercase">{l.letter}</span>
                  <span className={`text-[10px] ${l.isVowel ? 'text-rose-300' : 'text-indigo-300'}`}>{l.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500/30"></span> Samohlásky (duša)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500/30"></span> Spoluhlásky (osobnosť)</span>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-indigo-400 uppercase mb-1">Číslo výrazu ({nameResult.expressionNumber})</p>
                <p className="text-sm text-slate-300">{nameResult.expressionDescription}</p>
              </div>
              <div>
                <p className="text-xs text-rose-400 uppercase mb-1">Číslo duše ({nameResult.soulNumber})</p>
                <p className="text-sm text-slate-300">{nameResult.soulDescription}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase mb-1">Číslo osobnosti ({nameResult.personalityNumber})</p>
                <p className="text-sm text-slate-300">{nameResult.personalityDescription}</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Hidden Passion */}
            {nameResult.hiddenPassion.number > 0 && (
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {nameResult.hiddenPassion.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-amber-400 uppercase mb-1">Hidden Passion ({nameResult.hiddenPassion.count}× v mene)</p>
                    <p className="text-sm text-slate-300">{nameResult.hiddenPassion.description}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Balance number (B4) */}
            {nameResult.balanceNumber.value > 0 && (
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {nameResult.balanceNumber.value}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-emerald-400 uppercase mb-1">Balance number ({nameResult.balanceNumber.initials})</p>
                    <p className="text-sm text-slate-300">{nameResult.balanceNumber.description}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Vyrátané z iniciál mena. Aktivuje sa v období emocionálnej krízy ako stratégia obnovy rovnováhy.</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Karmic Lessons */}
          {nameResult.karmicLessons.length > 0 && (
            <GlassCard>
              <h4 className="font-medium text-white mb-2">Karmické lekcie ({nameResult.karmicLessons.length})</h4>
              <p className="text-xs text-slate-500 mb-3">
                Čísla 1–9 ktoré v mene <strong>vôbec nie sú zastúpené</strong> — vrodené slabiny, ktoré sa duša učí v tomto živote.
              </p>
              <div className="space-y-2">
                {nameResult.karmicLessons.map(kl => (
                  <div key={kl.number} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 font-bold flex items-center justify-center shrink-0">
                        {kl.number}
                      </div>
                      <p className="text-sm text-slate-300">{kl.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Cornerstone / Capstone / First Vowel */}
          <GlassCard>
            <h4 className="font-medium text-white mb-2">Kľúčové písmená</h4>
            <p className="text-xs text-slate-500 mb-3">
              Prvé písmeno (Cornerstone) charakterizuje váš prístup k novým situáciám, posledné (Capstone) postoj k dokončovaniu, prvá samohláska okamžitú emocionálnu reakciu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nameResult.cornerstone && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-9 h-9 rounded-full bg-indigo-500/30 text-white font-serif font-bold text-lg flex items-center justify-center uppercase">{nameResult.cornerstone.letter}</span>
                    <span className="text-xs text-indigo-300 uppercase">Cornerstone ({nameResult.cornerstone.value})</span>
                  </div>
                  <p className="text-xs text-slate-300">{nameResult.cornerstone.description}</p>
                </div>
              )}
              {nameResult.capstone && (
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-9 h-9 rounded-full bg-violet-500/30 text-white font-serif font-bold text-lg flex items-center justify-center uppercase">{nameResult.capstone.letter}</span>
                    <span className="text-xs text-violet-300 uppercase">Capstone ({nameResult.capstone.value})</span>
                  </div>
                  <p className="text-xs text-slate-300">{nameResult.capstone.description}</p>
                </div>
              )}
              {nameResult.firstVowel && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-9 h-9 rounded-full bg-rose-500/30 text-white font-serif font-bold text-lg flex items-center justify-center uppercase">{nameResult.firstVowel.letter}</span>
                    <span className="text-xs text-rose-300 uppercase">Prvá samohláska ({nameResult.firstVowel.value})</span>
                  </div>
                  <p className="text-xs text-slate-300">{nameResult.firstVowel.description}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
