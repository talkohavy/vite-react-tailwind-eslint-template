export const CursorPosition = {
  InKey: 'in-key',
  InValue: 'in-value',
  InOperator: 'in-operator',
  InComparator: 'in-comparator',
  AfterValue: 'after-value',
  BetweenKeyComparator: 'between-key-comparator',
  BetweenComparatorValue: 'between-comparator-value',
  Unknown: 'unknown',
} as const;

type TypeOfCursorPosition = typeof CursorPosition;
export type CursorPositionKeys = keyof TypeOfCursorPosition;
export type CursorPositionValues = TypeOfCursorPosition[CursorPositionKeys];
