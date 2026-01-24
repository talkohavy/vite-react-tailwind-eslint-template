import { forwardRef } from 'react';
import type { ForwardRefRenderFunction, RefObject } from 'react';
import InputWithDropdown, { type OpenChangeDetails } from '@src/components/controls/InputWithDropdown';
import { useQueryInputLogic } from './logic/useQueryInputLogic';
import styles from './QueryInput.module.scss';
import type { CompletionItem } from './types';

type QueryInputProps = {
  query: string;
  onQueryChange: (value: string, cursorPosition?: number) => void;
  completions: CompletionItem[];
  onCompletionSelect: (completion: CompletionItem) => { value: string; cursorPosition: number };
  setCursorPosition: (position: number) => void;
  isDropdownOpen?: boolean;
  onDropdownOpenChange?: (details: OpenChangeDetails) => void;
};

function QueryInputToForward(props: QueryInputProps, inputRef: RefObject<HTMLInputElement>) {
  const {
    query,
    completions,
    onQueryChange,
    setCursorPosition,
    onCompletionSelect,
    isDropdownOpen,
    onDropdownOpenChange,
  } = props;

  const { handleCompletionSelect, updateCursorPosition, groupedCompletions } = useQueryInputLogic({
    inputRef,
    onQueryChange,
    setCursorPosition,
    onCompletionSelect,
    completions,
  });

  return (
    <div className='relative'>
      <InputWithDropdown
        ref={inputRef}
        value={query}
        options={groupedCompletions}
        isOpen={isDropdownOpen}
        onOpenChange={onDropdownOpenChange}
        onItemSelect={handleCompletionSelect}
        onChange={onQueryChange}
        closeOnSelect={false}
        onKeyDown={updateCursorPosition}
        onMousedown={updateCursorPosition}
        showClear
        showDropdownWhenEmpty
        noResultsLabel='No results were found'
        placeholder='Enter your query with AND, OR, NOT, (, )'
        className={styles.queryInput}
      />
    </div>
  );
}

const QueryInput = forwardRef(QueryInputToForward as ForwardRefRenderFunction<any, QueryInputProps>);

export default QueryInput;
