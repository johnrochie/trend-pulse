'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/actions/subscribe-newsletter';
import { Check } from 'lucide-react';

interface DigestNewsletterCTAProps {
  title?: string;
  description?: string;
  compact?: boolean;
}

export default function DigestNewsletterCTA({
  title = 'Never Miss a Digest',
  description = 'Subscribe to get daily AI-powered news summaries delivered to your inbox. Stay informed with the top stories across technology, business, finance, and more.',
  compact = false,
}: DigestNewsletterCTAProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('digest-email') as string;
    const honeypot = formData.get('website_url') as string;
    setStatus('sending');
    setErrorMessage('');
    const result = await subscribeNewsletter(email, honeypot);
    if (result.ok) {
      setStatus('success');
      e.currentTarget.reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-7 h-7 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You&apos;re subscribed!</h3>
        <p className="text-gray-400">Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30 ${compact ? 'p-6' : 'p-8'}`}>
      <div className="text-center">
        <h3 className={`font-bold mb-4 ${compact ? 'text-xl' : 'text-2xl'}`}>{title}</h3>
        <p className={`text-gray-300 mb-6 max-w-2xl mx-auto ${compact ? 'text-sm' : ''}`}>
          {description}
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
          <div className="hidden" aria-hidden="true">
            <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
          </div>
          <input
            type="email"
            name="digest-email"
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-4">{errorMessage}</p>
        )}
        {!compact && (
          <p className="text-gray-500 text-sm mt-4">
            Unsubscribe anytime. We respect your privacy.
          </p>
        )}
      </div>
    </div>
  );
}
