import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const base = 'block cursor-pointer rounded-md p-3';
const lightModeNormal = 'bg-blue-500 text-white';
const lightModeFocused = 'focus:rounded-lg';
const lightModeHovered = 'hover:rounded-lg hover:bg-blue-600';
const lightModeActive = 'active:bg-blue-500 active:rounded-xl';
const lightModeDisabled = 'disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-default disabled:rounded-md';

type ButtonProps = PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}>;
// & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { children, onClick, disabled, className, ...rest } = props;

  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge(
        base,
        lightModeNormal,
        lightModeFocused,
        lightModeHovered,
        lightModeActive,
        lightModeDisabled,
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
