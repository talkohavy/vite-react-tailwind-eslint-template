import Button from '@src/components/controls/Button';
import FallbackImage from '@src/components/FallbackImage';
import Image from '@src/components/Image';
import LineOfCode from '@src/components/LineOfCode';
import Arrow from '@src/components/StoryTelling/Arrow';
import FlowStep from '@src/components/StoryTelling/FlowStep';
import MessageBox from '@src/components/StoryTelling/MessageBox';
import Scene from '@src/components/StoryTelling/Scene';
import { useCachedAsset } from '@src/hooks/useCachedAsset/useCachedAsset';
import { cacheAssetOnDemand } from '@src/pages/ProgressiveWebAppPage/logic/utils/cacheAssetOnDemand';

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
    <div className='flex flex-col gap-5 size-full p-4 overflow-auto'>
      <div>
        <div className='text-3xl font-medium'>Cache Asset</div>

        <p className='text-gray-500 dark:text-gray-400 mt-1 text-sm'>
          A story about how a static asset (like an image) gets fetched, stored in the browser, and shown — even
          offline.
        </p>
      </div>

      {/* ── Try it ────────────────────────────────────────── */}
      <Scene badge='Try it' title='Interactive demo'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Ensure the service worker is registered (e.g. visit the Register tab first, or run{' '}
          <LineOfCode text='build:sw:dev' /> and load the app). The asset is served from your app origin (
          <LineOfCode text={assetUrl} />
          ).
        </p>

        <Button onClick={fetchAndSaveAssetOnDemand}>Fetch and cache asset on demand</Button>

        <div className='text-sm h-xl'>
          <div className='font-medium mb-1'>Cached Image (from Cache API + state):</div>

          {cachedAsset ? (
            <Image src={cachedAsset as string} alt='Cached Resource' className='w-52 h-auto'>
              <FallbackImage />
            </Image>
          ) : (
            <div className='border rounded-lg p-3 text-gray-400 text-xs italic'>
              Empty — nothing in the on-demand cache yet.
            </div>
          )}
        </div>
      </Scene>

      {/* ── The Cast ───────────────────────────────────────── */}
      <Scene badge='The Players' title='Meet the pieces'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Before the story begins, here are the characters involved:
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='fetch(assetUrl)' />

            <span className='text-gray-600 dark:text-gray-400'>
              The Messenger. Requests the asset from the network (e.g. <LineOfCode text={assetUrl} />
              ). Returns a <LineOfCode text='Response' />; if the request fails or returns non-OK, we stop.
            </span>
          </div>

          <div className='border rounded-lg p-3'>
            <LineOfCode text='Cache API' /> (<LineOfCode text='caches.open' />, <LineOfCode text='cache.match' />,{' '}
            <LineOfCode text='cache.put' />
            ). <br />
            <span className='text-gray-600 dark:text-gray-400'>
              The Storage. A cache built into the browser, keyed by request URL. Survives page refreshes and works
              offline once populated.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='loadAssetFromCache(requestPath)' />

            <span className='text-gray-600 dark:text-gray-400'>
              The Lookup. Opens the on-demand cache, calls <LineOfCode text='cache.match(requestPath)' />. Returns the
              cached <LineOfCode text='Response' /> or nothing.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='cacheAssetOnDemand(response)' />

            <span className='text-gray-600 dark:text-gray-400'>
              The Librarian. Takes a <LineOfCode text='Response' /> and stores it in the Cache API under{' '}
              <LineOfCode text='response.url' /> (using <LineOfCode text='response.clone()' /> so the original can still
              be read).
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1 sm:col-span-2'>
            <LineOfCode text='useCachedAsset' />

            <span className='text-gray-600 dark:text-gray-400'>
              The Orchestrator. A hook that runs on load. Calls <LineOfCode text='loadAssetFromCache(assetUrl)' /> once;
              if something is found, it creates an object URL (for images) and sets state. You can also call{' '}
              <LineOfCode text='setData' /> from outside (e.g. after fetching and caching) to update the UI.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1 sm:col-span-2'>
            <LineOfCode text='Service Worker' /> (cache-first for this asset)
            <span className='text-gray-600 dark:text-gray-400'>
              Once the asset is in the on-demand cache, the SW can serve it for matching requests. So after you've
              cached the image, reloading or visiting offline still loads it from cache.
            </span>
          </div>
        </div>
      </Scene>

      {/* ── Scene 1: First Visit ───────────────────────────── */}
      <Scene badge='Scene 1' title='Your very first visit — the cache is empty'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          You've just opened the app. The on-demand cache has never been filled for this asset.
        </p>

        <FlowStep
          label='useCachedAsset wakes up on page load'
          detail={`It runs an effect with assetUrl = ${assetUrl}.`}
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='loadAssetFromCache(assetUrl) checks the Cache API'
          detail='Opens the on-demand cache and calls cache.match(assetUrl). Finds nothing.'
          variant='muted'
        />

        <Arrow />

        <FlowStep
          label='No cached Response — data stays null'
          detail="The hook doesn't call setData. The screen shows “Empty” until you prime the cache."
          variant='muted'
        />
      </Scene>

      {/* ── Scene 2: Clicking the Button ─────────────────── */}
      <Scene badge='Scene 2' title='You click the button — fetch and cache on demand'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This is the manual “prime the cache” action. It fetches from the network and stores the result.
        </p>

        <FlowStep
          label='fetchAndSaveAssetOnDemand() is called'
          detail='Triggered by the button click.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='fetch(assetUrl) → network request'
          detail='The Messenger requests the asset. If !response.ok, we log and return; no cache write.'
          variant='warn'
        />

        <Arrow />

        <FlowStep
          label='cacheAssetOnDemand(response)'
          detail='The Librarian stores the response in the Cache API (response.url → response.clone()).'
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='Blob + URL.createObjectURL(blob) → setData(objectUrl)'
          detail='We create an object URL from the response body and update state. The image appears on screen.'
          variant='success'
        />

        <MessageBox title='Note'>
          This updates React state and the Cache API. It does not re-run <LineOfCode text='useCachedAsset' />
          's effect. On the next page load, the hook will read from cache and show the image without hitting the
          network.
        </MessageBox>
      </Scene>

      {/* ── Scene 3: Refresh ──────────────────────────────── */}
      <Scene badge='Scene 3' title='You refresh the page — the asset is already cached'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          You've already fetched and cached the asset. Now you hit refresh.
        </p>

        <FlowStep
          label='useCachedAsset wakes up again'
          detail='Same as before — it runs its effect on mount with the same assetUrl.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='loadAssetFromCache(assetUrl) checks the Cache API'
          detail='cache.match(assetUrl) returns the cached Response.'
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='URL.createObjectURL(await cachedResponse.blob()) → setData(objectUrl)'
          detail='The hook builds an object URL from the cached blob and updates state. The image appears with zero network delay.'
          variant='success'
        />

        <MessageBox title='What you experience'>
          The image shows up immediately from cache. No spinner, no network request — instant load after the first time
          you've primed the cache.
        </MessageBox>
      </Scene>

      {/* ── Scene 4: Offline ─────────────────────────────── */}
      <Scene badge='Scene 4' title='The internet goes down'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Your Wi-Fi cuts out. You reload the page or open this tab again. What happens?
        </p>

        <FlowStep
          label='useCachedAsset runs'
          detail='Same flow — it calls loadAssetFromCache(assetUrl).'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='Cache API is local — loadAssetFromCache still works'
          detail='If you had previously cached the asset, cache.match(assetUrl) returns it. The image appears from cache. Offline-resilient.'
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='If the cache was never filled'
          detail='cache.match returns undefined. data stays null. You see “Empty”. You need network at least once to prime the cache.'
          variant='muted'
        />

        <MessageBox title='Optional check'>
          In DevTools → Application → Cache Storage, open the on-demand cache and confirm the asset URL is listed. Then
          go offline (Network → Offline), reload, and open this tab — the image should still load.
        </MessageBox>
      </Scene>
    </div>
  );
}
