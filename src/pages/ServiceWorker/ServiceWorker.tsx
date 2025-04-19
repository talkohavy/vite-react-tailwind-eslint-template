import { useEffect } from 'react';
import type { User } from './types';
import Button from '../../components/controls/Button';
import Image from '../../components/Image';
import { useCachedAsset } from '../../hooks/useCachedAsset/useCachedAsset';
import { useCachedContent } from '../../hooks/useCachedContent';
import { cacheAssetOnDemand } from './logic/utils/cacheAssetOnDemand';
import { cacheContentOnDemand } from './logic/utils/cacheContentOnDemand';
import { registerServiceWorker } from './logic/utils/registerServiceWorker';

const id = 2;
const assetUrl = '/heart-256x256.png';

export default function ServiceWorker() {
  const { data: cachedAsset, setData: setCachedImageUrl } = useCachedAsset({
    assetUrl,
    isImage: true,
  });

  const { data: cachedContent, setData: setCachedContent } = useCachedContent<User>({ id });

  const fetchAndSaveAssetOnDemand = async () => {
    const response = await fetch(assetUrl);

    if (!response.ok) {
      console.error('Failed to fetch resource:', response.statusText);
      return;
    }

    await cacheAssetOnDemand(response);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    setCachedImageUrl(objectUrl);
  };

  const fetchAndSaveContentOnDemand = async () => {
    const response = await fetch(`http://localhost:8000/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': 'vite-react-template',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch resource:', response.statusText);
      return;
    }

    const user = (await response.json()) as User;

    await cacheContentOnDemand(user);

    setCachedContent(user);
  };

  useEffect(() => {
    // should essentially be called on main.tsx, but for the sake of this example, we are calling it here
    registerServiceWorker();
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Service Worker Tutorial</div>

      <Button className='mt-4' onClick={fetchAndSaveAssetOnDemand}>
        Fetch and cache asset on demand
      </Button>

      <Button className='mt-4' onClick={fetchAndSaveContentOnDemand}>
        Fetch and cache dynamic content
      </Button>

      {cachedAsset && (
        <div className='mt-4'>
          <div>Cached Image:</div>

          <Image src={cachedAsset as string} alt='Cached Resource' className='w-1/2 h-auto'>
            <div className='shrink-0 size-32 flex justify-center items-center border rounded-md'>Image</div>
          </Image>
        </div>
      )}

      {cachedContent && (
        <div className='mt-4'>
          <div>Cached Content:</div>
          <div>{JSON.stringify(cachedContent)}</div>
        </div>
      )}
    </div>
  );
}
