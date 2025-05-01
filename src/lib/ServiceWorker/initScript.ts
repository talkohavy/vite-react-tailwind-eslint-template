import { AssetManager } from './logic/AssetManager';
import { MyServiceWorker } from './ServiceWorker';

const assetManager = new AssetManager();

async function initServiceWorker() {
  MyServiceWorker.getInstance(self);
  MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));
  MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches.bind(assetManager));
  MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy.bind(assetManager));
}

initServiceWorker();
