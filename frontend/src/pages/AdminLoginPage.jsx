import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, KeyRound } from 'lucide-react';

/**
 * Dedicated Admin Login page.
 * Restricts access to users with the 'admin' role.
 * Redirects directly to the Admin Inventory Panel upon successful login.
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

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side - Administrative Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-slate-900 to-black p-12 flex-col justify-between border-r border-purple-900/40">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-600/30 rounded-xl border border-purple-500/40">
            <ShieldCheck className="h-8 w-8 text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Velo<span className="text-purple-400">Vault</span> <span className="text-xs uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 ml-2">Admin Portal</span>
          </span>
        </div>

        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Restricted Access Control</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Dealership Fleet & Inventory Management
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Authorized portal for dealership staff, fleet managers, and inventory controllers. Manage vehicle acquisitions, pricing tiers, restock logs, and system audits.
          </p>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-xs border-t border-slate-800 pt-6">
          <span>Protected by JWT & Role-Based Authorization</span>
          <span>© 2026 VeloVault</span>
        </div>
      </div>

      {/* Right side - Admin Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Back to Customer Login */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Switch to Customer Login</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white">Staff Sign In</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Enter your administrative credentials to access the control panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Authorize & Enter Admin Panel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
