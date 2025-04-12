// @ts-nocheck

console.log('Service Worker script mounted!');

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event);
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event);

  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] fetching...', event);

  event.respondWith(
    fetch(event.request).then((response) => {
      return response;
    }),
  );
});
