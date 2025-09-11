import { forwardRef, useCallback } from 'react';
import type { CompletionItem } from '../types';

interface TextInputFieldProps {
  query: string;
  isDropdownOpen: boolean;
  completions: CompletionItem[];
  selectedCompletionIndex: number;
  onQueryChange: (value: string) => void;
  onCursorPositionChange: (position: number) => void;
  onCompletionSelect?: (completion: CompletionItem) => void;
  onSelectedIndexChange: (index: number) => void;
  onDropdownToggle: (open: boolean) => void;
}

const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>((props, ref) => {
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
            onCompletionSelect?.(selectedCompletion);
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

  return (
    <input
      ref={ref}
      type='text'
      value={query}
      onChange={handleInputChange}
      onClick={handleInputClick}
      onKeyDown={handleKeyDown}
      placeholder='Type your query... (e.g., status: active AND role: manager)'
      className='w-full px-4 py-3 text-lg font-mono bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    />
  );
});

TextInputField.displayName = 'TextInputField';

export default TextInputField;
