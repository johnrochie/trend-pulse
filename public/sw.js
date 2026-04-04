// Minimal service worker for PWA / offline shell
const CACHE = 'trendpulse-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network-first for navigation; cache optional for static assets
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match(e.request).then((r) => r || caches.match('/'))
      )
    );
    return;
  }
  e.respondWith(fetch(e.request));
});

// Push notification handler
self.addEventListener('push', (e) => {
  const data = e.data?.json() ?? {};
  const title = data.title || 'Trend Pulse';
  const options = {
    body: data.body || 'New articles are available',
    icon: '/brand/favicon.ico',
    badge: '/brand/favicon.ico',
    tag: data.tag || 'trend-pulse-news',
    renotify: true,
    data: { url: data.url || '/' },
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click — open the linked article
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
