import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * Authentication context provider.
 * Manages user state, login, register, and logout functionality.
 * Persists authentication state in localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('velovault_user');
    const storedToken = localStorage.getItem('velovault_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, requiredRole = null) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token } = response.data.data;

      if (requiredRole && userData.role !== requiredRole) {
        const errorMsg = requiredRole === 'admin'
          ? 'Access denied. This portal is strictly for dealership administrators. Please use Customer Login.'
          : 'Access denied for this portal.';
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }

      localStorage.setItem('velovault_token', token);
      localStorage.setItem('velovault_user', JSON.stringify(userData));
      setUser(userData);

      toast.success(userData.role === 'admin' ? 'Welcome back, Administrator!' : 'Welcome back!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { user: userData, token } = response.data.data;

      localStorage.setItem('velovault_token', token);
      localStorage.setItem('velovault_user', JSON.stringify(userData));
      setUser(userData);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('velovault_token');
    localStorage.removeItem('velovault_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
