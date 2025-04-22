import Button from '../../../../components/controls/Button';
import FallbackImage from '../../../../components/FallbackImage';
import Image from '../../../../components/Image';
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
      <div>Service Worker Tutorial</div>

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
