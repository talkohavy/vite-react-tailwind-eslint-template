import { useEffect, useRef, useState } from 'react';
import { tableName } from '../common/constants';
import { indexDB } from '../main';

type useCachedContentProps<T> = {
  id: string | number;
  thenNetworkCallback?: (setData: (data: T | null) => void) => Promise<void>;
};

/**
 * @description
 * The fetch-from-cache only happens once onload (or when the `id` changes).
 * From that point, `data` is taken from the inner-state of the hook.
 *
 * You can set the state using `setData`,
 * but that won't update the cache with the new value.
 */
export function useCachedContent<T = any>(props: useCachedContentProps<T>) {
  const { id, thenNetworkCallback } = props;

  const [data, setData] = useState<T | null>(null);
  const callbackRef = useRef(thenNetworkCallback);

  useEffect(() => {
    callbackRef.current = thenNetworkCallback;
  }, [thenNetworkCallback]);

  useEffect(() => {
    async function loadCachedContentIfExists() {
      try {
        const cachedRecord = (await indexDB.getRecordById({ tableName, id })) as T | null;

        if (cachedRecord) setData(cachedRecord);

        if (callbackRef.current) await callbackRef.current(setData);
      } catch (error) {
        console.error('Failed to load cached resource:', error);
      }
    }

    loadCachedContentIfExists();
  }, [id]);

  return { data, setData };
}
