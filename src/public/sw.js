// @ts-nocheck

const CACHE_VERSION = 'v2';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

console.log('Service Worker script mounted!');

self.addEventListener('install', (event) => {
  async function onInstall() {
    console.log('[Service Worker] installing service worker...', event);

    const cache = await caches.open(STATIC_CACHE_NAME);

    const manifest = [
      '/',
      '/index.html',
      '/vite.svg',
      '/main/Button-omu9TOoX.js',
      '/main/app.worker-CNfNJUnC.js',
      '/main/index-4eE04RDn.js',
      '/main/index-B3dQYfP6.css',
      '/main/index-BYJ2YQ0L.js',
      '/main/index-CLo41o5m.js',
      '/main/index-CNkW44am.js',
      '/main/index-CYHV7gDG.js',
      '/main/index-CbWa3dfm.js',
      '/main/index-CjjH-qJD.css',
      '/main/index-CpFIWtVZ.js',
      '/main/index-D8J9BXga.js',
      '/main/index-DpW0JFHX.js',
    ];

    await cache.addAll(manifest);
  }

  event.waitUntil(onInstall());
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event);

  async function cleanupCache() {
    const cacheNames = await caches.keys();
    const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
    const cachesToDelete = cacheNames.filter((cacheName) => !cacheWhitelist.includes(cacheName));
    const promiseArr = cachesToDelete.map((cacheName) => {
      try {
        caches.delete(cacheName);
      } catch (_error) {
        console.log(`cacheName ${cacheName} does not exists. moving on...`);
      }
    });

    return Promise.all(promiseArr);
  }

  event.waitUntil(cleanupCache());

  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  async function fetchProxyHandler() {
    try {
      const cacheHit = await caches.match(event.request);

      if (cacheHit) return cacheHit;

      const response = await fetch(event.request);

      // Optionally cache the fetched response for future use
      if (response && response.status === 200 && response.type === 'basic') {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const responseClone = response.clone();
        await cache.put(event.request.url, responseClone);
      }

      return response;
    } catch (error) {
      console.error(error);
      // Fallback to a default offline page if fetch fails
      return caches.match('/index.html');
    }
  }

  event.respondWith(fetchProxyHandler());
});
