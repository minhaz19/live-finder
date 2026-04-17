export interface ThemeColors {
  // Core backgrounds
  background: string;
  surface: string;
  card: string;
  cardBorder: string;

  // Primary accent
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary
  secondary: string;
  secondaryLight: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI elements
  border: string;
  divider: string;
  overlay: string;
  shimmer: string;
  searchBar: string;
  tabBar: string;
  tabBarBorder: string;
  statusBar: string;

  // Category chips
  chipBackground: string;
  chipActiveBackground: string;
  chipText: string;
  chipActiveText: string;

  // Shadows
  shadowColor: string;

  // Gradients (stored as arrays)
  gradientPrimary: string[];
  gradientCard: string[];
  gradientHeader: string[];
}

export const darkColors: ThemeColors = {
  background: '#0B0B1E',
  surface: '#12122A',
  card: '#1A1A3E',
  cardBorder: 'rgba(255, 255, 255, 0.06)',

  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E84545',

  secondary: '#7C5CFC',
  secondaryLight: '#A78BFA',

  text: '#FFFFFF',
  textSecondary: '#9CA3C0',
  textTertiary: '#5E6380',
  textInverse: '#0B0B1E',

  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.05)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shimmer: 'rgba(255, 255, 255, 0.05)',
  searchBar: 'rgba(255, 255, 255, 0.07)',
  tabBar: '#12122A',
  tabBarBorder: 'rgba(255, 255, 255, 0.06)',
  statusBar: '#0B0B1E',

  chipBackground: 'rgba(255, 255, 255, 0.06)',
  chipActiveBackground: '#FF6B6B',
  chipText: '#9CA3C0',
  chipActiveText: '#FFFFFF',

  shadowColor: '#000000',

  gradientPrimary: ['#FF6B6B', '#E84545'],
  gradientCard: ['rgba(26, 26, 62, 0.8)', 'rgba(18, 18, 42, 0.9)'],
  gradientHeader: ['#1A1A3E', '#0B0B1E'],
};

export const lightColors: ThemeColors = {
  background: '#F5F5FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: 'rgba(0, 0, 0, 0.06)',

  primary: '#E84545',
  primaryLight: '#FF6B6B',
  primaryDark: '#C92A2A',

  secondary: '#6C3CE0',
  secondaryLight: '#8B5CF6',

  text: '#1A1A2E',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  border: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(0, 0, 0, 0.05)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  shimmer: 'rgba(0, 0, 0, 0.04)',
  searchBar: 'rgba(0, 0, 0, 0.04)',
  tabBar: '#FFFFFF',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  statusBar: '#F5F5FA',

  chipBackground: 'rgba(0, 0, 0, 0.05)',
  chipActiveBackground: '#E84545',
  chipText: '#64748B',
  chipActiveText: '#FFFFFF',

  shadowColor: 'rgba(0, 0, 0, 0.1)',

  gradientPrimary: ['#E84545', '#C92A2A'],
  gradientCard: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)'],
  gradientHeader: ['#FFFFFF', '#F5F5FA'],
};
