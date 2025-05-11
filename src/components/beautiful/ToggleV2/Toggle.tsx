import clsx from 'clsx';
import styles from './Toggle.module.css';

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function Toggle(props: ToggleProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.toggleSwitch, className)}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />

      <div className={styles.toggleSwitchBackground}>
        <div className={styles.toggleSwitchSlider} />
      </div>
    </label>
  );
}
