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
