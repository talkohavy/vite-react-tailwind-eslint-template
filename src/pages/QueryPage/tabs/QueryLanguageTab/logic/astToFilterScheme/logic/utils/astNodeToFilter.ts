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

      const result = conditions.filter(Boolean);

      if (operatorValue === BooleanOperators.OR) return { OR: result };

      return result;
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
