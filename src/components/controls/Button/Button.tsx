import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonProps = PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}>;

export default function Button(props: ButtonProps) {
  const { children, onClick, disabled, className, ...rest } = props;

  return (
    <button type='button' onClick={onClick} className={clsx(styles.button, className)} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
