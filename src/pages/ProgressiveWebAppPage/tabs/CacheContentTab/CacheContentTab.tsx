import Button from '@src/components/controls/Button';
import LineOfCode from '@src/components/LineOfCode';
import Arrow from './content/Arrow';
import CalloutBox from './content/CalloutBox';
import FlowStep from './content/FlowStep';
import Fork from './content/Fork';
import Scene from './content/Scene';
import { useCacheContentTabLogic } from './logic/useCacheContentTabLogic';

export default function CacheContentTab() {
  const { data, fetchAndSaveContentOnDemand, shouldFetchFromNetworkAfterCache } = useCacheContentTabLogic();

  return (
    <div className='flex flex-col gap-5 size-full p-4 overflow-auto'>
      <div>
        <div className='text-3xl font-medium'>Cache Content</div>
        <p className='text-gray-500 dark:text-gray-400 mt-1 text-sm'>
          A story about how user data travels from a server to your browser — and stays there.
        </p>
      </div>

      {/* ── The Cast ───────────────────────────────────────── */}
      <Scene badge='The Players' title='Meet the pieces'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Before the story begins, here are the characters involved:
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='fetchUserById(1)' />
            <span className='text-gray-600 dark:text-gray-400'>
              The Messenger. Goes out to <LineOfCode text='localhost:8000/users/1' /> and comes back with user JSON.
              Returns <LineOfCode text='undefined' /> if the request fails or the user doesn't exist.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='indexedDBClient' />
            <span className='text-gray-600 dark:text-gray-400'>
              The Library. A database built into your browser. Unlike memory, it survives page refreshes and even
              browser restarts.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='cacheContentOnDemand(user)' />
            <span className='text-gray-600 dark:text-gray-400'>
              The Librarian. Takes a user object and stores (or updates) it in IndexedDB. Just a thin wrapper around{' '}
              <LineOfCode text='indexedDBClient.upsertRecord(...)' />.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1'>
            <LineOfCode text='thenNetworkCallback' />
            <span className='text-gray-600 dark:text-gray-400'>
              The Background Updater. Runs <em>after</em> the cache is loaded. Quietly hits the network to check for
              fresher data and re-saves if something changed.
            </span>
          </div>

          <div className='border rounded-lg p-3 flex flex-col gap-1 sm:col-span-2'>
            <LineOfCode text='useCachedContent' />

            <span className='text-gray-600 dark:text-gray-400'>
              The Orchestrator. A hook that runs on page load. First reads IndexedDB, then optionally fires{' '}
              <LineOfCode text='thenNetworkCallback' />. Controls what you see on screen.
            </span>
          </div>
        </div>
      </Scene>

      {/* ── Scene 1: First Visit ───────────────────────────── */}
      <Scene badge='Scene 1' title='Your very first visit — the cache is empty'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          You've just opened the app for the first time. There's nothing in IndexedDB yet.
        </p>

        <FlowStep
          label='useCachedContent wakes up on page load'
          detail='It fires an effect tied to the user id (1).'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='Checks IndexedDB for user id=1'
          detail='Calls indexedDBClient.getRecordById(...). Finds nothing. Data stays null.'
          variant='muted'
        />
        <Arrow />

        <div className='text-xs font-semibold text-gray-400 uppercase tracking-widest text-center'>
          Two paths depending on the strategy:
        </div>

        <Fork
          left={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>
                cache-only (<LineOfCode text='shouldFetchFromNetworkAfterCache = false' />)
              </div>

              <FlowStep
                label='No callback is passed. Done.'
                detail='Screen shows nothing. You must click the button to populate the cache.'
                variant='muted'
              />
            </>
          }
          right={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>
                cache-then-network (<LineOfCode text='shouldFetchFromNetworkAfterCache = true' />)
              </div>

              <FlowStep
                label='thenNetworkCallback fires'
                detail='Even though the cache was empty, it still goes to the network.'
                variant='default'
              />
              <Arrow />

              <FlowStep
                label='fetchUserById(1) hits the server'
                detail='GET localhost:8000/users/1 → returns user JSON.'
                variant='success'
              />

              <Arrow />

              <FlowStep
                label='cacheContentOnDemand(user)'
                detail='Saves user to IndexedDB for next time.'
                variant='success'
              />

              <Arrow />

              <FlowStep
                label='setData(user) — screen updates'
                detail='You now see the user, fetched live from the network.'
                variant='success'
              />
            </>
          }
        />
      </Scene>

      {/* ── Scene 2: Clicking the Button ─────────────────── */}
      <Scene badge='Scene 2' title='You click the button — fetchAndSaveContentOnDemand'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This is the manual "prime the cache" action. It works independently of any strategy.
        </p>

        <FlowStep
          label='fetchAndSaveContentOnDemand() is called'
          detail='Triggered directly by the button click.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='fetchUserById(1) → GET localhost:8000/users/1'
          detail='The Messenger goes to the server. If the request fails or returns non-OK, it returns undefined and we stop here.'
          variant='warn'
        />

        <Arrow />

        <FlowStep
          label='cacheContentOnDemand(user)'
          detail='The Librarian upserts the user into IndexedDB. If a record already exists, it is overwritten.'
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='setData(user) — screen updates'
          detail='State is updated. You see the user JSON on screen.'
          variant='success'
        />

        <CalloutBox title='Note'>
          This only updates the React state and IndexedDB. It does not re-run <LineOfCode text='useCachedContent' />. On
          the next page load, the cache will be there waiting.
        </CalloutBox>
      </Scene>

      {/* ── Scene 3: Refresh ──────────────────────────────── */}
      <Scene badge='Scene 3' title='You refresh the page — the cache now exists'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          You've already fetched and cached the user. Now you hit refresh.
        </p>

        <FlowStep
          label='useCachedContent wakes up again'
          detail='Same as before — it fires its effect on mount.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='Checks IndexedDB — finds user id=1!'
          detail='setData(cachedRecord) is called immediately. The user appears on screen with zero network delay.'
          variant='success'
        />

        <Arrow />

        <Fork
          left={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>cache-only strategy</div>
              <FlowStep
                label='No callback. Story ends here.'
                detail="You always see what was last saved. If the server changed the user, you won't know until you press the button again."
                variant='muted'
              />
            </>
          }
          right={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>cache-then-network strategy</div>
              <FlowStep
                label='thenNetworkCallback fires in the background'
                detail='While you already see stale data, it quietly goes to the server.'
                variant='default'
              />

              <Arrow />

              <FlowStep
                label='Server returns updated user'
                detail='Maybe the age changed from 25 to 100 on the server.'
                variant='warn'
              />

              <Arrow />

              <FlowStep
                label='cacheContentOnDemand(user) + setData(user)'
                detail='IndexedDB is updated. The screen re-renders with the fresh value.'
                variant='success'
              />
            </>
          }
        />

        <CalloutBox title='What you experience'>
          With cache-then-network you may briefly see an old value, then it snaps to the new one. That "flash of stale
          content" is intentional — it's the tradeoff for instant first paint.
        </CalloutBox>
      </Scene>

      {/* ── Scene 4: Offline ─────────────────────────────── */}
      <Scene badge='Scene 4' title='The internet goes down'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Your Wi-Fi cuts out. You refresh the page. What happens?
        </p>

        <FlowStep label='useCachedContent runs' detail='Same flow — it checks IndexedDB first.' variant='default' />

        <Arrow />

        <Fork
          left={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>
                Cache was filled before going offline
              </div>
              <FlowStep
                label='IndexedDB has user id=1'
                detail='setData(cachedRecord) fires. User appears on screen immediately.'
                variant='success'
              />
              <Arrow />

              <FlowStep
                label='thenNetworkCallback tries the network'
                detail='fetch() throws a network error. It is caught silently by the try/catch in useCachedContent.'
                variant='danger'
              />

              <Arrow />

              <FlowStep
                label='Screen keeps showing cached data'
                detail='No crash. The user sees the last known value. Offline-resilient.'
                variant='success'
              />
            </>
          }
          right={
            <>
              <div className='text-xs font-semibold text-center text-gray-500'>Cache was never filled</div>

              <FlowStep label='IndexedDB is empty' detail='Nothing to show. Data stays null.' variant='muted' />

              <Arrow />

              <FlowStep
                label='thenNetworkCallback fails too'
                detail='fetch() throws. Error is swallowed. Screen stays empty.'
                variant='danger'
              />

              <Arrow />

              <FlowStep
                label='Nothing to display'
                detail='You need internet at least once to prime the cache.'
                variant='muted'
              />
            </>
          }
        />
      </Scene>

      {/* ── Scene 5: User Deleted ─────────────────────────── */}
      <Scene badge='Scene 5' title='The user disappears from the server'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          What if user id=1 gets deleted on the backend? This is handled specifically in{' '}
          <LineOfCode text='thenNetworkCallback' />.
        </p>

        <FlowStep
          label='thenNetworkCallback fires (cache-then-network only)'
          detail='Runs after the cached user is shown.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='fetchUserById(1) returns undefined'
          detail='The server responded with a non-OK status (e.g. 404). The function returns undefined.'
          variant='danger'
        />

        <Arrow />

        <FlowStep
          label='indexedDBClient.deleteRecordById(...) is called'
          detail='The stale cached record is removed from IndexedDB.'
          variant='warn'
        />

        <Arrow />

        <FlowStep
          label='setData is NOT called'
          detail="The screen keeps showing the old cached user for this session — but it won't be there next refresh."
          variant='muted'
        />

        <CalloutBox title='Next refresh'>
          The cache is now empty. If the user is still gone from the server and strategy is cache-only, you'll see
          nothing. If cache-then-network, you'll see nothing (cache miss) and the network will confirm it's gone again.
        </CalloutBox>
      </Scene>

      {/* ── Try it ────────────────────────────────────────── */}
      <Scene badge='Try it' title='Interactive demo'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Make sure a backend is running at <LineOfCode text='localhost:8000' /> serving{' '}
          <LineOfCode text='GET /users/1' /> (JSON with <LineOfCode text='id, name, age, email' />
          ).
        </p>

        <div className='flex items-center gap-2 text-sm'>
          <span className='text-gray-500'>Active strategy:</span>

          <span className='font-semibold'>
            {shouldFetchFromNetworkAfterCache ? 'cache-then-network' : 'cache-only'}
          </span>

          <span className='text-gray-400 text-xs'>
            (change <LineOfCode text='shouldFetchFromNetworkAfterCache' /> in{' '}
            <LineOfCode text='useCacheContentTabLogic.ts' />)
          </span>
        </div>

        <Button onClick={fetchAndSaveContentOnDemand}>Fetch and cache dynamic content</Button>

        <div className='text-sm'>
          <div className='font-medium mb-1'>Cached Content (IndexedDB):</div>

          {data ? (
            <pre className='border rounded-lg p-3 text-xs overflow-auto bg-gray-50 dark:bg-gray-800/60'>
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <div className='border rounded-lg p-3 text-gray-400 text-xs italic'>Empty — nothing in IndexedDB yet.</div>
          )}
        </div>
      </Scene>
    </div>
  );
}
