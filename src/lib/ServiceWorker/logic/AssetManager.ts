import { DYNAMIC_CACHE_NAME, STATIC_CACHE_NAME } from './constants';

export class AssetManager {
  async cacheStaticAssets() {
    const staticCache = await caches.open(STATIC_CACHE_NAME);

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

    await staticCache.addAll(manifest);
  }

  async cleanUpOldCaches() {
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

  /**
   * @description
   * Fast, but not always reliable. If the network is slow, it may return a cached response instead of the latest one.
   * This is useful for assets that don't change often, like images or fonts.
   */
  async cacheWithNetworkFallbackStrategy(event: any) {
    try {
      const cacheHit = await caches.match(event.request);

      if (cacheHit) return cacheHit;

      const response = await fetch(event.request);

      if (response && response.status === 200 && response.type === 'basic') {
        await this.dynamicallyCacheResponse(event, response);
      }

      return response;
    } catch (error) {
      console.error(error);

      return caches.match('/index.html');
    }
  }

  /**
   * @description
   * Slower, but more reliable. It will always return the latest response from the network.
   * If the network is unavailable, it will return the cached response.
   * This is useful for assets that change often, like API responses.
   */
  async networkWithCacheFallbackStrategy(event: any) {
    try {
      const response = await fetch(event.request);

      if (response && response.status === 200 && response.type === 'basic') {
        await this.dynamicallyCacheResponse(event, response);
      }

      return response;
    } catch (error) {
      console.error(error);
      const cacheHit = await caches.match(event.request);

      if (cacheHit) return cacheHit;

      return caches.match('/index.html');
    }
  }

  async cacheThenNetwork(event: any) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cacheHit = await cache.match(event.request);
    if (cacheHit) return cacheHit;
    const response = await fetch(event.request);
    if (response && response.status === 200 && response.type === 'basic') {
      await this.dynamicallyCacheResponse(event, response);
    }
    return response;
  }

  private async dynamicallyCacheResponse(event: any, response: Response) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const responseClone = response.clone();
    await cache.put(event.request.url, responseClone);
  }
}
