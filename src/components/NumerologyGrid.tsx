import { motion } from 'framer-motion';

interface GridItem {
  value: number;
  isBase: boolean;
}

interface NumerologyGridProps {
  grid: GridItem[][];
  highlightPlane?: number[];
}

export function NumerologyGrid({ grid, highlightPlane }: NumerologyGridProps) {
  const gridLayout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {gridLayout.map((row, rowIdx) =>
        row.map((num, colIdx) => {
          const items = grid[num] || [];
          const isHighlighted = highlightPlane?.includes(num);
          return (
            <motion.div
              key={`${rowIdx}-${colIdx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (rowIdx * 3 + colIdx) * 0.05, type: 'spring' }}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${
                isHighlighted
                  ? 'border-gold bg-gold/10 glow-gold'
                  : items.length > 0
                  ? 'border-indigo-500/30 bg-indigo-500/10'
                  : 'border-slate-700/30 bg-slate-800/30'
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
  );
}
