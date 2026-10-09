export interface UserSettings {
  theme: 'light' | 'dark';
  defaultFontFamily: string;
  defaultFontSize: string;
  defaultPaperSize: 'A4' | 'Letter';
  ribbonDensity: 'normal' | 'compact';
  autosaveIntervalSec: number;
}

const SETTINGS_KEY = 'wordlite_user_settings_v1';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  defaultFontFamily: 'Calibri, Aptos, sans-serif',
  defaultFontSize: '11pt',
  defaultPaperSize: 'A4',
  ribbonDensity: 'normal',
  autosaveIntervalSec: 30,
};

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}
