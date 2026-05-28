import { motion } from 'framer-motion';

interface MantraButtonProps {
  mantra: string;
  isPlaying: boolean;
  onToggle: () => void;
  colorHex: string;
  size?: 'sm' | 'md';
}

export function MantraButton({ mantra, isPlaying, onToggle, colorHex, size = 'md' }: MantraButtonProps) {
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-12 h-12 text-xs';

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold border-2 cursor-pointer relative`}
      style={{
        backgroundColor: `${colorHex}30`,
        borderColor: colorHex,
        color: colorHex,
        boxShadow: isPlaying ? `0 0 20px ${colorHex}80, 0 0 40px ${colorHex}40` : 'none',
      }}
      title={isPlaying ? `Stop ${mantra}` : `Play ${mantra}`}
      aria-label={isPlaying ? `Stop ${mantra} mantra` : `Play ${mantra} mantra`}
    >
      {isPlaying && (
        <motion.span
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: colorHex }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {isPlaying ? '⏸' : mantra}
    </motion.button>
  );
}
