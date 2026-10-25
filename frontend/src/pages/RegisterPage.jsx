import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, Mail, Lock, Loader2, Shield, UserPlus } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

/**
 * Registration page supporting Light Mode (White/Blue) and Dark Mode (Black/Purple).
 */
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(username, email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0a14] relative transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-purple-950 dark:via-slate-950 dark:to-black p-12 flex-col justify-between border-r border-transparent dark:border-purple-900/40 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 dark:bg-purple-600/20 rounded-xl border border-white/20 dark:border-purple-500/40">
            <Car className="h-8 w-8 text-white dark:text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Velo<span className="text-primary-200 dark:text-purple-400">Vault</span>
          </span>
        </div>
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 dark:bg-purple-500/10 border border-white/20 dark:border-purple-500/30 text-white dark:text-purple-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <UserPlus className="h-3.5 w-3.5 text-primary-200 dark:text-purple-400" />
            <span>Join VeloVault</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Create Your Customer Profile
          </h1>
          <p className="text-primary-100 dark:text-slate-300 text-lg leading-relaxed">
            Gain immediate access to purchase reservations, real-time inventory updates, and special dealership offerings.
          </p>
        </div>
        <div className="flex items-center justify-between text-primary-200 dark:text-slate-500 text-xs border-t border-white/20 dark:border-purple-900/30 pt-6">
          <span>Connected to MongoDB Atlas</span>
          <span>© 2026 VeloVault</span>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-[#0a0a14]">
        <div className="w-full max-w-md bg-white dark:bg-[#131324] border border-gray-200 dark:border-purple-900/50 p-8 rounded-2xl shadow-sm dark:shadow-2xl dark:shadow-black/80 transition-colors duration-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">Register as a customer to browse & purchase vehicles</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="johndoe"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400/70" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 text-sm mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Register Customer Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-purple-950/60 text-center space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-purple-400 font-semibold hover:text-primary-700 dark:hover:text-purple-300 transition-colors">
                Sign in to Customer Account
              </Link>
            </p>

            <div className="pt-2">
              <Link
                to="/admin-login"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 py-1.5 px-3.5 rounded-full transition-colors border border-purple-200 dark:border-purple-700/50"
              >
                <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>Dealership Staff? Access Admin Portal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
