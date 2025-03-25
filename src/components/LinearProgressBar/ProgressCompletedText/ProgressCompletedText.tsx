import styles from './ProgressCompletedText.module.scss';

type ProgressCompletedTextProps = {
  /**
   * A number in range between 0 - 100.
   */
  completed: number;
};

export default function ProgressCompletedText(props: ProgressCompletedTextProps) {
  const { completed } = props;

  return <span className={styles.progressCompletedText}>{`${Math.floor(completed)}%`}</span>;
}
