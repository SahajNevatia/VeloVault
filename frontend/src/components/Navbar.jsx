import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, LayoutDashboard, Settings } from 'lucide-react';

/**
 * Navigation bar component styled with deep black & neon purple accents.
 * Displays navigation links, user identity badge, and session controls.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-purple-400 border-b-2 border-purple-500 font-semibold'
      : 'text-slate-400 hover:text-purple-300';

  return (
    <nav className="bg-[#0e0e1c]/90 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-50 shadow-xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 group-hover:border-purple-500/60 transition-colors">
                <Car className="h-6 w-6 text-purple-400 group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-wider">
                Velo<span className="text-purple-400">Vault</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 py-5 text-sm font-medium transition-colors ${isActive('/dashboard')}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 py-5 text-sm font-medium transition-colors ${isActive('/admin')}`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-5 pl-4 border-l border-purple-900/40">
              <div className="text-sm">
                <span className="text-slate-400">Hello, </span>
                <span className="font-semibold text-white">{user?.username}</span>
                {user?.role === 'admin' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-600/40 shadow-sm">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-all text-sm font-medium"
                title="Log out of session"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
