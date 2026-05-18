import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const COUNT_MEANINGS: Record<number, Record<number, string>> = {
  0: { 1: 'Absencia – treba vedome rozvíjať', 2: 'Absencia – treba vedome rozvíjať', 3: 'Absencia – treba vedome rozvíjať', 4: 'Absencia – treba vedome rozvíjať', 5: 'Absencia – treba vedome rozvíjať', 6: 'Absencia – treba vedome rozvíjať', 7: 'Absencia – treba vedome rozvíjať', 8: 'Absencia – treba vedome rozvíjať', 9: 'Absencia – treba vedome rozvíjať' },
  1: { 1: 'Prítomné, ale slabšie', 2: 'Prítomné, ale slabšie', 3: 'Prítomné, ale slabšie', 4: 'Prítomné, ale slabšie', 5: 'Prítomné, ale slabšie', 6: 'Prítomné, ale slabšie', 7: 'Prítomné, ale slabšie', 8: 'Prítomné, ale slabšie', 9: 'Prítomné, ale slabšie' },
  2: { 1: 'Vyvážené, silná energia', 2: 'Vyvážené, silná energia', 3: 'Vyvážené, silná energia', 4: 'Vyvážené, silná energia', 5: 'Vyvážené, silná energia', 6: 'Vyvážené, silná energia', 7: 'Vyvážené, silná energia', 8: 'Vyvážené, silná energia', 9: 'Vyvážené, silná energia' },
  3: { 1: 'Veľmi silné – dominantná energia', 2: 'Veľmi silné – dominantná energia', 3: 'Veľmi silné – dominantná energia', 4: 'Veľmi silné – dominantná energia', 5: 'Veľmi silné – dominantná energia', 6: 'Veľmi silné – dominantná energia', 7: 'Veľmi silné – dominantná energia', 8: 'Veľmi silné – dominantná energia', 9: 'Veľmi silné – dominantná energia' },
};

export function NumerologyGrid({ grid, highlightPlane }: NumerologyGridProps) {
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
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-400/50'
                    : isHighlighted
                    ? 'border-gold bg-gold/10 glow-gold'
                    : items.length > 0
                    ? 'border-indigo-500/30 bg-indigo-500/10 hover:border-indigo-400/50'
                    : 'border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50'
                }`}
              >
                <span className="text-[10px] text-slate-500 mb-1">{num}</span>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {items.map((item, i) => (
                    <span
                      key={i}
                      className={`text-lg font-bold ${
                        item.isBase ? 'text-blue-400' : 'text-rose-400'
                      }`}
                    >
                      {item.value}
                    </span>
                  ))}
                </div>
                {items.length === 0 && (
                  <span className="text-slate-600 text-xs">—</span>
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
            className="mt-4 p-4 rounded-xl bg-[#1a1545] border border-indigo-500/20 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">Číslo {selectedNum} – {selectedInfo.theme}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                {selectedCount}× v mriežke
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {selectedCount === 0 ? 'Absencia – oblasť na vedomý rozvoj' :
               selectedCount === 1 ? 'Prítomné, ale slabšia energia' :
               selectedCount === 2 ? 'Vyvážená, silná energia' :
               'Veľmi silné – dominantná energia, pozor na tieň'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <p className="text-[10px] text-green-400 uppercase mb-0.5">Pozitívne</p>
                <p className="text-xs text-slate-300">{selectedInfo.positive}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <p className="text-[10px] text-red-400 uppercase mb-0.5">Negatívne (stres)</p>
                <p className="text-xs text-slate-300">{selectedInfo.negative}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
