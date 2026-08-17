import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SpatialBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const SpatialBackground: React.FC<SpatialBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`spatial-background min-h-screen ${className}`}
      style={{
        background: theme === 'dark' ? '#0B0B10' : '#F7F8FC',
        backgroundImage: theme === 'dark' 
          ? 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.06) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.04) 0%, transparent 50%)'
          : 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.06) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.04) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </div>
  );
};
