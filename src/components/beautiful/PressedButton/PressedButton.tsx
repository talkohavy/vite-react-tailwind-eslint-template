import clsx from 'clsx';
import styles from './PressedButton.module.scss';

type PressedButtonProps = {
  isChecked: boolean;
  setIsChecked: () => void;
  className?: string;
};

export default function PressedButton(props: PressedButtonProps) {
  const { isChecked, setIsChecked, className } = props;

  return (
    <button
      type='button'
      onClick={setIsChecked}
      className={clsx(styles.button, isChecked && styles.buttonChecked, className)}
    >
      PressedButton
    </button>
  );
}
