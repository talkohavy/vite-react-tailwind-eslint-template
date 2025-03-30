import { useState } from 'react';
import type { RuleReturnValue } from './types';
import InputBase from './InputBase';

export type InputProps = {
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  onChange: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  dontChangeRule?: (e: any, newValue: string) => RuleReturnValue;
  className?: string;
  testId?: string;
};

export default function Input(props: InputProps) {
  const {
    type = 'text',
    onChange,
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
      onChange?.(newValue);
      setInnerValue(newValue);
    }
  };

  return (
    <InputBase
      type={type}
      value={innerValue}
      setValue={onTargetValueChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className={className}
      testId={testId}
    />
  );
}
