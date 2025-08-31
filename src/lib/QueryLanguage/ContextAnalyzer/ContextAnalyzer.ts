/**
 * Context Analyzer for Auto-Completion
 *
 * This module analyzes the current context of a query string to determine
 * what type of completions should be offered and where in the syntax tree
 * the user is currently positioned.
 */

import type { CompletionContext, ParseResult, Token } from '../types';
import type { AnalyzeContextProps } from './ContextAnalyzer.interface';
import { BOOLEAN_OPERATORS } from '../constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { ContextTypes, type ContextTypeValues } from './logic/constants';

/**
 * Analyzes the current context for auto-completion
 */
export class ContextAnalyzer {
  constructor(private readonly tokens: Token[]) {}

  /**
   * Analyzes the completion context at a given cursor position
   */
  public analyzeContext(props: AnalyzeContextProps): CompletionContext {
    const { parseResult, cursorPosition, originalQuery } = props;

    // Reinitialize lexer with the actual query
    const currentToken = this.findTokenAtPosition(this.tokens, cursorPosition);
    const previousToken = this.findPreviousToken(this.tokens, cursorPosition);
    const nextToken = this.findNextToken(this.tokens, cursorPosition);
    const expectedTypes = this.determineExpectedTypes(this.tokens, cursorPosition);
    const isInQuotes = this.isPositionInQuotes(currentToken);
    const canInsertOperator = this.canInsertOperator(this.tokens, cursorPosition);
    const canStartNewGroup = this.getCanStartNewGroup(this.tokens, cursorPosition);
    const incompleteValue = this.extractIncompleteValue(originalQuery, cursorPosition);
    const syntaxErrors = this.getSyntaxErrors(parseResult);

    const context: CompletionContext = {
      cursorPosition,
      currentToken,
      previousToken,
      nextToken,
      expectedTypes,
      isInQuotes,
      canInsertOperator,
      canStartNewGroup,
      incompleteValue,
      syntaxErrors,
    };

    return context;
  }

  /**
   * Finds the token at the given position
   */
  private findTokenAtPosition(tokens: Token[], position: number): Token | undefined {
    const foundToken = tokens.find((token) => position >= token.position.start && position <= token.position.end);

    return foundToken;
  }

  /**
   * Finds the previous non-whitespace token
   */
  private findPreviousToken(tokens: Token[], position: number): Token | undefined {
    const precedingTokens = tokens.filter(
      (token) => token.position.end < position && token.type !== TokenTypes.Whitespace,
    );

    const previousToken = precedingTokens[precedingTokens.length - 1];

    return previousToken;
  }

  /**
   * Finds the next non-whitespace token
   */
  private findNextToken(tokens: Token[], position: number): Token | undefined {
    const foundToken = tokens.find((token) => token.position.start > position && token.type !== TokenTypes.Whitespace);

    return foundToken;
  }

  /**
   * Determines what types of completions are expected at the current position
   */
  private determineExpectedTypes(tokens: Token[], position: number): ContextTypeValues[] {
    const nonWhitespaceTokens = tokens.filter((token) => token.type !== TokenTypes.Whitespace);

    if (nonWhitespaceTokens.length === 0) {
      // Empty query - expect key or opening parenthesis
      return [ContextTypes.Key, ContextTypes.Grouping];
    }

    // Find the last token before or at the cursor position
    const lastToken = this.findLastTokenBeforePosition(nonWhitespaceTokens, position);

    if (!lastToken) {
      return [ContextTypes.Key, ContextTypes.Grouping];
    }

    // After AND/OR - expect key or opening parenthesis
    if (Object.keys(BOOLEAN_OPERATORS).includes(lastToken.value)) {
      return [ContextTypes.Key, ContextTypes.Grouping];
    }

    // After opening parenthesis - expect key or another opening parenthesis
    if (lastToken.type === TokenTypes.LeftParenthesis) {
      return [ContextTypes.Key, ContextTypes.Grouping];
    }

    // After an identifier that's not a value - expect operator
    if (lastToken.type === TokenTypes.RightParenthesis) {
      return [ContextTypes.Operator, ContextTypes.Grouping];
    }

    // After a colon - expect value
    if (lastToken.type === TokenTypes.Colon) {
      return [ContextTypes.Value];
    }

    // After a value - expect boolean operator or closing parenthesis
    if (this.isValueToken(nonWhitespaceTokens, lastToken)) {
      return [ContextTypes.Operator, ContextTypes.Grouping, ContextTypes.Value]; // <--- Value is expected because it could be a partial value
    }

    // After an identifier that's not a value - expect operator
    if (lastToken.type === TokenTypes.Identifier) {
      return [ContextTypes.Operator, ContextTypes.Key]; // <--- Key is expected because it could be a partial key
    }

    // Default case
    return [];
  }

  /**
   * Checks if a specific token is a value based on its context in the token array
   */
  private isValueToken(_tokens: Token[], token: Token): boolean {
    if ([TokenTypes.Identifier, TokenTypes.QuotedString].includes(token.type as any)) return true;

    return false;
  }

  /**
   * Finds the last token before or at the given position
   */
  private findLastTokenBeforePosition(tokens: Token[], position: number): Token | undefined {
    let lastToken: Token | undefined;

    for (const token of tokens) {
      // Only consider tokens that end before the cursor position
      if (token.position.end < position) {
        lastToken = token;
      } else if (token.position.start <= position && position <= token.position.end) {
        // If cursor is within a token, consider this token only if it's not at the start
        if (position > token.position.start) {
          lastToken = token;
        }
        break;
      } else {
        break;
      }
    }

    return lastToken;
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
  private canInsertOperator(tokens: Token[], position: number): boolean {
    const previousToken = this.findPreviousToken(tokens, position);
    if (!previousToken) return false;

    const canInsertOperator =
      this.isValueToken(tokens, previousToken) || previousToken.type === TokenTypes.RightParenthesis;

    return canInsertOperator;
  }

  /**
   * Determines if grouping (left parentheses) can be inserted at the current position
   */
  private getCanStartNewGroup(tokens: Token[], position: number): boolean {
    const previousToken = this.findPreviousToken(tokens, position);

    // Can insert at beginning
    if (!previousToken) return true;

    // Can insert after operators or opening parenthesis
    const canStartNewGroup =
      Object.keys(BOOLEAN_OPERATORS).includes(previousToken.value) || previousToken.type === TokenTypes.LeftParenthesis;

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

    return beforeCursor.substring(start) + afterCursor.substring(0, end);
  }

  /**
   * Gets syntax errors from parsing the query
   */
  private getSyntaxErrors(parseResult: ParseResult): string[] {
    const syntaxErrors = parseResult.errors.map((error: any) => error.message);

    return syntaxErrors;
  }
}
