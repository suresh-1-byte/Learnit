import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const { theme } = useTheme();
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `px-4 py-2.5 rounded-xl text-sm transition-all duration-250 shadow-sm hover:shadow-md focus:shadow-lg focus:-translate-y-0.5 ${
    theme === 'dark' 
      ? 'bg-[#0D0D0D] border-[rgba(255,255,255,0.08)] text-white placeholder-[#555] focus:border-[rgba(99,102,241,0.3)] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] hover:border-[rgba(255,255,255,0.12)]' 
      : 'bg-white border-[rgba(0,0,0,0.06)] text-gray-900 placeholder-[#64748B] focus:border-[rgba(99,102,241,0.3)] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] hover:border-[rgba(0,0,0,0.12)]'
  } focus:outline-none`;
  const errorStyles = error ? `border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] ${
    theme === 'dark' ? 'hover:border-[#EF4444]' : 'hover:border-[#EF4444]'
  }` : '';
  const widthStyles = fullWidth ? 'w-full' : '';
  const paddingStyles = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-xs font-mono uppercase font-bold transition-colors duration-250 ${
            theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
          }`}
        >
          {label}
          {props.required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-250 ${
            theme === 'dark' ? 'text-[#555]' : 'text-[#64748B]'
          }`}>
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`${baseStyles} ${errorStyles} ${widthStyles} ${paddingStyles}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {rightIcon && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-250 ${
            theme === 'dark' ? 'text-[#555]' : 'text-[#64748B]'
          }`}>
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p id={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined} className={`text-[11px] transition-colors duration-250 ${
          error ? 'text-[#EF4444]' : theme === 'dark' ? 'text-[#666]' : 'text-[#64748B]'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
