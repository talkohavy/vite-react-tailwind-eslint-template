import type { PropsWithChildren } from 'react';
import styles from './ProgressBarTrack.module.scss';

type ProgressBarTrackProps = PropsWithChildren;

export default function ProgressBarTrack(props: ProgressBarTrackProps) {
  const { children } = props;

  return <div className={styles.progressBarTrack}>{children}</div>;
}
