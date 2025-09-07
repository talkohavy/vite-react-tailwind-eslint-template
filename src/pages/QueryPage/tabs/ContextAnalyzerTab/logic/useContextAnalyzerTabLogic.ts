import { useRef, useState } from 'react';
import { ASTContextAnalyzer, QueryLexer, QueryParser } from '../../../../../lib/QueryLanguage';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export default function useContextAnalyzerTabLogic() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  function handleInputChange(newValue: string, e: React.ChangeEvent<HTMLInputElement>) {
    const newCursorPosition = e.target.selectionStart || 0;

    setQuery(newValue);
    setCursorPosition(newCursorPosition); // <--- without this line you would miss one render where the position is off by 1.
  }

  function handleCursorPositionChange() {
    if (inputRef.current) {
      const newPosition = inputRef.current.selectionStart || 0;
      setCursorPosition(newPosition);
    }
  }

  const tokens = lexer.tokenize(query);
  const result = queryParser.parse(query);
  const contextResults = new ASTContextAnalyzer(tokens).analyzeContext({
    cursorPosition,
    originalQuery: query,
    parseResult: result,
  });

  return {
    inputRef,
    query,
    cursorPosition,
    handleInputChange,
    handleCursorPositionChange,
    result,
    tokens,
    contextResults,
  };
}
