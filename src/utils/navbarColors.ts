/**
 * Navbar Color Management Utility
 *
 * This utility provides functions to dynamically change navbar colors
 * from anywhere in the application, including settings pages.
 */

export interface NavbarColorScheme {
  light: {
    bg: string;
    bgHover: string;
    text: string;
    textHover: string;
  };
  dark: {
    bg: string;
    bgHover: string;
    text: string;
    textHover: string;
  };
}

export const defaultNavbarColors: NavbarColorScheme = {
  light: {
    bg: '221.2 83.2% 53.3%', // Blue
    bgHover: '221.2 83.2% 48%', // Darker blue
    text: '210 40% 98%', // White
    textHover: '210 40% 98%', // White
  },
  dark: {
    bg: '217.2 91.2% 59.8%', // Lighter blue
    bgHover: '217.2 91.2% 54%', // Darker blue
    text: '222.2 84% 4.9%', // Dark
    textHover: '222.2 84% 4.9%', // Dark
  },
};

export const presetColorSchemes: Record<string, NavbarColorScheme> = {
  blue: defaultNavbarColors,
  green: {
    light: {
      bg: '142.1 76.2% 36.3%', // Green
      bgHover: '142.1 76.2% 31%', // Darker green
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
    dark: {
      bg: '142.1 70.6% 45.3%', // Lighter green
      bgHover: '142.1 70.6% 40%', // Darker green
      text: '222.2 84% 4.9%', // Dark
      textHover: '222.2 84% 4.9%', // Dark
    },
  },
  purple: {
    light: {
      bg: '262.1 83.3% 57.8%', // Purple
      bgHover: '262.1 83.3% 52%', // Darker purple
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
    dark: {
      bg: '262.1 83.3% 62%', // Lighter purple
      bgHover: '262.1 83.3% 57%', // Darker purple
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
  },
  red: {
    light: {
      bg: '0 84.2% 60.2%', // Red
      bgHover: '0 84.2% 55%', // Darker red
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
    dark: {
      bg: '0 62.8% 30.6%', // Darker red
      bgHover: '0 62.8% 25%', // Even darker red
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
  },
  orange: {
    light: {
      bg: '24.6 95% 53.1%', // Orange
      bgHover: '24.6 95% 48%', // Darker orange
      text: '210 40% 98%', // White
      textHover: '210 40% 98%', // White
    },
    dark: {
      bg: '24.6 95% 58%', // Lighter orange
      bgHover: '24.6 95% 53%', // Darker orange
      text: '222.2 84% 4.9%', // Dark
      textHover: '222.2 84% 4.9%', // Dark
    },
  },
};

/**
 * Apply navbar color scheme to CSS custom properties
 */
export function applyNavbarColors(colorScheme: NavbarColorScheme): void {
  const root = document.documentElement;

  // Apply light mode colors
  root.style.setProperty('--navbar-bg', colorScheme.light.bg);
  root.style.setProperty('--navbar-bg-hover', colorScheme.light.bgHover);
  root.style.setProperty('--navbar-text', colorScheme.light.text);
  root.style.setProperty('--navbar-text-hover', colorScheme.light.textHover);

  // Apply dark mode colors
  const darkModeColors = colorScheme.dark;
  root.style.setProperty('--navbar-bg-dark', darkModeColors.bg);
  root.style.setProperty('--navbar-bg-hover-dark', darkModeColors.bgHover);
  root.style.setProperty('--navbar-text-dark', darkModeColors.text);
  root.style.setProperty('--navbar-text-hover-dark', darkModeColors.textHover);
}

/**
 * Apply preset color scheme by name
 */
export function applyPresetNavbarColors(presetName: string): void {
  const colorScheme = presetColorSchemes[presetName];
  if (colorScheme) {
    applyNavbarColors(colorScheme);
  } else {
    console.warn(
      `Navbar color preset "${presetName}" not found. Available presets:`,
      Object.keys(presetColorSchemes)
    );
  }
}

/**
 * Reset navbar colors to default
 */
export function resetNavbarColors(): void {
  applyNavbarColors(defaultNavbarColors);
}

/**
 * Get current navbar color scheme from CSS custom properties
 */
export function getCurrentNavbarColors(): NavbarColorScheme {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    light: {
      bg: computedStyle.getPropertyValue('--navbar-bg').trim(),
      bgHover: computedStyle.getPropertyValue('--navbar-bg-hover').trim(),
      text: computedStyle.getPropertyValue('--navbar-text').trim(),
      textHover: computedStyle.getPropertyValue('--navbar-text-hover').trim(),
    },
    dark: {
      bg:
        computedStyle.getPropertyValue('--navbar-bg-dark').trim() ||
        computedStyle.getPropertyValue('--navbar-bg').trim(),
      bgHover:
        computedStyle.getPropertyValue('--navbar-bg-hover-dark').trim() ||
        computedStyle.getPropertyValue('--navbar-bg-hover').trim(),
      text:
        computedStyle.getPropertyValue('--navbar-text-dark').trim() ||
        computedStyle.getPropertyValue('--navbar-text').trim(),
      textHover:
        computedStyle.getPropertyValue('--navbar-text-hover-dark').trim() ||
        computedStyle.getPropertyValue('--navbar-text-hover').trim(),
    },
  };
}

/**
 * Save navbar color preference to localStorage
 */
export function saveNavbarColorPreference(presetName: string): void {
  localStorage.setItem('navbar-color-preset', presetName);
}

/**
 * Load navbar color preference from localStorage
 */
export function loadNavbarColorPreference(): string | null {
  return localStorage.getItem('navbar-color-preset');
}

/**
 * Initialize navbar colors on app startup
 */
export function initializeNavbarColors(): void {
  const savedPreset = loadNavbarColorPreference();
  if (savedPreset && presetColorSchemes[savedPreset]) {
    applyPresetNavbarColors(savedPreset);
  } else {
    applyNavbarColors(defaultNavbarColors);
  }
}
