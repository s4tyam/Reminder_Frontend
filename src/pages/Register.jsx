import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm]   = useState({ email: '', password: '', fullName: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-brand">
          <span className="auth-logo">◆</span>
          <h1 className="auth-title">Remind</h1>
        </div>
        <p className="auth-sub">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
              placeholder="Aditya Kumar" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
              placeholder="Min 6 characters" minLength={6} required />
          </div>
          <div className="form-group">
            <label>Phone Number <span style={{color:'var(--text-dim)', fontWeight:300}}>(for SMS)</span></label>
            <input type="tel" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)}
              placeholder="+91 9876543210" />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center; padding: 24px;
          background: radial-gradient(ellipse at 50% 0%, rgba(212,255,87,0.06) 0%, transparent 70%);
        }
        .auth-card {
          width: 100%; max-width: 420px;
          background: var(--bg-card); border: 1px solid var(--border-mid);
          border-radius: var(--radius-lg); padding: 40px 36px;
        }
        .auth-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .auth-logo  { font-size: 1.6rem; color: var(--accent); }
        .auth-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; }
        .auth-sub   { color: var(--text-mid); font-size: 0.88rem; margin-bottom: 28px; }
        .auth-form  { display: flex; flex-direction: column; gap: 16px; }
        .auth-btn   { width: 100%; padding: 14px; font-size: 0.95rem; margin-top: 4px; }
        .auth-switch { margin-top: 20px; text-align: center; font-size: 0.85rem; color: var(--text-mid); }
        .auth-switch a { color: var(--accent); text-decoration: none; font-weight: 500; }
      `}</style>
    </div>
  );
}
