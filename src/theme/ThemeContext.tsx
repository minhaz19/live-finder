/**
 * Theme context provider with dark/light mode support.
 * Persists theme preference to MMKV storage.
 */

import React, {createContext, useContext, useState, useCallback, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeColors, darkColors, lightColors} from './colors';
import {storage} from '../utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = storage.getString(THEME_STORAGE_KEY);
      return (saved as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      storage.set(THEME_STORAGE_KEY, mode);
    } catch {
      // Silently fail if storage is unavailable
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  }, [isDark, setThemeMode]);

  const value = useMemo(
    () => ({colors, isDark, themeMode, setThemeMode, toggleTheme}),
    [colors, isDark, themeMode, setThemeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
