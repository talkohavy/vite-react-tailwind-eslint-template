import type { ContextTypeValues } from './QueryParser';

export interface Position {
  start: number;
  end: number;
  line?: number;
  column?: number;
}

type TokenContextBase = {
  expectedTokens: ContextTypeValues[]; // <--- Context information for whitespace tokens (added during parsing)
};

export type TokenContextWithKey = TokenContextBase & {
  key: string;
};

export type TokenContext = TokenContextBase | TokenContextWithKey;
