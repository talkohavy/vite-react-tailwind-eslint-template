export {
  // Grammar Constants
  BOOLEAN_OPERATORS,
  Comparators,
  SUPPORTED_COMPARATORS,
  OPERATOR_PRECEDENCE,

  // Regex Patterns
  IDENTIFIER_PATTERN,
  QUOTED_STRING_PATTERN,
  WHITESPACE_PATTERN,
  BOOLEAN_OPERATOR_PATTERN,

  // Error Messages and Codes
  ERROR_MESSAGES,
  ERROR_CODES,

  // Auto-Completion Constants
  DEFAULT_OPERATOR_COMPLETIONS,
  DEFAULT_GROUPING_COMPLETIONS,
  DEFAULT_MAX_SUGGESTIONS,
  DEFAULT_COMPLETION_CONFIG,

  // Parser Configuration
  DEFAULT_PARSER_OPTIONS,

  // Character Constants
  SPECIAL_CHARS,
  ESCAPE_CHARS,

  // Validation Constants
  MAX_QUERY_LENGTH,
  MAX_NESTING_DEPTH,
  RESERVED_KEYWORDS,

  // Examples
  EXAMPLE_QUERIES,
  EXAMPLE_KEY_CONFIGS,
} from './constants';

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
