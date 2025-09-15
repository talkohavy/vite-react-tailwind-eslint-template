import type { FilterScheme } from '@talkohavy/filters';
import type { Expression } from 'create-query-language';
import { convertAstNodeToFilter } from './logic/utils/convertASTNodeToFilter';

export function convertAstToFilterScheme(ast: Expression): FilterScheme {
  try {
    const filterScheme = convertAstNodeToFilter(ast);

    return filterScheme;
  } catch (error) {
    console.error('Error converting AST to FilterScheme:', error);
    return [];
  }
}
