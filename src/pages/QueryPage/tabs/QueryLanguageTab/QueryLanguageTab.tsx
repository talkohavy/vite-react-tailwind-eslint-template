import { useState, useMemo, useEffect } from 'react';
import { QueryParser, TokenTypes } from 'create-query-language';
import ContextInfo from './components/ContextInfo';
import ParseResult from './components/ParseResult';
import QueryInput from './components/QueryInput';
import { keyConfigs } from './logic/constants';
import { useCompletionEngine } from './logic/useCompletionEngine';

export default function QueryLanguageTab() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(-1);

  const queryParser = useMemo(() => new QueryParser(), []);

  const { generateCompletions } = useCompletionEngine({ keyConfigs, query });

  const { completions, expectedTypes, tokens } = useMemo(() => {
    if (!query) {
      return { completions: [], expectedTypes: [], tokens: [] };
    }

    try {
      const parseResult = queryParser.parse(query);

      const currentToken = parseResult.tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      let expectedTypes: string[] = [];

      if (currentToken?.context?.expectedTokens) {
        expectedTypes = [...currentToken.context.expectedTokens];
      }

      const currentInput = currentToken?.value ?? ''; // Could be enhanced to get partial input
      const suggestions = generateCompletions(currentToken?.context, currentInput);

      return { completions: suggestions, expectedTypes, tokens: parseResult.tokens };
    } catch (error) {
      console.error('Error getting completions:', error);

      return { completions: [], expectedTypes: [], tokens: [] };
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
     *
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
    const rightPart = `${addedWhitespaces}${query.substring(token.position.end)}`;
    const newValue = leftPart + insertText + rightPart;

    const newCursorPosition = leftPart.length + insertText.length;

    setCursorPosition(newCursorPosition);

    return { value: newValue, cursorPosition: newCursorPosition };
  };

  return (
    <div className='p-6 max-w-4xl mx-auto bg-black'>
      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>Query Input</h2>

          <QueryInput
            query={query}
            isDropdownOpen={isDropdownOpen}
            completions={completions}
            selectedCompletionIndex={selectedCompletionIndex}
            onQueryChange={setQuery}
            onCursorPositionChange={setCursorPosition}
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

        <ParseResult query={query} queryParser={queryParser} />
      </div>
    </div>
  );
}
