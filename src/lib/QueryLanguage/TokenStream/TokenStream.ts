import type { Token } from '../QueryLexer';
import type { TokenContext } from '../types';
import { TokenTypes, type TokenTypeValues } from '../QueryLexer/logic/constants';

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
   * Count and skip whitespace tokens, returning the number of spaces.
   * You also need to provide context information, which classifies the whitespace.
   */
  countAndSkipWhitespaces(context: TokenContext): number {
    let spaceCount = 0;

    while (this.current()?.type === TokenTypes.Whitespace) {
      const token = this.current()!;
      token.context = context;
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
}
