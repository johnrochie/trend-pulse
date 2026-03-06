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

  if (!process.env.RESEND_API_KEY || !to) {
    return { ok: false, error: 'Newsletter not configured.' };
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
