import { API_GATEWAY_URL, dbName, syncRequestsTableName, tables } from '../../common/constants';
import { httpClient, initHttpClient } from '../HttpClient';
import { HttpError } from '../HttpClient/logic/HttpError';
import { indexedDBClient, initIndexedDB } from '../IndexedDB';
import { AssetManager } from './logic/AssetManager';
import { MyServiceWorker } from './ServiceWorker';
import type { RequestDetails } from '../../common/types';

const assetManager = new AssetManager();

async function initServiceWorker() {
  const version = 1;

  initHttpClient(API_GATEWAY_URL);
  await initIndexedDB({ dbName, tables, version });

  async function syncAllRequests(): Promise<void> {
    const requestsToSend = await indexedDBClient.getAll<RequestDetails & { id: string }>({
      tableName: syncRequestsTableName,
    });

    for (const request of requestsToSend) {
      try {
        const { id, url, options } = request;

        await httpClient.post(url, options).promise;

        await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id });
      } catch (error: any) {
        if (error instanceof HttpError && error.status === 409) {
          await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id: request.id });
          continue;
        }
        console.log('Error processing request:', error);
      }
    }
  }

  MyServiceWorker.getInstance(self);
  MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));
  MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches.bind(assetManager));
  MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy.bind(assetManager));
  MyServiceWorker.addOnSyncListener(syncAllRequests);
}

initServiceWorker();
