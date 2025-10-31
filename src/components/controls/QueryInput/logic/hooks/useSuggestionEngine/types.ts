import type { ReactNode } from 'react';
import type { ContextTypeValues } from 'create-query-language';

export type CompletionItem = {
  type: ContextTypeValues;
  value: string;
  label: string | ReactNode | (() => ReactNode);
  insertText: string;
  priority: number;
};
