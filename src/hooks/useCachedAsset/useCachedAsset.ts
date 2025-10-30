import { useEffect, useState } from 'react';
import { loadAssetFromCache } from './logic/loadAssetFromCache';

type useCachedAssetProps = {
  assetUrl: string;
  isImage?: boolean;
};

/**
 * @description
 * The fetch-from-cache only happens once onload (or when the `assetUrl` changes).
 * From that point, `data` is taken from the inner-state of the hook.
 *
 * You can set the state using `setData`,
 * but that won't update the cache with the new value.
 */
export function useCachedAsset(props: useCachedAssetProps) {
  const { assetUrl, isImage } = props;

  const [data, setData] = useState<Response | string | null>(null);

  useEffect(() => {
    async function loadCachedAssetIfExists() {
      const cachedResponse = await loadAssetFromCache(assetUrl);

      if (cachedResponse) {
        const objectUrl = isImage ? URL.createObjectURL(await cachedResponse.blob()) : cachedResponse;
        setData(objectUrl);
      }
    }

    loadCachedAssetIfExists();
  }, [isImage, assetUrl]);

  return { data, setData };
}
