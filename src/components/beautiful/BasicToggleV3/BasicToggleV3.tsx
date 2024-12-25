import clsx from 'clsx';
import styles from './BasicToggleV3.module.css';

type BasicToggleV3Props = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function BasicToggleV3(props: BasicToggleV3Props) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.switch, className)}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />
      <span className={styles.radioButtonBg}>
        <div className={styles.slider} />
      </span>
    </label>
  );
}
