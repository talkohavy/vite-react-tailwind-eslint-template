import { useState, useMemo, useEffect, useRef } from 'react';
import { QueryParser, TokenTypes } from 'create-query-language';
import ContextInfo from './components/ContextInfo';
import QueryInput from './components/QueryInput';
import TokenBubbles from './components/TokenBubbles';
import { keyConfigs } from './logic/constants';
import { useCompletionEngine } from './logic/useCompletionEngine';

export default function QueryLanguageTab() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryParser = useMemo(() => new QueryParser(), []);

  const { generateCompletions } = useCompletionEngine({ keyConfigs, query });

  const { completions, expectedTypes, tokens, firstErrorTokenIndex } = useMemo(() => {
    if (!query) {
      return { completions: [], expectedTypes: [], tokens: [], firstErrorTokenIndex: undefined };
    }

    try {
      const parseResult = queryParser.parse(query);

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
        tokens: parseResult.tokens,
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

    /**
     * Replace Logic:
     *
     *
     */
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

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='dark:bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold mb-4'>Query Input</h2>

          <TokenBubbles tokens={tokens} firstErrorTokenIndex={firstErrorTokenIndex} />

          <QueryInput
            ref={inputRef}
            query={query}
            onQueryChange={onQueryChange}
            isDropdownOpen={isDropdownOpen}
            completions={completions}
            selectedCompletionIndex={selectedCompletionIndex}
            setCursorPosition={setCursorPosition}
            onSelectedIndexChange={setSelectedCompletionIndex}
            onDropdownToggle={setIsDropdownOpen}
            onCompletionSelect={onCompletionSelect}
          />

          <ContextInfo
            cursorPosition={cursorPosition}
            expectedTypes={expectedTypes}
            completions={completions}
            query={query}
          />
        </div>
      </div>
    </div>
  );
}
