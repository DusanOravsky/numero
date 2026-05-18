import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { calculateFullNumerology, reduceToSingle } from '../engine/numerologyEngine';
import { calculatePartnerCompatibility, calculateParentChild } from '../engine/compatibilityEngine';
import type { CompatibilityResult, ParentChildResult } from '../engine/compatibilityEngine';
import { motion } from 'framer-motion';

type Mode = 'partner' | 'family';

interface PersonInput {
  name: string;
  day: string;
  month: string;
  year: string;
}

const emptyPerson = (): PersonInput => ({ name: '', day: '', month: '', year: '' });

function PersonForm({ person, onChange, label }: { person: PersonInput; onChange: (p: PersonInput) => void; label: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 font-medium">{label}</p>
      <input
        type="text"
        placeholder="Meno"
        value={person.name}
        onChange={e => onChange({ ...person, name: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
      />
      <div className="flex gap-2">
        <input type="number" placeholder="Deň" min={1} max={31} value={person.day} onChange={e => onChange({ ...person, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
        <input type="number" placeholder="Mesiac" min={1} max={12} value={person.month} onChange={e => onChange({ ...person, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
        <input type="number" placeholder="Rok" min={1900} max={2100} value={person.year} onChange={e => onChange({ ...person, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
      </div>
    </div>
  );
}

function isPersonValid(p: PersonInput): boolean {
  return !!(p.name.trim() && parseInt(p.day) >= 1 && parseInt(p.month) >= 1 && parseInt(p.year) >= 1900);
}

export function RelationshipsPage() {
  const [mode, setMode] = useState<Mode>('partner');
  const [partner1, setPartner1] = useState<PersonInput>(emptyPerson());
  const [partner2, setPartner2] = useState<PersonInput>(emptyPerson());
  const [parent, setParent] = useState<PersonInput>(emptyPerson());
  const [children, setChildren] = useState<PersonInput[]>([emptyPerson()]);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [familyResults, setFamilyResults] = useState<{ child: PersonInput; result: ParentChildResult }[] | null>(null);

  const handlePartnerCalc = () => {
    if (!isPersonValid(partner1) || !isPersonValid(partner2)) return;
    const p1 = calculateFullNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
    const p2 = calculateFullNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));
    setCompatibility(calculatePartnerCompatibility(p1, p2, partner1.name, partner2.name));
  };

  const handleFamilyCalc = () => {
    if (!isPersonValid(parent)) return;
    const validChildren = children.filter(isPersonValid);
    if (validChildren.length === 0) return;

    const parentNum = calculateFullNumerology(parseInt(parent.day), parseInt(parent.month), parseInt(parent.year));
    const results = validChildren.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(parentNum, childNum) };
    });
    setFamilyResults(results);
  };

  const addChild = () => setChildren([...children, emptyPerson()]);
  const removeChild = (idx: number) => setChildren(children.filter((_, i) => i !== idx));

  const reset = () => {
    setPartner1(emptyPerson());
    setPartner2(emptyPerson());
    setParent(emptyPerson());
    setChildren([emptyPerson()]);
    setCompatibility(null);
    setFamilyResults(null);
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
          onClick={() => { setMode('family'); reset(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'family' ? 'bg-indigo-600 text-white glow' : 'glass text-slate-400'}`}
        >
          Rodič a deti
        </button>
      </div>

      {/* PARTNERSKÝ MÓD */}
      {mode === 'partner' && !compatibility && (
        <GlassCard>
          <p className="text-sm text-slate-400 mb-4">
            <strong className="text-white">Partnerský výklad</strong> porovnáva numerologické profily dvoch osôb -- životné čísla, roviny, jazyky lásky a ročné vibrácie. Výsledkom je celková kompatibilita, silné stránky a výzvy vzťahu, plus <strong className="text-rose-300">Cieľ vzťahu</strong> (súčet životných čísel = vyšší zmysel partnerstva).
          </p>
        </GlassCard>
      )}
      {mode === 'partner' && !compatibility && (
        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonForm person={partner1} onChange={setPartner1} label="Partner 1" />
            <PersonForm person={partner2} onChange={setPartner2} label="Partner 2" />
          </div>
          <button
            onClick={handlePartnerCalc}
            disabled={!isPersonValid(partner1) || !isPersonValid(partner2)}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed glow"
          >
            Vypočítať kompatibilitu
          </button>
        </GlassCard>
      )}

      {mode === 'partner' && compatibility && (
        <div className="space-y-6">
          <GlassCard glow>
            <div className="text-center">
              <p className="text-sm text-slate-400">{partner1.name} & {partner2.name}</p>
              <div className="relative w-32 h-32 mx-auto my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}`}
                    initial={{ strokeDasharray: '0 283' }}
                    animate={{ strokeDasharray: `${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs><linearGradient id="grad"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-serif font-bold text-white">{compatibility.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">Celková kompatibilita</p>
            </div>
          </GlassCard>

          {/* Cieľ vzťahu */}
          {(() => {
            const p1Num = calculateFullNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
            const p2Num = calculateFullNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));
            const relationshipGoal = reduceToSingle(p1Num.lifePathNumber + p2Num.lifePathNumber);
            const goalDescriptions: Record<number, string> = {
              1: 'Cieľom tohto vzťahu je vzájomná nezávislosť a podpora individuality. Spolu sa učíte byť silnými jednotlivcami, ktorí sa navzájom inšpirujú k vedeniu a odvaze.',
              2: 'Cieľom tohto vzťahu je harmonická spolupráca a vzájomná podpora. Učíte sa diplomacii, trpezlivosti a jemnému prepojeniu duší.',
              3: 'Cieľom tohto vzťahu je spoločná kreativita a radosť. Spolu tvoríte, komunikujete a zdieľate svoju radosť so svetom.',
              4: 'Cieľom tohto vzťahu je budovanie stabilných základov. Spolu vytvárate bezpečie, štruktúru a trvalé hodnoty pre seba aj okolie.',
              5: 'Cieľom tohto vzťahu je spoločný rast cez zmeny a nové skúsenosti. Učíte sa slobode v rámci vzťahu a adaptabilite.',
              6: 'Cieľom tohto vzťahu je bezpodmienečná láska a služba. Spolu vytvárate harmonický domov a staráte sa o seba aj komunitu.',
              7: 'Cieľom tohto vzťahu je duchovný rast a hlboké pochopenie. Spolu hľadáte pravdu, múdrosť a vnútorný pokoj.',
              8: 'Cieľom tohto vzťahu je spoločná manifestácia a budovanie hojnosti. Spolu dosahujete veľké veci v materiálnom aj duchovnom svete.',
              9: 'Cieľom tohto vzťahu je univerzálna láska a služba ľudstvu. Spolu sa učíte odpúšťať, púšťať a slúžiť vyššiemu dobru.',
            };
            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-2">Cieľ vzťahu</h3>
                <p className="text-xs text-slate-400 mb-3">Cieľ vzťahu = súčet životných čísel oboch partnerov, redukovaný na jednociferné číslo. Ukazuje vyšší zmysel a spoločnú lekciu vášho vzťahu.</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">ŽČ({partner1.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{p1Num.lifePathNumber}</span>
                  </div>
                  <span className="text-slate-500">+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">ŽČ({partner2.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{p2Num.lifePathNumber}</span>
                  </div>
                  <span className="text-slate-500">=</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <span className="text-lg font-serif font-bold text-white">{relationshipGoal}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">{goalDescriptions[relationshipGoal]}</p>
              </GlassCard>
            );
          })()}

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
              <h3 className="font-medium text-white mb-3">Silné stránky</h3>
              {compatibility.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1"><span className="text-green-400">+</span><span className="text-sm text-slate-300">{s}</span></div>
              ))}
            </GlassCard>
          )}

          {compatibility.challenges.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Výzvy</h3>
              {compatibility.challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1"><span className="text-amber-400">!</span><span className="text-sm text-slate-300">{c}</span></div>
              ))}
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Odporúčania</h3>
            {compatibility.recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-2 mb-1"><span className="text-indigo-400">→</span><span className="text-sm text-slate-300">{r}</span></div>
            ))}
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Rituály pre pár</h3>
            {compatibility.rituals.map((r, i) => (
              <div key={i} className="flex items-start gap-2 mb-1"><span className="text-rose-400">♡</span><span className="text-sm text-slate-300">{r}</span></div>
            ))}
          </GlassCard>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm glass text-slate-400 hover:text-white">Nový výpočet</button>
        </div>
      )}

      {/* RODINNÝ MÓD */}
      {mode === 'family' && !familyResults && (
        <div className="space-y-4">
          <GlassCard>
            <PersonForm person={parent} onChange={setParent} label="Rodič" />
          </GlassCard>

          {children.map((child, idx) => (
            <GlassCard key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Dieťa {idx + 1}</span>
                {children.length > 1 && (
                  <button onClick={() => removeChild(idx)} className="text-xs text-red-400 hover:text-red-300">Odstrániť</button>
                )}
              </div>
              <PersonForm person={child} onChange={(p) => { const next = [...children]; next[idx] = p; setChildren(next); }} label="" />
            </GlassCard>
          ))}

          <button
            onClick={addChild}
            className="w-full py-3 rounded-xl border border-dashed border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-500/10"
          >
            + Pridať ďalšie dieťa
          </button>

          <button
            onClick={handleFamilyCalc}
            disabled={!isPersonValid(parent) || !children.some(isPersonValid)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed glow"
          >
            Vypočítať kompatibilitu
          </button>
        </div>
      )}

      {mode === 'family' && familyResults && (
        <div className="space-y-6">
          <p className="text-sm text-slate-400">Rodič: <span className="text-white font-medium">{parent.name}</span></p>

          {familyResults.map(({ child, result }, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">{child.name}</h3>
                  <span className="text-lg font-serif font-bold text-indigo-300">{result.compatibility}%</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Rola rodiča</p>
                    <p className="text-sm text-slate-300">{result.parentRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Komunikácia</p>
                    <p className="text-sm text-slate-300">{result.communicationStyle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Emocionálne potreby</p>
                    {result.emotionalNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-cyan-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Potreby dieťaťa</p>
                    {result.childNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-purple-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Odporúčania</p>
                    {result.recommendations.map((r, i) => (
                      <p key={i} className="text-xs text-indigo-300">→ {r}</p>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {familyResults.length > 1 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Interakcie medzi deťmi</h3>
              {familyResults.map(({ child: c1 }, i) =>
                familyResults.slice(i + 1).map(({ child: c2 }, j) => {
                  const n1 = calculateFullNumerology(parseInt(c1.day), parseInt(c1.month), parseInt(c1.year));
                  const n2 = calculateFullNumerology(parseInt(c2.day), parseInt(c2.month), parseInt(c2.year));
                  const compat = calculatePartnerCompatibility(n1, n2, c1.name, c2.name);
                  return (
                    <div key={`${i}-${j}`} className="p-3 rounded-xl glass-light mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{c1.name} & {c2.name}</span>
                        <span className="text-sm font-bold text-indigo-300">{compat.overallScore}%</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{compat.lifePathCompatibility.description}</p>
                      {compat.strengths.length > 0 && <p className="text-xs text-green-300 mt-1">+ {compat.strengths[0]}</p>}
                      {compat.challenges.length > 0 && <p className="text-xs text-amber-300 mt-1">! {compat.challenges[0]}</p>}
                    </div>
                  );
                })
              )}
            </GlassCard>
          )}

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm glass text-slate-400 hover:text-white">Nový výpočet</button>
        </div>
      )}
    </div>
  );
}
