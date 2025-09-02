import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type InputBaseProps = {
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: React.HTMLInputTypeAttribute;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

function InputBaseToForward(props: InputBaseProps, ref: React.Ref<HTMLInputElement>) {
  const {
    type = 'text',
    value,
    setValue,
    onSelect,
    placeholder = '',
    disabled,
    autoFocus,
    className,
    testId = '',
  } = props;

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={setValue}
      onSelect={onSelect}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={twMerge('h-10 w-full rounded-md border border-black p-2', className)}
      data-test-id={`${testId}Input`}
    />
  );
}

const InputBase = forwardRef(InputBaseToForward);

export default InputBase;
