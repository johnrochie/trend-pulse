import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const SUBS_FILE = join(process.cwd(), 'data', 'push-subscriptions.json');
const MAX_SUBS = 2000;

function loadSubs(): any[] {
  try {
    const raw = readFileSync(SUBS_FILE, 'utf-8');
    return JSON.parse(raw).subscriptions ?? [];
  } catch {
    return [];
  }
}

function saveSubs(subs: any[]) {
  writeFileSync(SUBS_FILE, JSON.stringify({ subscriptions: subs, updatedAt: new Date().toISOString() }, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ ok: false, error: 'Invalid subscription' }, { status: 400 });
    }

    const subs = loadSubs();

    // Avoid duplicates
    const exists = subs.some((s) => s.endpoint === subscription.endpoint);
    if (!exists) {
      subs.push(subscription);
      // Ring buffer — keep only the newest MAX_SUBS
      if (subs.length > MAX_SUBS) subs.splice(0, subs.length - MAX_SUBS);
      saveSubs(subs);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Push subscribe error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
