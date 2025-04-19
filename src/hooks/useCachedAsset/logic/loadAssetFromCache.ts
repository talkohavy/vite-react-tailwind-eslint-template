import { ON_DEMAND_CACHE } from '../../../common/constants';
import { isCachesFeatureEnabled } from '../../../common/utils/isCachesFeatureEnabled';

export async function loadAssetFromCache(requestPath: string) {
  if (!isCachesFeatureEnabled()) return;

  try {
    const cache = await caches.open(ON_DEMAND_CACHE);
    const cachedResponse = await cache.match(requestPath);
    return cachedResponse;
  } catch (error) {
    console.error('Failed to load cached resource:', error);
  }
}
