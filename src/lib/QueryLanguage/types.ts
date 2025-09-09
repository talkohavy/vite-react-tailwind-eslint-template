/**
 * Type definitions for the Query Language system
 *
 * This module defines the core types used throughout the query language
 * parser, auto-completion engine, and related components.
 */

import type { TokenTypeValues } from './QueryLexer';
import type { ContextTypeValues } from './QueryParser';

export interface Position {
  start: number;
  end: number;
  line?: number;
  column?: number;
}

// =============================================================================
// Token Types (for lexical analysis)
// =============================================================================

type TokenContextBase = {
  expectedTokens: ContextTypeValues[]; // <--- Context information for whitespace tokens (added during parsing)
};

export type TokenContextWithKey = TokenContextBase & {
  key: string;
};

export type TokenContext = TokenContextBase | TokenContextWithKey;

/**
 * Token structure from lexical analysis
 */
export interface Token {
  type: TokenTypeValues;
  value: string;
  position: Position;
  context?: TokenContext;
}

// =============================================================================
// Auto-Completion Types
// =============================================================================

/**
 * Simple context type for basic completion
 */
export type CompletionContextType =
  | 'key' // Expecting a key name
  | 'value' // Expecting a value after colon
  | 'operator' // Expecting AND/OR after complete condition
  | 'grouping' // Can start parentheses group
  | 'unknown'; // Unable to determine context

/**
 * Detailed context for auto-completion analysis
 */
export interface CompletionContext {
  cursorPosition: number;
  expectedTypes: ContextTypeValues[];
  incompleteValue: string;
  // currentToken?: Token;
  // isInQuotes: boolean;
  // canInsertLogicalOperator: boolean;
  // canInsertComparator: boolean;
  // canInsertKey: boolean;
  // canInsertValue: boolean;
  // canStartNewGroup: boolean;
  // syntaxErrors: string[];
  // isPartiallyCorrect: boolean;
}

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
 * Configuration for auto-completion
 */
export interface CompletionConfig {
  keys: KeyConfig[];
  caseSensitive: boolean;
  fuzzyMatch: boolean;
  maxSuggestions: number;
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
// Validation Types
// =============================================================================

/**
 * Result of query validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  message: string;
  position: Position;
  code: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  message: string;
  position: Position;
  code: string;
}

// =============================================================================
// Query Execution Types (for future use)
// =============================================================================

/**
 * Context for query execution
 */
export interface QueryContext {
  data?: Record<string, unknown>[];
  schema?: SchemaDefinition;
}

/**
 * Schema definition for data validation
 */
export interface SchemaDefinition {
  fields: FieldDefinition[];
}

/**
 * Field definition in schema
 */
export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
  values?: string[];
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Options for parser configuration
 */
export interface ParserOptions {
  maxErrors: number;
  trackPositions: boolean;
}

/**
 * Options for lexer configuration
 */
export interface LexerOptions {
  ignoreWhitespace: boolean;
  caseSensitiveOperators: boolean;
}
