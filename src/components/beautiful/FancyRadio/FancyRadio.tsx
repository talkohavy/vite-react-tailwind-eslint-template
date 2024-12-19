import clsx from 'clsx';
import styles from './FancyRadio.module.css';

type FancyRadioProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
};

export default function FancyRadio(props: FancyRadioProps) {
  const { isChecked, setIsChecked, disabled } = props;

  return (
    <label className={styles.switchButton}>
      <div className={styles.switchInnerBg}>
        <input type='checkbox' checked={!!isChecked} onChange={setIsChecked} disabled={disabled} />

        <div className={styles.blackRoundToggleTrack}>
          <div className={styles.blackRoundToggle} />
        </div>

        <div className={clsx(styles.statusIndicatorStyle, styles.statusOn)} />
        <div className={clsx(styles.statusIndicatorStyle, styles.statusOff)} />
      </div>
    </label>
  );
}
