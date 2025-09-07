import type { ASTNode } from '../ASTBuilder';
import type { ParseResult } from '../QueryParser';

export type AnalyzeContextProps = {
  parseResult: ParseResult;
  cursorPosition: number;
  originalQuery: string;
};

/**
 * Context information about where the cursor is positioned in the AST
 */
export interface ASTContextInfo {
  node: ASTNode | null;
  parentNode: ASTNode | null;
}
