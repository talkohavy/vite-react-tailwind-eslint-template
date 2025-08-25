import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import type { CompletionItem } from '../../lib/QueryLanguage/types';
import { CompletionEngine } from '../../lib/QueryLanguage/completion/CompletionEngine';
import { QueryParser } from '../../lib/QueryLanguage/parser/QueryParser';
import CompletionDropdown from './CompletionDropdown';
import QueryInputBase from './QueryInputBase';

type QueryInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  testId?: string;
  availableKeys?: string[];
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
};

export default function QueryInput(props: QueryInputProps) {
  const {
    value,
    onChange,
    placeholder = 'Enter query...',
    disabled = false,
    autoFocus = false,
    className,
    testId = 'query-input',
    availableKeys = [],
    showValidation = true,
    onValidationChange,
  } = props;

  const [cursorPosition, setCursorPosition] = useState(0);
  const [completions, setCompletions] = useState<CompletionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const completionEngineRef = useRef<CompletionEngine | null>(null);
  const parserRef = useRef<QueryParser | null>(null);

  // Initialize completion engine and parser
  useEffect(() => {
    if (!completionEngineRef.current) {
      completionEngineRef.current = new CompletionEngine();
      const keyConfigs = availableKeys.map((key) => ({ name: key }));
      completionEngineRef.current.updateConfig({
        keys: keyConfigs,
        caseSensitive: false,
        maxSuggestions: 10,
      });
    }

    if (!parserRef.current) {
      parserRef.current = new QueryParser();
    }
  }, []);

  // Update available keys when they change
  useEffect(() => {
    if (completionEngineRef.current) {
      const keyConfigs = availableKeys.map((key) => ({ name: key }));
      completionEngineRef.current.updateConfig({
        keys: keyConfigs,
        caseSensitive: false,
        maxSuggestions: 10,
      });
    }
  }, [availableKeys]);

  // Validate query and update completions when value or cursor position changes
  useEffect(() => {
    if (!completionEngineRef.current || !parserRef.current) return;

    // Validate query
    if (showValidation && value.trim()) {
      const parseResult = parserRef.current.parse(value);
      const errors = parseResult.errors.map((error) => error.message);
      const valid = errors.length === 0;

      setValidationErrors(errors);
      setIsValid(valid);
      onValidationChange?.(valid, errors);
    } else {
      setValidationErrors([]);
      setIsValid(true);
      onValidationChange?.(true, []);
    }

    // Get completions
    if (value.length > 0 || cursorPosition > 0) {
      const newCompletions = completionEngineRef.current.getCompletions(value, cursorPosition);
      setCompletions(newCompletions);
      setShowDropdown(newCompletions.length > 0);
      setSelectedCompletionIndex(0);
    } else {
      setCompletions([]);
      setShowDropdown(false);
    }
  }, [value, cursorPosition, showValidation, onValidationChange]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart || 0;

    onChange(newValue);
    setCursorPosition(newCursorPosition);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || completions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCompletionIndex((prev) => (prev < completions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedCompletionIndex((prev) => (prev > 0 ? prev - 1 : completions.length - 1));
        break;

      case 'Enter':
      case 'Tab':
        if (completions[selectedCompletionIndex]) {
          e.preventDefault();
          handleCompletionSelect(completions[selectedCompletionIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
    }
  }

  function handleCompletionSelect(completion: CompletionItem) {
    if (!inputRef.current) return;

    const insertText = completion.insertText || completion.text;

    // Simple insertion at cursor position
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    const newValue = beforeCursor + insertText + afterCursor;
    const newCursorPosition = cursorPosition + insertText.length;

    onChange(newValue);
    setShowDropdown(false);

    // Set cursor position after the inserted text
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        setCursorPosition(newCursorPosition);
      }
    }, 0);
  }

  function handleCursorPositionChange() {
    if (inputRef.current) {
      const newPosition = inputRef.current.selectionStart || 0;
      setCursorPosition(newPosition);
    }
  }

  function handleInputFocus() {
    if (completions.length > 0) {
      setShowDropdown(true);
    }
  }

  function handleInputBlur() {
    // Delay hiding dropdown to allow for completion selection
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  }

  const inputClassName = twMerge(
    'transition-colors duration-200',
    !isValid && showValidation && 'border-red-500 focus:border-red-500',
    isValid && 'border-gray-300 focus:border-blue-500',
    className,
  );

  return (
    <div className='relative w-full'>
      <QueryInputBase
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSelect={handleCursorPositionChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={inputClassName}
        testId={testId}
      />

      {showDropdown && completions.length > 0 && (
        <CompletionDropdown
          completions={completions}
          selectedIndex={selectedCompletionIndex}
          onSelect={handleCompletionSelect}
          onClose={() => setShowDropdown(false)}
        />
      )}

      {showValidation && validationErrors.length > 0 && (
        <div className='mt-1 text-sm text-red-600' data-test-id={`${testId}-errors`}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
