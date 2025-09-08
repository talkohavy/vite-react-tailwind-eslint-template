import type { QueryExpression } from '../ASTBuilder';
import type { Position } from '../types';
import type { ContextTypeValues } from './logic/constants';

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
  expectedTokens?: ContextTypeValues[];
  recoverable: boolean;
}

/**
 * Whitespace classification information
 */
export interface WhitespaceContext {
  type: ContextTypeValues;
  position: Position;
  expectedTokens: ContextTypeValues[];
  description: string;
}
