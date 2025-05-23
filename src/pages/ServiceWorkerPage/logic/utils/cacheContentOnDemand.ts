import { dynamicTableName } from '../../../../common/constants';
import { indexedDBClient } from '../../../../lib/IndexedDB';

export async function cacheContentOnDemand(record: Record<string, any>) {
  try {
    const result = await indexedDBClient.upsertRecord({ tableName: dynamicTableName, data: record });

    return result;
  } catch (error) {
    console.error('Failed to cache content:', error);
  }
}
