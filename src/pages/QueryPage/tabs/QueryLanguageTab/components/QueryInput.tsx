import { useRef, useCallback } from 'react';
import type { CompletionItem } from '../types';
import CompletionDropdown from './CompletionDropdown';
import TextInputField from './TextInputField';

type QueryInputProps = {
  query: string;
  isDropdownOpen: boolean;
  completions: CompletionItem[];
  selectedCompletionIndex: number;
  onQueryChange: (value: string) => void;
  onCursorPositionChange: (position: number) => void;
  onCompletionSelect?: (completion: CompletionItem) => void;
  onSelectedIndexChange: (index: number) => void;
  onDropdownToggle: (open: boolean) => void;
};

export default function QueryInput(props: QueryInputProps) {
  const {
    query,
    isDropdownOpen,
    completions,
    selectedCompletionIndex,
    onQueryChange,
    onCursorPositionChange,
    onCompletionSelect,
    onSelectedIndexChange,
    onDropdownToggle,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCompletionSelect = useCallback(
    (completion: CompletionItem) => {
      // Call the parent's completion select handler first
      onCompletionSelect?.(completion);

      // Then handle the text insertion logic here
      if (!inputRef.current) return;

      const input = inputRef.current;
      const value = input.value;
      const start = input.selectionStart || 0;

      // Find the start of the current token to replace
      let tokenStart = start;
      while (tokenStart > 0) {
        const prevChar = value[tokenStart - 1];
        if (prevChar && /[a-zA-Z0-9_-]/.test(prevChar)) {
          tokenStart--;
        } else {
          break;
        }
      }

      // Insert the completion
      const insertText = `${completion.insertText || completion.text} `;
      const newValue = value.substring(0, tokenStart) + insertText + value.substring(start);
      const newCursorPosition = tokenStart + insertText.length;

      onQueryChange(newValue);
      onCursorPositionChange(newCursorPosition);

      // Focus back to input and set cursor position
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
      <TextInputField
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
      />
    </div>
  );
}
