import type { ContextTypeValues } from 'create-query-language';

export type CompletionItem = {
  type: ContextTypeValues;
  value: string;
  label: string;
  insertText: string;
};

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
  valueType?: 'string' | 'number' | 'date' | 'boolean' | 'enum';
}
