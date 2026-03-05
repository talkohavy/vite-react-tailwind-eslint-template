import type { TableMetadata } from '@src/lib/IndexedDB/types';

export const dbName = 'vite-react-template';
export const dynamicTableName = 'dynamic';
export const usersTableName = 'users';
export const syncRequestsTableName = 'sync-requests';

export const tables: Array<TableMetadata> = [
  { tableName: dynamicTableName },
  {
    tableName: usersTableName,
    indexes: [],
  },
  {
    tableName: syncRequestsTableName,
    autoIncrement: true,
    indexes: [],
  },
];
