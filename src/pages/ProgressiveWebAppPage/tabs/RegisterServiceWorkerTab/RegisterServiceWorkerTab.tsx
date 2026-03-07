import CodeBlock from '@src/components/CodeBlock';
import LineOfCode from '@src/components/LineOfCode';

export default function RegisterServiceWorkerTab() {
  return (
    <div className='size-full p-6 overflow-auto'>
      <div className='text-lg font-medium'>Register</div>

      <div className='flex flex-col gap-2 border rounded-md p-3 mt-4'>
        <div className='font-medium text-xl'>What this tab shows</div>

        <p>
          This tab registers the app&apos;s service worker (
          <LineOfCode text='/sw.js' />
          ). Once registered, the SW can cache the app shell and serve it when you&apos;re offline.
        </p>
      </div>

      <div className='flex flex-col gap-2 border rounded-md p-3 mt-4'>
        <div className='font-medium text-xl'>How to test</div>

        <ol className='list-decimal list-inside space-y-1'>
          <li>
            Run <LineOfCode text='pnpm run build:sw:dev' /> so <LineOfCode text='src/public/sw.js' /> exists.
          </li>

          <li>
            Start dev (<LineOfCode text='pnpm dev' />
            ), open this page, and open DevTools → Application → Service Workers. You should see the SW registered and
            &quot;activated and is running&quot;.
          </li>

          <li>
            Optional offline test: with the SW active, in DevTools → Network set throttling to &quot;Offline&quot;, then
            reload. The page should still load from cache (after the first visit).
          </li>
        </ol>
      </div>

      <div className='flex flex-col gap-2 border rounded-md p-3 mt-4'>
        <div className='font-medium text-xl'>Where the app shell is cached</div>

        <p>
          The Register tab only registers the SW. The code that actually caches the app shell runs <em>inside</em> the
          service worker, in the bundle built from <LineOfCode text='src/lib/ServiceWorker/initServiceWorker.ts' /> →{' '}
          <LineOfCode text='src/public/sw.js' />.
        </p>

        <p className='font-medium mt-2'>1. Install: pre-cache static URLs</p>

        <p>
          On <strong>install</strong>, the SW runs <LineOfCode text='AssetManager.cacheStaticAssets()' /> (in{' '}
          <LineOfCode text='src/lib/ServiceWorker/logic/AssetManager.ts' />
          ). It opens a static cache and adds the app shell URLs:
        </p>

        <div className='mt-1'>
          <CodeBlock
            code={
              "async cacheStaticAssets() {\n  const staticCache = await caches.open(STATIC_CACHE_NAME);\n  const manifest = ['/', '/index.html', '/vite.svg'];\n  await staticCache.addAll(manifest);\n}"
            }
            language='typescript'
          />
        </div>

        <p className='font-medium mt-2'>2. Wiring in the SW</p>

        <p>
          In <LineOfCode text='initServiceWorker.ts' />, that method is attached to the install event:
        </p>

        <div className='mt-1'>
          <CodeBlock
            code='MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));'
            language='typescript'
          />
        </div>

        <p className='font-medium mt-2'>3. Fetch: serve cache first, fallback to index.html</p>

        <p>
          When a request is made, the SW uses <LineOfCode text='cacheWithNetworkFallbackStrategy' />: try cache first,
          then network; if the network fails (e.g. offline), return cached <LineOfCode text='/index.html' /> so the app
          still loads:
        </p>

        <div className='mt-1'>
          <CodeBlock
            code={
              "async cacheWithNetworkFallbackStrategy(event) {\n  try {\n    const cacheHit = await caches.match(event.request);\n    if (cacheHit) return cacheHit;\n    const response = await fetch(event.request);\n    // ... cache successful response ...\n    return response;\n  } catch (error) {\n    return caches.match('/index.html');  // offline fallback\n  }\n}"
            }
            language='typescript'
          />
        </div>
      </div>
    </div>
  );
}
