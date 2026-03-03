import Button from '../../../../components/controls/Button';
import FallbackImage from '../../../../components/FallbackImage';
import Image from '../../../../components/Image';
import LineOfCode from '../../../../components/LineOfCode';
import { useCachedAsset } from '../../../../hooks/useCachedAsset/useCachedAsset';
import { cacheAssetOnDemand } from '../../logic/utils/cacheAssetOnDemand';

const assetUrl = '/heart-256x256.png';

export default function CacheAssetTab() {
  const { data: cachedAsset, setData: setCachedImageUrl } = useCachedAsset({
    assetUrl,
    isImage: true,
  });

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

  return (
    <div className='size-full p-6 overflow-auto'>
      <div className='text-3xl font-medium'>Cache Asset</div>

      <div className='flex flex-col gap-2 border rounded-md p-3 mt-4'>
        <div className='font-medium text-xl'>1. What this tab shows</div>

        <ul className='dark:text-gray-400'>
          <li className='list-disc list-inside pl-1'>
            On-demand caching of a static asset (the heart image). Clicking the button fetches{' '}
            <LineOfCode text='/heart-256x256.png' />, stores it in the <LineOfCode text='Cache API' />, and displays it.
          </li>

          <li className='list-disc list-inside pl-1'>
            The SW uses a <LineOfCode text='cache-first' /> strategy for fetches, so once cached, the image can be shown
            offline.
          </li>
        </ul>
      </div>

      <div className='flex flex-col gap-2 border rounded-md p-3 mt-4'>
        <div className='font-medium text-xl'>2. How to test</div>

        <ol className='list-decimal list-inside space-y-1 dark:text-gray-400'>
          <li>
            Ensure the service worker is registered (e.g. visit the Register tab first, or run{' '}
            <LineOfCode text='build:sw:dev' /> and load the app).
          </li>

          <li>Click &quot;Fetch and cache asset on demand&quot;. The heart image should appear below.</li>

          <li>
            In <LineOfCode text='DevTools → Application → Cache Storage' />, open the on-demand cache and confirm the
            image URL is listed.
          </li>

          <li>
            Optional: go offline (<LineOfCode text='Network → Offline' />) and reload; open this tab again and click the
            button — the image can still load from cache.
          </li>
        </ol>
      </div>

      <Button className='mt-4' onClick={fetchAndSaveAssetOnDemand}>
        Fetch and cache asset on demand
      </Button>

      <div className='mt-4'>
        <div>Cached Image:</div>

        {cachedAsset ? (
          <Image src={cachedAsset as string} alt='Cached Resource' className='w-1/2 h-auto'>
            <FallbackImage />
          </Image>
        ) : (
          <div>Empty</div>
        )}
      </div>
    </div>
  );
}
