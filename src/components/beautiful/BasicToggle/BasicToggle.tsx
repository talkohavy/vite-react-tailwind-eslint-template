import clsx from 'clsx';
import styles from './BasicToggle.module.css';

type BasicToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function BasicToggle(props: BasicToggleProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.basicToggleWrapper, className)}>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={setIsChecked}
        disabled={disabled}
        className={styles.checkbox}
      />

      <span className={styles.roundBall} />
    </label>
  );
}
