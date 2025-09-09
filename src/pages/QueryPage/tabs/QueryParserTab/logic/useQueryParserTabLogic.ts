import { useMemo } from 'react';
import { QueryParser } from '../../../../../lib/QueryLanguage';
import { useCursorPositionLogic } from './useCursorPositionLogic';
import { usePositionInfoLogic } from './usePositionInfoLogic';
import { useQueryInputLogic } from './useQueryInputLogic';

const queryParser = new QueryParser();

export function useQueryParserTabLogic() {
  const { cursorPosition, setCursorPosition } = useCursorPositionLogic();
  const { query, handleInputChange } = useQueryInputLogic({ setCursorPosition });

  const result = useMemo(() => {
    return queryParser.parse(query);
  }, [query]);

  const { currentToken, currentASTNode } = usePositionInfoLogic({ cursorPosition, result });

  return {
    query,
    result,
    cursorPosition,
    currentToken,
    currentASTNode,
    handleInputChange,
  };
}
