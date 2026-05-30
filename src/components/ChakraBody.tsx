import { motion } from 'framer-motion';
import type { ChakraState } from '../engine/chakraEngine';
import { MantraButton } from './MantraButton';
import { useTranslation } from '../i18n/useTranslation';

interface ChakraBodyProps {
  chakras: ChakraState[];
  /** Aktuálne hrajúca mantra (uppercase key) — zdieľané z rodiča, aby existovala jediná audio inštancia. */
  playing: string | null;
  /** Toggle mantry — zdieľaný z rodiča (ChakrasPage). */
  onToggleMantra: (mantra: string) => void;
}

export function ChakraBody({ chakras, playing, onToggleMantra }: ChakraBodyProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {[...chakras].reverse().map((state, idx) => (
        <motion.div
          key={state.chakra.number}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-4 w-full max-w-md"
        >
          <MantraButton
            mantra={state.chakra.mantra}
            isPlaying={playing === state.chakra.mantra.toUpperCase()}
            onToggle={() => onToggleMantra(state.chakra.mantra)}
            colorHex={state.chakra.colorHex}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{state.chakra.name}</span>
                <span className="text-[10px] text-slate-400 italic">{state.chakra.sanskrit}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                state.status === 'balanced' ? 'bg-green-500/20 text-green-700' :
                state.status === 'blocked' ? 'bg-red-500/20 text-red-700' :
                'bg-yellow-500/20 text-yellow-700'
              }`}>
                {state.status === 'balanced' ? t('chakras.balanced') :
                 state.status === 'blocked' ? t('chakras.blocked') : t('chakras.hyperactive')}
              </span>
            </div>
            <div className="mt-1 h-2 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={state.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${state.chakra.name}: ${state.score}%`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.score}%` }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                className="h-full rounded-full"
                style={{ backgroundColor: state.chakra.colorHex }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
