import { useState, useEffect, useCallback } from 'react';
import {
  applyNavbarColors,
  applyPresetNavbarColors,
  resetNavbarColors,
  getCurrentNavbarColors,
  saveNavbarColorPreference,
  loadNavbarColorPreference,
  presetColorSchemes,
  type NavbarColorScheme,
} from '../utils/navbarColors';

/**
 * Hook for managing navbar colors
 */
export function useNavbarColors() {
  const [currentPreset, setCurrentPreset] = useState<string>('blue');
  const [availablePresets] = useState<string[]>(
    Object.keys(presetColorSchemes)
  );

  // Initialize navbar colors on mount
  useEffect(() => {
    const savedPreset = loadNavbarColorPreference();
    if (savedPreset && presetColorSchemes[savedPreset]) {
      setCurrentPreset(savedPreset);
      applyPresetNavbarColors(savedPreset);
    } else {
      applyPresetNavbarColors('blue');
    }
  }, []);

  /**
   * Change navbar color preset
   */
  const changeColorPreset = useCallback((presetName: string) => {
    if (presetColorSchemes[presetName]) {
      setCurrentPreset(presetName);
      applyPresetNavbarColors(presetName);
      saveNavbarColorPreference(presetName);
    }
  }, []);

  /**
   * Apply custom color scheme
   */
  const applyCustomColors = useCallback((colorScheme: NavbarColorScheme) => {
    applyNavbarColors(colorScheme);
    setCurrentPreset('custom');
  }, []);

  /**
   * Reset to default colors
   */
  const resetColors = useCallback(() => {
    resetNavbarColors();
    setCurrentPreset('blue');
    saveNavbarColorPreference('blue');
  }, []);

  /**
   * Get current color scheme
   */
  const getCurrentColors = useCallback(() => {
    return getCurrentNavbarColors();
  }, []);

  return {
    currentPreset,
    availablePresets,
    changeColorPreset,
    applyCustomColors,
    resetColors,
    getCurrentColors,
  };
}
