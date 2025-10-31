import QueryInput from './components/QueryInput/QueryInput';
import TokenBubbles from './components/TokenBubbles';
import ParseErrorDisplayer from './content/ParseErrorDisplayer';
import { useQueryLanguageTabLogic } from './logic/useQueryLanguageTabLogic';

export default function QueryLanguageTab() {
  const {
    inputRef,
    query,
    onQueryChange,
    isDropdownOpen,
    completions,
    onCompletionSelect,
    setCursorPosition,
    handleDropdownOpenChange,
    parseResult,
    filterScheme,
    errors,
  } = useQueryLanguageTabLogic();

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='dark:bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold mb-4'>Query Input</h2>

          <TokenBubbles tokens={parseResult.tokens} />

          <QueryInput
            ref={inputRef}
            query={query}
            onQueryChange={onQueryChange}
            completions={completions}
            onCompletionSelect={onCompletionSelect}
            setCursorPosition={setCursorPosition}
            isDropdownOpen={isDropdownOpen}
            onDropdownOpenChange={handleDropdownOpenChange}
          />

          {errors.length > 0 && <ParseErrorDisplayer errors={errors} />}
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
