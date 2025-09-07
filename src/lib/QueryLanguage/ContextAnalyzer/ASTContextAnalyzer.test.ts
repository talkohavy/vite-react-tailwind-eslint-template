import type { ParseResult } from '../QueryParser';
import type { Token } from '../types';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { ASTContextAnalyzer } from './ASTContextAnalyzer';

describe('ASTContextAnalyzer', () => {
  const createToken = (type: string, value: string, start: number, end: number): Token => ({
    type: type as any,
    value,
    position: { start, end },
  });

  const createMockParseResult = (errors: any[] = [], ast?: any): ParseResult => ({
    success: errors.length === 0,
    errors,
    ast,
  });

  describe('analyzeContext', () => {
    it('should handle empty query correctly', () => {
      const tokens: Token[] = [];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult(),
        cursorPosition: 0,
        originalQuery: '',
      });

      expect(result.expectedTypes).toContain('key');
      expect(result.canStartNewGroup).toBe(true);
      expect(result.canInsertValue).toBe(false);
      expect(result.canInsertKey).toBe(true);
      expect(result.isPartiallyCorrect).toBe(true);
    });

    it('should handle single identifier correctly', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'name', 0, 4)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Expected comparator',
            position: { start: 4, end: 4 },
            expectedTokens: [TokenTypes.Colon, TokenTypes.Comparator],
            recoverable: true,
          },
        ]),
        cursorPosition: 2,
        originalQuery: 'name',
      });

      expect(result.expectedTypes.length).toBeGreaterThan(0);
      expect(result.canInsertValue).toBe(false);
      expect(result.isPartiallyCorrect).toBe(true);
    });

    it('should handle parsing errors gracefully', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'name', 0, 4), createToken(TokenTypes.Invalid, '??', 4, 6)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Unexpected token',
            position: { start: 4, end: 6 },
            expectedTokens: [TokenTypes.Colon],
            recoverable: false,
          },
        ]),
        cursorPosition: 5,
        originalQuery: 'name??',
      });

      expect(result.syntaxErrors).toHaveLength(1);
      expect(result.isPartiallyCorrect).toBe(false);
    });

    it('should handle quoted strings', () => {
      const tokens = [
        createToken(TokenTypes.Identifier, 'name', 0, 4),
        createToken(TokenTypes.Colon, ':', 4, 5),
        createToken(TokenTypes.QuotedString, '"john doe"', 5, 15),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult(),
        cursorPosition: 10,
        originalQuery: 'name:"john doe"',
      });

      expect(result.isInQuotes).toBe(true);
      expect(result.incompleteValue).toBeTruthy();
    });

    it('should handle partial logical operators', () => {
      const tokens = [
        createToken(TokenTypes.Identifier, 'name', 0, 4),
        createToken(TokenTypes.Colon, ':', 4, 5),
        createToken(TokenTypes.QuotedString, '"john"', 5, 11),
        createToken(TokenTypes.Whitespace, ' ', 11, 12),
        createToken(TokenTypes.Identifier, 'AN', 12, 14),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Expected AND or OR',
            position: { start: 12, end: 14 },
            expectedTokens: [TokenTypes.AND, TokenTypes.OR],
            recoverable: true,
          },
        ]),
        cursorPosition: 14,
        originalQuery: 'name:"john" AN',
      });

      expect(result.incompleteValue).toBe('AN');
      expect(result.expectedTypes).toContain('operator');
    });

    it('should handle partial comparators', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'age', 0, 3), createToken(TokenTypes.Identifier, '=', 3, 4)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Expected comparator',
            position: { start: 3, end: 4 },
            expectedTokens: [TokenTypes.Comparator],
            recoverable: true,
          },
        ]),
        cursorPosition: 4,
        originalQuery: 'age=',
      });

      expect(result.incompleteValue).toBe('age=');
      expect(result.expectedTypes).toContain('comparator');
    });

    it('should indicate canInsertValue when expecting a value', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'name', 0, 4), createToken(TokenTypes.Colon, ':', 4, 5)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Expected value',
            position: { start: 5, end: 5 },
            expectedTokens: [TokenTypes.Value],
            recoverable: true,
          },
        ]),
        cursorPosition: 5,
        originalQuery: 'name:',
      });

      expect(result.canInsertValue).toBe(true);
      expect(result.canInsertComparator).toBe(false);
      expect(result.canInsertLogicalOperator).toBe(false);
      expect(result.canInsertKey).toBe(false); // After comparator, only expecting value
    });

    it('should indicate canInsertKey when expecting a key after logical operator', () => {
      const tokens = [
        createToken(TokenTypes.Identifier, 'name', 0, 4),
        createToken(TokenTypes.Colon, ':', 4, 5),
        createToken(TokenTypes.QuotedString, '"john"', 5, 11),
        createToken(TokenTypes.Whitespace, ' ', 11, 12),
        createToken(TokenTypes.AND, 'AND', 12, 15),
        createToken(TokenTypes.Whitespace, ' ', 15, 16),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([
          {
            message: 'Expected key',
            position: { start: 16, end: 16 },
            expectedTokens: [TokenTypes.Key, TokenTypes.LeftParenthesis],
            recoverable: true,
          },
        ]),
        cursorPosition: 16,
        originalQuery: 'name:"john" AND ',
      });

      expect(result.canInsertKey).toBe(true);
      expect(result.canInsertValue).toBe(false); // After logical operator, only expecting key
      expect(result.canInsertComparator).toBe(false);
      expect(result.canInsertLogicalOperator).toBe(false);
    });
  });

  describe('extractIncompleteValue', () => {
    it('should extract incomplete word correctly', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'nam', 0, 3)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult(),
        cursorPosition: 3,
        originalQuery: 'nam',
      });

      expect(result.incompleteValue).toBe('nam');
    });

    it('should extract partial value in middle of word', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'name', 0, 4)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult(),
        cursorPosition: 2,
        originalQuery: 'name',
      });

      expect(result.incompleteValue).toBe('name');
    });
  });

  describe('isPartialLogicalOperator', () => {
    it('should detect partial AND operator', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'A', 0, 1)];
      const analyzer = new ASTContextAnalyzer(tokens);

      // Use reflection to test private method
      const isPartial = (analyzer as any).isPartialLogicalOperator('a');
      expect(isPartial).toBe(true);
    });

    it('should detect partial OR operator', () => {
      const tokens = [createToken(TokenTypes.Identifier, 'O', 0, 1)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const isPartial = (analyzer as any).isPartialLogicalOperator('o');
      expect(isPartial).toBe(true);
    });

    it('should not detect complete operators as partial', () => {
      const tokens = [createToken(TokenTypes.AND, 'AND', 0, 3)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const isPartial = (analyzer as any).isPartialLogicalOperator('and');
      expect(isPartial).toBe(false);
    });
  });

  describe('isPartialComparator', () => {
    it('should detect partial == comparator', () => {
      const tokens = [createToken(TokenTypes.Identifier, '=', 0, 1)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const isPartial = (analyzer as any).isPartialComparator('=');
      expect(isPartial).toBe(true);
    });

    it('should detect partial >= comparator', () => {
      const tokens = [createToken(TokenTypes.Identifier, '>', 0, 1)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const isPartial = (analyzer as any).isPartialComparator('>');
      expect(isPartial).toBe(true);
    });

    it('should not detect complete comparators as partial', () => {
      const tokens = [createToken(TokenTypes.Comparator, '==', 0, 2)];
      const analyzer = new ASTContextAnalyzer(tokens);

      const isPartial = (analyzer as any).isPartialComparator('==');
      expect(isPartial).toBe(false);
    });
  });

  describe('complete expression analysis', () => {
    it('should return correct expected types for cursor at end of complete expression', () => {
      // Test case: "someKey == someVal"
      const tokens = [
        createToken(TokenTypes.Identifier, 'someKey', 0, 7),
        createToken(TokenTypes.Comparator, '==', 8, 10),
        createToken(TokenTypes.Identifier, 'someVal', 11, 18),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      // Create a mock AST for a complete condition (matching the real parser structure)
      const mockAST = {
        type: 'query',
        position: { start: 0, end: 18 },
        expression: {
          type: 'condition',
          key: 'someKey',
          comparator: '==',
          value: 'someVal',
          position: { start: 0, end: 18 },
        },
      };

      // Test cursor at position 18 (at the end of value token) - should allow continuing the value
      const result1 = analyzer.analyzeContext({
        parseResult: createMockParseResult([], mockAST),
        cursorPosition: 18,
        originalQuery: 'someKey == someVal',
      });

      expect(result1.expectedTypes).toContain('value');
      expect(result1.expectedTypes).not.toContain('operator');
      expect(result1.expectedTypes).not.toContain('key');
      expect(result1.expectedTypes).not.toContain('left-parenthesis');
    });

    it('should return correct expected types for cursor within value', () => {
      // Test case: "someKey == someVal" with cursor inside value
      const tokens = [
        createToken(TokenTypes.Identifier, 'someKey', 0, 7),
        createToken(TokenTypes.Comparator, '==', 8, 10),
        createToken(TokenTypes.Identifier, 'someVal', 11, 18),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      // Create a mock AST for a complete condition
      const mockAST = {
        type: 'query',
        position: { start: 0, end: 18 },
        expression: {
          type: 'condition',
          key: 'someKey',
          comparator: '==',
          value: 'someVal',
          position: { start: 0, end: 18 },
        },
      };

      // Test cursor at position 15 (within the value) - should allow value completion
      const result2 = analyzer.analyzeContext({
        parseResult: createMockParseResult([], mockAST),
        cursorPosition: 15,
        originalQuery: 'someKey == someVal',
      });

      expect(result2.expectedTypes).toContain('value');
      expect(result2.expectedTypes).not.toContain('operator');
      expect(result2.expectedTypes).not.toContain('key');
    });

    it('should return correct expected types for cursor after complete expression with space', () => {
      // Test case: "someKey == someVal " with cursor after space
      const tokens = [
        createToken(TokenTypes.Identifier, 'someKey', 0, 7),
        createToken(TokenTypes.Comparator, '==', 8, 10),
        createToken(TokenTypes.Identifier, 'someVal', 11, 18),
        createToken(TokenTypes.Whitespace, ' ', 18, 19),
      ];
      const analyzer = new ASTContextAnalyzer(tokens);

      // Create a mock AST for a complete condition with trailing space
      const mockAST = {
        type: 'query',
        position: { start: 0, end: 19 },
        expression: {
          type: 'condition',
          key: 'someKey',
          comparator: '==',
          value: 'someVal',
          position: { start: 0, end: 18 },
        },
      };

      // Test cursor at position 19 (after space) - should allow logical operators
      const result = analyzer.analyzeContext({
        parseResult: createMockParseResult([], mockAST),
        cursorPosition: 19,
        originalQuery: 'someKey == someVal ',
      });

      expect(result.expectedTypes).toContain('operator');
      expect(result.expectedTypes).toContain('right-parenthesis');
      expect(result.expectedTypes).not.toContain('key');
      expect(result.expectedTypes).not.toContain('left-parenthesis');
    });
  });
});
