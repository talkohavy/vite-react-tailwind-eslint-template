import QueryInput from '../QueryLanguageTab/components/QueryInput';
import ContextInfo from './components/ContextInfo';
import { useSuggestionsTabLogic } from './logic/useSuggestionsTabLogic';

export default function SuggestionsTab() {
  const {
    query,
    onQueryChange,
    isDropdownOpen,
    completions,
    cursorPosition,
    setCursorPosition,
    onCompletionSelect,
    expectedTypes,
    inputRef,
  } = useSuggestionsTabLogic();

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='dark:bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold mb-4'>Query Input</h2>

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
      </div>
    </div>
  );
}
