import { useRef, useCallback } from 'react';
import type { CompletionItem } from '../types';

type QueryInputProps = {
  query: string;
  isDropdownOpen: boolean;
  completions: CompletionItem[];
  selectedCompletionIndex: number;
  onQueryChange: (value: string) => void;
  onCursorPositionChange: (position: number) => void;
  onCompletionSelect: (completion: CompletionItem) => void;
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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      onQueryChange(newValue);
      onCursorPositionChange(event.target.selectionStart || 0);
      onSelectedIndexChange(-1); // Reset selection when typing
    },
    [onQueryChange, onCursorPositionChange, onSelectedIndexChange],
  );

  const handleInputClick = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      onCursorPositionChange(target.selectionStart || 0);
      onSelectedIndexChange(-1); // Reset selection when clicking
    },
    [onCursorPositionChange, onSelectedIndexChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;

      // Handle arrow key navigation in dropdown
      if (isDropdownOpen && completions.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          onSelectedIndexChange(selectedCompletionIndex < completions.length - 1 ? selectedCompletionIndex + 1 : 0);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          onSelectedIndexChange(selectedCompletionIndex > 0 ? selectedCompletionIndex - 1 : completions.length - 1);
          return;
        }

        if (event.key === 'Enter' && selectedCompletionIndex >= 0) {
          event.preventDefault();
          const selectedCompletion = completions[selectedCompletionIndex];
          if (selectedCompletion) {
            onCompletionSelect(selectedCompletion);
          }
          return;
        }

        if (event.key === 'Escape') {
          onDropdownToggle(false);
          onSelectedIndexChange(-1);
          return;
        }
      }

      // Update cursor position on key navigation
      setTimeout(() => {
        onCursorPositionChange(target.selectionStart || 0);
      }, 0);
    },
    [
      isDropdownOpen,
      completions,
      selectedCompletionIndex,
      onSelectedIndexChange,
      onCompletionSelect,
      onDropdownToggle,
      onCursorPositionChange,
    ],
  );

  const handleCompletionSelect = useCallback(
    (completion: CompletionItem) => {
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
      const insertText = completion.insertText || completion.text;
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
    [onQueryChange, onCursorPositionChange],
  );

  return (
    <div className='relative'>
      <input
        ref={inputRef}
        type='text'
        value={query}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        placeholder='Type your query... (e.g., status: active AND role: manager)'
        className='w-full px-4 py-3 text-lg font-mono bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      />

      {/* Autocomplete Dropdown with Arrow Key Navigation */}
      {isDropdownOpen && completions.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10'>
          {completions.map((completion: CompletionItem, index: number) => (
            <button
              key={`${completion.text}-${index}`}
              type='button'
              className={`px-4 py-3 cursor-pointer border-b border-gray-700 last:border-b-0 text-left w-full transition-colors ${
                index === selectedCompletionIndex ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-white'
              }`}
              onClick={() => handleCompletionSelect(completion)}
              onMouseEnter={() => onSelectedIndexChange(index)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <span className='font-mono'>{completion.text}</span>
                  <span className='text-xs px-2 py-1 bg-blue-600 text-white rounded'>{completion.type}</span>
                </div>
                <span className='text-xs text-gray-400'>Priority: {completion.priority}</span>
              </div>
              {completion.description && <div className='text-sm text-gray-400 mt-1'>{completion.description}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
