import type { Expression } from '../ASTBuilder';
import type { TokenContext } from '../types';
import type { AddErrorProps, IQueryParser } from './QueryParser.interface';
import type { ParseError, ParseResult, ParserOptions } from './types';
import { ASTBuilder } from '../ASTBuilder/ASTBuilder';
import { BooleanOperator, type ComparatorValues } from '../constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { QueryLexer } from '../QueryLexer/QueryLexer';
import { TokenStream } from '../TokenStream';
import {
  ContextTypes,
  ERROR_CODES,
  ERROR_MESSAGES,
  DEFAULT_PARSER_OPTIONS,
  type ContextTypeValues,
} from './logic/constants';

export class QueryParser implements IQueryParser {
  private tokenStream: TokenStream = new TokenStream([]);
  private errors: ParseError[] = [];
  private openParenthesisCount = 0;
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
      const tokens = this.queryLexer.tokenize(input);
      this.tokenStream = new TokenStream(tokens);

      // Skip leading whitespace
      this.tokenStream.countAndSkipWhitespaces({ expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis] });

      // Check for empty input
      if (this.tokenStream.isAtEnd()) {
        const errorEmptyInputPosition = ASTBuilder.createPosition(0, 0);
        this.addError({
          message: ERROR_MESSAGES.EMPTY_QUERY,
          position: errorEmptyInputPosition,
          code: ERROR_CODES.EMPTY_EXPRESSION,
        });

        return { success: false, errors: this.errors, tokens };
      }

      // Parse the expression
      const expression = this.parseOrExpression();

      if (!expression) return { success: false, errors: this.errors, tokens };

      // Check for unexpected tokens at end
      this.tokenStream.countAndSkipWhitespaces({ expectedTokens: [] });

      if (!this.tokenStream.isAtEnd()) {
        const token = this.tokenStream.current()!;

        const expectedTokens: ContextTypeValues[] = [];
        const spacesAfterValue = 'spacesAfterValue' in expression ? expression.spacesAfterValue : 0;

        if (
          token.position.start === expression.position.end + spacesAfterValue &&
          this.isPartialLogicalOperator(token.value)
        ) {
          expectedTokens.push(ContextTypes.LogicalOperator);
        }
        token.context = { expectedTokens };

        this.addError({
          message: ERROR_MESSAGES.EXPECTED_OPERATOR,
          position: token.position,
          code: ERROR_CODES.UNEXPECTED_TOKEN,
        });
      }

      const queryPosition = ASTBuilder.createPosition(0, input.length);
      const queryAST = ASTBuilder.createQuery(expression, queryPosition);

      return {
        success: this.errors.length === 0,
        ast: queryAST,
        errors: this.errors,
        tokens,
      };
    } catch (error) {
      const errorPosition = ASTBuilder.createPosition(0, input.length);
      this.addError({
        message: error instanceof Error ? error.message : 'Unknown parsing error',
        position: errorPosition,
        code: ERROR_CODES.SYNTAX_ERROR,
      });

      return { success: false, errors: this.errors, tokens: [] };
    }
  }

  /**
   * Reset parser state
   */
  private reset(): void {
    this.errors = [];
    this.openParenthesisCount = 0;
  }

  /**
   * Parse OR expressions (lowest precedence)
   */
  private parseOrExpression(): Expression | null {
    let leftAST = this.parseAndExpression();

    if (!leftAST) return null;

    while (this.matchLogicalOperatorOR()) {
      const operatorToken = this.tokenStream.consume()!;

      this.tokenStream.countAndSkipWhitespaces({ expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis] });

      const rightAST = this.parseAndExpression();

      if (!rightAST) return leftAST;

      // Create operator node with position information
      const operatorNode = ASTBuilder.createOperator(BooleanOperator.OR, operatorToken.position);

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

    const context: TokenContext = { expectedTokens: [ContextTypes.LogicalOperator] };
    if (this.openParenthesisCount > 0) {
      context.expectedTokens.push(ContextTypes.RightParenthesis);
    }
    this.tokenStream.countAndSkipWhitespaces(context);

    while (this.matchLogicalOperatorAND()) {
      const operatorToken = this.tokenStream.consume()!;

      const whiteSpacesAfterLogicalOperatorCount = this.tokenStream.countAndSkipWhitespaces({
        expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis],
      });

      // Check if we're at end of input after AND
      if (this.tokenStream.isAtEnd()) {
        const errorPosition = this.getPositionAfterToken(operatorToken);
        errorPosition.end += whiteSpacesAfterLogicalOperatorCount;

        this.addError({
          message: ERROR_MESSAGES.EXPECTED_EXPRESSION_AFTER_AND,
          position: errorPosition,
          code: ERROR_CODES.MISSING_TOKEN,
        });

        return leftAST;
      }

      const rightAST = this.parsePrimaryExpression();

      if (!rightAST) return leftAST;

      // Create operator node with position information
      const operatorNode = ASTBuilder.createOperator(BooleanOperator.AND, operatorToken.position);

      const leftPosition = ASTBuilder.mergePositions(leftAST.position, rightAST.position);
      leftAST = ASTBuilder.createBooleanExpression(operatorNode, leftAST, rightAST, leftPosition);

      const context: TokenContext = { expectedTokens: [ContextTypes.LogicalOperator] };
      if (this.openParenthesisCount > 0) {
        context.expectedTokens.push(ContextTypes.RightParenthesis);
      }
      this.tokenStream.countAndSkipWhitespaces(context);
    }

    return leftAST;
  }

  /**
   * Parse primary expressions (conditions and groups)
   */
  private parsePrimaryExpression(): Expression | null {
    this.tokenStream.countAndSkipWhitespaces({ expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis] });

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
    this.openParenthesisCount++;

    this.tokenStream.countAndSkipWhitespaces({ expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis] });

    // Check for empty parentheses
    if (this.tokenStream.isCurrentAMatchWith(TokenTypes.RightParenthesis)) {
      this.addError({
        message: ERROR_MESSAGES.EMPTY_PARENTHESES,
        position: startToken.position,
        code: ERROR_CODES.EMPTY_EXPRESSION,
      });

      this.tokenStream.consume(); // consume the closing parenthesis
      this.openParenthesisCount--;

      return null;
    }

    const expression = this.parseOrExpression();

    if (!expression) {
      this.addError({
        message: ERROR_MESSAGES.EXPECTED_EXPRESSION_IN_PARENTHESES,
        position: startToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
      });

      return null;
    }

    const context: TokenContext = { expectedTokens: [ContextTypes.Comparator] };
    if (this.openParenthesisCount > 1) {
      context.expectedTokens.push(ContextTypes.RightParenthesis);
    }
    this.tokenStream.countAndSkipWhitespaces(context);

    if (!this.tokenStream.isCurrentAMatchWith(TokenTypes.RightParenthesis)) {
      this.addError({
        message: ERROR_MESSAGES.EXPECTED_CLOSING_PAREN,
        position: expression.position,
        code: ERROR_CODES.UNBALANCED_PARENS,
      });

      return expression; // Return what we have for error recovery
    }

    const rightParenthesisToken = this.tokenStream.consume()!;
    this.openParenthesisCount--;

    const groupPosition = ASTBuilder.mergePositions(startToken.position, rightParenthesisToken.position);
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
      this.addError({
        message: ERROR_MESSAGES.EXPECTED_KEY,
        position: currentToken?.position || ASTBuilder.createPosition(0, 0),
        code: ERROR_CODES.MISSING_TOKEN,
      });

      return null;
    }

    const keyToken = this.tokenStream.consume()!;
    keyToken.context = { expectedTokens: [ContextTypes.Key, ContextTypes.Colon] };

    const spacesAfterKey = this.tokenStream.countAndSkipWhitespaces({
      expectedTokens: [ContextTypes.Comparator, ContextTypes.Colon],
    });

    // Expect comparator
    if (!this.tokenStream.matchAny(TokenTypes.Colon, TokenTypes.Comparator)) {
      const token = this.tokenStream.current()!;

      const expectedTokens: ContextTypeValues[] = [];

      if (this.isPartialComparator(token.value)) {
        expectedTokens.push(ContextTypes.Comparator);
      }
      token.context = { expectedTokens };

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_COMPARATOR,
        position: token?.position || keyToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
      });

      return null;
    }

    const comparatorToken = this.tokenStream.consume()!;
    comparatorToken.context = { expectedTokens: [ContextTypes.Comparator] };

    const spacesAfterComparator = this.tokenStream.countAndSkipWhitespaces({
      expectedTokens: [ContextTypes.Value, ContextTypes.QuotedString],
      key: keyToken.value,
    });

    // Expect value (identifier or quoted string)
    if (!this.tokenStream.matchAny(TokenTypes.Identifier, TokenTypes.QuotedString)) {
      const valueToken = this.tokenStream.current();

      this.addError({
        message: ERROR_MESSAGES.EXPECTED_VALUE,
        position: valueToken?.position || comparatorToken.position,
        code: ERROR_CODES.MISSING_TOKEN,
      });

      return null;
    }

    const valueToken = this.tokenStream.consume()!;
    valueToken.context = { expectedTokens: [ContextTypes.Value, ContextTypes.QuotedString] };

    const context: TokenContext = { expectedTokens: [ContextTypes.LogicalOperator] };
    if (this.openParenthesisCount > 0) {
      context.expectedTokens.push(ContextTypes.RightParenthesis);
    }
    const spacesAfterValue = this.tokenStream.countAndSkipWhitespaces(context);

    // Create child nodes
    const keyNode = ASTBuilder.createKey(keyToken.value, keyToken.position);
    const comparatorNode = ASTBuilder.createComparator(
      comparatorToken.value as ComparatorValues,
      comparatorToken.position,
    );
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
    const { code, message, position } = props;

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
   * Get position after a token for error reporting
   */
  private getPositionAfterToken(token: any): { start: number; end: number } {
    return {
      start: token.position.end,
      end: token.position.end,
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

  private isPartialLogicalOperator(value: string): boolean {
    const lowercasedIncompleteValue = value.toLowerCase();
    return [TokenTypes.AND, TokenTypes.OR].some((op) => op.toLowerCase().startsWith(lowercasedIncompleteValue));
  }

  private isPartialComparator(value: string): boolean {
    const comparators = [':', '=', '!=', '<', '<=', '>', '>='];
    return comparators.some((comp) => comp.startsWith(value));
  }
}
