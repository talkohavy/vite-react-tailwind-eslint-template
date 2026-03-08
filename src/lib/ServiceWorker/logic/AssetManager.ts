import { DYNAMIC_CACHE_NAME, STATIC_CACHE_NAME } from '@src/common/constants/cacheNames';

const DEFAULT_HTML_FILE = '/index.html';

export type AssetManagerOptions = {
  cacheIgnoreList: string[];
  cacheLimit: number;
};

export class AssetManager {
  private readonly cacheIgnoreList: string[];
  private readonly cacheLimit: number;

  constructor(options = {} as AssetManagerOptions) {
    this.cacheIgnoreList = options.cacheIgnoreList ?? [];
    this.cacheLimit = options.cacheLimit ?? 50;
  }

  async cacheStaticAssets() {
    const staticCache = await caches.open(STATIC_CACHE_NAME);

    const appShell = ['/', DEFAULT_HTML_FILE, '/vite.svg'];
    await staticCache.addAll(appShell);

    await this.precacheBuildAssets(staticCache);
  }

  private async precacheBuildAssets(cache: Cache) {
    try {
      const manifestResponse = await fetch('/vite-manifest.json');

      if (!manifestResponse.ok) return;

      const manifest = await manifestResponse.json();
      const assetUrls = Object.values(manifest).flatMap((entry: any) => {
        const urls: string[] = [];

        /**
         * Case 1: `file` contains the path to the asset file under the dist folder.
         * An asset file could be one of: [js, ts, tsx, css, html, ...]
         */
        urls.push(`/${entry.file}`);

        /**
         * Case 2: `css`, if exists, contains the path to the css file under the dist folder.
         */
        if (entry.css) urls.push(...entry.css.map((css: string) => `/${css}`));

        return urls;
      });

      const uniqueUrls = [...new Set(assetUrls)];
      await cache.addAll(uniqueUrls);
    } catch {
      // Manifest not available (e.g. in development) — skip pre-caching
      console.warn('Failed to fetch vite-manifest.json. Web app will not work in offline mode.');
    }
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

  private shouldBeCached(url: string): boolean {
    return !this.cacheIgnoreList.some((ignoreUrl) => url.includes(ignoreUrl));
  }

  /**
   * @description
   * Fast, but not always reliable. If the network is slow, it may return a cached response instead of the latest one.
   * This is useful for assets that don't change often, like images or fonts.
   */
  async cacheWithNetworkFallbackStrategy(event: any) {
    const eventRequestUrl = event.request.url;
    const shouldBeCached = this.shouldBeCached(eventRequestUrl);

    try {
      if (!shouldBeCached) {
        const response = await fetch(event.request);
        return response;
      }

      const cacheHit = await caches.match(eventRequestUrl);

      if (cacheHit) return cacheHit;

      const response = await fetch(event.request);

      if (response.status === 200 && response.type === 'basic') {
        await this.dynamicallyCacheResponse(event, response);
      }

      return response;
    } catch (error) {
      console.error(error);

      if (!shouldBeCached) {
        return new Response('Offline', { status: 503, statusText: 'Client Offline' });
      }

      // Only serve index.html for document navigation (offline SPA fallback)
      if (event.request.mode === 'navigate') {
        return caches.match(DEFAULT_HTML_FILE);
      }

      return new Response('Offline', { status: 503, statusText: 'Client Offline' });
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

      if (response.status === 200 && response.type === 'basic') {
        await this.dynamicallyCacheResponse(event, response);
      }

      return response;
    } catch (error) {
      console.error(error);
      const cacheHit = await caches.match(event.request.url);

      if (cacheHit) return cacheHit;

      if (event.request.mode === 'navigate') {
        return caches.match(DEFAULT_HTML_FILE);
      }

      return new Response('Offline', { status: 503, statusText: 'Client Offline' });
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
