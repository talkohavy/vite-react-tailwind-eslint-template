import { forwardRef, useState } from 'react';
import InputBase from './InputBase';
import type { RuleReturnValue } from './types';

export type InputProps = {
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  dontChangeRule?: (e: any, newValue: string) => RuleReturnValue;
  className?: string;
  testId?: string;
};

function InputToForward(props: InputProps, ref: React.Ref<HTMLInputElement>) {
  const {
    type = 'text',
    onChange,
    onSelect,
    initialValue = '',
    disabled,
    placeholder,
    autoFocus,
    dontChangeRule,
    className,
    testId = '',
  } = props;

  const [innerValue, setInnerValue] = useState(initialValue);

  const onTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shouldChange, newValue } = dontChangeRule?.(e, e.target.value) ?? {
      shouldChange: true,
      newValue: e.target.value,
    };

    if (shouldChange) {
      onChange?.(newValue, e);
      setInnerValue(newValue);
    }
  };

  return (
    <InputBase
      ref={ref}
      type={type}
      value={innerValue}
      setValue={onTargetValueChange}
      onSelect={onSelect}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className={className}
      testId={testId}
    />
  );
}

const Input = forwardRef(InputToForward);

export default Input;
