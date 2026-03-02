const API_PLACEHOLDER = '___API_PLACEHOLDER___';
export const API_GATEWAY_URL = API_PLACEHOLDER.includes('API_PLACEHOLDER') ? 'http://localhost:8000' : API_PLACEHOLDER;

const WS_SERVICE_PLACEHOLDER = '___WS_SERVICE_URL_PLACEHOLDER___';
export const WS_SERVICE_URL = WS_SERVICE_PLACEHOLDER.includes('WS_SERVICE_URL_PLACEHOLDER')
  ? 'http://localhost:8000'
  : WS_SERVICE_PLACEHOLDER;

export const ON_DEMAND_CACHE = 'on-demand-cache';
export const SYNC_REQUESTS = 'sync-requests';
export const BASE_URL = '/base';

export * from './localStorageKeys';
export * from './regex';
export * from './indexedDB';
export * from './apiUrls';
