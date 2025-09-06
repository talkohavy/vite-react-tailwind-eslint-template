export const ContextTypes = {
  Key: 'key',
  Value: 'value',
  QuotedString: 'quoted-string',
  LogicalOperator: 'operator',
  Comparator: 'comparator',
  Colon: 'colon',
  LeftParenthesis: 'left-parenthesis',
  RightParenthesis: 'right-parenthesis',
} as const;

type TypeOfContextType = typeof ContextTypes;
export type ContextTypeKeys = keyof TypeOfContextType;
export type ContextTypeValues = TypeOfContextType[ContextTypeKeys];

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
