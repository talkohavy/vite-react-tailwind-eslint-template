import type { ContextTypeValues } from './QueryParser';

type TokenContextBase = {
  expectedTokens: ContextTypeValues[]; // <--- Context information for whitespace tokens (added during parsing)
};

export type TokenContextWithKey = TokenContextBase & {
  key: string;
};

export type TokenContext = TokenContextBase | TokenContextWithKey;

// =============================================================================
// Auto-Completion Types
// =============================================================================

/**
 * Auto-completion suggestion
 */
export interface CompletionItem {
  text: string;
  type: ContextTypeValues;
  description?: string;
  insertText?: string;
  priority: number;
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

/**
 * Configuration for key values
 */
export interface ValueConfig {
  value: string;
  description?: string;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Options for lexer configuration
 */
export interface LexerOptions {
  caseSensitiveOperators?: boolean;
}
