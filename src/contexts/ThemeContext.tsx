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
  const [theme, setTheme] = useState<Theme>('light');

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
