import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-bold rounded-md';
  
  const variantStyles = {
    default: 'bg-[#141414] text-[#777] border border-[#222]',
    primary: 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30',
    success: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
    error: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
  };
  
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
