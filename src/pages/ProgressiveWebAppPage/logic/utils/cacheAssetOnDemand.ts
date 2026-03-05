import { ON_DEMAND_CACHE_NAME } from '@src/common/constants';
import { isCachesFeatureEnabled } from '@src/common/utils/isCachesFeatureEnabled';

export async function cacheAssetOnDemand(response: Response) {
  try {
    if (!isCachesFeatureEnabled()) return;

    const cache = await caches.open(ON_DEMAND_CACHE_NAME);
    return cache.put(response.url, response.clone());
  } catch (error) {
    console.error('Failed to cache resource:', error);
  }
}
