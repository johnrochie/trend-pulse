'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr.buffer;
}

export default function PushPrompt() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'subscribing' | 'done'>('idle');

  useEffect(() => {
    // Only show if browser supports push + permission not yet decided + not dismissed
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      Notification.permission !== 'default' ||
      localStorage.getItem('push-dismissed') === 'true'
    ) return;

    // Delay 12 seconds so it doesn't interrupt the initial page load
    const timer = setTimeout(() => setVisible(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  async function subscribe() {
    setStatus('subscribing');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setVisible(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      });
      setStatus('done');
      setTimeout(() => setVisible(false), 2500);
    } catch (err) {
      console.error('Push subscribe failed:', err);
      setVisible(false);
    }
  }

  function dismiss() {
    localStorage.setItem('push-dismissed', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          {status === 'done' ? (
            <p className="text-sm font-semibold text-green-400">You're subscribed! ✓</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-white mb-0.5">Breaking news alerts</p>
              <p className="text-xs text-gray-400 mb-3">
                Get notified when major stories break — no spam, just news.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={subscribe}
                  disabled={status === 'subscribing'}
                  className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {status === 'subscribing' ? 'Subscribing…' : 'Subscribe'}
                </button>
                <button
                  onClick={dismiss}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white transition-colors"
                >
                  No thanks
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
