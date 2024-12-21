import clsx from 'clsx';
import styles from './BasicToggleV2.module.css';

type BasicToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function BasicToggle(props: BasicToggleProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.toggleSwitch, className)}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />
      <div className={styles.toggleSwitchBackground}>
        <div className={styles.toggleSwitchHandle}></div>
      </div>
    </label>
  );
}
