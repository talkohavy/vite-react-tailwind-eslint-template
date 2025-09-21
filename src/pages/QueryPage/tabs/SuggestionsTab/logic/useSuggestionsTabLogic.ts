import { useState, useMemo, useEffect, useRef } from 'react';
import { TokenTypes } from 'create-query-language';
import { useQueryParser } from '../../../logic/hooks/useQueryParser';
import { keyConfigs } from './constants';
import { useCompletionEngine } from './useCompletionEngine';

export function useSuggestionsTabLogic() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseResult = useQueryParser({ query });

  const { generateCompletions } = useCompletionEngine({ keyConfigs, query });

  const { completions, expectedTypes, tokens } = useMemo(() => {
    try {
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
        tokens: parseResult.tokens,
      };
    } catch (error) {
      console.error('Error getting completions:', error);

      return { completions: [], expectedTypes: [], tokens: [] };
    }
  }, [query, cursorPosition, generateCompletions]);

  // Update dropdown visibility based on expected types
  useEffect(() => {
    const shouldShowDropdown = expectedTypes.length > 0 && completions.length > 0;
    setIsDropdownOpen(shouldShowDropdown);
  }, [expectedTypes, completions]);

  const onCompletionSelect = (completion: any) => {
    /**
     * Use Cases:
     * 1. "role <= |admin" - token should be "admin"
     * 2. "role <= admin|" - token should be "admin"
     * 3. "role <= ad|min" - token should be "admin"
     * 4. "role <= | admin" - token should be WHITESPACE
     * 5. "role <= admin |" - token should be WHITESPACE
     */
    // Find uses < intentionally! So that cases like "status <= <cursor-here>pending AND ..." would take the "pending" adn not the WHITESPACE.
    const currentToken = tokens.find(
      (token) => cursorPosition >= token.position.start && cursorPosition < token.position.end,
    )!;
    const nextToken = tokens.find(
      (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
    )!;
    const token = currentToken && currentToken.type !== TokenTypes.Whitespace ? currentToken : nextToken;

    const addedWhitespaces = token.type === TokenTypes.Whitespace ? ' ' : '';

    const leftPart = `${query.substring(0, token.position.start)}${addedWhitespaces}`;
    const insertText = completion.label;
    const rightPart = `${addedWhitespaces}${query.substring(token.position.end)}`.trimEnd();
    const newValue = leftPart + insertText + rightPart;

    const newCursorPosition = leftPart.length + insertText.length;

    return { value: newValue, cursorPosition: newCursorPosition };
  };

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
    inputRef,
  };
}
