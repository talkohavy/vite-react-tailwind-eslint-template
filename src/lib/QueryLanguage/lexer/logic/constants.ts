export const TokenTypes = {
  Whitespace: 'WHITESPACE',
  QuotedString: 'QUOTED_STRING',
  Colon: 'COLON',
  Invalid: 'INVALID',
  LeftParenthesis: 'LEFT_PARENTHESIS',
  RightParenthesis: 'RIGHT_PARENTHESIS',
  Key: 'KEY',
  Value: 'VALUE',
  EOF: 'EOF',
  AND: 'AND',
  OR: 'OR',
  Comparator: 'COMPARATOR',
} as const;

type TokenTypesType = typeof TokenTypes;
export type TokenTypeKeys = keyof TokenTypesType;
export type TokenTypeValues = TokenTypesType[TokenTypeKeys];
