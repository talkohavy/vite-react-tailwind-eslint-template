/**
 * Constants and patterns for the Query Language system
 *
 * This module contains all the constant values, regex patterns, and
 * configuration used throughout the query language implementation.
 */

import type { BooleanOperator, Comparator } from './types';

// =============================================================================
// Grammar Constants
// =============================================================================

/**
 * Boolean operators supported by the query language
 */
export const BOOLEAN_OPERATORS: Record<string, BooleanOperator> = {
  AND: 'AND',
  and: 'AND',
  And: 'AND',
  OR: 'OR',
  or: 'OR',
  Or: 'OR',
} as const;

/**
 * Comparison operators supported by the query language
 */
// export const COMPARATORS: Record<string, Comparator> = {
export const Comparators = {
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  '!=': '!=',
  '==': '==',
  // ':': ':',
  // '~': '~',
} as const;

type TypeOfComparator = typeof Comparators;
export type ComparatorKeys = keyof TypeOfComparator;
export type ComparatorValues = TypeOfComparator[ComparatorKeys];

export const ComparatorBeginnings = {
  '>': '>',
  '<': '<',
  '=': '=',
  '!': '!',
  // ':': ':',
  // '~': '~',
} as const;

type TypeOfComparatorBeginnings = typeof ComparatorBeginnings;
export type ComparatorBeginningKeys = keyof TypeOfComparatorBeginnings;
export type ComparatorBeginningValues = TypeOfComparatorBeginnings[ComparatorBeginningKeys];

/**
 * Currently supported comparators (phase 1 only supports equals)
 */
export const SUPPORTED_COMPARATORS: Comparator[] = [':'];

/**
 * Operator precedence (higher number = higher precedence)
 */
export const OPERATOR_PRECEDENCE: Record<BooleanOperator, number> = {
  AND: 2,
  OR: 1,
} as const;

// =============================================================================
// Regex Patterns
// =============================================================================

/**
 * Pattern for valid identifiers (keys and unquoted values)
 */
export const IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
export const KEY_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
export const VALUE_PATTERN = /^[a-zA-Z0-9_]+$/;

/**
 * Pattern for quoted strings (single or double quotes)
 */
export const QUOTED_STRING_PATTERN = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;

/**
 * Pattern for whitespace
 */
export const WHITESPACE_PATTERN = /^\s+$/;

/**
 * Pattern for valid boolean operator (case-insensitive)
 */
export const BOOLEAN_OPERATOR_PATTERN = /^(AND|OR)$/i;

// =============================================================================
// Error Messages
// =============================================================================

/**
 * Standard error messages for common parse errors
 */
export const ERROR_MESSAGES = {
  UNEXPECTED_TOKEN: 'Unexpected token',
  EXPECTED_KEY: 'Expected key name',
  EXPECTED_COLON: "Expected ':' after key",
  EXPECTED_COMPARATOR: 'Expected comparator (i.e. :,<,>,=) after key',
  EXPECTED_VALUE: 'Expected value after comparator',
  EXPECTED_EXPRESSION_AFTER_AND: "Expected expression after 'AND'",
  EXPECTED_EXPRESSION_AFTER_OR: "Expected expression after 'OR'",
  EXPECTED_EXPRESSION_IN_PARENTHESES: 'Expected expression inside parentheses',
  EXPECTED_OPERATOR: "Expected 'AND' or 'OR'",
  EXPECTED_CLOSING_PAREN: 'Expected closing parenthesis',
  UNEXPECTED_END: 'Unexpected end of input',
  UNBALANCED_PARENS: 'Unbalanced parentheses',
  INVALID_IDENTIFIER: 'Invalid identifier',
  INVALID_OPERATOR: 'Invalid operator',
  EMPTY_QUERY: 'Empty query',
  EMPTY_PARENTHESES: 'Empty parentheses not allowed',
  INVALID_SYNTAX: 'Invalid syntax',
} as const;

/**
 * Error codes for programmatic error handling
 */
export const ERROR_CODES = {
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  UNEXPECTED_TOKEN: 'UNEXPECTED_TOKEN',
  MISSING_TOKEN: 'MISSING_TOKEN',
  INVALID_IDENTIFIER: 'INVALID_IDENTIFIER',
  UNBALANCED_PARENS: 'UNBALANCED_PARENS',
  EMPTY_EXPRESSION: 'EMPTY_EXPRESSION',
} as const;

// =============================================================================
// Auto-Completion Constants
// =============================================================================

/**
 * Default completion items for operators
 */
export const DEFAULT_OPERATOR_COMPLETIONS = [
  { text: 'AND', priority: 10 },
  { text: 'OR', priority: 9 },
];

/**
 * Default completion items for grouping
 */
export const DEFAULT_GROUPING_COMPLETIONS = [{ text: '(', priority: 5 }];

/**
 * Maximum number of suggestions to show by default
 */
export const DEFAULT_MAX_SUGGESTIONS = 10;

/**
 * Default auto-completion configuration
 */
export const DEFAULT_COMPLETION_CONFIG = {
  keys: [],
  caseSensitive: false,
  fuzzyMatch: false,
  maxSuggestions: DEFAULT_MAX_SUGGESTIONS,
} as const;

// =============================================================================
// Parser Configuration
// =============================================================================

/**
 * Default parser options
 */
export const DEFAULT_PARSER_OPTIONS = {
  maxErrors: 10,
  trackPositions: true,
} as const;

/**
 * Default lexer options
 */
export const DEFAULT_LEXER_OPTIONS = {
  ignoreWhitespace: false,
  caseSensitiveOperators: false,
} as const;

// =============================================================================
// Character Constants
// =============================================================================

/**
 * Special characters used in the query language
 */
export const SPECIAL_CHARS = {
  COLON: ':',
  LPAREN: '(',
  RPAREN: ')',
  SINGLE_QUOTE: "'",
  DOUBLE_QUOTE: '"',
  SPACE: ' ',
  TAB: '\t',
  NEWLINE: '\n',
  CARRIAGE_RETURN: '\r',
  INCLUDES: '~',
} as const;

/**
 * Characters that need escaping in quoted strings
 */
export const ESCAPE_CHARS = ['\\', '"', "'", '\n', '\r', '\t'] as const;

// =============================================================================
// Validation Constants
// =============================================================================

/**
 * Maximum query length for performance reasons
 */
export const MAX_QUERY_LENGTH = 1000;

/**
 * Maximum nesting depth for expressions
 */
export const MAX_NESTING_DEPTH = 10;

/**
 * Reserved keywords that cannot be used as identifiers
 */
export const RESERVED_KEYWORDS = ['AND', 'OR', 'NOT'] as const;

// =============================================================================
// Demo/Example Data
// =============================================================================

/**
 * Example queries for testing and documentation
 */
export const EXAMPLE_QUERIES = [
  'status: active',
  'name: "John Doe"',
  'status: active AND role: admin',
  'status: active OR status: pending',
  'name: "John" AND (role: admin OR role: moderator)',
  '(status: active OR status: pending) AND role: admin',
  'status: active AND (department: engineering OR department: design) AND level: senior',
] as const;

/**
 * Example key configurations for testing
 */
export const EXAMPLE_KEY_CONFIGS = [
  {
    name: 'status',
    description: 'User status',
    values: [
      { value: 'active', description: 'Active user' },
      { value: 'inactive', description: 'Inactive user' },
      { value: 'pending', description: 'Pending approval' },
    ],
  },
  {
    name: 'role',
    description: 'User role',
    values: [
      { value: 'admin', description: 'Administrator' },
      { value: 'moderator', description: 'Moderator' },
      { value: 'user', description: 'Regular user' },
    ],
  },
  {
    name: 'department',
    description: 'User department',
    values: [
      { value: 'engineering', description: 'Engineering department' },
      { value: 'design', description: 'Design department' },
      { value: 'marketing', description: 'Marketing department' },
    ],
  },
  {
    name: 'name',
    description: 'User name',
    valueType: 'string' as const,
  },
  {
    name: 'level',
    description: 'Experience level',
    values: [
      { value: 'junior', description: 'Junior level' },
      { value: 'senior', description: 'Senior level' },
      { value: 'principal', description: 'Principal level' },
    ],
  },
] as const;
