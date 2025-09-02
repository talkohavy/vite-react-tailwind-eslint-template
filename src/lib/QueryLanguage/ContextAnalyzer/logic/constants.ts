export const ContextTypes = {
  Key: 'key',
  Value: 'value',
  LogicalOperator: 'operator',
  Comparator: 'comparator',
  LeftParenthesis: 'left-parenthesis',
  RightParenthesis: 'right-parenthesis',
} as const;

type TypeOfContextType = typeof ContextTypes;
export type ContextTypeKeys = keyof TypeOfContextType;
export type ContextTypeValues = TypeOfContextType[ContextTypeKeys];
