import { TokenTypes } from 'create-query-language';

export const ERROR_TOKEN_CLASS = 'bg-red-100 text-red-800 border-red-300 ring-1 ring-red-400';

export const TOKEN_COLOR_MAP: Record<string, string> = {
  [TokenTypes.Identifier]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TokenTypes.QuotedString]: 'bg-green-100 text-green-800 border-green-200',
  [TokenTypes.Comparator]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TokenTypes.AND]: 'bg-blue-500 text-white border-indigo-200',
  [TokenTypes.OR]: 'bg-blue-500 text-white border-indigo-200',
  [TokenTypes.LeftParenthesis]: 'bg-gray-100 text-gray-800 border-gray-200',
  [TokenTypes.RightParenthesis]: 'bg-gray-100 text-gray-800 border-gray-200',
  [TokenTypes.Colon]: 'bg-orange-100 text-orange-800 border-orange-200',
  [TokenTypes.Invalid]: 'bg-red-400 text-red-800 border-red-300',
  [TokenTypes.Whitespace]: 'hidden', // We'll filter these out
};
