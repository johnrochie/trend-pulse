'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'trendpulse-cookie-consent';

type ConsentState = 'pending' | 'accepted' | 'rejected' | null;

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    setConsent(stored === 'accepted' || stored === 'rejected' ? stored : 'pending');
    setMounted(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated'));
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated'));
  }

  if (!mounted) return null;

  return (
    <>
      {consent === 'pending' && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gray-900 border-t border-gray-700"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              We use analytics to improve our site. No personal data is sold.{' '}
              <Link href="/privacy#cookies" className="text-blue-400 hover:text-blue-300 hover:underline">
                Learn more
              </Link>
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
