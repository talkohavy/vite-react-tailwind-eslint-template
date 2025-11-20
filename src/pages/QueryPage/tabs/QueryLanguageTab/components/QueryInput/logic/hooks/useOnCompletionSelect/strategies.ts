import { ContextTypes, SpecialChars, TokenTypes } from 'create-query-language';
import type { InsertionStrategy } from './types';

/**
 * Base strategy with common default behavior
 */
function createBaseStrategy(overrides: Partial<InsertionStrategy> = {}): InsertionStrategy {
  return {
    getInsertionStart: (props) => {
      const { token } = props;

      /**
       * Case 1: on partial token IDENTIFIER, if previous token was WHITESPACE, it could potentially be "       ".
       * Remove the extra spaces, and just insert 1 space.
       */
      if (token.prev?.type === TokenTypes.Whitespace) {
        return token.prev.position.start + 1;
      }

      /**
       * Case 2: on a WHITESPACE (no partial IDENTIFIER), it could potentially be "       ".
       * Remove the extra spaces, and just insert 1 space.
       */
      if (token.type === TokenTypes.Whitespace) {
        return token.position.start + 1;
      }

      // Default fallback
      return token.position.start;
    },
    getWhitespaceAfterMiddlePart: () => ' ',
    processRightPart: (props) => {
      const { token, query, cursorPosition } = props;

      /**
       * Case 1: on partial token IDENTIFIER, text after insertion includes many whitespaces, we want to remove them.
       *
       * Example:
       * "osNam<cursor-here>             :"
       */
      if (token.next?.type === TokenTypes.Whitespace) {
        const rightPart = query.substring(token.next.position.end);

        return rightPart;
      }

      /**
       * Case 2: on a WHITESPACE (no partial IDENTIFIER), we want to remove the whitespaces.
       *
       * Example:
       * "<cursor-here> : Haifa"
       */
      if (token.type === TokenTypes.Whitespace) {
        const rightPart = query.substring(token.position.end);

        return rightPart;
      }

      return query.substring(cursorPosition);
    },
    ...overrides,
  };
}

export const KeyInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const ValueInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const QuotedStringInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const LogicalOperatorInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const NotInsertionStrategy: InsertionStrategy = createBaseStrategy();

/**
 * Strategy for inserting colon (:)
 * Special handling:
 * - Inserts at the END of the token
 * - Removes duplicate colons in the right part
 */
export const ColonInsertionStrategy: InsertionStrategy = createBaseStrategy({
  getInsertionStart: (props) => {
    const { token, completion } = props;

    if (completion.insertText === SpecialChars.Colon) {
      return token.position.start;
    }

    return token.position.end;
  },
});

export const LeftParenthesisInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const RightParenthesisInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const ComparatorInsertionStrategy: InsertionStrategy = createBaseStrategy();

export const INSERTION_STRATEGIES: Record<string, InsertionStrategy> = {
  [ContextTypes.Key]: KeyInsertionStrategy,
  [ContextTypes.Value]: ValueInsertionStrategy,
  [ContextTypes.QuotedString]: QuotedStringInsertionStrategy,
  [ContextTypes.LogicalOperator]: LogicalOperatorInsertionStrategy,
  [ContextTypes.Not]: NotInsertionStrategy,
  [ContextTypes.Colon]: ColonInsertionStrategy,
  [ContextTypes.LeftParenthesis]: LeftParenthesisInsertionStrategy,
  [ContextTypes.RightParenthesis]: RightParenthesisInsertionStrategy,
  [ContextTypes.Comparator]: ComparatorInsertionStrategy,
};
