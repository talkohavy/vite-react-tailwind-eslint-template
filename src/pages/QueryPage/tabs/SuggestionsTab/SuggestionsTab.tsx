import ContextInfo from './components/ContextInfo';
import QueryInput from './components/QueryInput';
import { useSuggestionsTabLogic } from './logic/useSuggestionsTabLogic';

export default function SuggestionsTab() {
  const {
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
