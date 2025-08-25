/**
 * QueryLexer - Tokenizes query strings into meaningful tokens
 *
 * This lexer breaks down input strings into tokens that can be
 * consumed by the parser. It handles identifiers, quoted strings,
 * operators, and special characters.
 */

import type { Token, TokenType, LexerOptions } from '../types';
import {
  BOOLEAN_OPERATORS,
  IDENTIFIER_PATTERN,
  QUOTED_STRING_PATTERN,
  WHITESPACE_PATTERN,
  DEFAULT_LEXER_OPTIONS,
  SPECIAL_CHARS,
} from '../constants';

/**
 * QueryLexer tokenizes input strings according to the query language grammar
 */
export class QueryLexer {
  private input: string;
  private position = 0;
  private line = 1;
  private column = 1;
  private options: LexerOptions;

  constructor(input: string, options: Partial<LexerOptions> = {}) {
    this.input = input;
    this.options = { ...DEFAULT_LEXER_OPTIONS, ...options };
  }

  /**
   * Tokenize the entire input string
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isAtEnd()) {
      const token = this.nextToken();
      if (token) {
        // Skip whitespace tokens if configured to ignore them
        if (this.options.ignoreWhitespace && token.type === 'WHITESPACE') {
          continue;
        }
        tokens.push(token);
      }
    }

    // Add EOF token
    tokens.push(this.createToken('EOF', '', this.position, this.position));

    return tokens;
  }

  /**
   * Get the next token from the input
   */
  private nextToken(): Token | null {
    if (this.isAtEnd()) {
      return null;
    }

    const start = this.position;
    const char = this.currentChar();

    // Handle whitespace
    if (this.isWhitespace(char)) {
      return this.scanWhitespace(start);
    }

    // Handle quoted strings
    if (char === SPECIAL_CHARS.SINGLE_QUOTE || char === SPECIAL_CHARS.DOUBLE_QUOTE) {
      return this.scanQuotedString(start);
    }

    // Handle special characters
    switch (char) {
      case SPECIAL_CHARS.COLON:
        this.advance();
        return this.createToken('COLON', char, start, this.position);

      case SPECIAL_CHARS.LPAREN:
        this.advance();
        return this.createToken('LPAREN', char, start, this.position);

      case SPECIAL_CHARS.RPAREN:
        this.advance();
        return this.createToken('RPAREN', char, start, this.position);
    }

    // Handle identifiers and keywords
    if (this.isIdentifierStart(char)) {
      return this.scanIdentifier(start);
    }

    // Unknown character - create invalid token
    this.advance();
    return this.createToken('INVALID', char, start, this.position);
  }

  /**
   * Scan whitespace characters
   */
  private scanWhitespace(start: number): Token {
    while (!this.isAtEnd() && this.isWhitespace(this.currentChar())) {
      this.advance();
    }

    const value = this.input.slice(start, this.position);
    return this.createToken('WHITESPACE', value, start, this.position);
  }

  /**
   * Scan quoted string (single or double quotes)
   */
  private scanQuotedString(start: number): Token {
    const quote = this.currentChar();
    this.advance(); // Skip opening quote

    let value = '';
    let escaped = false;

    while (!this.isAtEnd()) {
      const char = this.currentChar();

      if (escaped) {
        // Handle escape sequences
        switch (char) {
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
            value += char;
        }
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        this.advance(); // Skip closing quote
        return this.createToken('QUOTED_STRING', value, start, this.position);
      } else {
        value += char;
      }

      this.advance();
    }

    // Unterminated string - return invalid token
    return this.createToken('INVALID', this.input.slice(start, this.position), start, this.position);
  }

  /**
   * Scan identifier or keyword
   */
  private scanIdentifier(start: number): Token {
    while (!this.isAtEnd() && this.isIdentifierPart(this.currentChar())) {
      this.advance();
    }

    const value = this.input.slice(start, this.position);
    const tokenType = this.getIdentifierTokenType(value);

    return this.createToken(tokenType, value, start, this.position);
  }

  /**
   * Determine token type for identifier (keyword or regular identifier)
   */
  private getIdentifierTokenType(value: string): TokenType {
    // Check if it's a boolean operator
    const normalizedValue = this.options.caseSensitiveOperators ? value : value.toUpperCase();

    if (BOOLEAN_OPERATORS[normalizedValue]) {
      return normalizedValue === 'AND' ? 'AND' : 'OR';
    }

    return 'IDENTIFIER';
  }

  /**
   * Create a token with position information
   */
  private createToken(type: TokenType, value: string, start: number, end: number): Token {
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
  private isWhitespace(char: string): boolean {
    return WHITESPACE_PATTERN.test(char);
  }

  /**
   * Check if character can start an identifier
   */
  private isIdentifierStart(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  /**
   * Check if character can be part of an identifier
   */
  private isIdentifierPart(char: string): boolean {
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
  reset(): void {
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  /**
   * Get remaining input from current position
   */
  getRemainingInput(): string {
    return this.input.slice(this.position);
  }

  /**
   * Validate if a string could be a valid identifier
   */
  static isValidIdentifier(value: string): boolean {
    return IDENTIFIER_PATTERN.test(value);
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
