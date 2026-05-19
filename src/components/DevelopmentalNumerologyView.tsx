import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import { developmentalMeanings, developmentalGridIntro } from '../data/developmentalMeanings';

interface Props {
  result: DevelopmentalNumerologyResult;
  /** Biologické pohlavie osoby — pre porovnanie s polaritou ega */
  gender?: 'male' | 'female';
}

export function DevelopmentalNumerologyView({ result, gender }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const layout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  const selectedMeaning = selected ? developmentalMeanings[selected] : null;
  const selectedCount = selected ? result.counts[selected] : 0;

  function getCountInterpretation(num: number, count: number): string | undefined {
    const m = developmentalMeanings[num];
    if (!m) return undefined;
    if (num === 1) {
      // Pre jednotku rozlišujeme aj párny / nepárny počet
      const parity = count > 0 ? (count % 2 === 0 ? m.parityNote?.even : m.parityNote?.odd) : undefined;
      const base =
        count === 0 ? m.byCount.none :
        count === 1 ? m.byCount.one :
        count === 2 ? m.byCount.two :
        count === 3 ? m.byCount.three :
        m.byCount.fourPlus;
      return [base, parity].filter(Boolean).join(' ');
    }
    return (
      count === 0 ? m.byCount.none :
      count === 1 ? m.byCount.one :
      count === 2 ? m.byCount.two :
      count === 3 ? m.byCount.three :
      m.byCount.fourPlus
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <p className="text-xs text-indigo-700 italic">{developmentalGridIntro}</p>
      </div>

      {/* Postup výpočtu */}
      <div className="p-4 rounded-xl glass-light">
        <h4 className="font-medium text-slate-800 mb-2">Postup výpočtu</h4>
        <div className="space-y-1 text-xs text-slate-600">
          <p>D + M (cifry dňa a mesiaca): <strong className="text-indigo-700">{result.dayMonthSum}</strong></p>
          <p>R (cifry roku{result.isPost2000 ? ', pre rok ≥ 2000: 20 + zvyšok' : ''}): <strong className="text-indigo-700">{result.yearSum}</strong></p>
        </div>
      </div>

      {/* Zakrúžkované ako karmické cykly */}
      <div>
        <h4 className="font-medium text-slate-800 mb-2">Karmické cykly (zakrúžkované čísla)</h4>
        <p className="text-xs text-slate-500 mb-3">
          Štyri zakrúžkované čísla zodpovedajú štyrom karmickým cyklom života: psychická stabilita, materiálna stabilita, životné poslanie a detské sny. Postupne sa aktivujú v životných obdobiach.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {result.circled.map((c, idx) => {
            const cycleLabels = [
              { name: 'Psychická stabilita', desc: 'Tvorba vnútornej psychickej stability a sebaobrazu.' },
              { name: 'Materiálna stabilita', desc: 'Vytváranie hmotnej a finančnej stability v živote.' },
              { name: 'Životné poslanie', desc: 'Plnenie hlavnej životnej úlohy duše.' },
              { name: 'Detské sny', desc: 'Plnenie detských snov, návrat k pôvodnej radosti.' },
            ];
            const meta = cycleLabels[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="p-3 rounded-xl bg-amber-50 border border-amber-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-amber-700 uppercase font-semibold">K{idx + 1}</p>
                  <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center bg-white">
                    <span className="text-base font-bold text-amber-700">{c.value}</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-800">{meta.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{meta.desc}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">{c.formula}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Polarita ega - zhrnutie z počtu jednotiek */}
      {result.oneCount > 0 ? (
        <div className={`p-3 rounded-xl border ${
          result.egoPolarity === 'masculine'
            ? 'bg-blue-50 border-blue-200'
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-lg ${result.egoPolarity === 'masculine' ? 'text-blue-600' : 'text-rose-500'}`}>
              {result.egoPolarity === 'masculine' ? '♂' : '♀'}
            </span>
            <p className={`font-semibold ${result.egoPolarity === 'masculine' ? 'text-blue-700' : 'text-rose-700'}`}>
              {result.egoPolarity === 'masculine' ? 'Mužské ego' : 'Ženské ego'} ({result.oneCount}× číslo 1)
            </p>
          </div>
          <p className="text-xs text-slate-700">
            {result.egoPolarity === 'masculine'
              ? 'Nepárny počet jednotiek – energia dávania, vymedzovania priestoru, ochrany, akcie a iniciatívy.'
              : 'Párny počet jednotiek – energia prijímania, otvorenia, plnenia priestoru teplom, trpezlivosti.'}
          </p>

          {/* Kontextový výklad podľa pohlavia */}
          {gender && (() => {
            const genderMatchesEgo =
              (gender === 'male' && result.egoPolarity === 'masculine') ||
              (gender === 'female' && result.egoPolarity === 'feminine');
            return (
              <div className={`mt-2 p-2 rounded-lg ${genderMatchesEgo ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className={`text-[11px] font-medium ${genderMatchesEgo ? 'text-green-700' : 'text-amber-700'}`}>
                  {genderMatchesEgo
                    ? `✓ Súlad: ${gender === 'male' ? 'muž' : 'žena'} s ${result.egoPolarity === 'masculine' ? 'mužským' : 'ženským'} egom`
                    : `⚠ Kríženie: ${gender === 'male' ? 'muž' : 'žena'} s ${result.egoPolarity === 'masculine' ? 'mužským' : 'ženským'} egom`}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {genderMatchesEgo
                    ? 'Polarita ega je v súlade s tvojim biologickým pohlavím – tvojou úlohou je rozvíjať túto prirodzenú polaritu s múdrosťou.'
                    : `Tvoje biologické pohlavie a vibrácia ega sú opačné. Životnou úlohou je vedome sa naučiť ${gender === 'male' ? 'mužský' : 'ženský'} princíp – to, čo prirodzene poznáš ${gender === 'male' ? 'zo ženského sveta' : 'z mužského sveta'}, doplniť o opačnú polaritu, aby si žil/a v plnom potenciáli.`}
                </p>
              </div>
            );
          })()}

          {!gender && (
            <p className="text-[11px] text-slate-500 italic mt-1">
              Pre presnejší výklad pridaj v profile pohlavie – ukážeme, či je polarita ega v súlade s biologickým pohlavím alebo či je tvojou úlohou naučiť sa opačnú polaritu.
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Bez čísla 1 v mriežke</strong> – veľmi slabé ego, človek sa silne vníma ako súčasť celku
            a môže mať tendenciu strácať sa v iných. Učí sa vymedziť seba.
          </p>
        </div>
      )}

      {/* Mriežka */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-slate-800">Mriežka</h4>
          <span className="text-[11px] text-indigo-600 italic">
            👆 Klikni na číslo pre detail
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {layout.map((row, rIdx) =>
            row.map((num, cIdx) => {
              const cells = result.grid[num] || [];
              const isSel = selected === num;
              return (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (rIdx * 3 + cIdx) * 0.04, type: 'spring' }}
                  onClick={() => setSelected(isSel ? null : num)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all ${
                    isSel
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : cells.length > 0
                      ? 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-300'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 mb-1">{num}</span>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {cells.map((cell, i) => (
                      <span
                        key={i}
                        title={cell.source === 'circled' ? `${cell.circledIndex}. zakrúžkované` : 'cifra dátumu'}
                        className={`text-lg font-bold ${cell.source === 'date' ? 'text-indigo-600' : 'text-amber-600'}`}
                      >
                        {cell.digit}
                      </span>
                    ))}
                  </div>
                  {cells.length === 0 && <span className="text-slate-300 text-xs">—</span>}
                </motion.div>
              );
            })
          )}
        </div>
        <div className="flex gap-4 mt-3 justify-center text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Z dátumu</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Zakrúžkované</span>
        </div>
      </div>

      {/* Vysvetlenie zvoleného políčka */}
      <AnimatePresence>
        {selectedMeaning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-800">
                {selectedMeaning.number} – {selectedMeaning.theme}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {selectedCount}× v mriežke
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">{selectedMeaning.description}</p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[10px] text-amber-700 uppercase mb-1">Interpretácia podľa počtu</p>
              <p className="text-xs text-slate-700">{getCountInterpretation(selectedMeaning.number, selectedCount)}</p>
            </div>
            {selectedMeaning.recommendation && (
              <div className="mt-2 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <p className="text-[10px] text-indigo-700 uppercase mb-1">Odporúčanie</p>
                <p className="text-xs text-slate-700">{selectedMeaning.recommendation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-[11px] text-slate-500 italic">
          Zdroj: kniha Lívia Mičková – <strong>Duchovná numerológia</strong> (a <strong>Duchovná numerológia pre deti</strong>).
        </p>
      </div>
    </div>
  );
}
