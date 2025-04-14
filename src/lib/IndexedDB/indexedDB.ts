interface IDBData {
  id?: number; // id is optional since it will be auto-generated
  [key: string]: any; // Additional properties
}

export class IndexedDB {
  private dbName: string;
  private tableName: string;
  private version: number;
  private db: IDBDatabase | null;

  constructor(dbName: string, tableName: string, version = 1) {
    this.dbName = dbName;
    this.tableName = tableName;
    this.version = version;
    this.db = null;
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const returnDbOnSuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      const handleInitError = (event: Event) => {
        const { error } = event.target as IDBOpenDBRequest;
        reject(`Failed to open database: ${error}`);
      };

      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = this.createTableIfDoesntExist;
      request.onsuccess = returnDbOnSuccess;
      request.onerror = handleInitError;
    });
  }

  async addRecord(data: IDBData): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.add(data);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = (event: Event) => reject(`Create failed: ${(event.target as IDBRequest).error}`);
    });
  }

  async getRecordById(id: number): Promise<IDBData> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.get(id);

      request.onsuccess = () => {
        if (request.result) return resolve(request.result as IDBData);

        return reject(`Item with id ${id} not found.`);
      };
      request.onerror = (event: Event) => reject(`Read failed: ${(event.target as IDBRequest).error}`);
    });
  }

  async getRecords(query: Partial<IDBData>): Promise<IDBData[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);

      const request = tableClient.getAll();

      request.onsuccess = () => {
        const result = request.result as IDBData[];
        // Filter results based on the query parameters
        const filteredResults = result.filter((item) =>
          // Ensure the query's key exists and matches the value
          Object.keys(query).every((key) => query[key as keyof IDBData] === item[key as keyof IDBData]),
        );

        resolve(filteredResults);
      };

      request.onerror = (event: Event) => {
        reject(`Find query failed: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async getAll(): Promise<IDBData[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readonly');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.getAll();

      request.onsuccess = () => resolve(request.result as IDBData[]);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(`Read all failed: ${error}`);
      };
    });
  }

  /**
   * @description
   * This update behaves like a PUT request. It will update the record if it exists, or create a new one if it doesn't.
   */
  async updateRecordById(id: number, updatedData: IDBData): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.put({ ...updatedData, id });

      request.onsuccess = () => resolve(`Item with id ${id} updated.`);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(`Update failed: ${error}`);
      };
    });
  }

  async deleteRecordById(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([this.tableName], 'readwrite');
      const tableClient = transaction.objectStore(this.tableName);
      const request = tableClient.delete(id);

      request.onsuccess = () => resolve(`Item with id ${id} deleted.`);
      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(`Delete failed: ${error}`);
      };
    });
  }

  // List all databases (Browser support may vary)
  static async listDatabases(): Promise<IDBDatabaseInfo[]> {
    if ('databases' in indexedDB) return indexedDB.databases();

    console.warn('The `indexedDB.databases()` API is not supported in this browser. Falling back to empty array.');
    return [];
  }

  // List all object stores (tables) in the current database
  async listTables(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const tableNames = Array.from(this.db.objectStoreNames);
      resolve(tableNames);
    });
  }

  private createTableIfDoesntExist(event: IDBVersionChangeEvent) {
    const db = (event.target as IDBOpenDBRequest).result;

    const isTableAlreadyExists = db.objectStoreNames.contains(this.tableName);

    if (isTableAlreadyExists) return;

    db.createObjectStore(this.tableName, { keyPath: 'id', autoIncrement: true });
  }
}
