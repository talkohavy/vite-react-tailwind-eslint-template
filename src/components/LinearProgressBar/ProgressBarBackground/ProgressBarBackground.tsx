import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './ProgressBarBackground.module.scss';

type ProgressBarBackgroundProps = PropsWithChildren<{
  className?: string;
}>;

export default function ProgressBarBackground(props: ProgressBarBackgroundProps) {
  const { children, className } = props;

  return <div className={clsx(styles.progressBarBackground, className)}>{children}</div>;
}
