/**
 * Context Analyzer for Auto-Completion
 *
 * This module analyzes the current context of a query string to determine
 * what type of completions should be offered and where in the syntax tree
 * the user is currently positioned.
 */

import type { CompletionContext, Token, CompletionItemType } from '../types';
import { BOOLEAN_OPERATORS } from '../constants';
import { QueryLexer } from '../lexer/QueryLexer';
import { QueryParser } from '../parser/QueryParser';

/**
 * Analyzes the current context for auto-completion
 */
export class ContextAnalyzer {
  private lexer: QueryLexer;
  private parser: QueryParser;

  constructor() {
    this.lexer = new QueryLexer('', {}); // Initialize with empty string
    this.parser = new QueryParser();
  }

  /**
   * Analyzes the completion context at a given cursor position
   */
  public analyzeContext(query: string, cursorPosition: number): CompletionContext {
    // Reinitialize lexer with the actual query
    this.lexer = new QueryLexer(query, {});
    const tokens = this.lexer.tokenize();
    const currentToken = this.findTokenAtPosition(tokens, cursorPosition);
    const previousToken = this.findPreviousToken(tokens, cursorPosition);
    const nextToken = this.findNextToken(tokens, cursorPosition);
    const expectedTypes = this.determineExpectedTypes(tokens, cursorPosition);
    const isInQuotes = this.isPositionInQuotes(query, cursorPosition);
    const canInsertOperator = this.canInsertOperator(tokens, cursorPosition);
    const canInsertGrouping = this.canInsertGrouping(tokens, cursorPosition);
    const incompleteValue = this.extractIncompleteValue(query, cursorPosition);
    const syntaxErrors = this.getSyntaxErrors(query);

    const context: CompletionContext = {
      cursorPosition,
      currentToken,
      previousToken,
      nextToken,
      expectedTypes,
      isInQuotes,
      canInsertOperator,
      canInsertGrouping,
      incompleteValue,
      syntaxErrors,
    };

    return context;
  }

  /**
   * Finds the token at the given position
   */
  private findTokenAtPosition(tokens: Token[], position: number): Token | undefined {
    return tokens.find((token) => position >= token.position.start && position <= token.position.end);
  }

  /**
   * Finds the previous non-whitespace token
   */
  private findPreviousToken(tokens: Token[], position: number): Token | undefined {
    const precedingTokens = tokens.filter((token) => token.position.end < position && token.type !== 'WHITESPACE');
    return precedingTokens[precedingTokens.length - 1];
  }

  /**
   * Finds the next non-whitespace token
   */
  private findNextToken(tokens: Token[], position: number): Token | undefined {
    return tokens.find((token) => token.position.start > position && token.type !== 'WHITESPACE');
  }

  /**
   * Determines what types of completions are expected at the current position
   */
  private determineExpectedTypes(tokens: Token[], position: number): CompletionItemType[] {
    const nonWhitespaceTokens = tokens.filter((token) => token.type !== 'WHITESPACE');

    if (nonWhitespaceTokens.length === 0) {
      // Empty query - expect key or opening parenthesis
      return ['key', 'grouping'];
    }

    // Find the last token before or at the cursor position
    const lastToken = this.findLastTokenBeforePosition(nonWhitespaceTokens, position);

    if (!lastToken) {
      return ['key', 'grouping'];
    }

    // After a colon - expect value
    if (lastToken.type === 'COLON') {
      return ['value'];
    }

    // After a value - expect boolean operator or closing parenthesis
    if (this.isTokenAValue(nonWhitespaceTokens, lastToken)) {
      return ['operator', 'grouping'];
    }

    // After AND/OR - expect key or opening parenthesis
    if (Object.keys(BOOLEAN_OPERATORS).includes(lastToken.value)) {
      return ['key', 'grouping'];
    }

    // After opening parenthesis - expect key or another opening parenthesis
    if (lastToken.type === 'LPAREN') {
      return ['key', 'grouping'];
    }

    // After an identifier that's not a value - expect operator
    if (lastToken.type === 'IDENTIFIER') {
      return ['operator'];
    }

    // Default case
    return ['key', 'operator', 'grouping'];
  }

  /**
   * Checks if a specific token is a value based on its context in the token array
   */
  private isTokenAValue(tokens: Token[], token: Token): boolean {
    if (token.type === 'QUOTED_STRING') return true;

    if (token.type === 'IDENTIFIER') {
      // Check if this identifier follows a colon
      const tokenIndex = tokens.indexOf(token);
      if (tokenIndex > 0) {
        const previousToken = tokens[tokenIndex - 1];
        return previousToken?.type === 'COLON';
      }
    }

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
  private isPositionInQuotes(query: string, position: number): boolean {
    let inQuotes = false;
    let quoteChar: string | null = null;

    for (let i = 0; i < Math.min(position, query.length); i++) {
      const char = query[i];
      if ((char === '"' || char === "'") && query[i - 1] !== '\\') {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = null;
        }
      }
    }

    return inQuotes;
  }

  /**
   * Determines if an operator can be inserted at the current position
   */
  private canInsertOperator(tokens: Token[], position: number): boolean {
    const previousToken = this.findPreviousToken(tokens, position);
    if (!previousToken) return false;

    return this.isTokenAValue(tokens, previousToken) || previousToken.type === 'RPAREN';
  }

  /**
   * Determines if grouping (parentheses) can be inserted at the current position
   */
  private canInsertGrouping(tokens: Token[], position: number): boolean {
    const previousToken = this.findPreviousToken(tokens, position);

    // Can insert at beginning
    if (!previousToken) return true;

    // Can insert after operators or opening parenthesis
    return Object.keys(BOOLEAN_OPERATORS).includes(previousToken.value) || previousToken.type === 'LPAREN';
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
  private getSyntaxErrors(query: string): string[] {
    const parseResult = this.parser.parse(query);
    return parseResult.errors.map((error) => error.message);
  }
}
