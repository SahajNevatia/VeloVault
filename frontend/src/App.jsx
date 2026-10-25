import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext';

/**
 * Main App component with routing configuration.
 * Handles protected routes and layout structure.
 */
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a12]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a12] dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {user && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />}
        />
        <Route
          path="/admin-login"
          element={!user ? <AdminLoginPage /> : <Navigate to="/admin" />}
        />
        <Route
          path="/admin/login"
          element={!user ? <AdminLoginPage /> : <Navigate to="/admin" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? (
              <AdminPage />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </div>
  );
}

export default App;
