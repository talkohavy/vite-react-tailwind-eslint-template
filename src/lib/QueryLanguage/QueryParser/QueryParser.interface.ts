import type { ParseResult } from './types';

export type AddErrorProps = {
  message: string;
  position: { start: number; end: number };
  code: string;
};

export interface IQueryParser {
  parse: (query: string) => ParseResult;
}
