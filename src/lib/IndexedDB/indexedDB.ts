import type { IndexedDBProps } from './types';

export class IndexedDB {
  private dbName: string;
  private tableName: string;
  private recordId: string;
  private autoIncrement: boolean;
  private version: number;
  private db: IDBDatabase | null;

  constructor(props: IndexedDBProps) {
    const { dbName, tableName, recordId = 'id', autoIncrement, version = 1 } = props;

    this.dbName = dbName;
    this.tableName = tableName;
    this.recordId = recordId;
    this.autoIncrement = !!autoIncrement;
    this.version = version;
    this.db = null;
  }

  async init(): Promise<this> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = this.createTableIfDoesntExist.bind(this);
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this);
      };
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBOpenDBRequest;
        reject({ message: `Failed to open database: ${error}` });
      };
    });
  }

  /**
   * @description
   * Returns the id of the record, which can later be used to get record by ID.
   */
  async addRecord(data: Record<string, any>): Promise<string | number> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.add(data);

      request.onsuccess = () => {
        const result = request.result as number;
        resolve(result);
      };
      request.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Create failed: ${errorMessage}` });
      };
    });
  }

  async getRecordById<T = any>(id: string | number): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.get(id);

      request.onsuccess = () => {
        const result = request.result as T;
        if (result) return resolve(result);

        return resolve(null);
      };
      request.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Read failed: ${errorMessage}` });
      };
    });
  }

  async getRecords<T = any>(query: Partial<T>): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);

      const request = tableClient.getAll();

      request.onsuccess = () => {
        const result = request.result as Array<T>;
        // Filter results based on the query parameters
        const filteredResults = result.filter((item) =>
          // Ensure the query's key exists and matches the value
          Object.keys(query).every((key) => query[key as keyof T] === item[key as keyof T]),
        );

        resolve(filteredResults);
      };

      request.onerror = (event: Event) => {
        const errorMessage = (event.target as IDBRequest).error;
        reject({ message: `Find query failed: ${errorMessage}` });
      };
    });
  }

  async getAll<T = any>(): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.getAll();

      request.onsuccess = () => {
        const result = request.result as Array<T>;
        resolve(result);
      };
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject({ message: `Read all failed: ${error}` });
      };
    });
  }

  /**
   * @description
   * This update behaves like a PUT request. It will update the record if it exists, or create a new one if it doesn't.
   */
  async updateRecordById<T = any>(id: string | number, updatedData: Partial<T>): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.put({ ...updatedData, id });

      request.onsuccess = () => resolve(`Item with id ${id} updated.`);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject({ message: `Update failed: ${error}` });
      };
    });
  }

  async deleteRecordById(id: string | number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: 'Database not initialized' });

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        console.warn(error);
        resolve(false);
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

  private createTableIfDoesntExist(event: IDBVersionChangeEvent) {
    const db = (event.target as IDBOpenDBRequest).result;

    const isTableAlreadyExists = db.objectStoreNames.contains(this.tableName);

    if (isTableAlreadyExists) return;

    db.createObjectStore(this.tableName, { keyPath: this.recordId, autoIncrement: this.autoIncrement });
  }
}
