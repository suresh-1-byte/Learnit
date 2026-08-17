import React from 'react';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label' | 'mono';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  className = '',
  children
}) => {
  const variantStyles = {
    h1: 'text-3xl font-bold text-white tracking-tight',
    h2: 'text-2xl font-bold text-white tracking-tight',
    h3: 'text-xl font-bold text-white tracking-tight',
    h4: 'text-lg font-semibold text-white',
    body: 'text-sm text-[#CCC] leading-relaxed',
    caption: 'text-xs text-[#888]',
    label: 'text-xs font-mono uppercase text-[#888] font-bold',
    mono: 'text-sm font-mono text-[#AAA]',
  };

  return (
    <span className={`${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
