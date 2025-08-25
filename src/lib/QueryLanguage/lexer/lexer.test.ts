/**
 * Unit tests for QueryLexer
 */

import type { TokenType } from '../types';
import { QueryLexer } from './QueryLexer';

describe('QueryLexer', () => {
  function testTokenization(input: string, expected: Array<{ type: TokenType; value: string }>) {
    const lexer = new QueryLexer(input, { ignoreWhitespace: true });
    const tokens = lexer.tokenize();

    // Remove EOF token for easier testing
    const actualTokens = tokens.slice(0, -1);

    expect(actualTokens).toHaveLength(expected.length);

    actualTokens.forEach((token, index) => {
      expect(token?.type).toBe(expected[index]?.type);
      expect(token?.value).toBe(expected[index]?.value);
    });
  }

  describe('basic tokenization', () => {
    test('should tokenize simple identifier', () => {
      testTokenization('status', [{ type: 'IDENTIFIER', value: 'status' }]);
    });

    test('should tokenize simple condition', () => {
      const input = 'status: active';
      const expected: Array<{ type: TokenType; value: string }> = [
        { type: 'IDENTIFIER', value: 'status' },
        { type: 'COLON', value: ':' },
        { type: 'IDENTIFIER', value: 'active' },
      ];

      testTokenization(input, expected);
    });

    test('should tokenize boolean expression', () => {
      const input = 'status: active AND role: admin';
      const expected: Array<{ type: TokenType; value: string }> = [
        { type: 'IDENTIFIER', value: 'status' },
        { type: 'COLON', value: ':' },
        { type: 'IDENTIFIER', value: 'active' },
        { type: 'AND', value: 'AND' },
        { type: 'IDENTIFIER', value: 'role' },
        { type: 'COLON', value: ':' },
        { type: 'IDENTIFIER', value: 'admin' },
      ];

      testTokenization(input, expected);
    });
  });

  describe('quoted strings', () => {
    test('should tokenize quoted string', () => {
      const lexer = new QueryLexer('"hello world"');
      const tokens = lexer.tokenize();

      expect(tokens[0]?.type).toBe('QUOTED_STRING');
      expect(tokens[0]?.value).toBe('hello world');
    });
  });

  describe('static utility methods', () => {
    test('isValidIdentifier should validate identifiers', () => {
      expect(QueryLexer.isValidIdentifier('status')).toBe(true);
      expect(QueryLexer.isValidIdentifier('123invalid')).toBe(false);
    });

    test('extractQuotedContent should extract content from quoted strings', () => {
      expect(QueryLexer.extractQuotedContent('"hello world"')).toBe('hello world');
      expect(QueryLexer.extractQuotedContent('unquoted')).toBe(null);
    });
  });
});
