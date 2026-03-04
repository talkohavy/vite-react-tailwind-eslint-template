import Button from '../../../../components/controls/Button';
import LineOfCode from '../../../../components/LineOfCode';
import { useCacheContentTabLogic } from './logic/useCacheContentTabLogic';

export default function CacheContentTab() {
  const { cachedContent, fetchAndSaveContentOnDemand, shouldFetchFromNetworkAfterCache } = useCacheContentTabLogic();

  return (
    <div className='flex flex-col gap-4 size-full p-4 overflow-auto'>
      <div className='text-3xl font-medium'>Cache Content</div>

      <div className='flex flex-col gap-4 overflow-auto flex-1'>
        <div className='flex flex-col gap-2 border rounded-md p-3'>
          <div className='font-medium text-xl'>1. What this tab shows</div>

          <p className='dark:text-gray-200'>
            Caching of dynamic API data (user with <LineOfCode text='id=1' />) in IndexedDB. Two strategies are
            controlled by the <LineOfCode text='shouldFetchFromNetworkAfterCache' /> constant in code:{' '}
            <strong>cache-only</strong> (show only cached user; no network) and <strong>cache-then-network</strong>{' '}
            (show cached first, then update when the API responds). Data is fetched from{' '}
            <LineOfCode text='http://localhost:8000/users/1' />.
          </p>
        </div>

        <div className='flex flex-col gap-2 border rounded-md p-3'>
          <div className='font-medium text-xl'>2. How to test</div>

          <ol className='list-decimal list-inside space-y-1 dark:text-gray-200'>
            <li>
              Run a backend on <LineOfCode text='localhost:8000' /> that serves <LineOfCode text='GET /users/1' /> (JSON
              with e.g. <LineOfCode text='id, name, age, email' />
              ).
            </li>

            <li>Click &quot;Fetch and cache dynamic content&quot;. Cached user JSON should appear below.</li>

            <li>
              <strong>Cache-then-network</strong> (current when{' '}
              <LineOfCode text='shouldFetchFromNetworkAfterCache === true' />
              ): Refresh the page — you may briefly see cached data, then it updates when the API responds. Change the
              user on the server (e.g. age to 100), refresh again; you should see old value then updated value.
            </li>

            <li>
              <strong>Cache-only</strong>: Set <LineOfCode text='shouldFetchFromNetworkAfterCache = false' /> in this
              file, refresh. You always see the last cached user; no background fetch. Change the user on the server and
              refresh — you still see the stale cached value.
            </li>
          </ol>
        </div>

        <Button onClick={fetchAndSaveContentOnDemand}>Fetch and cache dynamic content</Button>

        <div>Chosen strategy: {shouldFetchFromNetworkAfterCache ? 'cache-then-network' : 'cache-only'}</div>

        <div>
          <div>Cached Content:</div>
          {cachedContent ? <div>{JSON.stringify(cachedContent)}</div> : <div>Empty</div>}
        </div>

        <strong className='inline-block'>Strategy details</strong>

        <div className='border rounded-md p-2'>
          <div>
            <strong>cache-only:</strong> On refresh you only see cached data (stale if server changed).
          </div>

          <div>
            <strong>cache-then-network:</strong> On refresh you see cached data first, then it updates when the network
            returns fresh data.
          </div>
        </div>
      </div>
    </div>
  );
}
