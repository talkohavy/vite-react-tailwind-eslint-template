/**
 * QueryParser - Parses token streams into Abstract Syntax Trees
 *
 * This parser implements a recursive descent parser for the query language,
 * handling operator precedence, error recovery, and AST generation.
 */

import type { ParseResult, ParseError, ParserOptions, Expression, BooleanOperator } from '../types';
import { ERROR_MESSAGES, ERROR_CODES, DEFAULT_PARSER_OPTIONS } from '../constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { QueryLexer } from '../QueryLexer/QueryLexer';
import { TokenStream } from '../QueryLexer/TokenStream';
import { ASTBuilder } from '../utils/ASTBuilder';

/**
 * QueryParser parses query strings into Abstract Syntax Trees
 */
export class QueryParser {
  private tokenStream: TokenStream = new TokenStream([]);
  private errors: ParseError[] = [];
  private options: ParserOptions;
  private queryLexer: QueryLexer;

  constructor(options: Partial<ParserOptions> = {}) {
    this.options = { ...DEFAULT_PARSER_OPTIONS, ...options };
    this.queryLexer = new QueryLexer();
  }

  /**
   * Parse a query string into an AST
   */
  parse(input: string): ParseResult {
    try {
      this.reset();

      // Tokenize input
      this.tokenStream = new TokenStream(this.queryLexer.tokenize(input));

      // Skip leading whitespace
      this.skipWhitespace();

      // Check for empty input
      if (this.tokenStream.isAtEnd()) {
        const errorEmptyInputPosition = ASTBuilder.createPosition(0, 0);
        this.addError(ERROR_MESSAGES.EMPTY_QUERY, errorEmptyInputPosition, ERROR_CODES.EMPTY_EXPRESSION);

        return { success: false, errors: this.errors };
      }

      // Parse the expression
      const expression = this.parseExpression();

      if (!expression) {
        return { success: false, errors: this.errors };
      }

      // Check for unexpected tokens at end
      this.skipWhitespace();

      if (!this.tokenStream.isAtEnd()) {
        const token = this.tokenStream.current();
        if (token) {
          this.addError(ERROR_MESSAGES.UNEXPECTED_TOKEN, token.position, ERROR_CODES.UNEXPECTED_TOKEN);
        }
      }

      const queryPosition = ASTBuilder.createPosition(0, input.length);
      const queryAST = ASTBuilder.createQuery(expression, queryPosition);

      return {
        success: this.errors.length === 0,
        ast: queryAST,
        errors: this.errors,
      };
    } catch (error) {
      const errorPosition = ASTBuilder.createPosition(0, input.length);
      this.addError(
        error instanceof Error ? error.message : 'Unknown parsing error',
        errorPosition,
        ERROR_CODES.SYNTAX_ERROR,
      );

      return { success: false, errors: this.errors };
    }
  }

  /**
   * Reset parser state
   */
  private reset(): void {
    this.errors = [];
  }

  /**
   * Parse an expression (handles operator precedence)
   */
  private parseExpression(): Expression | null {
    return this.parseOrExpression();
  }

  /**
   * Parse OR expressions (lowest precedence)
   */
  private parseOrExpression(): Expression | null {
    let leftAST = this.parseAndExpression();
    if (!leftAST) return null;

    while (this.matchOperator(TokenTypes.OR)) {
      const operatorToken = this.tokenStream.consume()!;
      this.skipWhitespace();

      const rightAST = this.parseAndExpression();

      if (!rightAST) {
        this.addError(ERROR_MESSAGES.EXPECTED_VALUE, operatorToken.position, ERROR_CODES.MISSING_TOKEN);
        return leftAST;
      }

      const leftPosition = ASTBuilder.mergePositions(leftAST.position, rightAST.position);
      leftAST = ASTBuilder.createBooleanExpression(TokenTypes.OR, leftAST, rightAST, leftPosition);
    }

    return leftAST;
  }

  /**
   * Parse AND expressions (higher precedence than OR)
   */
  private parseAndExpression(): Expression | null {
    let leftAST = this.parsePrimaryExpression();
    if (!leftAST) return null;

    this.skipWhitespace();

    while (this.matchOperator(TokenTypes.AND)) {
      const operatorToken = this.tokenStream.consume()!;

      this.skipWhitespace();

      const rightAST = this.parsePrimaryExpression();

      if (!rightAST) {
        this.addError(ERROR_MESSAGES.EXPECTED_VALUE, operatorToken.position, ERROR_CODES.MISSING_TOKEN);
        return leftAST;
      }

      const leftPosition = ASTBuilder.mergePositions(leftAST.position, rightAST.position);
      leftAST = ASTBuilder.createBooleanExpression(TokenTypes.AND, leftAST, rightAST, leftPosition);
    }

    return leftAST;
  }

  /**
   * Parse primary expressions (conditions and groups)
   */
  private parsePrimaryExpression(): Expression | null {
    this.skipWhitespace();

    // Handle grouped expressions
    if (this.tokenStream.isCurrentAMatchWith(TokenTypes.LeftParenthesis)) {
      const groupExpression = this.parseGroupExpression();

      return groupExpression;
    }

    // Handle conditions
    const parsedCondition = this.parseCondition();

    return parsedCondition;
  }

  /**
   * Parse grouped expression (parentheses)
   */
  private parseGroupExpression(): Expression | null {
    const startToken = this.tokenStream.expect(TokenTypes.LeftParenthesis);
    this.skipWhitespace();

    const expression = this.parseExpression();
    if (!expression) {
      this.addError(ERROR_MESSAGES.EXPECTED_VALUE, startToken.position, ERROR_CODES.MISSING_TOKEN);
      return null;
    }

    this.skipWhitespace();

    if (!this.tokenStream.isCurrentAMatchWith(TokenTypes.RightParenthesis)) {
      this.addError(ERROR_MESSAGES.EXPECTED_CLOSING_PAREN, expression.position, ERROR_CODES.UNBALANCED_PARENS);
      return expression; // Return what we have for error recovery
    }

    const endToken = this.tokenStream.consume()!;

    const groupPosition = ASTBuilder.mergePositions(startToken.position, endToken.position);
    const groupAST = ASTBuilder.createGroup(expression, groupPosition);

    return groupAST;
  }

  /**
   * Parse condition expression (key: value)
   */
  private parseCondition(): Expression | null {
    // Expect identifier for key
    if (!this.tokenStream.isCurrentAMatchWith(TokenTypes.Key)) {
      const token = this.tokenStream.current();

      this.addError(
        ERROR_MESSAGES.EXPECTED_KEY,
        token?.position || ASTBuilder.createPosition(0, 0),
        ERROR_CODES.MISSING_TOKEN,
      );

      return null;
    }

    const keyToken = this.tokenStream.consume()!;
    this.skipWhitespace();

    // Expect colon
    if (!this.tokenStream.isCurrentAMatchWith(TokenTypes.Colon)) {
      const token = this.tokenStream.current();
      this.addError(ERROR_MESSAGES.EXPECTED_COLON, token?.position || keyToken.position, ERROR_CODES.MISSING_TOKEN);
      return null;
    }

    const colonToken = this.tokenStream.consume()!;
    this.skipWhitespace();

    // Expect value (identifier or quoted string)
    if (!this.tokenStream.matchAny(TokenTypes.Value, TokenTypes.QuotedString)) {
      const token = this.tokenStream.current();
      this.addError(ERROR_MESSAGES.EXPECTED_VALUE, token?.position || colonToken.position, ERROR_CODES.MISSING_TOKEN);
      return null;
    }

    const valueToken = this.tokenStream.consume()!;

    const value: string = valueToken.value;

    const conditionPosition = ASTBuilder.mergePositions(keyToken.position, valueToken.position);
    const conditionAST = ASTBuilder.createCondition(
      keyToken.value,
      ':', // Currently only support equals
      value,
      conditionPosition,
    );

    return conditionAST;
  }

  /**
   * Check if current token matches a boolean operator
   */
  private matchOperator(operator: BooleanOperator): boolean {
    const token = this.tokenStream.current();
    if (!token) return false;

    if (operator === TokenTypes.AND) {
      const isAndOperator =
        token.type === TokenTypes.AND ||
        (token.type === TokenTypes.Key && token.value.toUpperCase() === TokenTypes.AND);

      return isAndOperator;
    }

    if (operator === TokenTypes.OR) {
      const isOrOperator =
        token.type === TokenTypes.OR || (token.type === TokenTypes.Key && token.value.toUpperCase() === TokenTypes.OR);

      return isOrOperator;
    }

    return false;
  }

  /**
   * Skip whitespace tokens
   */
  private skipWhitespace(): void {
    this.tokenStream.skip(TokenTypes.Whitespace);
  }

  /**
   * Add a parse error
   */
  private addError(message: string, position: { start: number; end: number }, code: string): void {
    const error: ParseError = {
      message,
      position: {
        start: position.start,
        end: position.end,
      },
      recoverable: true,
    };

    // Add error code for programmatic handling
    (error as any).code = code;

    this.errors.push(error);

    // Stop parsing if we hit max errors
    if (this.errors.length >= this.options.maxErrors) {
      throw new Error(`Too many parse errors (${this.options.maxErrors})`);
    }
  }

  /**
   * Get current parsing position for debugging
   */
  private getCurrentPosition(): number {
    const token = this.tokenStream.current();
    return token?.position.start || 0;
  }

  /**
   * Get detailed parse information for debugging
   */
  getDebugInfo(): object {
    return {
      currentToken: this.tokenStream.current(),
      position: this.getCurrentPosition(),
      errors: this.errors,
      tokenStream: this.tokenStream.getDebugInfo(),
    };
  }

  /**
   * Parse a partial expression (useful for auto-completion)
   */
  parsePartial(input: string): {
    ast?: Expression;
    errors: ParseError[];
    context: 'key' | 'value' | 'operator' | 'unknown';
  } {
    // Store original options and temporarily allow partial parse
    const originalOptions = this.options;
    this.options = { ...this.options, allowPartialParse: true };

    try {
      const result = this.parse(input);
      const context = this.determineContext(input);

      return {
        ast: result.ast?.expression,
        errors: result.errors,
        context,
      };
    } finally {
      this.options = originalOptions;
    }
  }

  /**
   * Determine the parsing context for auto-completion
   */
  private determineContext(input: string): 'key' | 'value' | 'operator' | 'unknown' {
    const trimmed = input.trim();

    // Empty or only whitespace - expect key
    if (!trimmed) {
      return 'key';
    }

    // Ends with colon and optional whitespace - expect value
    if (/:\s*$/.test(trimmed)) {
      return 'value';
    }

    // Ends with complete condition - expect operator
    if (/\w+\s*:\s*(?:\w+|"[^"]*"|'[^']*')\s*$/.test(trimmed)) {
      return 'operator';
    }

    // After AND/OR - expect key
    if (/(?:AND|OR)\s*$/i.test(trimmed)) {
      return 'key';
    }

    // After opening parenthesis - expect key
    if (/\(\s*$/.test(trimmed)) {
      return 'key';
    }

    return 'unknown';
  }

  /**
   * Validate syntax without full parsing (faster for validation-only scenarios)
   */
  validateSyntax(input: string): { valid: boolean; errors: ParseError[] } {
    try {
      const result = this.parse(input);
      return {
        valid: result.success,
        errors: result.errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Validation error',
            position: { start: 0, end: input.length },
            recoverable: false,
          },
        ],
      };
    }
  }
}
