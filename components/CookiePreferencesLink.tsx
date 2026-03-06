'use client';

const CONSENT_KEY = 'trendpulse-cookie-consent';

export default function CookiePreferencesLink() {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSENT_KEY);
      window.location.reload();
    }
  }

  return (
    <a
      href="/privacy#cookies"
      onClick={handleClick}
      className="text-sm text-gray-400 hover:text-white transition-colors"
    >
      Cookie preferences
    </a>
  );
}
