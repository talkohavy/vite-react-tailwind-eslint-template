import type { ContextTypeValues } from './logic/constants';
import type { ParseResult, WhitespaceContext } from './types';

export type AddErrorProps = {
  message: string;
  position: { start: number; end: number };
  code: string;
  expectedTokens?: ContextTypeValues[];
};

export interface IQueryParser {
  parse: (query: string) => ParseResult;
  classifyWhitespace: (query: string, position: number) => WhitespaceContext | null;
}
