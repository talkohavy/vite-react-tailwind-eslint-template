import { TokenTypes } from 'create-query-language';

export const TOKEN_LEGEND = [
  { type: TokenTypes.Identifier, label: 'Field/Key', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { type: TokenTypes.QuotedString, label: 'Value', color: 'bg-green-100 text-green-800 border-green-200' },
  { type: TokenTypes.Comparator, label: 'Operator', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { type: TokenTypes.AND, label: 'AND', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { type: TokenTypes.OR, label: 'OR', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { type: TokenTypes.Colon, label: 'Separator', color: 'bg-orange-100 text-orange-800 border-orange-200' },
];
