import { AssetManager } from './logic/AssetManager';
import { MyServiceWorker } from './ServiceWorker';

const assetManager = new AssetManager();

MyServiceWorker.getInstance(self);
MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets);
MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches);
MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy);
