import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

interface GridItem {
  value: number;
  isBase: boolean;
}

interface NumerologyGridProps {
  grid: GridItem[][];
  highlightPlane?: number[];
}

const NUMBER_MEANINGS: Record<number, { positive: string; negative: string; theme: string }> = {
  1: {
    theme: 'Ja, ego, začiatok',
    positive: 'Aktivita, dynamika, cieľavedomosť, samostatnosť, verbálny prejav',
    negative: 'Pýcha, panovačnosť, sebectvo, agresivita, útočnosť',
  },
  2: {
    theme: 'Intuícia, partnerstvo',
    positive: 'Trpezlivosť, citlivosť, tolerancia, spolupráca, bio energia',
    negative: 'Nerozhodnosť, náladovosť, závislosť, strachy, vnucovanie sa',
  },
  3: {
    theme: 'Kreativita, komunikácia',
    positive: 'Mentálny postreh, tvorivosť, rozmach, rast, expanzia, výkonnosť',
    negative: 'Vypočítavosť, klamstvo, nezodpovednosť, povrchnosť, arogancia',
  },
  4: {
    theme: 'Stabilita, práca',
    positive: 'Manuálna zručnosť, pracovitosť, odvaha, organizačné schopnosti',
    negative: 'Nedôverčivosť, lakomosť, lenivosť, agresivita, hystéria',
  },
  5: {
    theme: 'Sloboda, zmena',
    positive: 'Rýchlosť, pohyb, vodcovstvo, riadenie, sloboda, dobrodružstvo',
    negative: 'Napätie, nervozita, panovačnosť, nepokoj, márnotratnosť',
  },
  6: {
    theme: 'Láska, rodina, domov',
    positive: 'Vzťahy, estetické cítenie, istota, vyrovnanosť, veľkorysosť',
    negative: 'Naivita, nepriebojnosť, požívačnosť, intrigánstvo, nenávisť',
  },
  7: {
    theme: 'Duchovno, pochopenie',
    positive: 'Liečiteľské schopnosti, ústretovosť, pochopenie, láskavosť, pokora',
    negative: 'Sklony k nehodám, lakomosť, rebélia, sarkazmus, krivdy',
  },
  8: {
    theme: 'Hojnosť, moc',
    positive: 'Peniaze, obchod, spravodlivosť, logika, prosperita, nezávislosť',
    negative: 'Pomstychtivosť, chamtivosť, nadradenosť, deštruktívnosť',
  },
  9: {
    theme: 'Múdrosť, zavŕšenie',
    positive: 'Pochopenie, systém, analytické schopnosti, sila, bojovnosť',
    negative: 'Diktátorstvo, nadradenosť, hašterivosť, pokrytectvo, chaos',
  },
};

export function NumerologyGrid({ grid, highlightPlane }: NumerologyGridProps) {
  const { language } = useTranslation();
  const [selectedNum, setSelectedNum] = useState<number | null>(null);

  const gridLayout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  const selectedInfo = selectedNum ? NUMBER_MEANINGS[selectedNum] : null;
  const selectedCount = selectedNum ? (grid[selectedNum]?.length || 0) : 0;

  return (
    <div>
      <p className="text-[11px] text-indigo-600 italic text-center mb-2">
        {language === 'sk' ? '👆 Klikni na číslo pre detail (význam, počet, dar/tieň)' : '👆 Click a number for detail (meaning, count, gift/shadow)'}
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {gridLayout.map((row, rowIdx) =>
          row.map((num, colIdx) => {
            const items = grid[num] || [];
            const isHighlighted = highlightPlane?.includes(num);
            const isSelected = selectedNum === num;
            return (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (rowIdx * 3 + colIdx) * 0.05, type: 'spring' }}
                onClick={() => setSelectedNum(isSelected ? null : num)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNum(isSelected ? null : num); } }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={language === 'sk' ? `Číslo ${num}: ${items.length}× — ${NUMBER_MEANINGS[num]?.theme || ''}` : `Number ${num}: ${items.length}× — ${NUMBER_MEANINGS[num]?.theme || ''}`}
                title={`${num} — ${NUMBER_MEANINGS[num]?.theme || ''}`}
                className={`group relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : isHighlighted
                    ? 'border-amber-400 bg-amber-50'
                    : items.length > 0
                    ? 'border-indigo-200 bg-indigo-50 hover:border-indigo-300'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Mini-card hover tooltip (B32) */}
                <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap text-[10px] px-2 py-1 rounded shadow-lg" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                  {NUMBER_MEANINGS[num]?.theme || (language === 'sk' ? `Číslo ${num}` : `Number ${num}`)}
                </div>
                <span className="text-[10px] text-slate-400 mb-1">{num}</span>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {items.map((item, i) => (
                    <span
                      key={i}
                      className={`text-lg font-bold ${
                        item.isBase ? 'text-indigo-600' : 'text-rose-600'
                      }`}
                    >
                      {item.value}
                    </span>
                  ))}
                </div>
                {items.length === 0 && (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {selectedInfo && selectedNum && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-800">{language === 'sk' ? `Číslo ${selectedNum} – ${selectedInfo.theme}` : `Number ${selectedNum} – ${selectedInfo.theme}`}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {selectedCount}× {language === 'sk' ? 'v mriežke' : 'in grid'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              {selectedCount === 0 ? (language === 'sk' ? 'Absencia – oblasť na vedomý rozvoj' : 'Absence – area for conscious development') :
               selectedCount === 1 ? (language === 'sk' ? 'Prítomné, ale slabšia energia' : 'Present, but weaker energy') :
               selectedCount === 2 ? (language === 'sk' ? 'Vyvážená, silná energia' : 'Balanced, strong energy') :
               (language === 'sk' ? 'Veľmi silné – dominantná energia, pozor na tieň' : 'Very strong – dominant energy, watch for the shadow')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                <p className="text-[10px] text-green-700 uppercase mb-0.5">{language === 'sk' ? 'Pozitívne' : 'Positive'}</p>
                <p className="text-xs text-slate-700">{selectedInfo.positive}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                <p className="text-[10px] text-red-700 uppercase mb-0.5">{language === 'sk' ? 'Negatívne (stres)' : 'Negative (stress)'}</p>
                <p className="text-xs text-slate-700">{selectedInfo.negative}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
