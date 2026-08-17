/**
 * Responsive Utilities
 * Enterprise-grade responsive helpers for the LearnIT Platform
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Check if current viewport is at or above a breakpoint
 */
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

/**
 * Get current breakpoint
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'md';
  
  const width = window.innerWidth;
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

/**
 * Hook to get current breakpoint
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(getCurrentBreakpoint());

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Responsive value selector
 */
export const responsiveValue = <T,>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const current = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  
  // Find the largest breakpoint that matches and has a value
  for (let i = breakpointOrder.length - 1; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (breakpoints[current] >= breakpoints[bp] && values[bp] !== undefined) {
      return values[bp]!;
    }
  }
  
  return defaultValue;
};

import React from 'react';

/**
 * Hook to get responsive value
 */
export const useResponsiveValue = <T,>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const breakpoint = useBreakpoint();
  return responsiveValue(values, defaultValue);
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => !isBreakpoint('md');

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => isBreakpoint('md') && !isBreakpoint('lg');

/**
 * Check if device is desktop
 */
export const isDesktop = (): boolean => isBreakpoint('lg');
