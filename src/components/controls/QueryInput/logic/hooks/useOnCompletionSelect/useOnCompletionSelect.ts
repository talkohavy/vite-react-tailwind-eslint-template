import type { CompletionItem } from '../../../types';
import type { InsertionResult } from './types';
import type { Token } from 'create-query-language';
import { findTokenAtCursor } from './findTokenAtCursor';
import { INSERTION_STRATEGIES } from './strategies';

type UseOnCompletionSelectProps = {
  tokens: Token[];
  cursorPosition: number;
  query: string;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
};

export function useOnCompletionSelect(props: UseOnCompletionSelectProps) {
  const { tokens, cursorPosition, query, setIsDropdownOpen } = props;

  const onCompletionSelect = (completion: CompletionItem): InsertionResult => {
    const token = findTokenAtCursor(tokens, cursorPosition);

    // Get the appropriate insertion strategy for this completion type
    const strategy = INSERTION_STRATEGIES[completion.type];

    if (!strategy) {
      console.warn(`No insertion strategy found for completion type: ${completion.type}`);
      // Fallback to simple replacement
      return { value: query, cursorPosition };
    }

    // Build the insertion context
    const context = {
      token,
      cursorPosition,
      query,
      completion,
      setIsDropdownOpen,
    };

    // Use the strategy to determine insertion behavior
    const insertionStartPosition = strategy.getInsertionStart(context);
    const whitespaceAfterMiddlePart = strategy.getWhitespaceAfterMiddlePart(context);

    // Build the new query value
    const leftPart = query.substring(0, insertionStartPosition);
    const middlePart = completion.insertText + whitespaceAfterMiddlePart;
    const rightPart = strategy.processRightPart(context);

    const newValue = leftPart + middlePart + rightPart;
    const newCursorPosition = leftPart.length + middlePart.length;

    // Execute any post-insertion side effects
    if (strategy.onAfterInsert) {
      strategy.onAfterInsert(context);
    }

    return { value: newValue, cursorPosition: newCursorPosition };
  };

  return onCompletionSelect;
}
