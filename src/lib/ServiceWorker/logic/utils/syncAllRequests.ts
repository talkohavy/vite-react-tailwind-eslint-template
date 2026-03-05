import { StatusCodes, syncRequestsTableName } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';
import { HttpError } from '@src/lib/HttpClient/logic/HttpError';
import { indexedDBClient } from '@src/lib/IndexedDB';
import type { RequestDetails } from '@src/common/types';

export async function syncAllRequests(): Promise<void> {
  const requestsToSend = await indexedDBClient.getAll<RequestDetails & { id: string }>({
    tableName: syncRequestsTableName,
  });

  for (const request of requestsToSend) {
    try {
      const { id, url, options } = request;

      await httpClient.post(url, options).promise;

      await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id });
    } catch (error: any) {
      if (error instanceof HttpError && error.status === StatusCodes.Conflict) {
        await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id: request.id });
        continue; // <--- prevent console.log below. silently continue.
      }
      console.log(`Error processing request with id of "${request.id}"`, error);
    }
  }
}
