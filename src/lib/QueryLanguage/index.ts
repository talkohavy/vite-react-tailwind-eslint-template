/**
 * Query Language Library - Main Export Module
 *
 * This module provides the main exports for the Query Language library,
 * including types, constants, and core functionality.
 *
 * @example
 * ```typescript
 * import { QueryParser, CompletionEngine } from '@/lib/QueryLanguage';
 *
 * const parser = new QueryParser();
 * const result = parser.parse('status: active AND role: admin');
 * ```
 */

// Core types
export type {
  // AST Types
  ASTNode,
  Position,
  QueryExpression,
  BooleanExpression,
  ConditionExpression,
  GroupExpression,
  Expression,

  // Operator Types
  BooleanOperator,
  Comparator,

  // Token Types
  TokenType,
  Token,

  // Parser Types
  ParseResult,
  ParseError,
  ParserOptions,
  LexerOptions,

  // Auto-Completion Types
  CompletionContext,
  CompletionItem,
  CompletionItemType,
  CompletionConfig,
  KeyConfig,
  ValueConfig,

  // Validation Types
  ValidationResult,
  ValidationError,
  ValidationWarning,

  // Query Execution Types
  QueryContext,
  SchemaDefinition,
  FieldDefinition,
} from './types';

// Constants and patterns
export {
  // Grammar Constants
  BOOLEAN_OPERATORS,
  COMPARATORS,
  SUPPORTED_COMPARATORS,
  OPERATOR_PRECEDENCE,

  // Regex Patterns
  IDENTIFIER_PATTERN,
  QUOTED_STRING_PATTERN,
  WHITESPACE_PATTERN,
  BOOLEAN_OPERATOR_PATTERN,
  TOKEN_PATTERNS,

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
  DEFAULT_LEXER_OPTIONS,

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

// Core components (will be implemented in future phases)
// export { QueryParser } from './parser/QueryParser';
// export { CompletionEngine } from './completion/CompletionEngine';
// export { QueryLexer } from './lexer/QueryLexer';
// export { QueryValidator } from './validation/QueryValidator';

// Utility functions (will be implemented in future phases)
// export { parseQuery, validateQuery, getCompletions } from './utils';

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
