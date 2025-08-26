/**
 * Unit tests for QueryLexer
 */

import { TokenTypes, type TokenTypeValues } from './logic/constants';
import { QueryLexer } from './QueryLexer';

describe('QueryLexer', () => {
  function testTokenization(input: string, expected: Array<{ type: TokenTypeValues; value: string }>) {
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
      testTokenization('status', [{ type: TokenTypes.Key, value: 'status' }]);
    });

    test('should tokenize simple condition', () => {
      const input = 'status: active';
      const expected: Array<{ type: TokenTypeValues; value: string }> = [
        { type: TokenTypes.Key, value: 'status' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Value, value: 'active' },
      ];

      testTokenization(input, expected);
    });

    test('should tokenize boolean expression', () => {
      const input = 'status: active AND role: admin';
      const expected: Array<{ type: TokenTypeValues; value: string }> = [
        { type: TokenTypes.Key, value: 'status' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Value, value: 'active' },
        { type: TokenTypes.AND, value: 'AND' },
        { type: TokenTypes.Key, value: 'role' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Value, value: 'admin' },
      ];

      testTokenization(input, expected);
    });
  });

  describe('quoted strings', () => {
    test('should tokenize quoted string', () => {
      const lexer = new QueryLexer('"hello world"');
      const tokens = lexer.tokenize();

      expect(tokens[0]?.type).toBe(TokenTypes.QuotedString);
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
