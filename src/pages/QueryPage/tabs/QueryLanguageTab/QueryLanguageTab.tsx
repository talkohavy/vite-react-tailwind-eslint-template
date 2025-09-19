import { useState, useMemo, useEffect, useRef } from 'react';
import { QueryParser, TokenTypes } from 'create-query-language';
import { useOnCompletionSelect } from '../../logic/hooks/useOnCompletionSelect';
import { useQueryParser } from '../../logic/hooks/useQueryParser';
import ContextInfo from './components/ContextInfo';
import QueryInput from './components/QueryInput';
import TokenBubbles from './components/TokenBubbles';
import { convertAstToFilterScheme } from './logic/astToFilterScheme/astToFilterScheme';
import { keyConfigs } from './logic/constants';
import { useCompletionEngine } from './logic/useCompletionEngine';

const queryParser = new QueryParser();

export default function QueryLanguageTab() {
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

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='dark:bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold mb-4'>Query Input</h2>

          <TokenBubbles tokens={parseResult.tokens} firstErrorTokenIndex={firstErrorTokenIndex} />

          <QueryInput
            ref={inputRef}
            query={query}
            onQueryChange={onQueryChange}
            completions={completions}
            onCompletionSelect={onCompletionSelect}
            isDropdownOpen={isDropdownOpen}
            setCursorPosition={setCursorPosition}
          />

          <ContextInfo
            cursorPosition={cursorPosition}
            expectedTypes={expectedTypes}
            completions={completions}
            query={query}
          />
        </div>

        <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h3 className='text-lg font-semibold text-white mb-4'>Generated FilterScheme</h3>
          <div className='font-mono text-sm'>
            <pre className='whitespace-pre-wrap bg-gray-900 p-3 rounded border border-gray-600 overflow-x-auto text-gray-300'>
              {JSON.stringify(filterScheme, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
