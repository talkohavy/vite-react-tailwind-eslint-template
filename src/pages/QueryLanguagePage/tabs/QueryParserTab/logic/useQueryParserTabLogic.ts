import { useState } from 'react';
import { useQueryParser } from '@src/components/controls/QueryInput/logic/hooks/useQueryParser';
import { usePositionInfoLogic } from './usePositionInfoLogic';
import { useQueryInputLogic } from './useQueryInputLogic';

export function useQueryParserTabLogic() {
  const [cursorPosition, setCursorPosition] = useState(0);
  const { query, handleInputChange } = useQueryInputLogic({ setCursorPosition });

  const result = useQueryParser({ query });

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
