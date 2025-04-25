export type InitIndexedDB = {
  dbName: string;
  /**
   * The tables to create when the database is initialized.
   * MUST be an array of at least one table.
   *
   * When you create an extra table, or an extra index,
   * you need to increment the version number.
   * That way, open tabs will be notified of the new version,
   * and will be asked to refresh the page.
   */
  tables: Array<TableMetadata>;
  version: number;
};

export type TableMetadata = {
  tableName: string;
  /**
   * The key which is used as the id to get a a record by.
   *
   * If `autoIncrement` is `false` (which is the default),
   * a newly inserted record **MUST** have a key named [recordId].
   * Trying to add a record without one, would result in an error.
   *
   * If `autoIncrement` is set to `true`, `recordId` is ignored,
   * and a newly inserted record gets its id from the autoIncrement.
   *
   * @default 'id'
   */
  recordId?: string;
  /**
   * If set to `true`, then then internal `keyPath`, which is set by `recordId`,
   * is ignored, and newly inserted records get their id from the auto increment.
   *
   * @default false
   */
  autoIncrement?: boolean;
  indexes?: Array<IndexMetadata>;
};

export type IndexMetadata = {
  indexName: string;
  fieldName: string | string[];
  unique?: boolean;
};

export type AddRecordProps = {
  tableName: string;
  data: Record<string, any>;
};

export type UpsertRecordProps = {
  tableName: string;
  data: Record<string, any>;
};

export type GetRecordByIdProps = {
  tableName: string;
  id: string | number;
};

export type GetRecordsProps<T = any> = {
  tableName: string;
  query: Partial<T>;
};

export type GetAllProps = {
  tableName: string;
};

export type UpdateRecordByIdProps<T = any> = {
  tableName: string;
  id: string | number;
  updatedData: Partial<T>;
};

export type DeleteRecordByIdProps = {
  tableName: string;
  id: string | number;
};

export type ClearAllProps = {
  tableName: string;
};

export type GetRecordsByIndexProps = {
  /**
   * The name of the table to query.
   */
  tableName: string;
  /**
   * The name of the index to query.
   */
  indexName: string;
  /**
   * The value to search for in the index.
   */
  value: any;
};
