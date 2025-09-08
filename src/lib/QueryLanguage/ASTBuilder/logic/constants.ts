export const AstTypes = {
  Query: 'query',
  Boolean: 'boolean',
  Condition: 'condition',
  Group: 'group',
  Key: 'key',
  Comparator: 'comparator',
  Operator: 'operator',
  Value: 'value',
} as const;

type TypOfAstTypes = typeof AstTypes;
export type AstTypeKeys = keyof TypOfAstTypes;
export type AstTypeValues = TypOfAstTypes[AstTypeKeys];

export const ExpressionTypes = {
  Key: 'key',
  Value: 'value',
  Comparator: 'comparator',
  Operator: 'operator',
  Query: 'query',
  Boolean: 'boolean',
  Condition: 'condition',
  Group: 'group',
} as const;

type TypeOfExpressionTypes = typeof ExpressionTypes;
export type ExpressionTypeKeys = keyof TypeOfExpressionTypes;
export type ExpressionTypeValues = TypeOfExpressionTypes[ExpressionTypeKeys];
