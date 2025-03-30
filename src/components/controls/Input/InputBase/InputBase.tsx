import { twMerge } from 'tailwind-merge';

type InputBaseProps = {
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: React.HTMLInputTypeAttribute;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

export default function InputBase(props: InputBaseProps) {
  const { type = 'text', value, setValue, placeholder = '', disabled, autoFocus, className, testId = '' } = props;

  return (
    <input
      type={type}
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={twMerge('h-10 w-full rounded-md border border-black p-2', className)}
      data-test-id={`${testId}Input`}
    />
  );
}
