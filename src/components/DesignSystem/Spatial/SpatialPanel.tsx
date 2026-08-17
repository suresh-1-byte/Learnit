import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialPanelProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const SpatialPanel: React.FC<SpatialPanelProps> = ({ 
  children, 
  className = '',
  glass = false
}) => {
  const { theme } = useTheme();

  const baseStyles = 'rounded-2xl transition-all duration-250';
  
  let panelStyles = '';
  if (glass) {
    panelStyles = theme === 'dark'
      ? 'bg-[rgba(13,13,20,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-xl'
      : 'bg-[rgba(255,255,255,0.95)] backdrop-blur-xl border border-[rgba(0,0,0,0.06)] shadow-xl';
  } else {
    panelStyles = theme === 'dark'
      ? 'bg-[#0D0D14] border border-[#1A1A1A] shadow-xl'
      : 'bg-white border border-[#E2E8F0] shadow-xl';
  }

  return (
    <div className={`${baseStyles} ${panelStyles} ${className}`}>
      {children}
    </div>
  );
};
