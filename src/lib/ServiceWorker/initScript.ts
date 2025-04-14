import { AssetManager } from './logic/AssetManager';
import { ServiceWorker } from './ServiceWorker';

const assetManager = new AssetManager();

ServiceWorker.getInstance(self);
ServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets);
ServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches);
ServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy);
