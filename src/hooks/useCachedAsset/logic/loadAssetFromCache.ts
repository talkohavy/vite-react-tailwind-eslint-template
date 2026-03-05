import { ON_DEMAND_CACHE_NAME } from '@src/common/constants';
import { isCachesFeatureEnabled } from '@src/common/utils/isCachesFeatureEnabled';

export async function loadAssetFromCache(requestPath: string) {
  if (!isCachesFeatureEnabled()) return;

  try {
    const cache = await caches.open(ON_DEMAND_CACHE_NAME);
    const cachedData = await cache.match(requestPath);

    return cachedData;
  } catch (error) {
    console.error('Failed to load cached resource:', error);
  }
}
