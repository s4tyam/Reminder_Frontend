import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
};

// ── Reminders ──
export const reminderApi = {
  getAll:    ()         => api.get('/api/reminders'),
  getUpcoming: ()       => api.get('/api/reminders/upcoming'),
  create:    (data)     => api.post('/api/reminders', data),
  update:    (id, data) => api.put(`/api/reminders/${id}`, data),
  delete:    (id)       => api.delete(`/api/reminders/${id}`),
  dismiss:   (id)       => api.post(`/api/reminders/${id}/dismiss`),
};

// ── Notifications ──
export const notifApi = {
  getUnread:           ()    => api.get('/api/notifications/unread'),
  getCount:            ()    => api.get('/api/notifications/count'),
  markAllRead:         ()    => api.post('/api/notifications/mark-read'),
  savePushSubscription:(sub) => api.post('/api/notifications/push-subscription', sub),
};

export default api;
