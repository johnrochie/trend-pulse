/**
 * Simple in-memory rate limiter for server actions.
 * Use for contact/newsletter forms. Resets on deploy; for multi-instance use Redis/KV.
 */

const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_NEWSLETTER = 5;
const MAX_CONTACT = 5;

function getKey(ip: string, action: 'newsletter' | 'contact') {
  return `rl:${action}:${ip}`;
}

function prune() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) store.delete(key);
  }
}

export function checkRateLimit(ip: string, action: 'newsletter' | 'contact'): { ok: boolean } {
  prune();
  const max = action === 'newsletter' ? MAX_NEWSLETTER : MAX_CONTACT;
  const key = getKey(ip, action);
  const entry = store.get(key);
  const now = Date.now();
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= max) {
    return { ok: false };
  }
  entry.count += 1;
  return { ok: true };
}

export async function getClientIp(): Promise<string> {
  if (typeof window !== 'undefined') return '';
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const forwarded = h.get('x-forwarded-for') ?? h.get('x-real-ip');
    if (forwarded) return forwarded.split(',')[0].trim();
    return h.get('cf-connecting-ip') ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
