// Admin auth with 48-hour session + device registration
// Registered devices get auto-login without password

const STORAGE_KEY = 'ccf_admin_session';
const DEVICE_KEY = 'ccf_device_token';
const SESSION_DURATION_MS = 48 * 60 * 60 * 1000;
const PASSKEY_API = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/passkey';

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
  } catch { return null; }
}

export function saveSession(key) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    key,
    expiresAt: Date.now() + SESSION_DURATION_MS
  }));
  sessionStorage.setItem('ccf_admin_key', key);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem('ccf_admin_key');
}

// Device token registration — simpler than WebAuthn, works everywhere
function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

export function getDeviceToken() {
  return localStorage.getItem(DEVICE_KEY);
}

// Register this device (requires password)
export async function registerDevice(adminKey, name) {
  const token = generateToken();
  const res = await fetch(`${PASSKEY_API}/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ credential_id: token, public_key: '', name: name || 'My Device' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  localStorage.setItem(DEVICE_KEY, token);
  // Also save a long session (1 year)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    key: adminKey,
    expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000)
  }));
  sessionStorage.setItem('ccf_admin_key', adminKey);
  return data;
}

// Check if this device is registered (auto-login)
export async function checkDeviceAuth() {
  const token = localStorage.getItem(DEVICE_KEY);
  if (!token) return { success: false, no_device: true };
  
  try {
    const res = await fetch(`${PASSKEY_API}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential_id: token })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      // Auto-save session
      saveSession('ccf2025admin');
      return { success: true, name: data.name };
    }
    // Token not recognized on server — remove it
    localStorage.removeItem(DEVICE_KEY);
    return { success: false };
  } catch {
    return { success: false };
  }
}

// Remove this device's registration
export function removeDeviceToken() {
  localStorage.removeItem(DEVICE_KEY);
}
