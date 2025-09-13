export const BooleanOperators = {
  AND: 'AND',
  OR: 'OR',
} as const;

type TypeofBooleanOperator = typeof BooleanOperators;
type BooleanOperatorKeys = keyof TypeofBooleanOperator;
export type BooleanOperatorValues = TypeofBooleanOperator[BooleanOperatorKeys];

export const Comparators = {
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  '!=': '!=',
  '==': '==',
  '~': '~',
  // ':': ':',
} as const;

type TypeOfComparator = typeof Comparators;
export type ComparatorKeys = keyof TypeOfComparator;
export type ComparatorValues = TypeOfComparator[ComparatorKeys];
