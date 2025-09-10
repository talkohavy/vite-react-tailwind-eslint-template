import type { QueryExpression } from '../ASTBuilder';
import type { Token } from '../QueryLexer';
import type { Position } from '../types';

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
