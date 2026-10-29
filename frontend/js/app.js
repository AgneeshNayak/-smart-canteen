// ── CONFIG ──
const isSeparateDevServer = window.location.protocol === 'file:' ||
  ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
   window.location.port !== '5000' &&
   window.location.port !== '8000' &&
   window.location.port !== '');

const API = isSeparateDevServer ? 'http://localhost:5000/api' : '/api';
const UPLOADS_URL = isSeparateDevServer ? 'http://localhost:5000/uploads' : '/uploads';

// Helper to resolve page URLs whether running from /pages/ or / or /frontend/
function getPageUrl(pageName) {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/')) {
    return pageName;
  }
  return `./pages/${pageName}`;
}

// ── AUTH HELPERS ──
const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const setAuth = (token, user) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); };
const clearAuth = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };

// ── API HELPER ──
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  if (options.body instanceof FormData) { delete headers['Content-Type']; }
  const res = await fetch(API + endpoint, { headers, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ── TOAST NOTIFICATIONS ──
function toast(msg, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, duration);
}

// ── ANIMATED COUNTER ──
function animateCounter(el, target) {
  const start = 0;
  const duration = 1200;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── FORMAT DATE ──
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── REDIRECT GUARD ──
function requireAuth(role = null) {
  const user = getUser();
  const token = getToken();
  if (!token || !user) { window.location.href = getPageUrl('login.html'); return null; }
  if (role && user.role !== role) { window.location.href = user.role === 'admin' ? getPageUrl('admin.html') : getPageUrl('dashboard.html'); return null; }
  return user;
}

// ── LOGOUT ──
function logout() {
  clearAuth();
  window.location.href = getPageUrl('login.html');
}

// ── AVATAR LETTER ──
function avatarLetter(name) {
  return name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
}

// ── FORMAT CURRENCY ──
function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ── CURRENT SESSION ──
function getCurrentSession() {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 9) return 'breakfast';
  if (hour >= 12 && hour < 14) return 'lunch';
  if (hour >= 15 && hour < 17) return 'snack';
  if (hour >= 19 && hour < 21) return 'dinner';
  return null;
}

// ── SESSION DISPLAY ──
const SESSION_INFO = {
  breakfast: { label: 'Morning Breakfast', time: '7:30 – 9:00 AM', icon: '🌅' },
  lunch: { label: 'Afternoon Lunch', time: '12:00 – 2:00 PM', icon: '☀️' },
  snack: { label: 'Evening Snack', time: '3:00 – 5:00 PM', icon: '🍵' },
  dinner: { label: 'Night Dinner', time: '7:30 – 9:15 PM', icon: '🌙' }
};
