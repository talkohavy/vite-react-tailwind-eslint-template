/**
 * Configuration for key values
 */
export interface ValueConfig {
  value: string;
  description?: string;
}

/**
 * Configuration for a specific key
 */
export interface KeyConfig {
  name: string;
  description?: string;
  values?: ValueConfig[];
}
