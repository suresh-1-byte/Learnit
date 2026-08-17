export const themeColors = {
  dark: {
    // Backgrounds
    background: '#0B0B10',
    surface: '#0D0D14',
    card: '#14141C',
    interactive: '#171720',
    elevated: '#1B1B26',
    
    // Borders
    border: '#1A1A1A',
    borderLight: '#222',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#EDEDED',
    textTertiary: '#BBB',
    textMuted: '#999',
    textDisabled: '#777',
    
    // Brand Colors (unchanged)
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#A855F7',
    accentLight: '#C084FC',
    success: '#10B981',
    successLight: '#34D399',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  light: {
    // Backgrounds
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    interactive: '#F1F5F9',
    elevated: '#E2E8F0',
    
    // Borders
    border: '#E2E8F0',
    borderLight: '#CBD5E1',
    
    // Text
    textPrimary: '#0F172A',
    textSecondary: '#1E293B',
    textTertiary: '#475569',
    textMuted: '#64748B',
    textDisabled: '#94A3B8',
    
    // Brand Colors (unchanged)
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#A855F7',
    accentLight: '#C084FC',
    success: '#10B981',
    successLight: '#34D399',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
} as const;

export type ThemeName = keyof typeof themeColors;

export const getThemeColor = (theme: ThemeName, colorKey: keyof typeof themeColors.dark): string => {
  return themeColors[theme][colorKey];
};
