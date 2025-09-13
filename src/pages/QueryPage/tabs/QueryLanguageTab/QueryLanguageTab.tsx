import { useState, useMemo, useEffect } from 'react';
import { QueryParser } from 'create-query-language';
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

  // Initialize QueryParser
  const queryParser = useMemo(() => new QueryParser(), []);

  // Initialize completion engine
  const { generateCompletions } = useCompletionEngine({ keyConfigs, query });

  // Get completion context and suggestions
  const { completions, expectedTypes } = useMemo(() => {
    if (!query) {
      return { completions: [], expectedTypes: [] };
    }

    try {
      // Parse the query to get tokens with context
      const parseResult = queryParser.parse(query);

      // Find the current token at cursor position
      const currentToken = parseResult.tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      let expectedTypes: string[] = [];

      if (currentToken?.context?.expectedTokens) {
        // Use the expectedTokens directly from the current token
        expectedTypes = [...currentToken.context.expectedTokens];
      }

      const currentInput = ''; // Could be enhanced to get partial input
      const suggestions = generateCompletions(currentToken?.context, currentInput);

      return {
        completions: suggestions,
        expectedTypes,
      };
    } catch (error) {
      console.error('Error getting completions:', error);

      return { completions: [], expectedTypes: [] };
    }
  }, [query, cursorPosition, queryParser, generateCompletions]);

  // Update dropdown visibility based on expected types
  useEffect(() => {
    const shouldShowDropdown = expectedTypes.length > 0 && completions.length > 0;
    setIsDropdownOpen(shouldShowDropdown);
  }, [expectedTypes, completions]);

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
