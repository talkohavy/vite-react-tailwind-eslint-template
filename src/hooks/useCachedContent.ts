import { useEffect, useState } from 'react';
import { indexDB } from '../main';

type useCachedContentProps = {
  id: string | number;
};

/**
 * @description
 * The fetch-from-cache only happens once onload (or when the `id` changes).
 * From that point, `data` is taken from the inner-state of the hook.
 *
 * You can set the state using `setData`,
 * but that won't update the cache with the new value.
 */
export function useCachedContent<T>(props: useCachedContentProps) {
  const { id } = props;

  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    async function loadCachedContentIfExists() {
      try {
        const cachedRecord = (await indexDB.getRecordById(id)) as T | null;

        if (cachedRecord) setData(cachedRecord);
      } catch (error) {
        console.error('Failed to load cached resource:', error);
      }
    }

    loadCachedContentIfExists();
  }, [id]);

  return { data, setData };
}
