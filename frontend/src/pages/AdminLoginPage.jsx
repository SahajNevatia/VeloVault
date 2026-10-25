import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

/**
 * Dedicated Admin Login page with Light Mode & Dark Mode support.
 * Restricts access to users with the 'admin' role.
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password, 'admin');
    setIsLoading(false);
    if (result.success) {
      navigate('/admin');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@velovault.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-gray-900 relative transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left side - Administrative Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-800 via-purple-950 to-slate-900 dark:from-purple-900 dark:via-slate-900 dark:to-black p-12 flex-col justify-between border-r border-purple-200 dark:border-purple-900/40 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 dark:bg-purple-600/30 rounded-xl border border-white/20 dark:border-purple-500/40">
            <ShieldCheck className="h-8 w-8 text-white dark:text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Velo<span className="text-purple-300 dark:text-purple-400">Vault</span> <span className="text-xs uppercase px-2 py-0.5 rounded bg-white/20 dark:bg-purple-500/20 text-white dark:text-purple-300 font-semibold border border-white/20 dark:border-purple-500/30 ml-2">Admin Portal</span>
          </span>
        </div>

        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 dark:bg-purple-500/10 border border-white/20 dark:border-purple-500/30 text-white dark:text-purple-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Restricted Access Control</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Dealership Fleet & Inventory Management
          </h1>
          <p className="text-purple-100 dark:text-slate-300 text-lg leading-relaxed">
            Authorized portal for dealership staff, fleet managers, and inventory controllers. Manage vehicle acquisitions, pricing tiers, restock logs, and system audits.
          </p>
        </div>

        <div className="flex items-center justify-between text-purple-200 dark:text-slate-400 text-xs border-t border-white/20 dark:border-slate-800 pt-6">
          <span>Protected by JWT & Role-Based Authorization</span>
          <span>© 2026 VeloVault</span>
        </div>
      </div>

      {/* Right side - Admin Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-[#131324] border border-slate-200 dark:border-purple-900/50 p-8 rounded-2xl shadow-sm dark:shadow-2xl dark:shadow-black/80 transition-colors duration-200">
          {/* Back to Customer Login */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Switch to Customer Login</span>
            </Link>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 p-2 px-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-medium mb-3">
              <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Administrator Authentication Required</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Staff Sign In</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
              Enter your administrative credentials to access the control panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@velovault.com"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Authorize & Enter Admin Panel</span>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-purple-500/30 rounded-lg text-xs font-medium text-purple-700 dark:text-purple-300 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Fill Demo Admin Credentials (admin@velovault.com)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
