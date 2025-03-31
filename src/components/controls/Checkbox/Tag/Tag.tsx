import CheckboxLogic from '../CheckboxLogic';
import styles from './Tag.module.scss';

export type TagProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
};

export default function Tag(props: TagProps) {
  return (
    <CheckboxLogic {...props} label=''>
      <div className={styles.tag}>
        <div>{props.label}</div>
      </div>
    </CheckboxLogic>
  );
}
