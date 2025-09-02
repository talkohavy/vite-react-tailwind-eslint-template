/**
 * Context Analyzer for Auto-Completion
 *
 * This module analyzes the current context of a query string to determine
 * what type of completions should be offered and where in the syntax tree
 * the user is currently positioned.
 */

import type { CompletionContext, ParseResult, Token } from '../types';
import type { AnalyzeContextProps } from './ContextAnalyzer.interface';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { ContextTypes, type ContextTypeValues } from './logic/constants';

export class ContextAnalyzer {
  constructor(private readonly tokens: Token[]) {}

  /**
   * Analyzes the completion context at a given cursor position
   */
  public analyzeContext(props: AnalyzeContextProps): CompletionContext {
    const { parseResult, cursorPosition, originalQuery } = props;

    const currentTokenIndex = this.findLastTokenBeforePosition(cursorPosition);

    const isPartiallyCorrect = this.isQueryCorrectUpToPosition(currentTokenIndex);

    const currentToken = this.tokens[currentTokenIndex];

    const isCurrentTokenAValue = this.getIsValueToken(currentTokenIndex);
    const isPreviousTokenAValue = !isCurrentTokenAValue && this.getIsValueToken(currentTokenIndex - 1);
    const isCurrentTokenAKey = this.getIsKeyToken(currentTokenIndex);
    const isPreviousTokenAKey = !isCurrentTokenAKey && this.getIsKeyToken(currentTokenIndex - 1);

    const isInQuotes = this.isPositionInQuotes(currentToken);
    const canInsertLogicalOperator = this.canInsertOperator(currentTokenIndex);
    const canInsertComparator = this.canInsertComparator(currentTokenIndex);
    const canStartNewGroup = this.getCanStartNewGroup(currentTokenIndex);
    const incompleteValue = this.extractIncompleteValue(originalQuery, cursorPosition);
    const syntaxErrors = this.getSyntaxErrors(parseResult);

    const { token: previousToken } = this.getPreviousToken(currentTokenIndex);
    const { token: nextToken } = this.getNextToken(currentTokenIndex);

    const expectedTypes = isPartiallyCorrect
      ? this.determineExpectedTypes({
          currentToken,
          previousToken,
          isCurrentTokenAValue,
          isCurrentTokenAKey,
          isPreviousTokenAValue,
          isPreviousTokenAKey,
        })
      : [];

    const context: CompletionContext = {
      cursorPosition,
      currentToken,
      previousToken,
      nextToken,
      expectedTypes,
      isInQuotes,
      isPartiallyCorrect,
      canInsertLogicalOperator,
      canInsertComparator,
      canStartNewGroup,
      incompleteValue,
      syntaxErrors,
    };

    return context;
  }

  /**
   * Determines what types of completions are expected at the current position
   */
  private determineExpectedTypes(props: {
    currentToken: Token | undefined;
    previousToken: Token | undefined;
    isCurrentTokenAValue: boolean;
    isCurrentTokenAKey: boolean;
    isPreviousTokenAValue: boolean;
    isPreviousTokenAKey: boolean;
  }): ContextTypeValues[] {
    const {
      currentToken,
      previousToken,
      isCurrentTokenAKey: isOnKey,
      isCurrentTokenAValue: isOnValue,
      isPreviousTokenAValue,
      isPreviousTokenAKey,
    } = props;

    const previousTokenType = previousToken?.type;
    const currentTokenType = currentToken?.type;

    /**
     * if(isOnKey) -> expect key
     * if(isOnValue || isOnColon) -> expect value
     * if(isOnLogicalOperator) -> expect AND,OR
     * if(isOnComparator) -> expect comparator
     * if(isOnLeftParenthesis) expect key,(
     * if(isOnRightParenthesis) expect AND,OR,)
     * if(isOnWhitespace){
     *    isAfterKey -> expect comparator
     *    isAfterValue -> expect AND,OR,)
     *    isAfterLogicalOperator -> expect Key,(
     *    isAfterComparator -> expect Value
     *    isAfterLeftParenthesis -> expect key,(
     *    isAfterRightParenthesis -> expect AND,OR,)
     * }
     */

    if (isOnKey) {
      return [ContextTypes.Key];
    }

    const isOnColon = currentTokenType === TokenTypes.Colon;
    if (isOnValue || isOnColon) {
      return [ContextTypes.Value];
    }

    const isOnLogicalOperator = [TokenTypes.AND, TokenTypes.OR].includes(currentTokenType as any);
    if (isOnLogicalOperator) {
      return [ContextTypes.LogicalOperator];
    }

    const isOnComparator = currentTokenType === TokenTypes.Comparator;
    if (isOnComparator) {
      return [ContextTypes.Comparator];
    }

    const isOnLeftParenthesis = currentTokenType === TokenTypes.LeftParenthesis;
    if (isOnLeftParenthesis) {
      return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }

    const isOnRightParenthesis = currentTokenType === TokenTypes.RightParenthesis;
    if (isOnRightParenthesis) {
      return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];
    }

    const isOnWhitespace = currentTokenType === TokenTypes.Whitespace;
    if (!isOnWhitespace) {
      // If we're not on whitespace and none of the above matched, return empty
      return [];
    }

    const isAfterKey = isPreviousTokenAKey;
    if (isAfterKey) {
      return [ContextTypes.Comparator];
    }

    const isAfterValue = previousTokenType === TokenTypes.QuotedString || isPreviousTokenAValue;
    if (isAfterValue) {
      return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];
    }

    const isAfterLogicalOperator = [TokenTypes.AND, TokenTypes.OR].includes(previousTokenType as any);
    if (isAfterLogicalOperator) {
      return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }

    const isAfterComparator = previousTokenType === TokenTypes.Comparator;
    const isAfterColon = previousTokenType === TokenTypes.Colon;
    if (isAfterComparator || isAfterColon) {
      return [ContextTypes.Value];
    }

    const isAfterLeftParenthesis = previousTokenType === TokenTypes.LeftParenthesis;
    if (isAfterLeftParenthesis) {
      return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }

    const isAfterRightParenthesis = previousTokenType === TokenTypes.RightParenthesis;
    if (isAfterRightParenthesis) {
      return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];
    }

    return [];
  }

  /**
   * Checks if a specific token is a value based on its context in the token array
   */
  private getIsValueToken(tokenIndex: number): boolean {
    const currentToken = this.tokens[tokenIndex];

    if (currentToken?.type !== TokenTypes.Identifier) return false;

    tokenIndex--;

    while (tokenIndex >= 0 && this.tokens[tokenIndex]!.type === TokenTypes.Whitespace) {
      tokenIndex--;
    }

    const previousTokenType = this.tokens[tokenIndex]?.type;

    const isValueToken = [TokenTypes.Colon, TokenTypes.Comparator].includes(previousTokenType as any);

    return isValueToken;
  }

  private getIsKeyToken(tokenIndex: number): boolean {
    const currentToken = this.tokens[tokenIndex];

    if (currentToken?.type !== TokenTypes.Identifier) return false;

    tokenIndex--;

    while (tokenIndex >= 0 && this.tokens[tokenIndex]!.type === TokenTypes.Whitespace) {
      tokenIndex--;
    }

    // First identifier in the query is always a key
    if (!this.tokens[tokenIndex]) return true;

    const previousTokenType = this.tokens[tokenIndex]?.type;
    const isKeyToken = [TokenTypes.LeftParenthesis, TokenTypes.Comparator].includes(previousTokenType as any);

    return isKeyToken;
  }

  /**
   * Finds the last token before or at the given position
   */
  private findLastTokenBeforePosition(position: number): number {
    let lastTokenIndex = -1;

    for (let index = 0; index < this.tokens.length; index++) {
      const token = this.tokens[index]!;

      // Only consider tokens that end before the cursor position
      if (token.position.end < position) {
        lastTokenIndex = index;
      } else if (token.position.start <= position && position <= token.position.end) {
        // If cursor is within a token, consider this token only if it's not at the start
        if (position > token.position.start) {
          lastTokenIndex = index;
        }
        break;
      } else {
        break;
      }
    }

    return lastTokenIndex;
  }

  /**
   * Checks if the cursor position is within quotes
   */
  private isPositionInQuotes(currentToken: Token | undefined): boolean {
    // If there's no current token, we're not in quotes
    if (!currentToken) return false;

    // Check if the current token is a quoted string
    return currentToken.type === TokenTypes.QuotedString;
  }

  /**
   * Determines if an operator can be inserted at the current position
   */
  private canInsertOperator(currentTokenIndex: number): boolean {
    if (currentTokenIndex - 1 < 0) return false;

    const previousToken = this.tokens[currentTokenIndex - 1];

    if (!previousToken) return false;

    // const canInsertOperator =
    //   this.getIsValueToken({ currentToken: tokens[0], previousToken }) ||
    //   previousToken.type === TokenTypes.RightParenthesis;
    const canInsertOperator = false;

    return canInsertOperator;
  }

  /**
   * Determines if an operator can be inserted at the current position
   */
  private canInsertComparator(currentTokenIndex: number): boolean {
    if (currentTokenIndex - 1 < 0) return false;

    const previousToken = this.tokens[currentTokenIndex - 1];

    if (!previousToken) return false;

    const canInsertComparator = false;
    // const canInsertComparator =
    //   this.getIsValueToken({ currentToken: tokens[0], previousToken }) ||
    //   previousToken.type === TokenTypes.RightParenthesis;

    return canInsertComparator;
  }

  /**
   * Determines if grouping (left parentheses) can be inserted at the current position
   */
  private getCanStartNewGroup(currentTokenIndex: number): boolean {
    if (currentTokenIndex - 1 < 0) return false;

    const previousToken = this.tokens[currentTokenIndex - 1];

    // You CAN insert a new group at the beginning!
    if (!previousToken) return true;

    // Can insert after operators or opening parenthesis
    const canStartNewGroup =
      [TokenTypes.AND, TokenTypes.OR].includes(previousToken.type as any) ||
      previousToken.type === TokenTypes.LeftParenthesis;

    return canStartNewGroup;
  }

  /**
   * Extracts incomplete value being typed
   */
  private extractIncompleteValue(query: string, position: number): string {
    const beforeCursor = query.substring(0, position);
    const afterCursor = query.substring(position);

    // Find the start of the current word
    let start = position - 1;
    while (start >= 0) {
      const char = beforeCursor[start];
      if (char && /\w/.test(char)) {
        start--;
      } else {
        break;
      }
    }
    start++;

    // Find the end of the current word
    let end = 0;
    while (end < afterCursor.length) {
      const char = afterCursor[end];
      if (char && /\w/.test(char)) {
        end++;
      } else {
        break;
      }
    }

    const incompleteValue = beforeCursor.substring(start) + afterCursor.substring(0, end);

    return incompleteValue;
  }

  /**
   * Gets syntax errors from parsing the query
   */
  private getSyntaxErrors(parseResult: ParseResult): string[] {
    const syntaxErrors = parseResult.errors.map((error: any) => error.message);

    return syntaxErrors;
  }

  /**
   * @returns the next token that is not a whitespace
   */
  private getNextToken(tokenIndex: number): { token: Token | undefined; wasWhitespaceSkipped: boolean } {
    let wasWhitespaceSkipped = false;

    if (tokenIndex + 1 >= this.tokens.length) {
      return { token: undefined, wasWhitespaceSkipped };
    }

    // Skip whitespace tokens
    while (tokenIndex + 1 < this.tokens.length && this.tokens[tokenIndex + 1]!.type === TokenTypes.Whitespace) {
      tokenIndex++;
      wasWhitespaceSkipped = true;
    }

    return { token: this.tokens[tokenIndex + 1], wasWhitespaceSkipped };
  }

  /**
   * @returns the previous token that is not a whitespace
   */
  private getPreviousToken(tokenIndex: number): { token: Token | undefined; wasWhitespaceSkipped: boolean } {
    let wasWhitespaceSkipped = false;

    if (tokenIndex - 1 < 0) {
      return { token: undefined, wasWhitespaceSkipped };
    }

    // Skip whitespace tokens
    while (tokenIndex - 1 >= 0 && this.tokens[tokenIndex - 1]!.type === TokenTypes.Whitespace) {
      tokenIndex--;
      wasWhitespaceSkipped = true;
    }

    return { token: this.tokens[tokenIndex - 1], wasWhitespaceSkipped };
  }

  private isQueryCorrectUpToPosition(tokenIndex: number): boolean {
    for (let i = 0; i <= tokenIndex; i++) {
      const token = this.tokens[i]!;
      if (token.type === TokenTypes.Invalid) {
        return false;
      }
    }
    return true;
  }
}
