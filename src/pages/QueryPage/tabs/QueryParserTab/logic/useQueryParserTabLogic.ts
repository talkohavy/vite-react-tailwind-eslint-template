import { QueryLexer, QueryParser } from '../../../../../lib/QueryLanguage';
import { useCursorPositionLogic } from './useCursorPositionLogic';
import { usePositionInfoLogic } from './usePositionInfoLogic';
import { useQueryInputLogic } from './useQueryInputLogic';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export function useQueryParserTabLogic() {
  const { cursorPosition, setCursorPosition } = useCursorPositionLogic();
  const { query, handleInputChange } = useQueryInputLogic({ setCursorPosition });

  const tokens = lexer.tokenize(query);
  const result = queryParser.parse(query);

  const { currentToken, currentASTNode, whitespaceContext } = usePositionInfoLogic({
    cursorPosition,
    tokens,
    result,
    query,
    queryParser,
  });

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
