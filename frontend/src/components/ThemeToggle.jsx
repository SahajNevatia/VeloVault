import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * Interactive toggle button to switch between Light Mode and Dark Mode.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        isDark
          ? 'bg-[#18182e] hover:bg-[#22223d] text-purple-300 border border-purple-500/30 hover:border-purple-500/60 shadow-sm'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Black & Purple)'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-300 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-purple-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
