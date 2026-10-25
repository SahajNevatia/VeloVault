import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, LogOut, LayoutDashboard, Settings, Sun, Moon } from 'lucide-react';

/**
 * Navigation bar component.
 * Features theme toggle (Light / Black & Purple Dark Mode),
 * role-aware links, and responsive styling.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 font-semibold'
      : 'text-gray-600 dark:text-purple-200/80 hover:text-primary-600 dark:hover:text-white';

  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-100 dark:border-dark-border sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-primary-50 dark:bg-accent-950/60 rounded-lg border border-primary-100 dark:border-accent-800/40">
                <Car className="h-6 w-6 text-primary-600 dark:text-accent-400" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-wide">
                Velo<span className="text-primary-600 dark:text-accent-400">Vault</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1.5 py-5 text-sm font-medium transition-colors ${isActive('/dashboard')}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1.5 py-5 text-sm font-medium transition-colors ${isActive('/admin')}`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Theme Toggle Button (Light / Black & Purple Dark Mode) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Black & Purple Dark Mode'}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-dark-hover text-gray-700 dark:text-accent-300 border border-transparent dark:border-dark-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 flex items-center space-x-1.5 text-xs font-medium"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-300" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-purple-600" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4 pl-2 border-l border-gray-200 dark:border-dark-border">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-purple-300/60 hidden sm:inline">Hello, </span>
                <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
                {user?.role === 'admin' && (
                  <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-accent-950 dark:text-accent-300 dark:border dark:border-accent-700/50">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-500 dark:text-purple-300/70 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
