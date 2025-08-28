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
  IDENTIFIER_PATTERN,
  QUOTED_STRING_PATTERN,
  WHITESPACE_PATTERN,
  DEFAULT_LEXER_OPTIONS,
  SPECIAL_CHARS,
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
  private previousToken: Token | null = null;

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
        // Update last token (skip whitespace for context)
        if (token.type !== TokenTypes.Whitespace) {
          this.previousToken = token;
        }
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

    // Handle comparison operators (multi-character first)
    if (['><!'].includes(char)) {
      return this.scanComparisonOperator(start);
    }

    // Handle special characters
    switch (char) {
      case SPECIAL_CHARS.COLON:
        this.advance();
        return this.createToken(TokenTypes.Colon, char, start, this.position);

      case SPECIAL_CHARS.LPAREN:
        this.advance();
        return this.createToken(TokenTypes.LeftParenthesis, char, start, this.position);

      case SPECIAL_CHARS.RPAREN:
        this.advance();
        return this.createToken(TokenTypes.RightParenthesis, char, start, this.position);

      case SPECIAL_CHARS.INCLUDES:
        this.advance();
        return this.createToken(TokenTypes.Comparator, char, start, this.position);
    }

    // Handle identifiers and keywords
    if (this.isIdentifierStart(char)) {
      return this.scanKeyValueAndOr(start);
    }

    // Unknown character - create invalid token
    this.advance();
    return this.createToken(TokenTypes.Invalid, char, start, this.position);
  }

  /**
   * Scan whitespace characters
   */
  private scanWhitespace(start: number): Token {
    while (!this.isAtEnd() && this.isWhitespace(this.currentChar())) {
      this.advance();
    }

    const allWhitespaces = this.input.slice(start, this.position);
    return this.createToken(TokenTypes.Whitespace, allWhitespaces, start, this.position);
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
        return this.createToken(TokenTypes.QuotedString, value, start, this.position);
      } else {
        value += nextChar;
      }

      this.advance();
    }

    // string was opened, but never closed! return invalid token
    return this.createToken(TokenTypes.Invalid, this.input.slice(start, this.position), start, this.position);
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
      return this.createToken(TokenTypes.Comparator, `${char}${nextChar}`, start, this.position);
    }

    // Check for Invalid combination ('!' without '=')
    if (char === '!') {
      return this.createToken(TokenTypes.Invalid, char, start, this.position);
    }

    return this.createToken(TokenTypes.Comparator, char, start, this.position);
  }

  /**
   * Scan identifier or keyword
   */
  private scanKeyValueAndOr(start: number): Token {
    while (!this.isAtEnd() && this.isPartOfIdentifier(this.currentChar())) {
      this.advance();
    }

    const valueToTokenize = this.input.slice(start, this.position);
    const tokenType = this.getIdentifierTokenType(valueToTokenize);

    return this.createToken(tokenType, valueToTokenize, start, this.position);
  }

  /**
   * Determine token type for identifier (keyword, key, or value)
   */
  private getIdentifierTokenType(value: string): TokenTypeValues {
    // Check if it's a boolean operator
    const normalizedValue = this.options.caseSensitiveOperators ? value : value.toUpperCase();

    if (BOOLEAN_OPERATORS[normalizedValue]) {
      return normalizedValue === TokenTypes.AND ? TokenTypes.AND : TokenTypes.OR;
    }

    // Determine if this identifier should be a KEY or VALUE based on context
    return this.determineKeyOrValue();
  }

  /**
   * Determine if the current identifier should be classified as KEY or VALUE
   * based on the previous token type
   */
  private determineKeyOrValue(): TokenTypeValues {
    // If first token in the query - must be a key
    if (!this.previousToken) return TokenTypes.Key;

    const previousTokenType = this.previousToken.type;

    // If previous token was opening parenthesis, AND, or OR, this must be a key
    if (
      previousTokenType === TokenTypes.LeftParenthesis ||
      previousTokenType === TokenTypes.AND ||
      previousTokenType === TokenTypes.OR
    ) {
      return TokenTypes.Key;
    }

    // If previous token was a comparison operator, this must be a value
    if ([TokenTypes.Comparator, TokenTypes.Colon].includes(previousTokenType as any)) return TokenTypes.Value;

    // WARNING! You should never get here!!!
    // If previous token was a key, this could be a value (for colon-less syntax)
    // or another key if there was a boolean operator in between
    // For now, default to key since we expect explicit operators
    return TokenTypes.Key;
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
  reset(): void {
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.previousToken = null;
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
