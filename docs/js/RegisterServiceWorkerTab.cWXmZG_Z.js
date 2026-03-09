import{P as c,w as l}from"./index.B8AALybY.js";import{t}from"./LineOfCode.OWWCIlzn.js";import{i as a,n,r as s,t as r}from"./Scene.BNJ12pcb.js";import{t as i}from"./CodeBlock.BsNYkESk.js";var e=c(l());function u(){return(0,e.jsxs)("div",{className:"flex flex-col gap-5 size-full p-4 overflow-auto",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("div",{className:"text-3xl font-medium",children:"Register Service Worker"}),(0,e.jsx)("p",{className:"text-gray-500 dark:text-gray-400 mt-1 text-sm",children:"A story about how a service worker gets registered, initialised, and turns your web app into an offline-capable PWA."})]}),(0,e.jsxs)(r,{badge:"Step 1",title:"Registration — it lives in main.tsx, outside of React",children:[(0,e.jsxs)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["The very first thing you need to understand: ",(0,e.jsx)(t,{text:"registerServiceWorker()"})," is called at the"," ",(0,e.jsx)("strong",{children:"top level"})," of ",(0,e.jsx)(t,{text:"main.tsx"}),", completely outside any JSX or React component tree."]}),(0,e.jsx)(i,{code:`const root = createRoot(rootElement);
root.render(<Client />);

registerServiceWorker();   // <-- right here, top-level, outside React`,language:"typescript"}),(0,e.jsxs)(n,{title:"Why is this placement critical?",children:["If you register the service worker inside a React component (e.g. inside a ",(0,e.jsx)(t,{text:"useEffect"}),"), registration gets tied to that component's lifecycle. That means:",(0,e.jsxs)("ul",{className:"list-disc list-inside mt-1 space-y-1",children:[(0,e.jsx)("li",{children:"It only runs when that component mounts — if the user never visits the page containing it, the SW never gets registered."}),(0,e.jsx)("li",{children:"It can re-run on every re-render or re-mount, causing unnecessary re-registration attempts."}),(0,e.jsx)("li",{children:"The service worker misses on some assets that are loaded prior to when the component mounted."})]}),(0,e.jsxs)("p",{className:"mt-2",children:["By calling it at the module level in ",(0,e.jsx)(t,{text:"main.tsx"}),", it runs exactly once, as early as possible, regardless of which page the user lands on. The SW starts installing immediately and can begin caching assets before the user even navigates."]})]}),(0,e.jsxs)("div",{className:"border rounded-lg p-3 text-sm",children:[(0,e.jsxs)("div",{className:"font-semibold mb-1",children:["What ",(0,e.jsx)(t,{text:"registerServiceWorker()"})," does:"]}),(0,e.jsx)(i,{code:`export async function registerServiceWorker() {
  if (!isServiceWorkerFeatureEnabled()) {
    return console.warn('Service Worker is not supported in this browser.');
  }

  try {
    const response = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', response.scope);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}`,language:"typescript"}),(0,e.jsxs)("p",{className:"text-gray-600 dark:text-gray-400 mt-2",children:["It checks browser support, then tells the browser to download and install ",(0,e.jsx)(t,{text:"/sw.js"}),". Once registered, the browser manages the SW lifecycle independently of your app."]})]})]}),(0,e.jsxs)(r,{badge:"Step 2",title:"initServiceWorker — the SW bootstrap (synchronous by design)",children:[(0,e.jsxs)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["After the browser downloads ",(0,e.jsx)(t,{text:"/sw.js"}),", it executes the file. That file is the compiled output of ",(0,e.jsx)(t,{text:"src/lib/ServiceWorker/initServiceWorker.ts"}),". Here's what happens inside:"]}),(0,e.jsx)(i,{language:"typescript",code:`initServiceWorker();

function initServiceWorker() {
  const assetManager = new AssetManager(assetManagerOptions);
  initHttpClient(API_GATEWAY_URL);
  const indexedDBInitPromise = initIndexedDB({ dbName, tables, version });

  MyServiceWorker.getInstance(self);
  MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));
  MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches.bind(assetManager));
  MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy.bind(assetManager));
  MyServiceWorker.addOnSyncListener((event) => {
    event.waitUntil(indexedDBInitPromise.then(syncAllRequests));
  });
}`}),(0,e.jsxs)(n,{title:"Why is initServiceWorker synchronous (not async)?",children:["When the browser parses a service worker script, event listeners must be attached"," ",(0,e.jsx)("strong",{children:"synchronously during the initial execution"}),". The browser does not wait for promises to resolve before deciding which events the SW handles. If you wrote"," ",(0,e.jsx)(t,{text:"async function initServiceWorker()"})," and ",(0,e.jsx)(t,{text:"await"}),"'d something before adding listeners, the browser would finish parsing, see zero listeners, and the SW would be effectively dead — it would never respond to ",(0,e.jsx)(t,{text:"install"}),","," ",(0,e.jsx)(t,{text:"fetch"}),", or ",(0,e.jsx)(t,{text:"sync"})," events."]}),(0,e.jsx)(s,{label:"All listeners wired synchronously",detail:"install, activate, fetch, and sync handlers are all attached in one synchronous pass — no awaits in between.",variant:"success"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Async work happens inside the handlers, not before them",detail:"Notice how IndexedDB init returns a promise that is consumed later inside the sync handler via event.waitUntil(). The key is: attach first, await later.",variant:"default"})]}),(0,e.jsxs)(r,{badge:"Step 3",title:"cacheStaticAssets — making the app work offline",children:[(0,e.jsxs)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["This method runs during the ",(0,e.jsx)(t,{text:"install"})," event. Its job is to pre-cache every static file the app needs to boot — so the next visit can be fully offline."]}),(0,e.jsx)(s,{label:"Cache the app shell",detail:(0,e.jsxs)(e.Fragment,{children:["Opens the static cache and adds the minimum files needed to render: ",(0,e.jsx)(t,{text:"/"}),","," ",(0,e.jsx)(t,{text:"/index.html"}),", and ",(0,e.jsx)(t,{text:"/vite.svg"}),"."]}),variant:"default"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Fetch the Vite manifest",detail:(0,e.jsxs)(e.Fragment,{children:["Calls ",(0,e.jsx)(t,{text:"fetch('/vite-manifest.json')"})," to get the build manifest Vite generates during"," ",(0,e.jsx)(t,{text:"pnpm build"}),"."]}),variant:"default"}),(0,e.jsxs)(n,{title:"Why is the Vite manifest so important?",children:[(0,e.jsx)("p",{className:"mt-2",children:(0,e.jsx)("strong",{children:"Without the manifest, your app will crash offline with a white screen!"})}),(0,e.jsxs)("p",{className:"mt-2",children:["Here's the exact scenario: Vite code-splits your app — each route gets its own lazy-loaded JS chunk. If a user navigates to a page they haven't visited yet (e.g. via a React Router"," ",(0,e.jsx)(t,{text:"<Link>"}),"), the ",(0,e.jsx)(t,{text:"cacheWithNetworkFallbackStrategy"})," won't find that route's chunk in the cache (it was never fetched before). It falls back to ",(0,e.jsx)(t,{text:"/index.html"}),", which loads fine — but then React Router reads the URL, tries to render the matching route, and requests the JS bundle for that page. That bundle isn't in the cache either, and you're offline, so the"," ",(0,e.jsx)(t,{text:"<script>"})," tag fails to load. The result: a white screen and a broken app."]}),(0,e.jsxs)("p",{className:"mt-2",children:[(0,e.jsx)("strong",{children:"You need the vite-manifest.json!"})," Ergo, ",(0,e.jsx)("strong",{children:"you need to build your app"})," and run it using",(0,e.jsx)(t,{text:"pnpm preview"}),"."]}),(0,e.jsxs)("p",{className:"mt-2",children:["Every time you build your app, Vite hashes filenames (e.g. ",(0,e.jsx)(t,{text:"index-a1b2c3d4.js"}),"). The manifest maps source files to their hashed output paths. Without it, the SW would have no way to know which exact files to cache — the names change on every build. By reading the manifest, the SW can pre-cache"," ",(0,e.jsx)("strong",{children:"every JS, CSS, and asset file"})," your app needs, ensuring complete offline coverage."]}),(0,e.jsxs)("p",{className:"mt-2",children:["The manifest solves this by letting the SW pre-cache ",(0,e.jsx)("strong",{children:"all"})," chunks at install time — even the ones for pages the user has never visited. Every lazy-loaded route chunk, every CSS split, every asset is already sitting in the cache before the user ever goes offline. No matter which ",(0,e.jsx)(t,{text:"<Link>"})," ","they click, the chunk is there."]})]}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Parse and collect all asset URLs",detail:(0,e.jsxs)(e.Fragment,{children:["Extracts ",(0,e.jsx)(t,{text:"entry.file"})," (JS/TS/HTML bundles) and ",(0,e.jsx)(t,{text:"entry.css"})," (CSS chunks) from each manifest entry, deduplicates them, and caches them all."]}),variant:"success"}),(0,e.jsxs)("div",{className:"border rounded-lg p-3 text-sm",children:[(0,e.jsx)("div",{className:"font-semibold mb-1",children:"The full method:"}),(0,e.jsx)(i,{code:`async cacheStaticAssets() {
  const staticCache = await caches.open(STATIC_CACHE_NAME);

  const appShell = ['/', '/index.html', '/vite.svg'];
  await staticCache.addAll(appShell);

  await this.precacheBuildAssets(staticCache);
}

private async precacheBuildAssets(cache: Cache) {
  const manifestResponse = await fetch('/vite-manifest.json');
  if (!manifestResponse.ok) return;

  const manifest = await manifestResponse.json();
  const assetUrls = Object.values(manifest).flatMap((entry: any) => {
    const urls: string[] = [];
    urls.push(\`/\${entry.file}\`);
    if (entry.css) urls.push(...entry.css.map((css: string) => \`/\${css}\`));
    return urls;
  });

  const uniqueUrls = [...new Set(assetUrls)];
  await cache.addAll(uniqueUrls);
}`,language:"typescript"})]})]}),(0,e.jsxs)(r,{badge:"Step 4",title:"cacheWithNetworkFallbackStrategy — caching dynamic assets",children:[(0,e.jsxs)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["This method handles the ",(0,e.jsx)(t,{text:"fetch"})," event. Every network request your app makes passes through here. It uses a ",(0,e.jsx)("strong",{children:"cache-first"})," strategy with intelligent fallbacks."]}),(0,e.jsx)(s,{label:"Check if the URL should be cached",detail:(0,e.jsxs)(e.Fragment,{children:["URLs matching the ignore list (e.g. ",(0,e.jsx)(t,{text:"@vite"}),", ",(0,e.jsx)(t,{text:"chrome-extension://"}),") are fetched directly from the network — no caching."]}),variant:"muted"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Look up the cache",detail:(0,e.jsxs)(e.Fragment,{children:["Calls ",(0,e.jsx)(t,{text:"caches.match(requestUrl)"}),". If a cached response exists, return it immediately — zero network latency."]}),variant:"success"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Cache miss → fetch from network",detail:"If nothing is in cache, the request goes to the network normally.",variant:"default"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Dynamically cache the response",detail:(0,e.jsxs)(e.Fragment,{children:["If the network response is ",(0,e.jsx)(t,{text:"status 200"})," and ",(0,e.jsx)(t,{text:"type 'basic'"}),", the response is cloned and stored in the ",(0,e.jsx)("strong",{children:"dynamic cache"}),". Next time this URL is requested, it will be served from cache."]}),variant:"success"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"Network fails → offline fallback",detail:(0,e.jsxs)(e.Fragment,{children:["If the network is unreachable and the request is a page navigation, the SW returns the cached"," ",(0,e.jsx)(t,{text:"/index.html"})," — keeping your SPA alive even offline."]}),variant:"warn"}),(0,e.jsxs)(n,{title:"Static vs. Dynamic cache",children:["The static cache (filled during ",(0,e.jsx)(t,{text:"install"}),") contains the app shell and build assets — files you know upfront. The dynamic cache is a runtime safety net: it captures any successful request the user makes (API calls, lazy-loaded chunks, images) and stores them for future offline use. Together, they give you comprehensive offline coverage."]}),(0,e.jsxs)("div",{className:"border rounded-lg p-3 text-sm",children:[(0,e.jsx)("div",{className:"font-semibold mb-1",children:"The full strategy:"}),(0,e.jsx)(i,{code:`async cacheWithNetworkFallbackStrategy(event: any) {
  const eventRequestUrl = event.request.url;
  const shouldBeCached = this.shouldBeCached(eventRequestUrl);

  try {
    if (!shouldBeCached) return await fetch(event.request);

    const cacheHit = await caches.match(eventRequestUrl);
    if (cacheHit) return cacheHit;

    const response = await fetch(event.request);

    if (response.status === 200 && response.type === 'basic') {
      await this.dynamicallyCacheResponse(event, response);
    }

    return response;
  } catch (error) {
    if (!shouldBeCached)
      return new Response('Offline', { status: 503 });

    if (event.request.mode === 'navigate')
      return caches.match('/index.html');

    return new Response('Offline', { status: 503 });
  }
}`,language:"typescript"})]})]}),(0,e.jsxs)(r,{badge:"Try it",title:"How to test",children:[(0,e.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Verify the service worker is registered and working correctly."}),(0,e.jsx)(s,{label:"1. Build the app & service worker",detail:(0,e.jsxs)(e.Fragment,{children:["Run ",(0,e.jsx)(t,{text:"pnpm run build"})," so ",(0,e.jsx)(t,{text:"src/public/sw.js"})," is generated alongside the ",(0,e.jsx)(t,{text:"dist"})," folder."]}),variant:"default"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"2. Start the preview server",detail:(0,e.jsxs)(e.Fragment,{children:["Run ",(0,e.jsx)(t,{text:"pnpm preview"}),', open this page, then open DevTools → Application → Service Workers. You should see the SW registered and "activated and is running".']}),variant:"default"}),(0,e.jsx)(a,{}),(0,e.jsx)(s,{label:"3. Test offline mode",detail:'In DevTools → Network, set throttling to "Offline", then reload. The page should still load from the static and dynamic caches.',variant:"success"})]})]})}export{u as default};

//# sourceMappingURL=RegisterServiceWorkerTab.cWXmZG_Z.js.map