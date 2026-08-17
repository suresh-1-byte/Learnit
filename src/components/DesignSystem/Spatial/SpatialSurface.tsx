import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialSurfaceProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  glass?: boolean;
}

export const SpatialSurface: React.FC<SpatialSurfaceProps> = ({ 
  children, 
  className = '',
  elevated = false,
  glass = false
}) => {
  const { theme } = useTheme();

  const baseStyles = 'rounded-xl transition-all duration-250';
  
  let surfaceStyles = '';
  if (glass) {
    surfaceStyles = theme === 'dark'
      ? 'bg-[rgba(13,13,20,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]'
      : 'bg-[rgba(255,255,255,0.85)] backdrop-blur-md border border-[rgba(0,0,0,0.06)]';
  } else if (elevated) {
    surfaceStyles = theme === 'dark'
      ? 'bg-[#14141C] border border-[#1A1A1A] shadow-lg'
      : 'bg-[#F8FAFC] border border-[#E2E8F0] shadow-lg';
  } else {
    surfaceStyles = theme === 'dark'
      ? 'bg-[#0D0D14] border border-[#1A1A1A] shadow'
      : 'bg-white border border-[#E2E8F0] shadow';
  }

  return (
    <div className={`${baseStyles} ${surfaceStyles} ${className}`}>
      {children}
    </div>
  );
};
