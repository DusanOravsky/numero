import { memo } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const GlassCard = memo(function GlassCard({ children, className = '', glow = false, animate = true, delay = 0, onClick }: GlassCardProps) {
  const Component = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  } : {};

  return (
    <Component
      className={`glass rounded-2xl p-6 ${glow ? 'glow' : ''} ${onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''} ${className}`}
      onClick={onClick}
      {...animateProps}
    >
      {children}
    </Component>
  );
});
