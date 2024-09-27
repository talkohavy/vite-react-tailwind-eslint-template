import clsx from 'clsx';
import styles from './Toggle.module.scss';
import ToggleMark from './ToggleMark';

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  className?: string;
  checkmarkClassName?: string;
};

export default function Toggle(props: ToggleProps) {
  const { isChecked, setIsChecked, className, checkmarkClassName } = props;

  return (
    <div className={clsx(styles.toggle, className)} onClick={setIsChecked}>
      <ToggleMark isChecked={isChecked} className={checkmarkClassName} />
    </div>
  );
}
