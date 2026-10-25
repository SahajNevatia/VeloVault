import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, User, Mail, Lock, Loader2, Sun, Moon } from 'lucide-react';

/**
 * Registration page for creating new user accounts.
 * Includes username, email, and password fields with theme toggle.
 */
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    await register(username, email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-[#180b2c] dark:via-[#130725] dark:to-black p-12 flex-col justify-between border-r border-transparent dark:border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 dark:bg-accent-950/60 rounded-xl border border-white/20 dark:border-accent-800/50">
            <Car className="h-8 w-8 text-white dark:text-accent-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Velo<span className="text-primary-200 dark:text-accent-400">Vault</span>
          </span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Join the VeloVault Community
          </h1>
          <p className="text-primary-100 dark:text-purple-200/80 text-lg leading-relaxed">
            Create your account today and gain access to our premium vehicle inventory management system.
          </p>
        </div>
        <p className="text-primary-200 dark:text-purple-400/60 text-sm">
          © 2026 VeloVault. All rights reserved.
        </p>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-dark-bg transition-colors duration-200 relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Black & Purple Dark Mode'}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover text-gray-700 dark:text-accent-300 border border-gray-200 dark:border-dark-border transition-colors flex items-center space-x-1.5 text-xs font-medium"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-300" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-purple-600" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
              <Car className="h-8 w-8 text-primary-600 dark:text-accent-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">VeloVault</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-purple-300/70 mt-2 text-sm">Get started with your customer profile</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/60" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="johndoe"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/60" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Create Customer Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-purple-300/80 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-accent-400 font-semibold hover:text-primary-700 dark:hover:text-accent-300">
              Sign in to Customer Account
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border text-center">
            <Link
              to="/admin-login"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-purple-700 dark:text-accent-300 hover:text-purple-800 dark:hover:text-white bg-purple-50 dark:bg-accent-950/60 hover:bg-purple-100 dark:hover:bg-accent-900/60 py-1.5 px-3 rounded-full transition-colors border border-purple-200 dark:border-accent-700/50"
            >
              <span>Dealership Staff? Access Admin Portal &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
