import {
  AstTypes,
  LogicalOperators,
  type ComparatorNode,
  type KeyNode,
  type ValueNode,
  type ConditionExpression,
  type BooleanExpression,
  type QueryExpression,
  type GroupExpression,
} from 'create-query-language';
import { astToFilterScheme } from './astToFilterScheme';

describe('astToFilterScheme', () => {
  it('should return empty object for null/undefined AST', () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); // Suppress console.error for this test

    const expectedResult = {} as any;
    const actualResult = astToFilterScheme(null as any);
    expect(actualResult).toEqual(expectedResult);

    const actualResultUndefined = astToFilterScheme(undefined as any);
    expect(actualResultUndefined).toEqual(expectedResult);

    console.error = originalConsoleError; // Restore original console.error
  });

  it('should convert simple condition node', () => {
    const ast = {
      type: AstTypes.Condition,
      key: { value: 'name' } as KeyNode,
      comparator: { value: '==' } as ComparatorNode,
      value: { value: 'John Doe' } as ValueNode,
    } as ConditionExpression;

    const expectedResult = { and: [{ key: 'name', op: 'equals', val: 'John Doe' }] };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert condition with different operators', () => {
    const astGreaterThan = {
      type: AstTypes.Condition,
      key: { value: 'age' },
      comparator: { value: '>' },
      value: { value: 30 },
    } as any as ConditionExpression;

    const expectedResult = { and: [{ key: 'age', op: 'greater_than', val: 30 }] };

    const actualResult = astToFilterScheme(astGreaterThan);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert AND boolean expression', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: LogicalOperators.AND },
      left: {
        type: AstTypes.Condition,
        key: { value: 'status' },
        comparator: { value: '==' },
        value: { value: 'active' },
      },
      right: {
        type: AstTypes.Condition,
        key: { value: 'role' },
        comparator: { value: '==' },
        value: { value: 'admin' },
      },
    } as BooleanExpression;

    const expectedResult = {
      and: [
        {
          key: 'status',
          op: 'equals',
          val: 'active',
        },
        {
          key: 'role',
          op: 'equals',
          val: 'admin',
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert OR boolean expression', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: LogicalOperators.OR },
      left: {
        type: AstTypes.Condition,
        key: { value: 'priority' },
        comparator: { value: '==' },
        value: { value: 'high' },
      },
      right: {
        type: AstTypes.Condition,
        key: { value: 'priority' },
        comparator: { value: '==' },
        value: { value: 'critical' },
      },
    } as BooleanExpression;

    const expectedResult = {
      or: [
        {
          key: 'priority',
          op: 'equals',
          val: 'high',
        },
        {
          key: 'priority',
          op: 'equals',
          val: 'critical',
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle Query node with expression', () => {
    const ast = {
      type: AstTypes.Query,
      expression: {
        type: AstTypes.Condition,
        key: { value: 'department' },
        comparator: { value: '==' },
        value: { value: 'engineering' },
      },
    } as QueryExpression;

    const expectedResult = { and: [{ key: 'department', op: 'equals', val: 'engineering' }] };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle Group node with expression', () => {
    const ast = {
      type: AstTypes.Group,
      expression: {
        type: AstTypes.Condition,
        key: { value: 'department' },
        comparator: { value: '==' },
        value: { value: 'engineering' },
      },
    } as GroupExpression;

    const expectedResult = { and: [{ key: 'department', op: 'equals', val: 'engineering' }] };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle complex nested expressions', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: LogicalOperators.AND },
      left: {
        type: AstTypes.Condition,
        key: { value: 'status' },
        comparator: { value: '==' },
        value: { value: 'active' },
      },
      right: {
        type: AstTypes.Boolean,
        operator: { value: LogicalOperators.OR },
        left: {
          type: AstTypes.Condition,
          key: { value: 'role' },
          comparator: { value: '==' },
          value: { value: 'admin' },
        },
        right: {
          type: AstTypes.Condition,
          key: { value: 'role' },
          comparator: { value: '==' },
          value: { value: 'manager' },
        },
      },
    } as BooleanExpression;

    const expectedResult = {
      and: [
        {
          key: 'status',
          op: 'equals',
          val: 'active',
        },
        {
          or: [
            {
              key: 'role',
              op: 'equals',
              val: 'admin',
            },
            {
              key: 'role',
              op: 'equals',
              val: 'manager',
            },
          ],
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle grouped query expression', () => {
    const ast = {
      type: AstTypes.Query,
      expression: {
        type: AstTypes.Group,
        expression: {
          type: AstTypes.Boolean,
          operator: { value: LogicalOperators.AND },
          left: {
            type: AstTypes.Condition,
            key: { value: 'a' } as KeyNode,
            comparator: { value: '==' } as ComparatorNode,
            value: { value: '2' } as ValueNode,
          },
          right: {
            type: AstTypes.Condition,
            key: { value: 'name' } as KeyNode,
            comparator: { value: '>=' } as ComparatorNode,
            value: { value: 'asd' } as ValueNode,
          },
        },
      },
    } as QueryExpression;

    const expectedResult = {
      and: [
        {
          key: 'a',
          op: 'equals',
          val: '2',
        },
        {
          key: 'name',
          op: 'greater_than_or_equal',
          val: 'asd',
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle different comparison operators', () => {
    const operators = [
      { comparator: '!=', expected: 'not_equals' },
      { comparator: '>', expected: 'greater_than' },
      { comparator: '>=', expected: 'greater_than_or_equal' },
      { comparator: '<', expected: 'less_than' },
      { comparator: '<=', expected: 'less_than_or_equal' },
    ];

    operators.forEach(({ comparator, expected }) => {
      const ast = {
        type: AstTypes.Condition,
        key: { value: 'test' },
        comparator: { value: comparator },
        value: { value: 'value' },
      } as ConditionExpression;

      const expectedResult = { and: [{ key: 'test', op: expected, val: 'value' }] };

      const actualResult = astToFilterScheme(ast);
      expect(actualResult).toEqual(expectedResult);
    });
  });

  it('should convert NOT expression', () => {
    const ast = {
      type: AstTypes.Not,
      expression: {
        type: AstTypes.Condition,
        key: { value: 'email' },
        comparator: { value: ':' },
        value: { value: 'asd' },
      },
    } as any;

    const expectedResult = {
      not: [
        {
          key: 'email',
          op: 'is',
          val: 'asd',
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert NOT expression with complex inner expression', () => {
    const ast = {
      type: AstTypes.Not,
      expression: {
        type: AstTypes.Boolean,
        operator: { value: LogicalOperators.AND },
        left: {
          type: AstTypes.Condition,
          key: { value: 'status' },
          comparator: { value: '==' },
          value: { value: 'active' },
        },
        right: {
          type: AstTypes.Condition,
          key: { value: 'role' },
          comparator: { value: '==' },
          value: { value: 'admin' },
        },
      },
    } as any;

    const expectedResult = {
      not: [
        {
          key: 'status',
          op: 'equals',
          val: 'active',
        },
        {
          key: 'role',
          op: 'equals',
          val: 'admin',
        },
      ],
    };

    const actualResult = astToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });
});
