import clsx from 'clsx';
import styles from './Toggle.module.scss';

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function Toggle(props: ToggleProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <button type='button' className={clsx(styles.toggle, className)} onClick={setIsChecked}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />

      <div className={styles.toggleMark} />
    </button>
  );
}
