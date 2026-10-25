import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, Mail, Lock, Loader2, Shield, UserCheck, Sparkles, Sun, Moon } from 'lucide-react';

/**
 * Customer / User Login page.
 * Provides user authentication, quick demo credentials, portal switcher,
 * and a theme toggle for Light and Black & Purple Dark mode.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('customer@velovault.com');
    setPassword('password123');
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 dark:bg-accent-950/60 backdrop-blur-sm text-primary-100 dark:text-accent-300 text-xs font-semibold mb-4 border border-white/20 dark:border-accent-700/50">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your Premier Car Dealership Platform
          </h1>
          <p className="text-primary-100 dark:text-purple-200/80 text-lg leading-relaxed">
            Discover, filter, and purchase from our inventory of certified luxury, performance, and everyday vehicles with live stock tracking.
          </p>
        </div>
        <p className="text-primary-200 dark:text-purple-400/60 text-sm">
          © 2026 VeloVault. All rights reserved.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-dark-bg transition-colors duration-200 relative">
        {/* Theme Switcher Toggle (Top Right) */}
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
          {/* Portal Switcher Tabs */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-dark-card p-1 mb-8 border border-gray-200 dark:border-dark-border">
            <div className="flex-1 py-2 text-center rounded-md bg-white dark:bg-accent-950 text-primary-700 dark:text-accent-300 font-semibold text-sm shadow-sm flex items-center justify-center space-x-2 border border-transparent dark:border-accent-700/60">
              <UserCheck className="h-4 w-4" />
              <span>Customer Login</span>
            </div>
            <Link
              to="/admin-login"
              className="flex-1 py-2 text-center rounded-md text-gray-500 dark:text-purple-300/70 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <Shield className="h-4 w-4 text-purple-600 dark:text-accent-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-purple-300/70 mt-2 text-sm">Sign in to your customer account to browse & purchase vehicles</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="customer@velovault.com"
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
                <span>Sign In to Customer Account</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-primary-50 dark:bg-dark-card hover:bg-primary-100 dark:hover:bg-dark-hover border border-primary-200 dark:border-dark-border rounded-lg text-xs font-medium text-primary-700 dark:text-accent-300 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-500 dark:text-accent-400" />
              <span>Fill Demo Customer Credentials (customer@velovault.com)</span>
            </button>
          </div>

          {/* Registration & Admin Portal Links */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-purple-300/80">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-accent-400 font-semibold hover:text-primary-700 dark:hover:text-accent-300">
                Create Customer Account
              </Link>
            </p>
            <div className="pt-2">
              <Link
                to="/admin-login"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-purple-700 dark:text-accent-300 hover:text-purple-800 dark:hover:text-white bg-purple-50 dark:bg-accent-950/60 hover:bg-purple-100 dark:hover:bg-accent-900/60 py-1.5 px-3 rounded-full transition-colors border border-purple-200 dark:border-accent-700/50"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Dealership Manager or Staff? Open Admin Portal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
