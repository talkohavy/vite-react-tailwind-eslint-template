import { useState, useMemo, useEffect, useRef } from 'react';
import { QueryParser, TokenTypes } from 'create-query-language';
import { useOnCompletionSelect } from '../../../logic/hooks/useOnCompletionSelect';
import { useQueryParser } from '../../../logic/hooks/useQueryParser';
import { convertAstToFilterScheme } from '../logic/astToFilterScheme/astToFilterScheme';
import { keyConfigs } from '../logic/constants';
import { useCompletionEngine } from '../logic/useCompletionEngine';

const queryParser = new QueryParser();

export function useQueryLanguageTabLogic() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { generateCompletions } = useCompletionEngine({ keyConfigs, query });

  const parseResult = useQueryParser({ query });

  const filterScheme = useMemo(() => {
    const filterScheme = convertAstToFilterScheme(parseResult.ast);

    return filterScheme;
  }, [query]);

  const { completions, expectedTypes, firstErrorTokenIndex } = useMemo(() => {
    try {
      // Find the first error token (Invalid type or where parsing fails)
      const visibleTokens = parseResult.tokens.filter((token) => token.type !== TokenTypes.Whitespace);
      const firstErrorIndex = visibleTokens.findIndex((token) => token.type === TokenTypes.Invalid);

      const currentToken = parseResult.tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      let expectedTypes: string[] = [];

      if (currentToken?.context?.expectedTokens) {
        expectedTypes = [...currentToken.context.expectedTokens];
      }

      const currentInput = currentToken!.value.trim() ?? '';
      const suggestions = generateCompletions(currentToken?.context, currentInput);

      return {
        completions: suggestions,
        expectedTypes,
        firstErrorTokenIndex: firstErrorIndex >= 0 ? firstErrorIndex : undefined,
      };
    } catch (error) {
      console.error('Error getting completions:', error);

      return { completions: [], expectedTypes: [], tokens: [], firstErrorTokenIndex: undefined };
    }
  }, [query, cursorPosition, queryParser, generateCompletions]);

  // Update dropdown visibility based on expected types
  useEffect(() => {
    const shouldShowDropdown = expectedTypes.length > 0 && completions.length > 0;
    setIsDropdownOpen(shouldShowDropdown);
  }, [expectedTypes, completions]);

  const onCompletionSelect = useOnCompletionSelect({ tokens: parseResult.tokens, cursorPosition, query });

  const onQueryChange = (value: string, cursorPosition?: number) => {
    setQuery(value);
    const newCursorPosition = cursorPosition ?? inputRef!.current?.selectionStart ?? 0;

    if (inputRef.current == null) return;

    if (cursorPosition !== undefined && cursorPosition !== inputRef.current.selectionStart) {
      inputRef.current!.setSelectionRange(cursorPosition, cursorPosition);
    }

    setCursorPosition(newCursorPosition);
  };

  return {
    query,
    onQueryChange,
    parseResult,
    completions,
    onCompletionSelect,
    isDropdownOpen,
    cursorPosition,
    setCursorPosition,
    expectedTypes,
    inputRef,
    filterScheme,
    firstErrorTokenIndex,
  };
}
