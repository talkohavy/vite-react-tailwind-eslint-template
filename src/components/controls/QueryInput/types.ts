import type { ReactNode } from 'react';
import type { ContextTypeValues } from 'create-query-language';

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

export type CompletionItem = {
  type: ContextTypeValues;
  value: string;
  label: string | ReactNode | (() => ReactNode);
  insertText: string;
  priority: number;
};
