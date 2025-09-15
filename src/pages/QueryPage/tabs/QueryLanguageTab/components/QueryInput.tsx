import { useRef, useCallback } from 'react';
import type { SelectOption } from '../../../../../components/controls/Select/types';
import type { CompletionItem } from '../types';
import InputWithDropdown from '../../../../../components/controls/InputWithDropdown';
// import CompletionDropdown from './CompletionDropdown';
// import TextInputField from './TextInputField';

type QueryInputProps = {
  query: string;
  isDropdownOpen: boolean;
  completions: CompletionItem[];
  selectedCompletionIndex: number;
  onQueryChange: (value: string) => void;
  onCompletionSelect: (completion: SelectOption) => { value: string; cursorPosition: number };
  onCursorPositionChange: (position: number) => void;
  onSelectedIndexChange: (index: number) => void;
  onDropdownToggle: (open: boolean) => void;
};

export default function QueryInput(props: QueryInputProps) {
  const {
    query,
    completions,
    onQueryChange,
    onCursorPositionChange,
    onCompletionSelect,
    // isDropdownOpen,
    // selectedCompletionIndex,
    // onSelectedIndexChange,
    // onDropdownToggle,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCompletionSelect = useCallback(
    (completion: any) => {
      const input = inputRef.current;

      if (!input) return;

      const { value: newValue, cursorPosition: newCursorPosition } = onCompletionSelect(completion);

      onQueryChange(newValue);

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [onQueryChange, onCursorPositionChange, onCompletionSelect],
  );

  const updateCursorPosition = useCallback((e: any) => {
    // ignore right-mouse click
    if (e.type === 'mousedown' && e.button === 2) {
      return;
    }

    // ignore shift + arrow keys to avoid double handling
    if (
      e.shiftKey &&
      (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
      return;
    }

    // Update cursor position on key navigation
    setTimeout(() => {
      onCursorPositionChange(e.target.selectionStart || 0);
    }, 0);
  }, []);

  return (
    <div className='relative'>
      <InputWithDropdown
        ref={inputRef}
        value={query}
        options={completions.map((c) => ({ value: c.text, label: c.text }))}
        onItemSelect={handleCompletionSelect}
        onChange={onQueryChange}
        closeOnSelect={false}
        onKeyDown={updateCursorPosition}
        onMousedown={updateCursorPosition}
        showClear
        placeholder='Type your query... (e.g., status: active AND role: manager)'
      />
      {/* <TextInputField
        ref={inputRef}
        query={query}
        isDropdownOpen={isDropdownOpen}
        completions={completions}
        selectedCompletionIndex={selectedCompletionIndex}
        onQueryChange={onQueryChange}
        onCursorPositionChange={onCursorPositionChange}
        onCompletionSelect={handleCompletionSelect}
        onSelectedIndexChange={onSelectedIndexChange}
        onDropdownToggle={onDropdownToggle}
      />

      <CompletionDropdown
        isOpen={isDropdownOpen}
        completions={completions}
        selectedIndex={selectedCompletionIndex}
        onCompletionSelect={handleCompletionSelect}
        onSelectedIndexChange={onSelectedIndexChange}
      /> */}
    </div>
  );
}
