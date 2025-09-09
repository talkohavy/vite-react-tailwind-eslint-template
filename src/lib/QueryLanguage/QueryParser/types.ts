import type { QueryExpression } from '../ASTBuilder';
import type { Position, Token } from '../types';
import type { ContextTypeValues } from './logic/constants';

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
  expectedTokens?: ContextTypeValues[];
  recoverable: boolean;
}
