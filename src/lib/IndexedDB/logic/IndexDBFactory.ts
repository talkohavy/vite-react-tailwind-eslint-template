import type { InitIndexedDB, TableMetadata } from '../types';

export class IndexDBFactory {
  private db: IDBDatabase | null;
  private upgradeAttempts: number;
  private maxUpgradeAttempts: number;
  private upgradeRetryTimeout: number;

  constructor() {
    this.db = null;
    this.upgradeAttempts = 0;
    this.maxUpgradeAttempts = 5;
    this.upgradeRetryTimeout = 3000;
  }

  async initializeDB(props: InitIndexedDB): Promise<IDBDatabase> {
    const { dbName, tables, version } = props;

    return new Promise((resolve, reject) => {
      try {
        if (this.db) {
          this.db.close();
          this.db = null;
        }

        const request = indexedDB.open(dbName, version);

        request.onblocked = (_event: Event) => this.handleAnotherTabHasDBOpenWithOlderVersion(props, resolve, reject);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          console.log(`Upgrading database from version ${event.oldVersion} to ${event.newVersion}`);

          const db = (event.target as IDBOpenDBRequest).result;
          this.db = db;

          const activeTransaction = (event.target as IDBOpenDBRequest).transaction!;

          this.deleteTablesNotInSchema(tables);
          this.createOrUpdateTables(activeTransaction, tables);
        };

        request.onsuccess = (event: Event) => {
          this.db = (event.target as IDBOpenDBRequest).result;

          this.upgradeAttempts = 0; // <--- Reset upgrade attempts on success

          this.db.onversionchange = () => {
            this.db?.close();
            this.db = null;
            console.log('A new version of the application is ready. Please reload the page.');

            alert('A new version of the application is ready. Please reload the page.');
            window.location.reload();
          };

          console.log(`Database ${dbName} initialized successfully with version ${version}!`);
          resolve(this.db);
        };

        request.onerror = (event: Event) => {
          const error = (event.target as IDBOpenDBRequest).error;
          reject({ message: `Failed to initialize database: ${error?.message}` });
        };
      } catch (error) {
        reject({ message: `Unexpected error initializing database: ${(error as Error).message}` });
      }
    });
  }

  private deleteTablesNotInSchema(tables: TableMetadata[]): void {
    if (!this.db) throw new Error('Database not initialized');

    const tableNames = tables.map((table) => table.tableName);
    const existingTableNames = Array.from(this.db.objectStoreNames);
    existingTableNames.forEach((existingTableName) => {
      if (!tableNames.includes(existingTableName)) {
        try {
          console.log(`Deleting table ${existingTableName} as it's no longer needed`);
          this.db?.deleteObjectStore(existingTableName);
        } catch (error) {
          console.error(`Error deleting table ${existingTableName}:`, error);
        }
      }
    });
  }

  private createOrUpdateTables(activeTransaction: IDBTransaction, tables: TableMetadata[]): void {
    if (!this.db) throw new Error('Database not initialized');

    tables.forEach((table) => {
      const { tableName, recordId = 'id', autoIncrement, indexes = [] } = table;

      try {
        const isTableAlreadyExists = this.isTableAlreadyExists(tableName);

        const tableClient: IDBObjectStore = isTableAlreadyExists
          ? this.getTableClientFromActiveTransaction(activeTransaction, tableName)
          : this.createNewTableClient({ tableName, recordId, autoIncrement });

        const filteredIndexes = indexes.filter(({ indexName }) => !tableClient.indexNames.contains(indexName));
        filteredIndexes.forEach(({ indexName, fieldName, unique = false }) => {
          tableClient.createIndex(indexName, fieldName, { unique });
        });
      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error);
        // Continue with other tables instead of failing the entire upgrade.
      }
    });
  }

  /**
   * Retry database initialization after a timeout.
   */
  private retryInitialization(
    props: InitIndexedDB,
    resolve: (db: IDBDatabase) => void,
    reject: (reason: any) => void,
  ): void {
    this.upgradeAttempts++;

    if (this.upgradeAttempts <= this.maxUpgradeAttempts) {
      console.log(`Retrying database initialization (Attempt ${this.upgradeAttempts}/${this.maxUpgradeAttempts})...`);

      setTimeout(async () => {
        try {
          const db = await this.initializeDB(props);
          resolve(db);
        } catch (error) {
          reject(error);
        }
      }, this.upgradeRetryTimeout);

      return;
    }

    reject({ message: 'Maximum upgrade attempts reached. Please close other browser tabs and reload the page.' });
  }

  private isTableAlreadyExists(tableName: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    return this.db.objectStoreNames.contains(tableName);
  }

  private getTableClientFromActiveTransaction(activeTransaction: IDBTransaction, tableName: string): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const tableClient = activeTransaction.objectStore(tableName);
      return tableClient;
    } catch (error) {
      console.error(`Error getting table client for ${tableName}:`, error);
      throw new Error(`Could not access table ${tableName}: ${(error as Error).message}`);
    }
  }

  private createNewTableClient(props: TableMetadata): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');

    const { tableName, recordId, autoIncrement } = props;

    try {
      const tableClient = this.db.createObjectStore(tableName, { keyPath: recordId, autoIncrement });
      return tableClient;
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
      throw new Error(`Failed to create table ${tableName}: ${(error as Error).message}`);
    }
  }

  private handleAnotherTabHasDBOpenWithOlderVersion(
    props: InitIndexedDB,
    resolve: (db: IDBDatabase) => void,
    reject: (reason: any) => void,
  ) {
    console.warn('Database upgrade blocked. Another tab may be using the database.');

    const userClickedOk = confirm(
      'Application update is waiting. Please close other tabs using this application, then click OK to continue.',
    );

    if (userClickedOk) return this.retryInitialization(props, resolve, reject);

    reject(new Error('Database upgrade blocked by user choice.'));
  }
}
