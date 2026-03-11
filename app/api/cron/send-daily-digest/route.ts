/**
 * Cron: sends the latest daily digest to newsletter subscribers via Resend Broadcast.
 * Vercel cron hits this at 6:05 PM GMT (after GitHub Actions publishes at 6 PM).
 * Protected by CRON_SECRET.
 */
import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const from = process.env.RESEND_FROM || 'Trend Pulse <onboarding@resend.dev>';

  if (!apiKey || !segmentId) {
    return NextResponse.json(
      { error: 'Newsletter not configured: RESEND_API_KEY and RESEND_SEGMENT_ID required' },
      { status: 500 }
    );
  }

  const baseUrl = config.site.url;
  const apiUrl = `${baseUrl}/api/articles?type=daily-digest&limit=1`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  const data = await res.json();

  if (!data.success || !data.data?.length) {
    return NextResponse.json(
      { error: 'No daily digest found to send', skipped: true },
      { status: 200 }
    );
  }

  const digest = data.data[0];
  const dateSlug = (digest.slug || '').replace('daily-digest-', '');
  const digestUrl = `${baseUrl}/daily-digest/${dateSlug}`;

  // Pre-filled share URLs (no API cost; recipients click to share)
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    digest.title
  )}&url=${encodeURIComponent(digestUrl)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    digestUrl
  )}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    digestUrl
  )}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #7c3aed;">Today's Daily Digest</h1>
  <h2>${escapeHtml(digest.title || '')}</h2>
  <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(digest.excerpt || '')}</p>
  <p><a href="${digestUrl}" style="display: inline-block; background: linear-gradient(to right, #7c3aed, #db2777); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Read Full Digest</a></p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 14px; color: #666;">Share with your network:</p>
  <p>
    <a href="${shareTwitter}" style="color: #1da1f2; margin-right: 12px;">Share on X/Twitter</a>
    <a href="${shareFacebook}" style="color: #1877f2; margin-right: 12px;">Share on Facebook</a>
    <a href="${shareLinkedIn}" style="color: #0a66c2;">Share on LinkedIn</a>
  </p>
  <p style="font-size: 12px; color: #999;">You received this because you subscribed to Trend Pulse. Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}</p>
</body>
</html>`;

  const text = `${digest.title}\n\n${digest.excerpt || ''}\n\nRead full digest: ${digestUrl}`;

  const broadcastRes = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      segment_id: segmentId,
      from,
      subject: digest.title || 'Trend Pulse Daily Digest',
      html,
      text,
      send: true,
    }),
  });

  if (!broadcastRes.ok) {
    const err = await broadcastRes.text();
    console.error('Resend broadcast error:', err);
    return NextResponse.json(
      { error: `Failed to send broadcast: ${err}` },
      { status: 500 }
    );
  }

  const result = await broadcastRes.json();
  return NextResponse.json({
    ok: true,
    broadcastId: result.id,
    digestUrl,
    subject: digest.title,
  });
}

function escapeHtml(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
