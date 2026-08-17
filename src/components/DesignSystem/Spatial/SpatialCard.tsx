import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({ 
  children, 
  className = '',
  hover = true,
  glow = false,
  onClick
}) => {
  const { theme } = useTheme();

  const baseStyles = 'rounded-xl transition-all duration-250 cursor-default';
  
  let surfaceStyles = '';
  if (theme === 'dark') {
    surfaceStyles = 'bg-[#0A0A0A] border border-[#1A1A1A]';
  } else {
    surfaceStyles = 'bg-white border border-[#E2E8F0]';
  }

  const shadowStyles = theme === 'dark' 
    ? 'shadow hover:shadow-lg' 
    : 'shadow hover:shadow-lg';

  const glowStyles = glow 
    ? (theme === 'dark'
        ? 'hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
        : 'hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]')
    : '';

  const hoverStyles = hover 
    ? 'hover:-translate-y-1 hover:border-[#6366F1]/30' 
    : '';

  const MotionComponent = onClick ? motion.button : motion.div;

  return (
    <MotionComponent
      className={`${baseStyles} ${surfaceStyles} ${shadowStyles} ${glowStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </MotionComponent>
  );
};
