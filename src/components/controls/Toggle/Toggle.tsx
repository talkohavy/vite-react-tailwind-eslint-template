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
    <button type='button' role='switch' aria-checked={isChecked ? 'true' : 'false'}>
      <label className={clsx(styles.switch, className)}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={setIsChecked}
          disabled={disabled}
          aria-hidden='true'
          tabIndex={-1}
        />

        <span className={styles.radioButtonBg}>
          <div className={styles.slider} />
        </span>
      </label>
    </button>
  );
}
