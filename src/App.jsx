import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotifProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Protect routes — redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <NotifProvider>
      <Navbar />
      {children}
    </NotifProvider>
  );
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>

      {/* Global toast notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Toast + in-app popup styles */}
      <style>{`
        /* react-hot-toast override */
        .react-hot-toast > div {
          background: var(--bg-card) !important;
          color: var(--text) !important;
          border: 1px solid var(--border-mid) !important;
          border-radius: var(--radius) !important;
          font-family: var(--font-body) !important;
          font-size: 0.88rem !important;
        }

        /* Zomato-style in-app notification popup */
        .notif-toast {
          display: flex; align-items: flex-start; gap: 12px;
          background: var(--bg-card);
          border: 1px solid rgba(212,255,87,0.3);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,255,87,0.08);
          max-width: 340px; width: 100%;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .notif-toast--in  { opacity: 1; transform: translateX(0) scale(1); animation: popIn 0.4s ease; }
        .notif-toast--out { opacity: 0; transform: translateX(100px) scale(0.9); }
        .notif-toast__icon { font-size: 1.3rem; margin-top: 1px; }
        .notif-toast__body { flex: 1; }
        .notif-toast__title {
          font-family: var(--font-head); font-size: 0.92rem;
          font-weight: 700; color: var(--accent); margin-bottom: 3px;
        }
        .notif-toast__msg { font-size: 0.82rem; color: var(--text-mid); line-height: 1.4; }
        .notif-toast__close {
          background: none; color: var(--text-dim);
          font-size: 0.9rem; padding: 0; flex-shrink: 0;
        }
        .notif-toast__close:hover { color: var(--text); }
      `}</style>
    </AuthProvider>
  );
}
