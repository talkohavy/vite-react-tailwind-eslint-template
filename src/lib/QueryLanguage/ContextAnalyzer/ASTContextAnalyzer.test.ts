import type { Token, ParseResult } from '../types';
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
            expectedTokens: [TokenTypes.Identifier, TokenTypes.QuotedString],
            recoverable: true,
          },
        ]),
        cursorPosition: 5,
        originalQuery: 'name:',
      });

      expect(result.canInsertValue).toBe(true);
      expect(result.canInsertComparator).toBe(false);
      expect(result.canInsertLogicalOperator).toBe(false);
      expect(result.canInsertKey).toBe(true); // Identifier can be key or value
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
            expectedTokens: [TokenTypes.Identifier, TokenTypes.LeftParenthesis],
            recoverable: true,
          },
        ]),
        cursorPosition: 16,
        originalQuery: 'name:"john" AND ',
      });

      expect(result.canInsertKey).toBe(true);
      expect(result.canInsertValue).toBe(true); // Identifier can be key or value in error cases
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
});
