# Reminder App — React Frontend (PWA)

## Stack
- React 18 + React Router v6
- Axios (API calls + JWT interceptor)
- STOMP/SockJS (WebSocket — real-time in-app notifications)
- Web Push API + Service Worker (background push like Zomato)
- react-hot-toast (in-app popup toasts)
- date-fns (date formatting + countdown)

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_VAPID_PUBLIC_KEY=your_vapid_public_key
```
The VAPID public key must match the one in Spring Boot `application.properties`.

### 3. Run
```bash
npm start
```
App opens at http://localhost:3000

---

## How push notifications work (the Zomato popup)

1. User clicks **Enable Push** on the dashboard
2. Browser asks for notification permission
3. React subscribes to Web Push and sends the subscription to backend
4. When a reminder is due, Spring Boot scheduler calls the Web Push API
5. **Service worker wakes up** (even if browser/tab is closed) and shows an OS-level popup
6. If the app is open, WebSocket also fires a **real-time in-app toast**

---

## Deploy to Vercel
```bash
# In Vercel dashboard:
# 1. Import GitHub repo
# 2. Set environment variables:
#    REACT_APP_API_URL = https://your-railway-backend.up.railway.app
#    REACT_APP_VAPID_PUBLIC_KEY = your_key
# 3. Deploy — done!
```

---

## PWA Install on Mobile
- Open the deployed URL in Chrome on Android
- Tap the browser menu → "Add to Home Screen"
- App installs like a native app with its own icon
- Push notifications work in the background
