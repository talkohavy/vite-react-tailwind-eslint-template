import type { InitIndexedDB, TableMetadata } from '../types';

export class IndexDBFactory {
  private db: IDBDatabase | null;

  constructor() {
    this.db = null;
  }

  async initializeDB(props: InitIndexedDB): Promise<IDBDatabase> {
    const { dbName, tables, version } = props;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;

        tables.forEach((table) => {
          const { tableName, recordId = 'id', autoIncrement, indexes = [] } = table;

          const isTableAlreadyExists = this.isTableAlreadyExists(tableName);

          // TODO: Check what happens when table already exists, but version was just upgraded.
          // does isTableAlreadyExists return true?
          const tableClient = isTableAlreadyExists
            ? this.getTableClient(tableName)
            : this.createNewTableClient({ tableName, recordId, autoIncrement });

          const filteredIndexes = indexes.filter(({ indexName }) => !tableClient.indexNames.contains(indexName));

          filteredIndexes.forEach(({ indexName, fieldName, unique = false }) => {
            tableClient.createIndex(indexName, fieldName, { unique });
          });
        });
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log(`Database ${dbName} initialized successfully!`);
        resolve(this.db);
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject({ message: `Failed to initialize database: ${error?.message}` });
      };
    });
  }

  private getTableClient(tableName: string): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([tableName], 'readwrite');
    return transaction.objectStore(tableName);
  }

  private isTableAlreadyExists(tableName: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    return this.db.objectStoreNames.contains(tableName);
  }

  private createNewTableClient(props: TableMetadata): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');

    const { tableName, recordId, autoIncrement } = props;

    return this.db.createObjectStore(tableName, { keyPath: recordId, autoIncrement });
  }
}
