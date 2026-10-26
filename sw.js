const DESTINATION = 'https://pace-david-run-20261026.web.app/training/';
const SCOPE = self.registration.scope;

// Replace the legacy GitHub Pages app immediately, including installed PWAs
// that still have the previous version controlling their page.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('campus-move-')).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.filter(client => client.url.startsWith(SCOPE)).map(client => client.navigate(SCOPE)));
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' && url.href.startsWith(SCOPE)) {
    event.respondWith(Response.redirect(DESTINATION, 302));
  }
});
