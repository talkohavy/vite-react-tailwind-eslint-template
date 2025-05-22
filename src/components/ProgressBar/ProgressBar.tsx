import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  /**
   * A number in range between 0 - 100.
   */
  completed: number;
  className?: string;
};

export default function ProgressBar(props: ProgressBarProps) {
  const { completed } = props;

  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${completed}%` }} />
      </div>
      <div className={styles.progressText}>{Math.round(completed)}% complete</div>
    </div>
  );
}
