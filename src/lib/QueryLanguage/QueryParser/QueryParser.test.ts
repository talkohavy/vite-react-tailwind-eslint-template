/**
 * Unit tests for QueryParser
 */

import { QueryParser } from './QueryParser';

describe('QueryParser', () => {
  let parser: QueryParser;

  beforeEach(() => {
    parser = new QueryParser();
  });

  describe('basic parsing', () => {
    test('should parse simple condition', () => {
      const result = parser.parse('status: active');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('condition');

      if (result.ast?.expression.type === 'condition') {
        expect(result.ast.expression.key).toBe('status');
        expect(result.ast.expression.value).toBe('active');
      }
    });

    test('should parse quoted value', () => {
      const result = parser.parse('name: "John Doe"');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('condition');

      if (result.ast?.expression.type === 'condition') {
        expect(result.ast.expression.key).toBe('name');
        expect(result.ast.expression.value).toBe('John Doe');
      }
    });
  });

  describe('boolean expressions', () => {
    test('should parse AND expression', () => {
      const result = parser.parse('status: active AND role: admin');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator).toBe('AND');
        expect(result.ast.expression.left.type).toBe('condition');
        expect(result.ast.expression.right.type).toBe('condition');
      }
    });

    test('should parse OR expression', () => {
      const result = parser.parse('status: active OR status: pending');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator).toBe('OR');
      }
    });

    test('should handle operator precedence (AND over OR)', () => {
      const result = parser.parse('status: active OR role: admin AND level: senior');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator).toBe('OR');
        expect(result.ast.expression.right.type).toBe('boolean');
      }
    });
  });

  describe('grouped expressions', () => {
    test('should parse simple group', () => {
      const result = parser.parse('(status: active)');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('group');

      if (result.ast?.expression.type === 'group') {
        expect(result.ast.expression.expression.type).toBe('condition');
      }
    });

    test('should parse complex group', () => {
      const result = parser.parse('(status: active OR status: pending) AND role: admin');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator).toBe('AND');
        expect(result.ast.expression.left.type).toBe('group');
      }
    });

    test('should handle nested groups', () => {
      const result = parser.parse('((status: active))');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('group');

      if (result.ast?.expression.type === 'group') {
        expect(result.ast.expression.expression.type).toBe('group');
      }
    });
  });

  describe('error handling', () => {
    test('should handle empty input', () => {
      const result = parser.parse('');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('Empty query');
    });

    test('should handle missing value', () => {
      const result = parser.parse('status:');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle missing colon', () => {
      const result = parser.parse('status active');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle unbalanced parentheses', () => {
      const result = parser.parse('(status: active');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle invalid operator', () => {
      const result = parser.parse('status: active XOR role: admin');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('syntax validation', () => {
    test('should validate correct syntax', () => {
      const result = parser.validateSyntax('status: active AND role: admin');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect syntax errors', () => {
      const result = parser.validateSyntax('status: AND role');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('whitespace handling', () => {
    test('should handle extra whitespace', () => {
      const result = parser.parse('  status  :  active  AND  role  :  admin  ');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');
    });

    test('should handle tabs and newlines', () => {
      const result = parser.parse('status:\tactive\nAND\nrole:\tadmin');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');
    });
  });
});
