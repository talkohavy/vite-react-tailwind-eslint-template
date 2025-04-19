export type IndexedDBProps = {
  dbName: string;
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
  version?: number;
};
