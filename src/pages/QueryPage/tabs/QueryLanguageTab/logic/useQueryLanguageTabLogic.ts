import { useState, useMemo, useEffect, useRef } from 'react';
import { useOnCompletionSelect } from '../../../logic/hooks/useOnCompletionSelect';
import { useQueryParser } from '../../../logic/hooks/useQueryParser';
import { useSuggestionEngine } from '../../../logic/hooks/useSuggestionEngine';
import { convertAstToFilterScheme } from '../logic/astToFilterScheme/astToFilterScheme';
import { keyConfigs } from '../logic/constants';

export function useQueryLanguageTabLogic() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseResult = useQueryParser({ query });

  const { expectedTypes, completions, firstErrorTokenIndex } = useSuggestionEngine({
    cursorPosition,
    tokens: parseResult.tokens,
    keyConfigs,
  });

  const filterScheme = useMemo(() => {
    const filterScheme = convertAstToFilterScheme(parseResult.ast);

    return filterScheme;
  }, [parseResult.ast]);

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
