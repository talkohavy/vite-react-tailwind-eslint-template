import { useState, useRef } from 'react';
import { useOnCompletionSelect } from '../../../../../components/controls/QueryInput/logic/hooks/useOnCompletionSelect';
import { useQueryParser } from '../../../../../components/controls/QueryInput/logic/hooks/useQueryParser';
import { useSuggestionEngine } from '../../../../../components/controls/QueryInput/logic/hooks/useSuggestionEngine';
import { keyConfigs } from './constants';

export function useUIChipsTabLogic() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseResult = useQueryParser({ query });

  const { completions, expectedTypes, firstErrorTokenIndex } = useSuggestionEngine({
    cursorPosition,
    keyConfigs,
    tokens: parseResult.tokens,
  });

  const onCompletionSelect = useOnCompletionSelect({
    tokens: parseResult.tokens,
    cursorPosition,
    query,
    setIsDropdownOpen,
  });

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
    isDropdownOpen,
    completions,
    selectedCompletionIndex,
    setCursorPosition,
    setSelectedCompletionIndex,
    setIsDropdownOpen,
    onCompletionSelect,
    cursorPosition,
    expectedTypes,
    firstErrorTokenIndex,
    inputRef,
    parseResult,
  };
}
