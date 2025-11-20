import type { FilterScheme, AndFilter, NotFilter, OrFilter } from '@talkohavy/filters';
import { AstTypes, LogicalOperators, type Expression } from 'create-query-language';
import { Comparators, SpecialChars } from 'create-query-language';

export const COMPARATOR_SYMBOL_TO_NAME: Record<any, any> = {
  [Comparators['==']]: 'equals',
  [Comparators['!=']]: 'notEquals',
  [Comparators['>']]: 'greaterThan',
  [Comparators['>=']]: 'greaterThanOrEqual',
  [Comparators['<']]: 'lessThan',
  [Comparators['<=']]: 'lessThanOrEqual',
  [SpecialChars.Colon]: 'equals',
};

export function astToFilterScheme(ast?: Expression): FilterScheme {
  try {
    if (!ast) return [];

    const filterScheme = convertAstNodeToFilterRecursively(ast);

    return filterScheme;
  } catch (error) {
    console.error('Error converting AST to FilterScheme:', error);
    return [];
  }
}

export function convertAstNodeToFilterRecursively(node: Expression): FilterScheme {
  switch (node.type) {
    case AstTypes.Query: {
      const queryFilter = convertAstNodeToFilterRecursively(node.expression);
      return queryFilter;
    }

    case AstTypes.Group: {
      const groupFilter = convertAstNodeToFilterRecursively(node.expression);
      return groupFilter;
    }

    case AstTypes.Boolean: {
      const operatorValue = node.operator.value;

      const leftSideCondition = convertAstNodeToFilterRecursively(node.left);

      const rightSideCondition = convertAstNodeToFilterRecursively(node.right);

      if (operatorValue === LogicalOperators.OR) {
        const result = [];
        if (isOrFilter(leftSideCondition)) {
          result.push(...leftSideCondition.OR);
        } else {
          result.push(leftSideCondition);
        }

        if (isOrFilter(rightSideCondition)) {
          result.push(...rightSideCondition.OR);
        } else {
          result.push(rightSideCondition);
        }

        return { [LogicalOperators.OR]: result } as OrFilter;
      }

      if (operatorValue === LogicalOperators.AND) {
        const result = [];

        if (isAndFilter(leftSideCondition)) {
          result.push(...leftSideCondition.AND);
        } else {
          result.push(leftSideCondition);
        }

        if (isAndFilter(rightSideCondition)) {
          result.push(...rightSideCondition.AND);
        } else {
          result.push(rightSideCondition);
        }

        return { [LogicalOperators.AND]: result } as AndFilter;
      }

      // Will never reach here
      return {} as FilterScheme;
    }

    case AstTypes.Not: {
      const result = [];

      const innerFilter = convertAstNodeToFilterRecursively(node.expression);

      if (isAndFilter(innerFilter)) {
        result.push(...innerFilter.AND);
      } else {
        result.push(innerFilter);
      }

      return { [LogicalOperators.NOT]: result } as NotFilter;
    }

    case AstTypes.Condition: {
      const fieldName = node.key.value;
      const comparatorValue = node.comparator.value;
      const value = node.value.value;

      const operator = COMPARATOR_SYMBOL_TO_NAME[comparatorValue];

      const result: FilterScheme = { fieldName, operator, value };

      return result;
    }
  }
}

function isOrFilter(filterScheme: any): filterScheme is OrFilter {
  return LogicalOperators.OR in filterScheme;
}

function isAndFilter(filterScheme: any): filterScheme is AndFilter {
  return LogicalOperators.AND in filterScheme;
}
