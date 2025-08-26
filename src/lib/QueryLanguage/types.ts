/**
 * Type definitions for the Query Language system
 *
 * This module defines the core types used throughout the query language
 * parser, auto-completion engine, and related components.
 */

import type { TokenTypeValues } from './QueryLexer/logic/constants';

// =============================================================================
// AST (Abstract Syntax Tree) Types
// =============================================================================

/**
 * Base interface for all AST nodes
 */
export interface ASTNode {
  type: string;
  position: Position;
}

/**
 * Position information for error reporting and highlighting
 */
export interface Position {
  start: number;
  end: number;
  line?: number;
  column?: number;
}

/**
 * Root query expression
 */
export interface QueryExpression extends ASTNode {
  type: 'query';
  expression: Expression;
}

/**
 * Boolean expression (AND/OR operations)
 */
export interface BooleanExpression extends ASTNode {
  type: 'boolean';
  operator: BooleanOperator;
  left: Expression;
  right: Expression;
}

/**
 * Condition expression (key: value)
 */
export interface ConditionExpression extends ASTNode {
  type: 'condition';
  key: string;
  comparator: Comparator;
  value: string;
}

/**
 * Grouped expression (parentheses)
 */
export interface GroupExpression extends ASTNode {
  type: 'group';
  expression: Expression;
}

/**
 * Union type for all expression types
 */
export type Expression = BooleanExpression | ConditionExpression | GroupExpression;

// =============================================================================
// Operator Types
// =============================================================================

/**
 * Boolean operators for combining conditions
 */
export type BooleanOperator = 'AND' | 'OR';

/**
 * Comparison operators (currently only equals, extensible for future)
 */
export type Comparator = ':' | '>' | '<' | '>=' | '<=' | '!=' | '~';

// =============================================================================
// Token Types (for lexical analysis)
// =============================================================================

/**
 * Token structure from lexical analysis
 */
export interface Token {
  type: TokenTypeValues;
  value: string;
  position: Position;
}

// =============================================================================
// Parser Types
// =============================================================================

/**
 * Result of parsing operation
 */
export interface ParseResult {
  success: boolean;
  ast?: QueryExpression;
  errors: ParseError[];
}

/**
 * Parse error information
 */
export interface ParseError {
  message: string;
  position: Position;
  expectedTokens?: TokenTypeValues[];
  recoverable: boolean;
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
  currentToken?: Token;
  previousToken?: Token;
  nextToken?: Token;
  expectedTypes: CompletionItemType[];
  isInQuotes: boolean;
  canInsertOperator: boolean;
  canInsertGrouping: boolean;
  incompleteValue: string;
  syntaxErrors: string[];
}

/**
 * Auto-completion suggestion
 */
export interface CompletionItem {
  text: string;
  type: CompletionItemType;
  description?: string;
  insertText?: string;
  priority: number;
}

/**
 * Types of completion items
 */
export type CompletionItemType = 'key' | 'value' | 'operator' | 'grouping' | 'keyword';

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
  allowPartialParse: boolean;
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
