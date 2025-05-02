import type { RequestDetails } from '../../../../../common/types';
import { syncRequestsTableName } from '../../../../../common/constants';
import { httpClient } from '../../../../../lib/HttpClient';
import { indexedDBClient } from '../../../../../lib/IndexedDB';
import { fireSyncEvent } from '../../../logic/utils/fireSyncEvent';

export async function sendDataLater(requestDetails: RequestDetails) {
  await indexedDBClient.addRecord({ tableName: syncRequestsTableName, data: requestDetails });
  await fireSyncEvent();
}

export async function sendDataNow(requestDetails: RequestDetails) {
  const { url, options } = requestDetails;

  await httpClient.post(url, options);
}
