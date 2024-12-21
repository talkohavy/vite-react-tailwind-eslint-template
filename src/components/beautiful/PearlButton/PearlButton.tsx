import clsx from 'clsx';
import styles from './PearlButton.module.scss';

type PearlButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function PearlButton(props: PearlButtonProps) {
  const { onClick, className } = props;

  return (
    <button type='button' onClick={onClick} className={clsx(styles.button, className)}>
      <div className={styles.btnContent}>
        <span className={styles.starOutline}>✧</span>
        <span className={styles.starFull}>✦</span>
        Pearl Button
      </div>
    </button>
  );
}
