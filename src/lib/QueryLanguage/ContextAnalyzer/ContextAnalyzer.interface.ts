import type { ParseResult } from '../types';

export type AnalyzeContextProps = {
  parseResult: ParseResult;
  cursorPosition: number;
  originalQuery: string;
};
