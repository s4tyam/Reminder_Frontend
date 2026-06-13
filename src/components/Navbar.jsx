import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotif } from '../context/NotificationContext';
import { format } from 'date-fns';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAllRead } = useNotif();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleNotifs = () => {
    setShowNotifs((v) => !v);
    if (!showNotifs && unreadCount > 0) markAllRead();
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar__brand">
        <span className="navbar__logo">◆</span>
        <span className="navbar__name">Remind</span>
      </Link>

      <div className="navbar__right">
        {/* Notification Bell */}
        <div className="notif-wrapper">
          <button className="notif-btn" onClick={toggleNotifs}>
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div className="notif-panel slide-in">
              <div className="notif-panel__head">
                <span>Notifications</span>
                <button onClick={() => setShowNotifs(false)}>✕</button>
              </div>
              <div className="notif-panel__list">
                {notifications.length === 0
                  ? <p className="notif-panel__empty">All clear!</p>
                  : notifications.slice(0, 10).map((n, i) => (
                    <div key={n.id || i} className={`notif-item ${n.isRead ? '' : 'notif-item--unread'}`}>
                      <p className="notif-item__msg">{n.message || n.title}</p>
                      <span className="notif-item__time">
                        {n.sentAt ? format(new Date(n.sentAt), 'MMM d, HH:mm') : 'just now'}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        <span className="navbar__user">{user?.fullName?.split(' ')[0]}</span>
        <button className="btn-ghost" style={{padding:'8px 14px', fontSize:'0.8rem'}}
          onClick={handleLogout}>Logout</button>
      </div>

      {showNotifs && (
        <div className="notif-overlay" onClick={() => setShowNotifs(false)} />
      )}

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 60px;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .navbar__brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .navbar__logo { font-size: 1.1rem; color: var(--accent); }
        .navbar__name { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
        .navbar__right { display: flex; align-items: center; gap: 12px; }
        .navbar__user  { font-size: 0.82rem; color: var(--text-mid); }
        .notif-wrapper { position: relative; }
        .notif-btn {
          position: relative; background: transparent; border: none;
          font-size: 1.1rem; cursor: pointer; padding: 6px 8px;
          border-radius: 8px; transition: background 0.2s;
        }
        .notif-btn:hover { background: var(--bg-hover); }
        .notif-badge {
          position: absolute; top: 0; right: 0;
          background: var(--accent); color: #0a0a0a;
          font-family: var(--font-head); font-size: 0.6rem; font-weight: 800;
          min-width: 16px; height: 16px; border-radius: 99px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }
        .notif-panel {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 320px; background: var(--bg-card);
          border: 1px solid var(--border-mid); border-radius: var(--radius-lg);
          overflow: hidden; z-index: 200; box-shadow: var(--shadow);
        }
        .notif-panel__head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-bottom: 1px solid var(--border);
          font-family: var(--font-head); font-size: 0.88rem; font-weight: 700;
        }
        .notif-panel__head button { background: none; color: var(--text-mid); font-size: 1rem; }
        .notif-panel__list { max-height: 320px; overflow-y: auto; }
        .notif-panel__empty { padding: 24px; text-align: center; color: var(--text-dim); font-size: 0.85rem; }
        .notif-item { padding: 12px 18px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .notif-item:hover { background: var(--bg-hover); }
        .notif-item--unread { border-left: 2px solid var(--accent); }
        .notif-item__msg  { font-size: 0.85rem; color: var(--text); }
        .notif-item__time { font-size: 0.72rem; color: var(--text-dim); margin-top: 3px; display: block; }
        .notif-overlay { position: fixed; inset: 0; z-index: 150; }
        @media (max-width: 480px) {
          .navbar__user { display: none; }
          .notif-panel { width: 280px; right: -8px; }
        }
      `}</style>
    </nav>
  );
}
