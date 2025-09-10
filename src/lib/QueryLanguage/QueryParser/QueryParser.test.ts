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
        expect(result.ast.expression.key.value).toBe('status');
        expect(result.ast.expression.value.value).toBe('active');
        expect(result.ast.expression.comparator.value).toBe(':');
        expect(result.ast.expression.spacesAfterKey).toBe(0);
        expect(result.ast.expression.spacesAfterComparator).toBe(1);
        expect(result.ast.expression.spacesAfterValue).toBe(0);
      }
    });

    test('should parse quoted value', () => {
      const result = parser.parse('name: "John Doe"');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('condition');

      if (result.ast?.expression.type === 'condition') {
        expect(result.ast.expression.key.value).toBe('name');
        expect(result.ast.expression.value.value).toBe('John Doe');
        expect(result.ast.expression.comparator.value).toBe(':');
      }
    });
  });

  describe('boolean expressions', () => {
    test('should parse AND expression', () => {
      const result = parser.parse('status: active AND role: admin');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator.value).toBe('AND');
        expect(result.ast.expression.left.type).toBe('condition');
        expect(result.ast.expression.right.type).toBe('condition');
      }
    });

    test('should parse OR expression', () => {
      const result = parser.parse('status: active OR status: pending');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator.value).toBe('OR');
      }
    });

    test('should handle operator precedence (AND over OR)', () => {
      const result = parser.parse('status: active OR role: admin AND level: senior');

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        expect(result.ast.expression.operator.value).toBe('OR');
        expect(result.ast.expression.right.type).toBe('boolean');
      }
    });

    test('should parse complex mixed operator expression with groups', () => {
      // This test specifically targets the bug where parsing stops after groups
      const input = 'key1 == v AND (key2 >= 14 OR key3 : 5) OR key4 < 1';
      const result = parser.parse(input);

      expect(result.success).toBe(true);
      expect(result.ast?.expression.type).toBe('boolean');

      if (result.ast?.expression.type === 'boolean') {
        // The top level should be an OR expression
        expect(result.ast.expression.operator.value).toBe('OR');

        // The left side should be the AND expression with the group
        expect(result.ast.expression.left.type).toBe('boolean');
        if (result.ast.expression.left.type === 'boolean') {
          expect(result.ast.expression.left.operator.value).toBe('AND');
        }

        // The right side should be the final condition
        expect(result.ast.expression.right.type).toBe('condition');
        if (result.ast.expression.right.type === 'condition') {
          expect(result.ast.expression.right.key.value).toBe('key4');
          expect(result.ast.expression.right.comparator.value).toBe('<');
          expect(result.ast.expression.right.value.value).toBe('1');
        }
      }

      // Verify that the entire input was parsed (position should match input length)
      expect(result.ast?.position.end).toBe(input.length);
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
        expect(result.ast.expression.operator.value).toBe('AND');
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

describe('Condition Node Structure', () => {
  test('should create child nodes for key, comparator, and value with spacing info', () => {
    const parser = new QueryParser();
    const result = parser.parse('status:  active   ');

    expect(result.success).toBe(true);
    expect(result.ast?.expression.type).toBe('condition');

    if (result.ast?.expression.type === 'condition') {
      const condition = result.ast.expression;

      // Test key node
      expect(condition.key.type).toBe('key');
      expect(condition.key.value).toBe('status');
      expect(condition.key.position.start).toBe(0);
      expect(condition.key.position.end).toBe(6);

      // Test comparator node
      expect(condition.comparator.type).toBe('comparator');
      expect(condition.comparator.value).toBe(':');
      expect(condition.comparator.position.start).toBe(6);
      expect(condition.comparator.position.end).toBe(7);

      // Test value node
      expect(condition.value.type).toBe('value');
      expect(condition.value.value).toBe('active');
      expect(condition.value.position.start).toBe(9);
      expect(condition.value.position.end).toBe(15);

      // Test spacing information
      expect(condition.spacesAfterKey).toBe(0);
      expect(condition.spacesAfterComparator).toBe(2);
      expect(condition.spacesAfterValue).toBe(3);
    }
  });

  test('should handle different spacing scenarios', () => {
    const parser = new QueryParser();
    const result = parser.parse('name : "John Doe"');

    expect(result.success).toBe(true);
    expect(result.ast?.expression.type).toBe('condition');

    if (result.ast?.expression.type === 'condition') {
      const condition = result.ast.expression;

      expect(condition.spacesAfterKey).toBe(1);
      expect(condition.spacesAfterComparator).toBe(1);
      expect(condition.spacesAfterValue).toBe(0);
    }
  });
});
