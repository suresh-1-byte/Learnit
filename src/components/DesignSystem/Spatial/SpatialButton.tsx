import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const SpatialButton: React.FC<SpatialButtonProps> = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const { theme } = useTheme();

  const baseStyles = 'font-semibold rounded-xl transition-all duration-250 flex items-center justify-center gap-2';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = theme === 'dark'
      ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
      : 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5';
  } else if (variant === 'secondary') {
    variantStyles = theme === 'dark'
      ? 'bg-[#14141C] border border-[#1A1A1A] text-white shadow hover:shadow-lg hover:-translate-y-0.5 hover:border-[#6366F1]/50'
      : 'bg-white border border-[#E2E8F0] text-gray-900 shadow hover:shadow-lg hover:-translate-y-0.5 hover:border-[#6366F1]/50';
  } else {
    variantStyles = theme === 'dark'
      ? 'bg-transparent text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
      : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-[rgba(0,0,0,0.05)]';
  }

  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none' 
    : '';

  return (
    <motion.button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.button>
  );
};
