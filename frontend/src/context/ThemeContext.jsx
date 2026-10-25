import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Theme context provider managing Light mode and Black & Purple Dark mode.
 * Defaults to 'light' mode per user specification.
 * Persists user preference in localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Default to 'light' mode
    return localStorage.getItem('velovault_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('velovault_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
