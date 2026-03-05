import { TokenTypes } from 'create-query-language';
import type { ColorableTokenTypes, TokenMetaInfo } from '../types';

export const TOKEN_TYPE_TO_COLOR: Record<ColorableTokenTypes, TokenMetaInfo> = {
  [TokenTypes.Identifier]: {
    backgroundColor: 'bg-gray-100',
    color: 'text-black',
    label: 'Key/Value',
  },
  [TokenTypes.QuotedString]: {
    backgroundColor: 'bg-gray-100',
    color: 'text-black',
    label: 'Quoted String',
  },
  [TokenTypes.Comparator]: {
    backgroundColor: 'bg-orange-100',
    color: 'text-black',
    label: 'Comparator',
  },
  [TokenTypes.AND]: {
    backgroundColor: 'bg-blue-300',
    color: 'text-blue-800',
    label: 'Logical Operator',
  },
  [TokenTypes.OR]: {
    backgroundColor: 'bg-blue-300',
    color: 'text-blue-800',
    label: 'Logical Operator',
  },
  [TokenTypes.NOT]: {
    backgroundColor: 'bg-purple-300',
    color: 'text-purple-800',
    label: 'NOT Operator',
  },
  [TokenTypes.LeftParenthesis]: {
    backgroundColor: 'bg-green-300',
    color: 'text-green-800',
    label: 'Group',
  },
  [TokenTypes.RightParenthesis]: {
    backgroundColor: 'bg-green-300',
    color: 'text-green-800',
    label: 'Group',
  },
  [TokenTypes.Colon]: {
    backgroundColor: 'bg-orange-100',
    color: 'text-black',
    label: 'Comparator',
  },
  [TokenTypes.Invalid]: {
    backgroundColor: 'bg-red-800',
    color: 'text-white',
    label: 'Invalid',
  },
  [TokenTypes.EndOfLine]: {
    backgroundColor: 'bg-red-800',
    color: 'text-white',
    label: 'END_OF_LINE',
  },
};
