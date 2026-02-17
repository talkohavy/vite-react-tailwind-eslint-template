import type { TableMetadata } from '../lib/IndexedDB/types';

export const LS_KEY_THEME = 'theme';
export const LS_KEY_SEARCH_PARAMS = 'search-params';

export const API_GATEWAY_URL = 'http://localhost:8000';

const WS_SERVICE_PLACEHOLDER = '___WS_SERVICE_URL_PLACEHOLDER___';
export const WS_SERVICE_URL = WS_SERVICE_PLACEHOLDER.includes('WS_SERVICE_URL_PLACEHOLDER')
  ? 'http://localhost:8000'
  : WS_SERVICE_PLACEHOLDER;

export const API_URLS = {
  users: '/api/users',
  books: '/api/books',
};

export const REGEX = {
  alphaNumeric: /^[a-zA-Z0-9_]+$/,
  containsWhitespace: /\s/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  integerNumbers: /^\d+$/,
  nickname: /^[0-9_a-zA-Zא-ת*-]{1,30}$/,
  password: /^[a-zA-Z0-9!@#$%^&*()\-=]{1,20}$/,
  startsOrEndsWithWhitespace: /(?=(^\s|\s{2,}$))/,
  sso: /^[a-zA-Z0-9]{3,30}$/,
  partiallyValidCreditCard: /^(?!.*\s{2})([0-9][0-9\s]*)?$/,
};

export const ON_DEMAND_CACHE = 'on-demand-cache';

export const SYNC_REQUESTS = 'sync-requests';

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

export const BASE_URL = '/base';
