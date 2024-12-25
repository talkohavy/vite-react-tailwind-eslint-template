import clsx from 'clsx';
import styles from './FancyRadio.module.css';

type FancyRadioProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function FancyRadio(props: FancyRadioProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.fancyRadio, className)}>
      <div className={styles.fancyRadioInnerStyle}>
        <input type='checkbox' checked={!!isChecked} onChange={setIsChecked} disabled={disabled} />

        <div className={styles.slider} />

        <div className={clsx(styles.statusIndicatorStyle, styles.statusOn)} />
        <div className={clsx(styles.statusIndicatorStyle, styles.statusOff)} />
      </div>
    </label>
  );
}
