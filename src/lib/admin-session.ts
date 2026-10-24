// Signed admin session cookie, shared by /api/auth and src/proxy.ts.
// Uses Web Crypto so it works in any runtime.

export const ADMIN_COOKIE = 'ps_admin_session';
const SESSION_DAYS = 7;

// Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET on Render.
// The fallbacks keep the current login working until they are set.
export function adminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@psmedicaldevices.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || `ps-admin:${adminCredentials().password}`;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(sig));
}

export async function createSessionToken(email: string): Promise<{ token: string; maxAge: number }> {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ email, exp: Date.now() + maxAge * 1000 })));
  return { token: `${payload}.${await sign(payload)}`, maxAge };
}

export async function verifySessionToken(token: string | undefined): Promise<{ email: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = await sign(payload);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(json) as { email?: string; exp?: number };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}
