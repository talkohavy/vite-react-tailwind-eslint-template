import { twMerge } from 'tailwind-merge';

type InputBaseProps = {
  refElement?: React.Ref<HTMLInputElement>;
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
  id?: string;
  testId?: string;
};

export default function InputBase(props: InputBaseProps) {
  const {
    refElement,
    type = 'text',
    value,
    setValue,
    onSelect,
    placeholder = '',
    disabled,
    autoFocus,
    className,
    id,
    testId = '',
  } = props;

  return (
    <input
      ref={refElement}
      type={type}
      id={id}
      value={value}
      onChange={setValue}
      onSelect={onSelect}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={twMerge(
        'h-10 w-full rounded-md border border-black p-2 dark:bg-slate-900 focus:border-blue-600',
        className,
      )}
      data-test-id={`${testId}Input`}
    />
  );
}
