import { DYNAMIC_CACHE_NAME, STATIC_CACHE_NAME } from './constants';

export class AssetManager {
  cacheLimit = 50;

  async cacheStaticAssets() {
    const staticCache = await caches.open(STATIC_CACHE_NAME);

    const manifest = ['/', '/index.html', '/vite.svg'];

    await staticCache.addAll(manifest);
  }

  async cleanUpOldCaches() {
    const cacheNames = await caches.keys();
    const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
    const cachesToDelete = cacheNames.filter((cacheName) => !cacheWhitelist.includes(cacheName));
    const promiseArr = cachesToDelete.map(async (cacheName) => {
      try {
        return caches.delete(cacheName);
      } catch {
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

  private async dynamicallyCacheResponse(event: any, response: Response) {
    const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
    const responseClone = response.clone();

    const cacheKeys = await dynamicCache.keys();
    const cacheLength = cacheKeys.length;

    if (cacheLength >= this.cacheLimit) {
      const removeCount = cacheLength - this.cacheLimit + 1;
      await this.removeOverflowCache(dynamicCache, removeCount);
    }

    await dynamicCache.put(event.request.url, responseClone);
  }

  async removeOverflowCache(dynamicCache: Cache, removeCount: number) {
    const cacheKeys = await dynamicCache.keys();

    const promiseArr = [] as Array<Promise<boolean>>;

    for (let i = 0; i < removeCount; i++) {
      const oldestCacheKey = cacheKeys[i]!;
      promiseArr.push(dynamicCache.delete(oldestCacheKey));
    }

    return Promise.all(promiseArr);
  }
}
