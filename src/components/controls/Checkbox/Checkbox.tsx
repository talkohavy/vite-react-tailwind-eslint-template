import CheckIcon from '../../svgs/CheckIcon';
import styles from './Checkbox.module.scss';
import CheckboxLogic from './CheckboxLogic';

export type CheckboxProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
};

export default function Checkbox(props: CheckboxProps) {
  return (
    <CheckboxLogic {...props}>
      <div className={styles.checkboxHolder}>
        <CheckIcon className={styles.checkboxCheckMark} />
      </div>
    </CheckboxLogic>
  );
}
