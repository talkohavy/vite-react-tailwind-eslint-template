export const ContextTypes = {
  Key: 'key',
  Value: 'value',
  QuotedString: 'quoted-string',
  LogicalOperator: 'operator',
  Comparator: 'comparator',
  Colon: 'colon',
  LeftParenthesis: 'left-parenthesis',
  RightParenthesis: 'right-parenthesis',
  // Whitespace context types
  WhitespaceAfterKey: 'whitespace-after-key',
  WhitespaceAfterComparator: 'whitespace-after-comparator',
  WhitespaceAfterValue: 'whitespace-after-value',
  WhitespaceAfterLogicalOperator: 'whitespace-after-logical-operator',
  WhitespaceAfterRightParenthesis: 'whitespace-after-right-parenthesis',
} as const;

type TypeOfContextType = typeof ContextTypes;
export type ContextTypeKeys = keyof TypeOfContextType;
export type ContextTypeValues = TypeOfContextType[ContextTypeKeys];
