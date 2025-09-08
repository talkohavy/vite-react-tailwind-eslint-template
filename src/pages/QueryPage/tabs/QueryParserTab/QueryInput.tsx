import { useRef, useCallback } from 'react';
import Input from '../../../../components/controls/Input';

interface QueryInputProps {
  value: string;
  onChange: (value: string, cursorPosition?: number) => void;
  placeholder?: string;
}

export default function QueryInput(props: QueryInputProps) {
  const { value, onChange, placeholder } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (newValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPosition = e.target.selectionStart || 0;
      onChange(newValue, cursorPosition);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPosition = e.target.selectionStart || 0;
      onChange(value, cursorPosition);
    },
    [onChange, value],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const cursorPosition = target.selectionStart || 0;
      onChange(value, cursorPosition);
    },
    [onChange, value],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const cursorPosition = target.selectionStart || 0;
      onChange(value, cursorPosition);
    },
    [onChange, value],
  );

  return (
    <div className='relative'>
      <Input
        ref={inputRef}
        initialValue={value}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder={placeholder}
        className='font-mono'
        // Add event handlers for tracking cursor position
        {...{
          onClick: handleClick,
          onKeyUp: handleKeyUp,
        }}
      />
    </div>
  );
}
