/**
 * QueryParser - Parses token streams into Abstract Syntax Trees
 *
 * This parser implements a recursive descent parser for the query language,
 * handling operator precedence, error recovery, and AST generation.
 */

import type { Comparator, Expression } from '../ASTBuilder';
import type { ParserOptions } from '../types';
import type { AddErrorProps, IQueryParser } from './QueryParser.interface';
import type { ParseError, ParseResult, WhitespaceContext } from './types';
import { ASTBuilder } from '../ASTBuilder/ASTBuilder';
import { ERROR_MESSAGES, ERROR_CODES, DEFAULT_PARSER_OPTIONS } from '../constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { QueryLexer } from '../QueryLexer/QueryLexer';
import { TokenStream } from '../QueryLexer/TokenStream';
import { ContextTypes, type ContextTypeValues } from './logic/constants';

/**
 * QueryParser parses query strings into Abstract Syntax Trees
 */
export class QueryParser implements IQueryParser {
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
      this.tokenStream.skipWhitespaces();

      // Check for empty input
      if (this.tokenStream.isAtEnd()) {
        const errorEmptyInputPosition = ASTBuilder.createPosition(0, 0);
        this.addError({
          message: ERROR_MESSAGES.EMPTY_QUERY,
          position: errorEmptyInputPosition,
          code: ERROR_CODES.EMPTY_EXPRESSION,
          expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
        });

        return { success: false, errors: this.errors };
      }

      // Parse the expression
      const expression = this.parseExpression();

      if (!expression) return { success: false, errors: this.errors };

      // Check for unexpected tokens at end
      this.tokenStream.skipWhitespaces();

      if (!this.tokenStream.isAtEnd()) {
        const token = this.tokenStream.current()!;

        const expectedTokens: ContextTypeValues[] = [];

        if (token.position.start === expression.position.end && this.isPartialLogicalOperator(token.value)) {
          expectedTokens.push(ContextTypes.LogicalOperator);
        }

        this.addError({
          message: ERROR_MESSAGES.UNEXPECTED_TOKEN,
          position: token.position,
          code: ERROR_CODES.UNEXPECTED_TOKEN,
          expectedTokens,
        });
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
      this.addError({
        message: error instanceof Error ? error.message : 'Unknown parsing error',
        position: errorPosition,
        code: ERROR_CODES.SYNTAX_ERROR,
      });

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
    const expression = this.parseOrExpression();
    return expression;
  }

  /**
   * Parse OR expressions (lowest precedence)
   */
  private parseOrExpression(): Expression | null {
    let leftAST = this.parseAndExpression();

    if (!leftAST) return null;

    while (this.matchLogicalOperatorOR()) {
      const operatorToken = this.tokenStream.consume()!;

      this.tokenStream.skipWhitespaces();
      const rightAST = this.parseAndExpression();

      if (!rightAST) return leftAST;

      // Create operator node with position information
      const operatorNode = ASTBuilder.createOperator('OR', operatorToken.position);

      const leftPosition = ASTBuilder.mergePositions(leftAST.position, rightAST.position);
      leftAST = ASTBuilder.createBooleanExpression(operatorNode, leftAST, rightAST, leftPosition);
    }

    return leftAST;
  }

  /**
   * Parse AND expressions (higher precedence than OR)
   */
  private parseAndExpression(): Expression | null {
    let leftAST = this.parsePrimaryExpression();

    if (!leftAST) return null;

    this.tokenStream.skipWhitespaces();

    while (this.matchLogicalOperatorAND()) {
      const operatorToken = this.tokenStream.consume()!;

      const whiteSpacesAfterLogicalOperatorCount = this.tokenStream.countAndSkipWhitespaces();

      // Check if we're at end of input after AND
      if (this.tokenStream.isAtEnd()) {
        const errorPosition = this.getPositionAfterToken(operatorToken);
        errorPosition.end += whiteSpacesAfterLogicalOperatorCount;

        const expectedTokens: ContextTypeValues[] = [];

        if (whiteSpacesAfterLogicalOperatorCount > 0) {
          expectedTokens.push(ContextTypes.Key, ContextTypes.LeftParenthesis);
        }

        this.addError({
          message: ERROR_MESSAGES.EXPECTED_EXPRESSION_AFTER_AND,
          position: errorPosition,
          code: ERROR_CODES.MISSING_TOKEN,
          expectedTokens,
        });
        return leftAST;
      }

      const rightAST = this.parsePrimaryExpression();

      if (!rightAST) return leftAST;

      // Create operator node with position information
      const operatorNode = ASTBuilder.createOperator('AND', operatorToken.position);

      const leftPosition = ASTBuilder.mergePositions(leftAST.position, rightAST.position);
      leftAST = ASTBuilder.createBooleanExpression(operatorNode, leftAST, rightAST, leftPosition);

      this.tokenStream.skipWhitespaces();
    }

    return leftAST;
  }

  /**
   * Parse primary expressions (conditions and groups)
   */
  private parsePrimaryExpression(): Expression | null {
    this.tokenStream.skipWhitespaces();

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

    this.tokenStream.skipWhitespaces();

    // Check for empty parentheses
    if (this.tokenStream.isCurrentAMatchWith(TokenTypes.RightParenthesis)) {
      this.addError({
        message: ERROR_MESSAGES.EMPTY_PARENTHESES,
        position: startToken.position,
        code: ERROR_CODES.EMPTY_EXPRESSION,
      });
      this.tokenStream.consume(); // consume the closing paren
      return null;
    }

    const expression = this.parseExpression();

    if (!expression) {
      this.addError({
        message: ERROR_MESSAGES.EXPECTED_EXPRESSION_IN_PARENTHESES,
        position: startToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
        expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
      });
      return null;
    }

    const whitespacesCount = this.tokenStream.countAndSkipWhitespaces();

    if (!this.tokenStream.isCurrentAMatchWith(TokenTypes.RightParenthesis)) {
      const expectedTokens: ContextTypeValues[] = [ContextTypes.RightParenthesis];

      if (whitespacesCount > 0) {
        expectedTokens.push(ContextTypes.RightParenthesis, ContextTypes.Comparator);
      } else {
        expectedTokens.push(ContextTypes.Value);
      }

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_CLOSING_PAREN,
        position: expression.position,
        code: ERROR_CODES.UNBALANCED_PARENS,
        expectedTokens,
      });

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
    const currentToken = this.tokenStream.current()!;

    const isValidKeyToken =
      this.tokenStream.isCurrentAMatchWith(TokenTypes.Identifier) && !/^\d/.test(currentToken.value);

    if (!isValidKeyToken) {
      const expectedTokens: ContextTypeValues[] = [];

      if (/[a-zA-Z_]/.test(currentToken.value)) {
        expectedTokens.push(ContextTypes.Key);
      }

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_KEY,
        position: currentToken?.position || ASTBuilder.createPosition(0, 0),
        code: ERROR_CODES.MISSING_TOKEN,
        expectedTokens,
      });

      return null;
    }

    const keyToken = this.tokenStream.consume()!;

    const spacesAfterKey = this.tokenStream.countAndSkipWhitespaces();

    // Expect comparator
    if (!this.tokenStream.matchAny(TokenTypes.Colon, TokenTypes.Comparator)) {
      const expectedTokens: ContextTypeValues[] = [ContextTypes.Colon];

      if (spacesAfterKey > 0) {
        expectedTokens.push(ContextTypes.Comparator);
      } else {
        expectedTokens.push(ContextTypes.Key);
      }

      const token = this.tokenStream.current();

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_COMPARATOR,
        position: token?.position || keyToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
        expectedTokens,
      });
      return null;
    }

    const comparatorToken = this.tokenStream.consume()!;

    const spacesAfterComparator = this.tokenStream.countAndSkipWhitespaces();

    // Expect value (identifier or quoted string)
    if (!this.tokenStream.matchAny(TokenTypes.Identifier, TokenTypes.QuotedString)) {
      const valueToken = this.tokenStream.current();

      const expectedTokens: ContextTypeValues[] = [ContextTypes.Value];

      // Always suggest QuotedString as an alternative for values
      if (spacesAfterComparator > 0) {
        expectedTokens.push(ContextTypes.QuotedString);
      }

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_VALUE,
        position: valueToken?.position || comparatorToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
        expectedTokens,
      });

      return null;
    }

    const valueToken = this.tokenStream.consume()!;

    const spacesAfterValue = this.tokenStream.countAndSkipWhitespaces();

    // Create child nodes
    const keyNode = ASTBuilder.createKey(keyToken.value, keyToken.position);
    const comparatorNode = ASTBuilder.createComparator(comparatorToken.value as Comparator, comparatorToken.position);
    const valueNode = ASTBuilder.createValue(valueToken.value, valueToken.position);

    const conditionPosition = ASTBuilder.mergePositions(keyToken.position, valueToken.position);

    const conditionAST = ASTBuilder.createCondition(
      keyNode,
      comparatorNode,
      valueNode,
      spacesAfterKey,
      spacesAfterComparator,
      spacesAfterValue,
      conditionPosition,
    );

    return conditionAST;
  }

  /**
   * Check if current token matches a boolean operator
   */
  private matchLogicalOperatorAND(): boolean {
    const token = this.tokenStream.current();

    if (!token) return false;

    const isAndOperator = token.type === TokenTypes.AND;

    return isAndOperator;
  }

  /**
   * Check if current token matches a boolean operator
   */
  private matchLogicalOperatorOR(): boolean {
    const token = this.tokenStream.current();

    if (!token) return false;

    const isOrOperator = token.type === TokenTypes.OR;

    return isOrOperator;
  }

  /**
   * Add a parse error
   */
  private addError(props: AddErrorProps): void {
    const { code, message, position, expectedTokens } = props;

    const error: ParseError = {
      message,
      position: {
        start: position.start,
        end: position.end,
      },
      expectedTokens,
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
   * Get position after a token for error reporting
   */
  private getPositionAfterToken(token: any): { start: number; end: number } {
    return {
      start: token.position.end,
      end: token.position.end,
    };
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

  /**
   * Classify whitespace context and determine what should come next
   */
  classifyWhitespace(input: string, position: number): WhitespaceContext | null {
    // First tokenize the input to understand the context
    const tokens = this.queryLexer.tokenize(input);

    // Find whitespace token at the given position
    const whitespaceToken = tokens.find(
      (token) =>
        token.type === TokenTypes.Whitespace && position >= token.position.start && position <= token.position.end,
    );

    if (!whitespaceToken) {
      return null; // Not in whitespace
    }

    // Find the token that comes before this whitespace
    const tokenBeforeWhitespace = tokens
      .filter((token) => token.type !== TokenTypes.Whitespace)
      .reverse()
      .find((token) => token.position.end <= whitespaceToken.position.start);

    if (!tokenBeforeWhitespace) {
      // Whitespace at the beginning - expect key or left parenthesis
      return {
        type: ContextTypes.Key,
        position: whitespaceToken.position,
        expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
        description: 'Whitespace at beginning - expect key or left parenthesis',
      };
    }

    // Classify based on the token that came before the whitespace
    switch (tokenBeforeWhitespace.type) {
      case TokenTypes.Identifier: {
        // Check if this identifier is a key by looking at what comes after the whitespace
        const nextNonWhitespaceToken = tokens
          .filter((token) => token.type !== TokenTypes.Whitespace)
          .find((token) => token.position.start >= whitespaceToken.position.end);

        if (
          nextNonWhitespaceToken &&
          (nextNonWhitespaceToken.type === TokenTypes.Colon || nextNonWhitespaceToken.type === TokenTypes.Comparator)
        ) {
          // This identifier is a key
          return {
            type: ContextTypes.WhitespaceAfterKey,
            position: whitespaceToken.position,
            expectedTokens: [ContextTypes.Comparator, ContextTypes.Colon],
            description: 'Whitespace after key - expect comparator',
          };
        }

        // This identifier is a value
        return {
          type: ContextTypes.WhitespaceAfterValue,
          position: whitespaceToken.position,
          expectedTokens: this.getExpectedAfterValue(tokens, whitespaceToken.position),
          description: 'Whitespace after value - expect logical operator or right parenthesis',
        };
      }

      case TokenTypes.QuotedString: {
        // Quoted strings are always values
        return {
          type: ContextTypes.WhitespaceAfterValue,
          position: whitespaceToken.position,
          expectedTokens: this.getExpectedAfterValue(tokens, whitespaceToken.position),
          description: 'Whitespace after value - expect logical operator or right parenthesis',
        };
      }

      case TokenTypes.Colon:
      case TokenTypes.Comparator: {
        return {
          type: ContextTypes.WhitespaceAfterComparator,
          position: whitespaceToken.position,
          expectedTokens: [ContextTypes.Value, ContextTypes.QuotedString],
          description: 'Whitespace after comparator - expect value',
        };
      }

      case TokenTypes.AND:
      case TokenTypes.OR: {
        return {
          type: ContextTypes.WhitespaceAfterLogicalOperator,
          position: whitespaceToken.position,
          expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
          description: 'Whitespace after logical operator - expect key or left parenthesis',
        };
      }

      case TokenTypes.RightParenthesis: {
        return {
          type: ContextTypes.WhitespaceAfterRightParenthesis,
          position: whitespaceToken.position,
          expectedTokens: this.getExpectedAfterValue(tokens, whitespaceToken.position),
          description: 'Whitespace after right parenthesis - expect logical operator or right parenthesis',
        };
      }

      default: {
        return {
          type: ContextTypes.Key,
          position: whitespaceToken.position,
          expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
          description: 'Unknown context - expect key or left parenthesis',
        };
      }
    }
  }

  /**
   * Get expected tokens after a value (considering parentheses context)
   */
  private getExpectedAfterValue(
    tokens: any[],
    whitespacePosition: { start: number; end: number },
  ): ContextTypeValues[] {
    const expectedTokens: ContextTypeValues[] = [ContextTypes.LogicalOperator];

    // Count open parentheses before this position
    const tokensBeforeWhitespace = tokens.filter((token) => token.position.end <= whitespacePosition.start);

    let openParensCount = 0;
    for (const token of tokensBeforeWhitespace) {
      if (token.type === TokenTypes.LeftParenthesis) {
        openParensCount++;
      } else if (token.type === TokenTypes.RightParenthesis) {
        openParensCount--;
      }
    }

    // If there are open parentheses, we can also expect a right parenthesis
    if (openParensCount > 0) {
      expectedTokens.push(ContextTypes.RightParenthesis);
    }

    return expectedTokens;
  }

  isPartialLogicalOperator(value: string): boolean {
    const lowercasedIncompleteValue = value.toLowerCase();
    return [TokenTypes.AND, TokenTypes.OR].some((op) => op.toLowerCase().startsWith(lowercasedIncompleteValue));
  }

  /**
   * Test whitespace classification for debugging
   */
  testWhitespaceClassification(input: string): Array<{ position: number; context: WhitespaceContext | null }> {
    const results: Array<{ position: number; context: WhitespaceContext | null }> = [];

    for (let i = 0; i < input.length; i++) {
      if (input[i] === ' ') {
        const context = this.classifyWhitespace(input, i);
        results.push({ position: i, context });
      }
    }

    return results;
  }
}
