import clsx from 'clsx';
import styles from './LoadingTerminal.module.scss';

type LoadingTerminalProps = {
  className?: string;
};

export default function LoadingTerminal(props: LoadingTerminalProps) {
  const { className } = props;

  return (
    <div className={clsx(styles.terminalLoader, className)}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>Status</div>

        <div className={styles.terminalControls}>
          <div className={clsx(styles.control, styles.close)}></div>
          <div className={clsx(styles.control, styles.minimize)}></div>
          <div className={clsx(styles.control, styles.maximize)}></div>
        </div>
      </div>

      <div className={styles.terminalContent}>
        <div className={styles.text}>Loading...</div>
      </div>
    </div>
  );
}
