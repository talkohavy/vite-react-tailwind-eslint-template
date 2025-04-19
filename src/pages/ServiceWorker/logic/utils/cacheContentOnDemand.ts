import { indexDB } from '../../../../main';

export async function cacheContentOnDemand(record: Record<string, any>) {
  try {
    const result = await indexDB.upsertRecord(record);

    return result;
  } catch (error) {
    console.error('Failed to cache content:', error);
  }
}
