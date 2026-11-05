import React, { useState, useLayoutEffect, ReactNode } from 'react';
import {
  ThemeContext,
  type Theme,
  type ThemeContextType,
} from './theme-context-value';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useLayoutEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      setTheme(systemTheme.matches ? 'dark' : 'light');
    };

    handleSystemThemeChange();
    systemTheme.addEventListener('change', handleSystemThemeChange);
    return () => {
      systemTheme.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  useLayoutEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.style.colorScheme = theme;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
