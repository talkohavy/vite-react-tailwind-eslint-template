import type { CompletionItem } from '../../../types';
import type { Token } from 'create-query-language';

export type InsertionContext = {
  token: Token;
  cursorPosition: number;
  query: string;
  completion: CompletionItem;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
};

export type InsertionStrategy = {
  /**
   * Where to start the insertion relative to the token
   */
  getInsertionStart: (context: InsertionContext) => number;

  /**
   * What whitespace to add after the inserted text
   */
  getWhitespaceAfterMiddlePart: (context: InsertionContext) => string;

  /**
   * Any special handling for the right part of the query
   */
  processRightPart: (context: InsertionContext) => string;

  /**
   * Any side effects after insertion (e.g., closing dropdown)
   */
  onAfterInsert?: (context: InsertionContext) => void;
};

export type InsertionResult = {
  value: string;
  cursorPosition: number;
};
