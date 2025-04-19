import { useEffect, useState } from 'react';
import { loadAssetFromCache } from './logic/loadAssetFromCache';

type useCachedAssetProps = {
  assetUrl: string;
  isImage?: boolean;
};

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
  }, [assetUrl]);

  return { data, setData };
}
