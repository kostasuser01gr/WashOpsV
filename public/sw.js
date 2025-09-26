self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'washopsv-sync') {
    event.waitUntil(
      (async () => {
        // Placeholder: background sync ping
        await fetch('/api/cron/hourly', { headers: { 'user-agent': 'vercel-cron/1.0' } }).catch(
          () => {},
        );
      })(),
    );
  }
});
