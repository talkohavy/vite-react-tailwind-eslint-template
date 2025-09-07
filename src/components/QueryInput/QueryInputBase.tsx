import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type QueryInputBaseProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  testId?: string;
};

const QueryInputBase = forwardRef<HTMLInputElement, QueryInputBaseProps>((props, ref) => {
  const {
    value,
    onChange,
    onKeyDown,
    onSelect,
    onFocus,
    onBlur,
    placeholder = '',
    disabled = false,
    autoFocus = false,
    className,
    testId = '',
  } = props;

  return (
    <input
      ref={ref}
      type='text'
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onSelect={onSelect}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={twMerge(
        'h-10 w-full rounded-md border p-2 outline-none transition-colors duration-200',
        'focus:ring-2 focus:ring-blue-500/20',
        disabled && 'cursor-not-allowed bg-gray-50 text-gray-500',
        className,
      )}
      data-test-id={`${testId}-base`}
    />
  );
});

QueryInputBase.displayName = 'QueryInputBase';

export default QueryInputBase;
