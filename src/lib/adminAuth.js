// Admin auth with 48-hour session persistence + passkey support

const STORAGE_KEY = 'ccf_admin_session';
const SESSION_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours
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

// Base64URL helpers
function bufToB64url(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function b64urlToBuf(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// Check if WebAuthn is available
export function isPasskeySupported() {
  return !!window.PublicKeyCredential && !!navigator.credentials;
}

// Register a new passkey (requires password)
export async function registerPasskey(adminKey, deviceName) {
  // Step 1: Get registration options
  const optRes = await fetch(`${PASSKEY_API}/register/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ name: deviceName })
  });
  const opts = await optRes.json();
  if (!optRes.ok) throw new Error(opts.error);

  // Convert base64url strings to ArrayBuffers for WebAuthn
  const publicKey = {
    ...opts.publicKey,
    challenge: b64urlToBuf(opts.publicKey.challenge),
    user: {
      ...opts.publicKey.user,
      id: b64urlToBuf(opts.publicKey.user.id),
    }
  };

  // Step 2: Create credential via browser WebAuthn API (triggers Face ID)
  const credential = await navigator.credentials.create({ publicKey });

  // Step 3: Send credential to server
  const credId = bufToB64url(credential.rawId);
  const attestation = bufToB64url(credential.response.attestationObject);

  const verRes = await fetch(`${PASSKEY_API}/register/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({
      credential_id: credId,
      public_key: attestation,
      name: deviceName
    })
  });
  const verData = await verRes.json();
  if (!verRes.ok) throw new Error(verData.error);
  return verData;
}

// Authenticate with passkey (no password needed)
export async function authenticateWithPasskey() {
  // Step 1: Get auth options
  const optRes = await fetch(`${PASSKEY_API}/auth/options`, { method: 'POST' });
  const opts = await optRes.json();
  if (!optRes.ok) {
    if (opts.no_passkeys) return { success: false, no_passkeys: true };
    throw new Error(opts.error);
  }

  // Convert challenge and allowCredentials IDs
  const publicKey = {
    ...opts.publicKey,
    challenge: b64urlToBuf(opts.publicKey.challenge),
    allowCredentials: opts.publicKey.allowCredentials.map(c => ({
      ...c,
      id: b64urlToBuf(c.id),
    }))
  };

  // Step 2: Get assertion via browser (triggers Face ID)
  const assertion = await navigator.credentials.get({ publicKey });

  // Step 3: Verify with server
  const credId = bufToB64url(assertion.rawId);
  const verRes = await fetch(`${PASSKEY_API}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential_id: credId })
  });
  const verData = await verRes.json();
  if (!verRes.ok) throw new Error(verData.error);

  // Save session
  saveSession('ccf2025admin');
  return { success: true, name: verData.name };
}
