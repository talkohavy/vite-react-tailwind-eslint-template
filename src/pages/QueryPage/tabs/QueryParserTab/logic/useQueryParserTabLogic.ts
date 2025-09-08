import { useMemo } from 'react';
import { QueryLexer, QueryParser } from '../../../../../lib/QueryLanguage';
import { useCursorPositionLogic } from './useCursorPositionLogic';
import { useQueryInputLogic } from './useQueryInputLogic';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export function useQueryParserTabLogic() {
  const { query, setQuery } = useQueryInputLogic();

  const tokens = lexer.tokenize(query);
  const result = queryParser.parse(query);

  const { cursorPosition, setCursorPosition, currentToken, currentASTNode } = useCursorPositionLogic({
    tokens,
    result,
  });

  // Classify whitespace context
  const whitespaceContext = useMemo(() => {
    return queryParser.classifyWhitespace(query, cursorPosition);
  }, [query, cursorPosition]);

  function handleInputChange(newQuery: string, newCursorPosition?: number) {
    setQuery(newQuery);
    if (newCursorPosition !== undefined) {
      setCursorPosition(newCursorPosition);
    }
  }

  return {
    query,
    tokens,
    result,
    cursorPosition,
    currentToken,
    currentASTNode,
    whitespaceContext,
    handleInputChange,
  };
}
