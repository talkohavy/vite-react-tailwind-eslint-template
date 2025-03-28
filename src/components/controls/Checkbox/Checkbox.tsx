import clsx from 'clsx';
import CheckIcon from '../../svgs/CheckIcon';

export type CheckboxProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const { isChecked, setIsChecked, disabled, label, className, testId = '' } = props;

  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={isChecked ? 'true' : 'false'}
      data-test-id={`${testId}CheckboxButton`}
    >
      <label className={clsx('group flex cursor-pointer items-center justify-start gap-2', className)}>
        <div className='flex items-center justify-center'>
          <input
            type='checkbox'
            // value={isChecked} // <--- apparently you don't need value in a checkbox
            checked={!!isChecked}
            onChange={setIsChecked}
            disabled={disabled}
            aria-hidden='true'
            tabIndex={-1}
            className='size-0 opacity-0 pointer-events-none'
            data-test-id={`${testId}Checkbox`}
          />

          <div className='flex justify-center items-center size-6 rounded-md border border-black group-has-[input:checked]:bg-blue-400 transition-all duration-500'>
            <CheckIcon className='fill-white opacity-0 group-has-[input:checked]:opacity-100 transition-all duration-200' />
          </div>
        </div>

        <div>{label}</div>
      </label>
    </button>
  );
}
