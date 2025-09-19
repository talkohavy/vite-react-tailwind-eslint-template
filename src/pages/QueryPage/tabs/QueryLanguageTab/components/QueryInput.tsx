import { forwardRef, useCallback } from 'react';
import type { ForwardRefRenderFunction, RefObject } from 'react';
import type { CompletionItem } from '../types';
import InputWithDropdown from '../../../../../components/controls/InputWithDropdown';

type QueryInputProps = {
  query: string;
  onQueryChange: (value: string, cursorPosition?: number) => void;
  completions: CompletionItem[];
  onCompletionSelect: (completion: CompletionItem) => { value: string; cursorPosition: number };
  isDropdownOpen: boolean;
  setCursorPosition: (position: number) => void;
};

function QueryInputToForward(props: QueryInputProps, inputRef: RefObject<HTMLInputElement>) {
  const { query, completions, onQueryChange, setCursorPosition, onCompletionSelect } = props;

  const handleCompletionSelect = useCallback(
    (completion: any) => {
      const input = inputRef?.current;

      if (!input) return;

      const { value: newValue, cursorPosition: newCursorPosition } = onCompletionSelect(completion);

      onQueryChange(newValue, newCursorPosition);

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [onQueryChange, onCompletionSelect],
  );

  const updateCursorPosition = useCallback(
    (e: any) => {
      const shouldUpdateCursor =
        // Left-mouse click
        (e.type === 'mousedown' && e.button === 0) ||
        // Arrow keys (alone, with alt, or with ctrl, but not shift)
        (e.type === 'keydown' && e.key === 'ArrowLeft' && !e.shiftKey) ||
        (e.type === 'keydown' && e.key === 'ArrowRight' && !e.shiftKey) ||
        // Home and End keys (alone or with ctrl)
        (e.type === 'keydown' && e.key === 'Home') ||
        (e.type === 'keydown' && e.key === 'End') ||
        // Page navigation keys
        (e.type === 'keydown' && e.key === 'PageUp') ||
        (e.type === 'keydown' && e.key === 'PageDown') ||
        // Select all (Ctrl+A)
        (e.type === 'keydown' && e.key === 'a' && e.ctrlKey && !e.shiftKey && !e.altKey);

      if (!shouldUpdateCursor) {
        return;
      }

      // Update cursor position on key navigation
      setTimeout(() => {
        setCursorPosition(e.target.selectionStart || 0);
      }, 0);
    },
    [setCursorPosition],
  );

  return (
    <div className='relative'>
      <InputWithDropdown
        ref={inputRef}
        value={query}
        options={completions}
        onItemSelect={handleCompletionSelect}
        onChange={onQueryChange}
        closeOnSelect={false}
        onKeyDown={updateCursorPosition}
        onMousedown={updateCursorPosition}
        showClear
        placeholder='Type your query... (e.g., status: active AND role: manager)'
      />
    </div>
  );
}

const QueryInput = forwardRef(QueryInputToForward as ForwardRefRenderFunction<any, QueryInputProps>);

export default QueryInput;
