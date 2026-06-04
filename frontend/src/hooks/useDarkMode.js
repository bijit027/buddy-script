import { useEffect, useState } from 'react';

/**
 * useDarkMode — persists dark mode preference in localStorage,
 * checks OS preference on first load, and toggles 'dark-mode' on document.body.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem('bs_dark_mode');
    if (stored !== null) return stored === 'true';

    // 2. Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('bs_dark_mode', String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}

export default useDarkMode;
