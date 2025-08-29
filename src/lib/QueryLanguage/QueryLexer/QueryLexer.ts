/**
 * QueryLexer - Tokenizes query strings into meaningful tokens
 *
 * This lexer breaks down input strings into tokens that can be
 * consumed by the parser. It handles identifiers, quoted strings,
 * operators, and special characters.
 */

import type { Token, LexerOptions } from '../types';
import {
  BOOLEAN_OPERATORS,
  KEY_PATTERN,
  VALUE_PATTERN,
  QUOTED_STRING_PATTERN,
  WHITESPACE_PATTERN,
  DEFAULT_LEXER_OPTIONS,
  SPECIAL_CHARS,
  ComparatorBeginnings,
  type ComparatorBeginningKeys,
} from '../constants';
import { TokenTypes, type TokenTypeValues } from './logic/constants';

/**
 * QueryLexer tokenizes input strings according to the query language grammar
 */
export class QueryLexer {
  private input = '';
  private position = 0;
  private line = 1;
  private column = 1;
  private options: LexerOptions;
  /**
   * Never a whitespace token! We skip those.
   */
  // private previousToken: Token | null = null;
  // private isWhitespaceExistsAfterPrevious = false;
  // private unclosedLeftParenthesisCount = 0;

  constructor(options: Partial<LexerOptions> = {}) {
    this.options = { ...DEFAULT_LEXER_OPTIONS, ...options };
  }

  /**
   * Tokenize the entire input string
   */
  tokenize(input: string): Token[] {
    this.reset();
    this.input = input;

    const tokens: Token[] = [];

    while (!this.isAtEnd()) {
      const token = this.nextToken();
      if (token) {
        // Skip whitespace tokens if configured to ignore them
        if (this.options.ignoreWhitespace && token.type === TokenTypes.Whitespace) {
          continue;
        }
        tokens.push(token);
      }
    }

    // Add EOF token
    tokens.push(this.createToken(TokenTypes.EOF, '', this.position, this.position));

    return tokens;
  }

  /**
   * Get the next token from the input
   */
  private nextToken(): Token | null {
    if (this.isAtEnd()) return null;

    const start = this.position;
    const char = this.currentChar();

    // Handle whitespace
    if (this.getIsWhitespace(char)) {
      const whitespacesToken = this.scanWhitespace(start);
      return whitespacesToken;
    }

    // Handle comparison operators (multi-character first)
    if (ComparatorBeginnings[char as ComparatorBeginningKeys]) {
      const comparatorToken = this.scanComparisonOperator(start);
      return comparatorToken;
    }

    // Handle a valid COLON char (that comes after a Key)
    if (char === SPECIAL_CHARS.COLON) {
      this.advance();

      const colonToken = this.createToken(TokenTypes.Colon, char, start, this.position);

      return colonToken;
    }

    // Handle quoted strings
    if (char === SPECIAL_CHARS.SINGLE_QUOTE || char === SPECIAL_CHARS.DOUBLE_QUOTE) {
      const quotedStringToken = this.scanQuotedString(start);
      return quotedStringToken;
    }

    // Handle Parentheses
    if (char === SPECIAL_CHARS.LPAREN) {
      this.advance();

      const leftParenthesisToken = this.createToken(TokenTypes.LeftParenthesis, char, start, this.position);

      return leftParenthesisToken;
    }

    // Handle Right Parenthesis
    if (char === SPECIAL_CHARS.RPAREN) {
      this.advance();

      const rightParenthesisToken = this.createToken(TokenTypes.RightParenthesis, char, start, this.position);

      return rightParenthesisToken;
    }

    // Handle Word
    if (this.isIdentifierStart(char)) {
      const keyToken = this.scanWord(start);
      return keyToken;
    }

    // Unknown character - create invalid token
    this.advance();
    const invalidToken = this.createToken(TokenTypes.Invalid, char, start, this.position);
    return invalidToken;
  }

  /**
   * Scan whitespace characters
   */
  private scanWhitespace(start: number): Token {
    while (!this.isAtEnd() && this.getIsWhitespace(this.currentChar())) {
      this.advance();
    }

    const allWhitespacesValue = this.input.slice(start, this.position);
    const allWhitespacesToken = this.createToken(TokenTypes.Whitespace, allWhitespacesValue, start, this.position);
    return allWhitespacesToken;
  }

  /**
   * Scan quoted string (single or double quotes)
   */
  private scanQuotedString(start: number): Token {
    const openingQuote = this.currentChar();
    this.advance(); // <--- Skip the opening quote

    let value = '';
    let escaped = false;

    while (!this.isAtEnd()) {
      const nextChar = this.currentChar();

      if (escaped) {
        // Handle escape sequences
        switch (nextChar) {
          case 'n':
            value += '\n';
            break;
          case 't':
            value += '\t';
            break;
          case 'r':
            value += '\r';
            break;
          case '\\':
            value += '\\';
            break;
          case '"':
            value += '"';
            break;
          case "'":
            value += "'";
            break;
          default:
            value += nextChar;
        }
        escaped = false;
      } else if (nextChar === '\\') {
        escaped = true;
      } else if (nextChar === openingQuote) {
        this.advance(); // <--- Skip closing quote
        const quotedStringToken = this.createToken(TokenTypes.QuotedString, value, start, this.position);
        return quotedStringToken;
      } else {
        value += nextChar;
      }

      this.advance();
    }

    // string was opened, but never closed! return invalid token
    const invalidQuotedStringValue = this.input.slice(start, this.position);
    const invalidToken = this.createToken(TokenTypes.Invalid, invalidQuotedStringValue, start, this.position);

    return invalidToken;
  }

  /**
   * Scan comparison operators (<=, >=, !=, <, >)
   */
  private scanComparisonOperator(start: number): Token {
    const char = this.currentChar();
    this.advance();

    // Check for two-character operators
    const nextChar = this.currentChar();
    if (nextChar === '=') {
      this.advance();
      const comparatorValue = `${char}${nextChar}`;
      const comparatorToken = this.createToken(TokenTypes.Comparator, comparatorValue, start, this.position);
      return comparatorToken;
    }

    // Assume valid single-character operator (< or >)
    let tokenType: TokenTypeValues = TokenTypes.Comparator;

    // Check for Invalid combination ('!' without '=' , or '=' alone)
    if (char === '!' || char === '=') {
      tokenType = TokenTypes.Invalid;
    }

    const comparatorToken = this.createToken(tokenType, char, start, this.position);

    return comparatorToken;
  }

  /**
   * Scan word (could be one of: key / value / AND / OR
   */
  private scanWord(start: number): Token {
    while (!this.isAtEnd() && this.isPartOfIdentifier(this.currentChar())) {
      this.advance();
    }

    const wordValue = this.input.slice(start, this.position);
    const normalizedTokenValue = this.options.caseSensitiveOperators ? wordValue : wordValue.toUpperCase();

    if (BOOLEAN_OPERATORS[normalizedTokenValue]) {
      const logicalOperatorToken = this.scanLogicalOperator(start, wordValue);
      return logicalOperatorToken;
    }

    const workToken = this.createToken(TokenTypes.Identifier, wordValue, start, this.position);

    return workToken;
  }

  /**
   * Scan word (could be one of: key / value / AND / OR
   */
  private scanLogicalOperator(start: number, tokenValue: string): Token {
    const logicalOperatorTokenType = tokenValue === TokenTypes.AND ? TokenTypes.AND : TokenTypes.OR;

    const logicalOperatorToken = this.createToken(logicalOperatorTokenType, tokenValue, start, this.position);

    return logicalOperatorToken;
  }

  /**
   * Create a token with position information
   */
  private createToken(type: TokenTypeValues, value: string, start: number, end: number): Token {
    return {
      type,
      value,
      position: {
        start,
        end,
        line: this.line,
        column: this.column - (end - start),
      },
    };
  }

  /**
   * Get current character without advancing
   */
  private currentChar(): string {
    return this.input[this.position] || '';
  }

  /**
   * Advance position and update line/column tracking
   */
  private advance(): void {
    if (this.position < this.input.length) {
      const char = this.input[this.position];
      this.position++;

      if (char === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
    }
  }

  /**
   * Check if we've reached the end of input
   */
  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  /**
   * Check if character is whitespace
   */
  private getIsWhitespace(char: string): boolean {
    return WHITESPACE_PATTERN.test(char);
  }

  /**
   * Check if character can start an identifier
   */
  private isIdentifierStart(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }

  /**
   * Check if character can be part of an identifier (key / value)
   */
  private isPartOfIdentifier(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }

  /**
   * Get current position information for debugging
   */
  getPosition(): { position: number; line: number; column: number } {
    return {
      position: this.position,
      line: this.line,
      column: this.column,
    };
  }

  /**
   * Reset lexer to beginning of input
   */
  private reset(): void {
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  /**
   * Validate if a string could be a valid value
   */
  static isValidValue(value: string): boolean {
    return VALUE_PATTERN.test(value);
  }

  /**
   * Validate if a string could be a valid key
   */
  static isValidKey(value: string): boolean {
    return KEY_PATTERN.test(value);
  }

  /**
   * Validate if a string is a valid quoted string
   */
  static isValidQuotedString(value: string): boolean {
    return QUOTED_STRING_PATTERN.test(value);
  }

  /**
   * Extract content from a quoted string
   */
  static extractQuotedContent(quotedString: string): string | null {
    const match = quotedString.match(QUOTED_STRING_PATTERN);
    return match?.[2] ?? null;
  }
}
