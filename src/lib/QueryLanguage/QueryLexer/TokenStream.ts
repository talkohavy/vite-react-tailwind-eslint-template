/**
 * TokenStream - Manages a stream of tokens for parsing
 *
 * This class provides a convenient interface for consuming tokens
 * during the parsing process, with lookahead capabilities and
 * position tracking.
 */

import type { ContextTypeValues } from '../QueryParser';
import type { Token } from '../types';
import { TokenTypes, type TokenTypeValues } from './logic/constants';

/**
 * TokenStream manages a sequence of tokens with cursor positioning
 * and lookahead capabilities for parser consumption.
 */
export class TokenStream {
  private tokens: Token[];
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Get the current token without advancing the position
   */
  current(): Token | null {
    const currentToken = this.tokens[this.position] || null;
    return currentToken;
  }

  /**
   * Consume and return the current token, advancing the position
   */
  consume(): Token | null {
    const token = this.current();
    if (token) {
      this.position++;
    }
    return token;
  }

  /**
   * Consume the current token and expect it to be of the specified type
   * Throws an error if the token doesn't match
   */
  expect(expectedType: TokenTypeValues): Token {
    const token = this.current();

    if (!token) {
      throw new Error(`Expected ${expectedType} but reached end of input`);
    }

    if (token.type !== expectedType) {
      throw new Error(`Expected ${expectedType} but got ${token.type} at position ${token.position.start}`);
    }

    return this.consume()!;
  }

  /**
   * Check if the current token matches the expected type
   */
  isCurrentAMatchWith(expectedType: TokenTypeValues): boolean {
    const token = this.current();
    const isMatch = token ? token.type === expectedType : false;

    return isMatch;
  }

  /**
   * Check if any of the expected types match the current token
   */
  matchAny(...expectedTypes: TokenTypeValues[]): boolean {
    const token = this.current();

    if (!token) return false;

    const isMatchAny = expectedTypes.includes(token.type);

    return isMatchAny;
  }

  /**
   * Count and skip whitespace tokens, returning the number of spaces
   */
  countAndSkipWhitespaces(expectedTokens: ContextTypeValues[]): number {
    let spaceCount = 0;

    while (this.current()?.type === TokenTypes.Whitespace) {
      const token = this.current()!;
      token.expectedTokens = expectedTokens;
      spaceCount += token.value.length;
      this.advance();
    }

    return spaceCount;
  }

  /**
   * Advance the position by one without returning the token
   */
  advance(): void {
    if (this.position < this.tokens.length) {
      this.position++;
    }
  }

  /**
   * Check if we've reached the end of the token stream
   */
  isAtEnd(): boolean {
    const token = this.current();

    const isEnd = !token || token.type === TokenTypes.EOF;

    return isEnd;
  }

  /**
   * Get detailed debug information about the token stream
   */
  getDebugInfo(): object {
    return {
      position: this.position,
      totalTokens: this.tokens.length,
      currentToken: this.current(),
      nextTokens: this.tokens.slice(this.position, this.position + 5),
      isAtEnd: this.isAtEnd(),
    };
  }

  // /**
  //  * Get the next token without advancing the position
  //  */
  // peek(offset = 1): Token | null {
  //   return this.tokens[this.position + offset] || null;
  // }

  // /**
  //  * Consume the current token if it matches the expected type
  //  */
  // consumeIf(expectedType: TokenTypeValues): Token | null {
  //   const token = this.current();
  //   if (token && token.type === expectedType) {
  //     return this.consume();
  //   }
  //   return null;
  // }

  // /**
  //  * Get the current position in the token stream
  //  */
  // getPosition(): number {
  //   return this.position;
  // }

  // /**
  //  * Set the position in the token stream (for backtracking)
  //  */
  // setPosition(position: number): void {
  //   this.position = Math.max(0, Math.min(position, this.tokens.length));
  // }

  // /**
  //  * Save the current position for potential backtracking
  //  */
  // savePosition(): number {
  //   return this.position;
  // }

  // /**
  //  * Restore a previously saved position
  //  */
  // restorePosition(savedPosition: number): void {
  //   this.setPosition(savedPosition);
  // }

  // /**
  //  * Get all remaining tokens from current position
  //  */
  // remaining(): Token[] {
  //   return this.tokens.slice(this.position);
  // }

  // /**
  //  * Get all tokens from the stream
  //  */
  // getAllTokens(): Token[] {
  //   return [...this.tokens];
  // }

  // /**
  //  * Get the number of tokens in the stream
  //  */
  // length(): number {
  //   return this.tokens.length;
  // }

  // /**
  //  * Create a new TokenStream with a subset of tokens
  //  */
  // slice(start: number, end?: number): TokenStream {
  //   return new TokenStream(this.tokens.slice(start, end));
  // }

  // /**
  //  * Find the next token of the specified type
  //  */
  // findNext(tokenType: TokenTypeValues, startOffset = 0): Token | null {
  //   for (let i = this.position + startOffset; i < this.tokens.length; i++) {
  //     const token = this.tokens[i];
  //     if (token?.type === tokenType) {
  //       return token;
  //     }
  //   }
  //   return null;
  // }

  // /**
  //  * Get a string representation of the current state (useful for debugging)
  //  */
  // toString(): string {
  //   const nextTokens = this.tokens.slice(this.position, this.position + 3);
  //   const tokenStrings = nextTokens.map((t) => `${t.type}(${t.value})`);
  //   return `TokenStream[${this.position}/${this.tokens.length}]: ${tokenStrings.join(' ')}`;
  // }
}
