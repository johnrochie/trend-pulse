'use server';

import { Resend } from 'resend';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const honeypot = formData.get('website_url') as string;
  if (honeypot) {
    return { ok: true, data: null };
  }
  const ip = await getClientIp();
  if (!checkRateLimit(ip, 'contact').ok) {
    return { ok: false, error: 'Too many messages. Please try again later.' };
  }

  const name = formData.get('name') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? 'Trend Pulse <onboarding@resend.dev>';

  if (!process.env.RESEND_API_KEY || !to) {
    return { ok: false, error: 'Contact form not configured.' };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: subject ? `Contact: ${subject}` : 'Contact form submission',
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name || '(not provided)'}</p>
        <p><strong>Subject:</strong> ${subject || '(not provided)'}</p>
        <h3>Message</h3>
        <p>${(message || '').replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to send message';
    return { ok: false, error: msg };
  }
}
