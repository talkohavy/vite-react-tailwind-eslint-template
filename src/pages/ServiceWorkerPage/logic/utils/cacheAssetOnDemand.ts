import { ON_DEMAND_CACHE } from '../../../../common/constants';
import { isCachesFeatureEnabled } from '../../../../common/utils/isCachesFeatureEnabled';

export async function cacheAssetOnDemand(response: Response) {
  try {
    if (!isCachesFeatureEnabled()) return;

    const cache = await caches.open(ON_DEMAND_CACHE);
    return cache.put(response.url, response.clone());
  } catch (error) {
    console.error('Failed to cache resource:', error);
  }
}
