import React from 'react';
import { Loader2 } from 'lucide-react';
import { Ripple } from './Ripple';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  withRipple?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  withRipple = true,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-[#6366F1] text-white hover:bg-indigo-500 focus:ring-[#6366F1] shadow-lg hover:shadow-xl hover:shadow-[#6366F1]/20 active:scale-95',
    secondary: 'bg-[#141414] text-white border border-[#222] hover:bg-[#1A1A1A] focus:ring-[#6366F1] active:scale-95',
    ghost: 'bg-transparent text-[#AAA] hover:bg-[#111] hover:text-white focus:ring-[#6366F1] active:scale-95',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-[#EF4444] shadow-lg hover:shadow-xl hover:shadow-[#EF4444]/20 active:scale-95',
    success: 'bg-[#10B981] text-white hover:bg-emerald-600 focus:ring-[#10B981] shadow-lg hover:shadow-xl hover:shadow-[#10B981]/20 active:scale-95',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const buttonContent = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );

  if (withRipple && !disabled) {
    return (
      <Ripple>
        <button
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
          disabled={disabled || isLoading}
          {...props}
        >
          {buttonContent}
        </button>
      </Ripple>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};
