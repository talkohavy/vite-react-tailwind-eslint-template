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

export const DEFAULT_PARSER_OPTIONS = {
  maxErrors: 10,
  trackPositions: true,
} as const;

export const ERROR_MESSAGES = {
  UNEXPECTED_TOKEN: 'Unexpected token',
  EXPECTED_KEY: 'Expected key name',
  EXPECTED_COLON: "Expected ':' after key",
  EXPECTED_COMPARATOR: 'Expected comparator (i.e. :,<,>,=) after key',
  EXPECTED_VALUE: 'Expected value after comparator',
  EXPECTED_EXPRESSION_AFTER_AND: "Expected expression after 'AND'",
  EXPECTED_EXPRESSION_AFTER_OR: "Expected expression after 'OR'",
  EXPECTED_EXPRESSION_IN_PARENTHESES: 'Expected expression inside parentheses',
  EXPECTED_OPERATOR: "Expected 'AND' or 'OR'",
  EXPECTED_CLOSING_PAREN: 'Expected closing parenthesis',
  UNEXPECTED_END: 'Unexpected end of input',
  UNBALANCED_PARENS: 'Unbalanced parentheses',
  INVALID_IDENTIFIER: 'Invalid identifier',
  INVALID_OPERATOR: 'Invalid operator',
  EMPTY_QUERY: 'Empty query',
  EMPTY_PARENTHESES: 'Empty parentheses not allowed',
  INVALID_SYNTAX: 'Invalid syntax',
} as const;

export const ERROR_CODES = {
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  UNEXPECTED_TOKEN: 'UNEXPECTED_TOKEN',
  MISSING_TOKEN: 'MISSING_TOKEN',
  INVALID_IDENTIFIER: 'INVALID_IDENTIFIER',
  UNBALANCED_PARENS: 'UNBALANCED_PARENS',
  EMPTY_EXPRESSION: 'EMPTY_EXPRESSION',
} as const;
