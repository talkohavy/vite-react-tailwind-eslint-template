import clsx from 'clsx';
import type { ChildItemProps } from '../../types';

const singleDotBase =
  'relative flex justify-center items-center bg-neutral-500 size-5 cursor-pointer rounded-full border border-black shrink-0';
const singleDotInputChecked = 'group-has-[input:checked]/radioWrapper:bg-blue-500';
const singleDotInputFocused =
  'group-has-[input:focus:not(:checked)]/radioWrapper:bg-slate-300 group-has-[input:focus:not(:checked)]/radioWrapper:border-blue-400 group-has-[input:focus]/radioWrapper:ring-2 group-has-[input:focus]/radioWrapper:ring-blue-400 group-has-[input:focus]/radioWrapper:ring-offset-2';
const singleDotInputHovered = 'group-has-[input:hover:not(:disabled)]/radioWrapper:bg-blue-400';
const singleDotInputDisabled =
  'group-has-[input:disabled]/radioWrapper:bg-neutral-400 group-has-[input:disabled]/radioWrapper:opacity-40';

export default function SingleRadioDot(props: ChildItemProps) {
  const { label, className } = props;

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div
        className={clsx(
          singleDotBase,
          singleDotInputChecked,
          singleDotInputFocused,
          singleDotInputHovered,
          singleDotInputDisabled,
        )}
      >
        <div className='size-2.5 bg-white invisible transition-all duration-300 opacity-0 group-has-[input:checked]/radioWrapper:visible group-has-[input:checked]/radioWrapper:opacity-100 translate-x-half translate-y-half rounded-full' />
      </div>

      {label && (
        <span className='text-sm select-none group-has-[input:disabled]/radioWrapper:opacity-40 group-has-[input:checked]/radioWrapper:font-medium'>
          {label}
        </span>
      )}
    </div>
  );
}
