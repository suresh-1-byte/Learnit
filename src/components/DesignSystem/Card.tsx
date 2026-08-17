import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default'
}) => {
  const { theme } = useTheme();
  
  const baseStyles = theme === 'dark' ? 'bg-[#14141C]' : 'bg-white';
  
  const variantStyles = {
    default: theme === 'dark' ? 'border border-[#1A1A1A]' : 'border border-gray-200',
    elevated: theme === 'dark' ? 'border border-[#1A1A1A] shadow-lg shadow-black/20' : 'border border-gray-200 shadow-lg shadow-gray-200/50',
    bordered: theme === 'dark' ? 'border-2 border-[#222]' : 'border-2 border-gray-300',
  };
  
  const hoverStyles = hoverable
    ? theme === 'dark'
      ? 'hover:border-[#2A2A2A] hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'
      : 'hover:border-gray-300 hover:shadow-xl hover:shadow-gray-300/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'
    : '';
  const clickStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${clickStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
