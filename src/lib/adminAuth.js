// Admin auth with 48-hour session persistence
// Stores the admin key + expiry in localStorage

const STORAGE_KEY = 'ccf_admin_session';
const SESSION_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

export function getSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session.key;
  } catch {
    return null;
  }
}

export function saveSession(key) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    key,
    expiresAt: Date.now() + SESSION_DURATION_MS
  }));
  // Also store in sessionStorage for the social preview page
  sessionStorage.setItem('ccf_admin_key', key);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem('ccf_admin_key');
}
