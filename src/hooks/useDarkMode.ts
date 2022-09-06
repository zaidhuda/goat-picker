import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dark-mode';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode((enabled) => {
      if (window !== undefined) {
        window.localStorage.setItem(STORAGE_KEY, !enabled ? 'true' : 'false');
        document.querySelector('html')?.classList.toggle('dark');
      }
      return !enabled;
    });
  };

  useEffect(() => {
    if (window !== undefined) {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);
      const darkModeEnabled = savedTheme === 'true';
      setDarkMode(darkModeEnabled);
      if (darkModeEnabled) {
        document.querySelector('html')?.classList.add('dark');
      } else {
        document.querySelector('html')?.classList.remove('dark');
      }
    }
  }, []);

  return { darkMode, toggleDarkMode };
}
