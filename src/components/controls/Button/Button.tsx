import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = PropsWithChildren<{
  onClick: () => void;
  className?: string;
}>;
// & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { children, onClick, className, ...rest } = props;

  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        'block cursor-pointer rounded-md hover:rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-500 active:rounded-xl focus:rounded-lg p-3',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
