/**
 * LearnIT Enterprise Platform - Design System Tokens
 * Centralized design tokens for consistent UI across the application
 */

// Spacing Scale (4px base unit)
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

// Typography Scale
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Color Palette - Dark Theme
export const colors = {
  // Backgrounds
  background: {
    primary: '#050505',
    secondary: '#080808',
    tertiary: '#0A0A0A',
    quaternary: '#0D0D0D',
    elevated: '#111111',
    card: '#141414',
  },
  // Borders
  border: {
    primary: '#1A1A1A',
    secondary: '#222222',
    tertiary: '#2A2A2A',
    focus: '#6366F1',
  },
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    tertiary: '#888888',
    muted: '#666666',
    disabled: '#444444',
  },
  // Brand Colors
  brand: {
    primary: '#6366F1',    // Indigo
    secondary: '#A855F7',  // Purple
    accent: '#8B5CF6',     // Violet
  },
  // Semantic Colors
  semantic: {
    success: '#10B981',    // Emerald
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#3B82F6',       // Blue
  },
  // Semantic Backgrounds (with opacity)
  semanticBg: {
    success: 'rgba(16, 185, 129, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)',
  },
  // Semantic Borders (with opacity)
  semanticBorder: {
    success: 'rgba(16, 185, 129, 0.2)',
    warning: 'rgba(245, 158, 11, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)',
    info: 'rgba(59, 130, 246, 0.2)',
  },
} as const;

// Border Radius Scale
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem', // 20px
  full: '9999px',
} as const;

// Shadow Scale
export const shadow = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  glow: '0 0 20px rgba(99, 102, 241, 0.15)',
} as const;

// Transition durations
export const transition = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Z-index scale
export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// Breakpoints (for reference, Tailwind handles these)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
