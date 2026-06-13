import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { notifApi } from '../services/api';
import { useAuth } from './AuthContext';

const NotifContext = createContext(null);

export function NotifProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const stompRef = useRef(null);

  // Load initial unread notifications from REST
  const loadUnread = useCallback(async () => {
    if (!user) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        notifApi.getUnread(),
        notifApi.getCount(),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (e) { /* silent */ }
  }, [user]);

  useEffect(() => { loadUnread(); }, [loadUnread]);

  // Connect WebSocket for real-time popups
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    if (!apiUrl.includes('localhost')) {
      // WebSocket not supported on Render free tier — skip silently
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${apiUrl}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to personal notification channel
        client.subscribe(`/user/${user.email}/notifications`, (message) => {
          const notif = JSON.parse(message.body);

          // Add to state
          setNotifications((prev) => [notif, ...prev]);
          setUnreadCount((c) => c + 1);

          // Show Zomato-style in-app toast popup
          toast.custom((t) => (
            <div className={`notif-toast ${t.visible ? 'notif-toast--in' : 'notif-toast--out'}`}>
              <div className="notif-toast__icon">🔔</div>
              <div className="notif-toast__body">
                <p className="notif-toast__title">{notif.title}</p>
                <p className="notif-toast__msg">{notif.message}</p>
              </div>
              <button className="notif-toast__close" onClick={() => toast.dismiss(t.id)}>✕</button>
            </div>
          ), { duration: 8000, position: 'top-right' });
        });
      },
      onStompError: (frame) => console.error('WS error:', frame),
    });

    client.activate();
    stompRef.current = client;

    return () => { client.deactivate(); };
  }, [user]);

  const markAllRead = useCallback(async () => {
    await notifApi.markAllRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markAllRead, loadUnread }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotif = () => useContext(NotifContext);
