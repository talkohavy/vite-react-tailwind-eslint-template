export const AstTypes = {
  Key: 'key',
  Value: 'value',
  Comparator: 'comparator',
  Operator: 'operator',
  Condition: 'condition',
  Group: 'group',
  Boolean: 'boolean',
  Query: 'query',
} as const;

type TypOfAstTypes = typeof AstTypes;
export type AstTypeKeys = keyof TypOfAstTypes;
export type AstTypeValues = TypOfAstTypes[AstTypeKeys];

export const ExpressionTypes = {
  Key: 'key',
  Value: 'value',
  Comparator: 'comparator',
  LogicalOperator: 'logical-operator',
  Query: 'query',
  Boolean: 'boolean',
  Condition: 'condition',
  Group: 'group',
} as const;

type TypeOfExpressionTypes = typeof ExpressionTypes;
export type ExpressionTypeKeys = keyof TypeOfExpressionTypes;
export type ExpressionTypeValues = TypeOfExpressionTypes[ExpressionTypeKeys];
