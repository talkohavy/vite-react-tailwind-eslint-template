// @ts-nocheck

console.log('Service Worker script mounted!');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static').then((cache) => {
      console.log('[Service Worker] caching app shell');
      cache.addAll([
        '/index.html',
        'index-BWWZR0Od.css',
        // '/',
        // '/manifest.json',
        // '/src/public/css/style.css',
        // '/src/public/js/app.js',
        // '/src/public/img/favicon.png',
        // '/src/public/img/logo.png',
        // '/src/public/img/hero.jpg',
        // '/src/public/img/hero.webp',
        // '/src/public/img/hero.avif',
      ]);
    }),
  );

  console.log('[Service Worker] installing service worker...', event);
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event);

  return self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
  try {
    // console.log('[Service Worker] fetching...', event);

    const cacheHit = await caches.match(event.request);

    const response = cacheHit ? cacheHit : fetch(event.request);

    await event.respondWith(response);
  } catch (error) {
    console.error(error);
  }
});
