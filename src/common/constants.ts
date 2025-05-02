import type { TableMetadata } from '../lib/IndexedDB/types';

export const LS_KEY_THEME = 'theme';
export const LS_KEY_SEARCH_PARAMS = 'search-params';

export const API_GATEWAY_URL = 'http://localhost:8000';

export const API_URLS = {
  users_service: {
    loginWithCredentials: '/login',
    loginWithCookie: '/login-with-cookie',
    loginWithSaml: '/login-with-saml',
    logout: '/logout',
    users: '/users',
  },
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

export const dbName = 'vite-react-template';
export const dynamicTableName = 'dynamic';
export const usersTableName = 'users';
export const tables: Array<TableMetadata> = [
  { tableName: dynamicTableName },
  {
    tableName: usersTableName,
    indexes: [],
  },
];

export const BASE_URL = '/base';
