export type IndexedDBProps = {
  dbName: string;
  version?: number;
};

export type CreateTableProps = {
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
