import type {
  InitIndexedDB,
  AddRecordProps,
  UpsertRecordProps,
  GetRecordByIdProps,
  GetRecordsProps,
  GetAllProps,
  UpdateRecordByIdProps,
  DeleteRecordByIdProps,
  ClearAllProps,
  GetRecordsByIndexProps,
} from './types';
import { IndexDBFactory } from './logic/IndexDBFactory';

class IndexedDBClient {
  private db: IDBDatabase | null;

  constructor(db: IDBDatabase | null) {
    this.db = db;
  }

  /**
   * @description
   * Returns the id of the record, which can later be used to get record by ID.
   *
   * If `autoIncrement` is `false`, it can throw an error if a record
   * with the same exact id already exists.
   */
  async addRecord(props: AddRecordProps): Promise<string | number> {
    const { tableName, data } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readwrite');
      const tableClient = transaction.objectStore(tableName);
      const addRequest = tableClient.add(data);

      addRequest.onsuccess = () => {
        const result = addRequest.result as number;
        resolve(result);
      };
      addRequest.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Create failed: ${errorMessage}` });
      };
    });
  }

  /**
   * @description
   * Same as `addRecord`, only it does not throw an error if a record
   * with the same exact id already exists. In such case, it overrides it.
   */
  async upsertRecord(props: UpsertRecordProps): Promise<string | number> {
    const { tableName, data } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readwrite');
      const tableClient = transaction.objectStore(tableName);
      const putRequest = tableClient.put(data);

      putRequest.onsuccess = () => {
        const result = putRequest.result as number;
        resolve(result);
      };
      putRequest.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Create failed: ${errorMessage}` });
      };
    });
  }

  async getRecordById<T = any>(props: GetRecordByIdProps): Promise<T | null> {
    const { tableName, id } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readonly');
      const tableClient = transaction.objectStore(tableName);
      const getRequest = tableClient.get(id);

      getRequest.onsuccess = () => {
        const result = getRequest.result as T;
        if (result) return resolve(result);

        return resolve(null);
      };
      getRequest.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Read failed: ${errorMessage}` });
      };
    });
  }

  async getAll<T = any>(props: GetAllProps): Promise<Array<T>> {
    const { tableName } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readonly');
      const tableClient = transaction.objectStore(tableName);
      const getAllRequest = tableClient.getAll() as IDBRequest<Array<T>>;

      getAllRequest.onsuccess = () => {
        const result = getAllRequest.result;
        resolve(result);
      };
      getAllRequest.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject({ message: `Read all failed: ${error}` });
      };
    });
  }

  /**
   * @description
   * **SLOW!**
   *
   * Try to avoid if you can, and use one of the other methods.
   *
   * Fetches all the records from the DB, and filters them using javascript.
   */
  async getRecordsByQuery<T = any>(props: GetRecordsProps<T>): Promise<Array<T>> {
    const { tableName, query } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readonly');
      const tableClient = transaction.objectStore(tableName);

      const getAllRequest = tableClient.getAll();

      getAllRequest.onsuccess = () => {
        const result = getAllRequest.result as Array<T>;
        // Filter results based on the query parameters
        const filteredResults = result.filter((item) =>
          // Ensure the query's key exists and matches the value
          Object.keys(query).every((key) => query[key as keyof T] === item[key as keyof T]),
        );

        resolve(filteredResults);
      };

      getAllRequest.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Find query failed: ${errorMessage}` });
      };
    });
  }

  /**
   * @description
   * This update behaves like a PUT request. It will update the record if it exists, or create a new one if it doesn't.
   */
  async updateRecordById<T = any>(props: UpdateRecordByIdProps<T>): Promise<string> {
    const { tableName, id, updatedData } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readwrite');
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.put({ ...updatedData, id });

      request.onsuccess = () => resolve(`Item with id ${id} updated.`);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject({ message: `Update failed: ${error}` });
      };
    });
  }

  async deleteRecordById(props: DeleteRecordByIdProps): Promise<boolean> {
    const { tableName, id } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readwrite');
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        console.warn(error);
        resolve(false);
      };
    });
  }

  async clearAll(props: ClearAllProps): Promise<boolean> {
    const { tableName } = props;

    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([tableName], 'readwrite');
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        console.warn(error);
        resolve(false);
      };
    });
  }

  /**
   * @description
   * Retrieves records from a table based on a specific indexed field.
   */
  async getRecordsByIndex<T = any>(props: GetRecordsByIndexProps): Promise<Array<T>> {
    const { tableName, indexName, value } = props;

    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([tableName], 'readonly');
    const objectStore = transaction.objectStore(tableName);
    const index = objectStore.index(indexName);

    const request = index.getAll(value);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result as Array<T>);
      };

      request.onerror = () => {
        reject(new Error(`Failed to retrieve records by index: ${request.error}`));
      };
    });
  }

  // List all databases (Browser support may vary)
  static async listDatabases(): Promise<IDBDatabaseInfo[]> {
    if ('databases' in indexedDB) return indexedDB.databases();

    console.warn('The `indexedDB.databases()` API is not supported in this browser. Falling back to empty array.');
    return [];
  }

  /**
   * @description
   * List all object stores (tables) in the current database
   */
  async listTables(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const tableNames = Array.from(this.db.objectStoreNames);
      resolve(tableNames);
    });
  }
}

export let indexedDBClient = new IndexedDBClient(null);

export async function initIndexedDB(props: InitIndexedDB): Promise<void> {
  try {
    const { dbName, tables, version = 1 } = props;

    if (tables.length === 0) throw new Error('You must provide at least one table to create.');

    const indexDBFactory = new IndexDBFactory();

    const idbDatabase = await indexDBFactory.initializeDB({ dbName, tables, version });

    indexedDBClient = new IndexedDBClient(idbDatabase);
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
  }
}
