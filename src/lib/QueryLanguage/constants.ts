export const BooleanOperator = {
  AND: 'AND',
  OR: 'OR',
} as const;

type TypeofBooleanOperator = typeof BooleanOperator;
type BooleanOperatorKeys = keyof TypeofBooleanOperator;
export type BooleanOperatorValues = TypeofBooleanOperator[BooleanOperatorKeys];

// =============================================================================
// Grammar Constants
// =============================================================================

/**
 * Boolean operators supported by the query language
 */
export const BOOLEAN_OPERATORS: Record<string, BooleanOperatorValues> = {
  AND: 'AND',
  and: 'AND',
  And: 'AND',
  OR: 'OR',
  or: 'OR',
  Or: 'OR',
} as const;

export const Comparators = {
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  '!=': '!=',
  '==': '==',
  ':': ':',
  '~': '~',
} as const;

type TypeOfComparator = typeof Comparators;
export type ComparatorKeys = keyof TypeOfComparator;
export type ComparatorValues = TypeOfComparator[ComparatorKeys];

export const ComparatorBeginnings = {
  '>': '>',
  '<': '<',
  '=': '=',
  '!': '!',
} as const;

type TypeOfComparatorBeginnings = typeof ComparatorBeginnings;
export type ComparatorBeginningKeys = keyof TypeOfComparatorBeginnings;
export type ComparatorBeginningValues = TypeOfComparatorBeginnings[ComparatorBeginningKeys];
