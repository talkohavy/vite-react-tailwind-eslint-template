import styles from './ProgressBarThumb.module.scss';

type ProgressBarThumbProps = {
  /**
   * A number in range between 0 - 100.
   */
  completed: number;
};

export default function ProgressBarThumb(props: ProgressBarThumbProps) {
  const { completed } = props;

  return <div className={styles.progressBarThumb} style={{ width: `${Math.floor(completed)}%` }} />;
}
