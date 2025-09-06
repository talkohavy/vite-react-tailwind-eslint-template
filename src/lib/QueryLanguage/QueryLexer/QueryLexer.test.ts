/**
 * Unit tests for QueryLexer
 */

import { TokenTypes, type TokenTypeValues } from './logic/constants';
import { QueryLexer } from './QueryLexer';

describe('QueryLexer', () => {
  function testTokenization(input: string, expected: Array<{ type: TokenTypeValues; value: string }>) {
    const lexer = new QueryLexer({ ignoreWhitespace: true });
    const tokens = lexer.tokenize(input);

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
      testTokenization('status', [{ type: TokenTypes.Identifier, value: 'status' }]);
    });

    test('should tokenize simple condition', () => {
      const input = 'status: active';
      const expected: Array<{ type: TokenTypeValues; value: string }> = [
        { type: TokenTypes.Identifier, value: 'status' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Identifier, value: 'active' },
      ];

      testTokenization(input, expected);
    });

    test('should tokenize boolean expression', () => {
      const input = 'status: active AND role: admin';
      const expected: Array<{ type: TokenTypeValues; value: string }> = [
        { type: TokenTypes.Identifier, value: 'status' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Identifier, value: 'active' },
        { type: TokenTypes.AND, value: 'AND' },
        { type: TokenTypes.Identifier, value: 'role' },
        { type: TokenTypes.Colon, value: ':' },
        { type: TokenTypes.Identifier, value: 'admin' },
      ];

      testTokenization(input, expected);
    });
  });

  describe('quoted strings', () => {
    test('should tokenize quoted string', () => {
      const lexer = new QueryLexer();
      const tokens = lexer.tokenize('"hello world"');

      expect(tokens[0]?.type).toBe(TokenTypes.QuotedString);
      expect(tokens[0]?.value).toBe('hello world');
    });
  });

  describe('static utility methods', () => {
    test('extractQuotedContent should extract content from quoted strings', () => {
      expect(QueryLexer.extractQuotedContent('"hello world"')).toBe('hello world');
      expect(QueryLexer.extractQuotedContent('unquoted')).toBe(null);
    });
  });
});
