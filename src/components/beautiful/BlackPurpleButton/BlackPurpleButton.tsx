import clsx from 'clsx';
import styles from './BlackPurpleButton.module.scss';

type BlackPurpleButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function BlackPurpleButton(props: BlackPurpleButtonProps) {
  const { onClick, className } = props;

  return (
    <button type='button' onClick={onClick} className={clsx(styles.button, className)}>
      <div className={styles.blurryBackground} />

      <div className={styles.innerButton}>Hover me</div>
    </button>
  );
}
