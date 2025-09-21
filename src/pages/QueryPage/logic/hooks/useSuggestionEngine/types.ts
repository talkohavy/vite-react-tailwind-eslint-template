import type { ContextTypeValues } from 'create-query-language';

export type CompletionItem = {
  type: ContextTypeValues;
  value: string;
  label: string;
  insertText: string;
};
