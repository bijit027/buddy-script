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

    // 2. Default to light mode
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('_dark_wrapper');
    } else {
      document.body.classList.remove('_dark_wrapper');
    }
    localStorage.setItem('bs_dark_mode', String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}

export default useDarkMode;
