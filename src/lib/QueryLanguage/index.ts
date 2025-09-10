export { Comparators } from './constants';

// Core components
export { QueryParser } from './QueryParser/QueryParser';
export { QueryLexer } from './QueryLexer/QueryLexer';
export { TokenStream } from './TokenStream';

// Auto-completion components

// Utility functions
export * from './ASTBuilder';

/**
 * Query Language Library Version
 */
export const VERSION = '1.0.0-alpha';

/**
 * Library information
 */
export const LIBRARY_INFO = {
  name: 'Query Language Library',
  version: VERSION,
  description: 'A TypeScript library for parsing and auto-completing custom query syntax',
  author: 'Query Language Team',
  license: 'MIT',
} as const;
