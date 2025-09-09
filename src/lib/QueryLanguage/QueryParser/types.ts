import type { QueryExpression } from '../ASTBuilder';
import type { Position, Token } from '../types';

/**
 * Result of parsing operation
 */
export interface ParseResult {
  success: boolean;
  ast?: QueryExpression;
  errors: ParseError[];
  tokens: Token[];
}

/**
 * Parse error information
 */
export interface ParseError {
  message: string;
  position: Position;
  recoverable: boolean;
}
