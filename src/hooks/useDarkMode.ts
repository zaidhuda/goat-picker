import { useCallback, useEffect } from 'react';
import usePreferences from './usePreferences';

const THEMES = ['light', 'dark', 'auto'] as const;

export default function useDarkMode() {
  const {
    preferences: { THEME },
    setPreference,
  } = usePreferences();

  const toggleTheme = useCallback(() => {
    const nextTheme = THEMES[(THEMES.indexOf(THEME) + 1) % THEMES.length];
    setPreference('THEME', nextTheme);
  }, [THEME, setPreference]);

  useEffect(() => {
    if (
      THEME === 'dark' ||
      (THEME === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [THEME]);

  return { theme: THEME, toggleTheme };
}
