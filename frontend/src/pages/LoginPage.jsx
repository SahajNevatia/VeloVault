import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, Loader2, Shield, UserCheck, Sparkles } from 'lucide-react';

/**
 * Customer / User Login page styled with black & purple dark luxury aesthetic.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
    <div className="min-h-screen flex bg-[#0a0a14]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-950 via-slate-950 to-black p-12 flex-col justify-between border-r border-purple-900/40">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/40">
            <Car className="h-8 w-8 text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Velo<span className="text-purple-400">Vault</span>
          </span>
        </div>
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <UserCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your Premier Car Dealership Platform
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Discover, filter, and purchase from our inventory of certified luxury, performance, and electric vehicles with live stock tracking.
          </p>
        </div>
        <div className="flex items-center justify-between text-slate-500 text-xs border-t border-purple-900/30 pt-6">
          <span>Connected to MongoDB Atlas</span>
          <span>© 2026 VeloVault</span>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0a14]">
        <div className="w-full max-w-md bg-[#131324] border border-purple-900/50 p-8 rounded-2xl shadow-2xl shadow-black/80">
          {/* Portal Switcher Tabs */}
          <div className="flex rounded-lg bg-black/60 p-1 mb-8 border border-purple-900/40">
            <div className="flex-1 py-2 text-center rounded-md bg-purple-600 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Customer Login</span>
            </div>
            <Link
              to="/admin-login"
              className="flex-1 py-2 text-center rounded-md text-slate-400 hover:text-purple-300 font-medium text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Shield className="h-3.5 w-3.5 text-purple-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-slate-400 mt-2 text-sm">Sign in to your customer account to browse & purchase vehicles</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="customer@velovault.com"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400/70" />
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
              className="btn-primary w-full flex items-center justify-center space-x-2 text-sm"
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
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-purple-950/40 hover:bg-purple-950/70 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Fill Demo Customer (customer@velovault.com)</span>
            </button>
          </div>

          {/* Registration & Admin Portal Links */}
          <div className="mt-8 pt-6 border-t border-purple-950/60 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                Create Customer Account
              </Link>
            </p>
            <div className="pt-2">
              <Link
                to="/admin-login"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 py-1.5 px-3.5 rounded-full transition-colors border border-purple-700/50"
              >
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span>Dealership Manager or Staff? Open Admin Portal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
