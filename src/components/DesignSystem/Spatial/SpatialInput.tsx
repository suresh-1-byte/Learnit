import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const SpatialInput: React.FC<SpatialInputProps> = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  const baseStyles = 'w-full px-4 py-2.5 rounded-xl transition-all duration-250 outline-none';
  
  let inputStyles = '';
  let focusStyles = '';
  
  if (error) {
    inputStyles = theme === 'dark'
      ? 'bg-[#111] border border-[#EF4444] text-white'
      : 'bg-[#F8FAFC] border border-[#EF4444] text-gray-900';
    focusStyles = theme === 'dark'
      ? 'focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
      : 'focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]';
  } else {
    inputStyles = theme === 'dark'
      ? 'bg-[#111] border border-[#222] text-white placeholder-[#555]'
      : 'bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 placeholder-gray-400';
    focusStyles = theme === 'dark'
      ? 'focus:border-[#6366F1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
      : 'focus:border-[#6366F1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]';
  }

  const labelStyles = theme === 'dark'
    ? 'text-[#AAA] text-xs font-semibold mb-1.5 block'
    : 'text-gray-700 text-xs font-semibold mb-1.5 block';

  const errorStyles = 'text-[#EF4444] text-xs mt-1 block';

  return (
    <div className={className}>
      {label && <label className={labelStyles}>{label}</label>}
      <input 
        className={`${baseStyles} ${inputStyles} ${focusStyles}`}
        {...props}
      />
      {error && <span className={errorStyles}>{error}</span>}
    </div>
  );
};
