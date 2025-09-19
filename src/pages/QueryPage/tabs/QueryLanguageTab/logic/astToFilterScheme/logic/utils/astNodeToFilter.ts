import { AstTypes, BooleanOperators, type Expression } from 'create-query-language';
import { COMPARATOR_MAP } from '../constants';

export function convertAstNodeToFilter(node: Expression): any {
  switch (node.type) {
    case AstTypes.Query: {
      const queryFilter = convertAstNodeToFilter(node.expression);
      return queryFilter;
    }

    case AstTypes.Group: {
      const groupFilter = convertAstNodeToFilter(node.expression);
      return groupFilter;
    }

    case AstTypes.Boolean: {
      const operatorValue = node.operator.value;

      const conditions = [];
      const leftSideCondition = convertAstNodeToFilter(node.left);
      conditions.push(leftSideCondition);

      const rightSideCondition = convertAstNodeToFilter(node.right);
      conditions.push(rightSideCondition);

      if (operatorValue === BooleanOperators.OR) {
        const result = [];
        if (conditions[0].OR) {
          result.push(...conditions[0].OR);
        } else {
          result.push(conditions[0]);
        }

        if (conditions[1].OR) {
          result.push(...conditions[1].OR);
        } else {
          result.push(conditions[1]);
        }

        return { [BooleanOperators.OR]: result };
      }

      if (operatorValue === BooleanOperators.AND) {
        const result = [];
        if (conditions[0].AND) {
          result.push(...conditions[0].AND);
        } else {
          result.push(conditions[0]);
        }

        if (conditions[1].AND) {
          result.push(...conditions[1].AND);
        } else {
          result.push(conditions[1]);
        }

        return { [BooleanOperators.AND]: result };
      }

      return null;
    }

    case AstTypes.Not: {
      const result = [];

      const innerFilter = convertAstNodeToFilter(node.expression);
      if (innerFilter.AND) {
        result.push(...innerFilter.AND);
      } else {
        result.push(innerFilter);
      }

      return { NOT: result };
    }

    case AstTypes.Condition: {
      const key = node.key.value;
      const comparatorValue = node.comparator.value;
      const value = node.value.value;

      const operator = COMPARATOR_MAP[comparatorValue] ?? COMPARATOR_MAP['=='];

      const result = { fieldName: key, operator, value };

      return result;
    }
  }
}
