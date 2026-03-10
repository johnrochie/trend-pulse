'use server';

import { Resend } from 'resend';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeNewsletter(email: string, honeypot?: string) {
  if (honeypot) {
    return { ok: true };
  }
  const ip = await getClientIp();
  if (!checkRateLimit(ip, 'newsletter').ok) {
    return { ok: false, error: 'Too many signup attempts. Please try again later.' };
  }
  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? 'Trend Pulse <onboarding@resend.dev>';
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!process.env.RESEND_API_KEY || !to) {
    return { ok: false, error: 'Newsletter not configured.' };
  }

  // Add contact to Resend audience for daily digest broadcasts
  if (audienceId) {
    try {
      const addRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!addRes.ok) {
        const errData = await addRes.json().catch(() => ({}));
        if (errData?.message?.includes?.('already exists') || addRes.status === 409) {
          // Already subscribed
        } else {
          console.error('Resend add contact error:', await addRes.text());
        }
      }
    } catch (e) {
      console.error('Failed to add to audience:', e);
    }
  }

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Newsletter signup: ${email}`,
    html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
