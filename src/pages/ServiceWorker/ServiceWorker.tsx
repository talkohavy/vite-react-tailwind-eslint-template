import { useEffect, useState } from 'react';
import { isCachesEnabled } from '../../common/utils/isCachesFeatureEnabled';
import Button from '../../components/controls/Button';
import { indexDB } from '../../main';
import { registerServiceWorker } from './utils/registerServiceWorker';

const ON_DEMAND_CACHE = 'on-demand-cache';
// const id = '1';

export default function ServiceWorker() {
  const [isVisible, setIsVisible] = useState(false);
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);

  const onSaveClick = async () => {
    const response = await fetch('/heart-256x256.png');
    const userResponse = await fetch('http://localhost:8000/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'tal',
        age: 29,
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': 'vite-react-template',
      },
      // credentials: 'include',
    });
    const user = await userResponse.json();
    await indexDB.addRecord(user);

    if (!response.ok) {
      console.error('Failed to fetch resource:', response.statusText);
      return;
    }

    if (isCachesEnabled()) cacheOnDemand(response);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    setCachedImageUrl(objectUrl);
  };

  const onStoreDynamicContentClick = async () => {
    const response = await fetch('/heart-256x256.png');
    const userResponse = await fetch('http://localhost:8000/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'tal',
        age: 29,
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': 'vite-react-template',
      },
      // credentials: 'include',
    });
    const user = await userResponse.json();
    await indexDB.addRecord(user);

    if (!response.ok) {
      console.error('Failed to fetch resource:', response.statusText);
      return;
    }

    if (isCachesEnabled()) cacheOnDemand(response);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    setCachedImageUrl(objectUrl);
  };

  useEffect(() => {
    async function loadCachedImageIfExists() {
      if (!isCachesEnabled()) return;

      try {
        const resourceToCache = '/heart-256x256.png';
        const cache = await caches.open(ON_DEMAND_CACHE);
        const cachedResponse = await cache.match(resourceToCache);
        if (cachedResponse) {
          const objectUrl = URL.createObjectURL(await cachedResponse.blob());
          setCachedImageUrl(objectUrl);
        }
      } catch (error) {
        console.error('Failed to load cached resource:', error);
      }
    }

    loadCachedImageIfExists();
  }, []);

  useEffect(() => {
    // should essentially be called on main.tsx, but for the sake of this example, we are calling it here
    registerServiceWorker();
  }, []);

  useEffect(() => {
    function appInstalled(_event: any) {
      console.log('PWA was installed');
    }

    window.addEventListener('appinstalled', appInstalled);

    return () => {
      window.removeEventListener('appinstalled', appInstalled);
    };
  }, []);

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Service Worker Tutorial</div>

      {isVisible && <img src='/heart-256x256.png' alt='PWA Install Prompt' className='w-1/2 h-auto' />}

      <Button className='mt-4' onClick={onSaveClick}>
        Save
      </Button>

      <Button className='mt-4' onClick={onStoreDynamicContentClick}>
        Store dynamic content
      </Button>

      {cachedImageUrl && (
        <div className='mt-4'>
          <div>Cached Image:</div>
          <img src={cachedImageUrl} alt='Cached Resource' className='w-1/2 h-auto' />
        </div>
      )}
    </div>
  );
}

async function cacheOnDemand(response: Response) {
  try {
    const cache = await caches.open(ON_DEMAND_CACHE);
    return cache.put(response.url, response.clone());
  } catch (error) {
    console.error('Failed to cache resource:', error);
  }
}
