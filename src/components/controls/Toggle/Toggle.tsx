import clsx from 'clsx';
import styles from './Toggle.module.scss';

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export default function Toggle(props: ToggleProps) {
  const { isChecked, setIsChecked, disabled, label, className } = props;

  return (
    <button type='button' role='switch' aria-checked={isChecked ? 'true' : 'false'}>
      <label className={clsx(styles.label, className)}>
        <div className={styles.checkboxInputAndFakeCheckMark}>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={setIsChecked}
            disabled={disabled}
            aria-hidden='true'
            tabIndex={-1}
            className={styles.input}
          />

          <span className={styles.fakeToggleHolder}>
            <div className={styles.toggleCheckMark} />
          </span>
        </div>

        {label && <div>{label}</div>}
      </label>
    </button>
  );
}
