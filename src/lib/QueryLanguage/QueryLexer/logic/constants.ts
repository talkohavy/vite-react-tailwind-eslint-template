export const TokenTypes = {
  Whitespace: 'WHITESPACE',
  QuotedString: 'QUOTED_STRING',
  Colon: 'COLON',
  Invalid: 'INVALID',
  LeftParenthesis: 'LEFT_PARENTHESIS',
  RightParenthesis: 'RIGHT_PARENTHESIS',
  Identifier: 'IDENTIFIER',
  AND: 'AND',
  OR: 'OR',
  Comparator: 'COMPARATOR',
  EOF: 'EOF',
  // Custom types for context analysis
  Key: 'KEY',
  Value: 'VALUE',
} as const;

type TokenTypesType = typeof TokenTypes;
export type TokenTypeKeys = keyof TokenTypesType;
export type TokenTypeValues = TokenTypesType[TokenTypeKeys];
