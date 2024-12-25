import clsx from 'clsx';
import styles from './FancyToggleButton.module.scss';

type ToggleButtonProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  size?: number;
  className?: string;
};

export default function FancyToggleButton(props: ToggleButtonProps) {
  const { isChecked, setIsChecked, size = 26, className = '' } = props;

  return (
    // @ts-ignore
    <label className={clsx(styles.fancyToggleButton, className)} style={{ '--size': `${size}px` }}>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={setIsChecked}
        className='absolute inset-0 z-50 cursor-pointer opacity-0'
      />

      <div className={styles.toggleSlider}>
        <div className={styles.tinyDot} />
      </div>
    </label>
  );
}
