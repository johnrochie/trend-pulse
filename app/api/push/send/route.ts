import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import webpush from 'web-push';

export const dynamic = 'force-dynamic';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const SUBS_FILE = join(process.cwd(), 'data', 'push-subscriptions.json');

function loadSubs(): any[] {
  try {
    return JSON.parse(readFileSync(SUBS_FILE, 'utf-8')).subscriptions ?? [];
  } catch {
    return [];
  }
}

function saveSubs(subs: any[]) {
  writeFileSync(SUBS_FILE, JSON.stringify({ subscriptions: subs, updatedAt: new Date().toISOString() }, null, 2));
}

export async function POST(req: NextRequest) {
  // Verify secret
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.PUSH_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, body, url } = await req.json();
  const payload = JSON.stringify({ title, body, url, tag: 'trend-pulse-news' });

  const subs = loadSubs();
  let sent = 0;
  const dead: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (err: any) {
        // 404 / 410 = subscription expired — remove it
        if (err.statusCode === 404 || err.statusCode === 410) {
          dead.push(sub.endpoint);
        }
      }
    }),
  );

  // Clean up dead subscriptions
  if (dead.length > 0) {
    saveSubs(subs.filter((s) => !dead.includes(s.endpoint)));
  }

  return NextResponse.json({ ok: true, sent, failed: dead.length, total: subs.length });
}
