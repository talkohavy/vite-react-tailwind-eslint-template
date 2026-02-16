type CacheEntry<T> = {
  data: T;
  timestamp: number;
  error?: unknown;
};

const fetchCache = new Map<string, CacheEntry<unknown>>();
const inFlightPromises = new Map<string, Promise<unknown>>();

export function getCacheKey(queryKey: unknown[]): string {
  return JSON.stringify(queryKey);
}

export function getCachedEntry<T>(key: string): CacheEntry<T> | undefined {
  return fetchCache.get(key) as CacheEntry<T> | undefined;
}

export function isFresh(entry: CacheEntry<unknown>, staleTime: number): boolean {
  // if Infinity, data is always fresh
  if (staleTime === Number.POSITIVE_INFINITY) return true;

  // if 0, data is always stale
  if (staleTime === 0) return false;

  // data is fresh when within range
  return Date.now() - entry.timestamp <= staleTime;
}

export function setCachedData(key: string, data: unknown): void {
  fetchCache.set(key, { data, timestamp: Date.now() });
}

export function scheduleGc(key: string, gcTime: number): void {
  setTimeout(() => {
    fetchCache.delete(key);
    inFlightPromises.delete(key);
  }, gcTime);
}

export function getInFlightPromise(key: string): Promise<unknown> | undefined {
  return inFlightPromises.get(key);
}

export function setInFlightPromise(key: string, promise: Promise<unknown>): void {
  inFlightPromises.set(key, promise);
}

export function clearInFlightPromise(key: string): void {
  inFlightPromises.delete(key);
}

/**
 * Invalidate cached data for a query key. Next useAsyncFetch with this key will refetch.
 */
export function invalidateAsyncFetchCache(queryKey: unknown[]): void {
  const key = getCacheKey(queryKey);
  fetchCache.delete(key);
}
