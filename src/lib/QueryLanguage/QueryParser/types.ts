import type { QueryExpression } from '../ASTBuilder';
import type { Position, Token } from '../QueryLexer';

export interface ParseResult {
  success: boolean;
  ast?: QueryExpression;
  errors: ParseError[];
  tokens: Token[];
}

export interface ParseError {
  message: string;
  position: Position;
  recoverable: boolean;
}

export interface ParserOptions {
  maxErrors: number;
  trackPositions: boolean;
}
