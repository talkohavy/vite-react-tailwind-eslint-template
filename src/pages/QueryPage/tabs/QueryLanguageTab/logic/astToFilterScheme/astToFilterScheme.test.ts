import type { FilterScheme } from '@talkohavy/filters';
import {
  AstTypes,
  BooleanOperators,
  type ComparatorNode,
  type KeyNode,
  type ValueNode,
  type ConditionExpression,
  type BooleanExpression,
  type QueryExpression,
  type GroupExpression,
} from 'create-query-language';
import { convertAstToFilterScheme } from './astToFilterScheme';

describe('convertAstToFilterScheme', () => {
  it('should return empty array for null/undefined AST', () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); // Suppress console.error for this test

    const expectedResult: FilterScheme = [];
    const actualResult = convertAstToFilterScheme(null as any);
    expect(actualResult).toEqual(expectedResult);

    const actualResultUndefined = convertAstToFilterScheme(undefined as any);
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

    const expectedResult = {
      fieldName: 'name',
      operator: 'equals',
      value: 'John Doe',
    };

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert condition with different operators', () => {
    const astGreaterThan = {
      type: AstTypes.Condition,
      key: { value: 'age' },
      comparator: { value: '>' },
      value: { value: 30 },
    } as any as ConditionExpression;

    const expectedResult = {
      fieldName: 'age',
      operator: 'greaterThan',
      value: 30,
    };

    const actualResult = convertAstToFilterScheme(astGreaterThan);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert AND boolean expression', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: BooleanOperators.AND },
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

    const expectedResult = [
      {
        fieldName: 'status',
        operator: 'equals',
        value: 'active',
      },
      {
        fieldName: 'role',
        operator: 'equals',
        value: 'admin',
      },
    ];

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert OR boolean expression', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: BooleanOperators.OR },
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
      OR: [
        {
          fieldName: 'priority',
          operator: 'equals',
          value: 'high',
        },
        {
          fieldName: 'priority',
          operator: 'equals',
          value: 'critical',
        },
      ],
    };

    const actualResult = convertAstToFilterScheme(ast);
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

    const expectedResult = {
      fieldName: 'department',
      operator: 'equals',
      value: 'engineering',
    };

    const actualResult = convertAstToFilterScheme(ast);
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

    const expectedResult = {
      fieldName: 'department',
      operator: 'equals',
      value: 'engineering',
    };

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle complex nested expressions', () => {
    const ast = {
      type: AstTypes.Boolean,
      operator: { value: BooleanOperators.AND },
      left: {
        type: AstTypes.Condition,
        key: { value: 'status' },
        comparator: { value: '==' },
        value: { value: 'active' },
      },
      right: {
        type: AstTypes.Boolean,
        operator: { value: BooleanOperators.OR },
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

    const expectedResult = [
      {
        fieldName: 'status',
        operator: 'equals',
        value: 'active',
      },
      {
        OR: [
          {
            fieldName: 'role',
            operator: 'equals',
            value: 'admin',
          },
          {
            fieldName: 'role',
            operator: 'equals',
            value: 'manager',
          },
        ],
      },
    ];

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle grouped query expression', () => {
    const ast = {
      type: AstTypes.Query,
      expression: {
        type: AstTypes.Group,
        expression: {
          type: AstTypes.Boolean,
          operator: { value: BooleanOperators.AND },
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

    const expectedResult = [
      {
        fieldName: 'a',
        operator: 'equals',
        value: '2',
      },
      {
        fieldName: 'name',
        operator: 'greaterThanOrEqual',
        value: 'asd',
      },
    ];

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle different comparison operators', () => {
    const operators = [
      { comparator: '!=', expected: 'notEquals' },
      { comparator: '>', expected: 'greaterThan' },
      { comparator: '>=', expected: 'greaterThanOrEqual' },
      { comparator: '<', expected: 'lessThan' },
      { comparator: '<=', expected: 'lessThanOrEqual' },
    ];

    operators.forEach(({ comparator, expected }) => {
      const ast = {
        type: AstTypes.Condition,
        key: { value: 'test' },
        comparator: { value: comparator },
        value: { value: 'value' },
      } as ConditionExpression;

      const expectedResult = {
        fieldName: 'test',
        operator: expected,
        value: 'value',
      };

      const actualResult = convertAstToFilterScheme(ast);
      expect(actualResult).toEqual(expectedResult);
    });
  });

  it('should handle unknown operators by defaulting to equals', () => {
    const ast = {
      type: AstTypes.Condition,
      key: { value: 'test' },
      comparator: { value: 'unknownOp' as any },
      value: { value: 'value' },
    } as ConditionExpression;

    const expectedResult = {
      fieldName: 'test',
      operator: 'equals',
      value: 'value',
    };

    const actualResult = convertAstToFilterScheme(ast);
    expect(actualResult).toEqual(expectedResult);
  });
});
