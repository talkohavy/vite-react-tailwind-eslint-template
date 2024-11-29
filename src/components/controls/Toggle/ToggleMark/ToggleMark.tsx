import clsx from 'clsx';
import styles from './ToggleMark.module.scss';

type ToggleMarkProps = {
  isChecked: boolean;
  className?: string;
};

export default function ToggleMark(props: ToggleMarkProps) {
  const { isChecked, className } = props;

  return (
    <div
      className={clsx(styles.toggleMark, isChecked ? styles.toggleMarkChecked : styles.toggleMarkUnchecked, className)}
    />
  );
}
