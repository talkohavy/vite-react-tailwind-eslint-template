import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './CheckboxLogic.module.scss';

export type CheckboxLogicProps = PropsWithChildren<{
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
}>;

export default function CheckboxLogic(props: CheckboxLogicProps) {
  const { children, isChecked, setIsChecked, disabled, label, className, testId = '' } = props;

  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={isChecked ? 'true' : 'false'}
      data-test-id={`${testId}CheckboxButton`}
    >
      <label className={clsx(styles.checkboxLabel, className)}>
        <div className={styles.checkboxInputAndFakeCheckMark}>
          <input
            type='checkbox'
            // value={isChecked} // <--- apparently you don't need value in a checkbox
            checked={!!isChecked}
            onChange={setIsChecked}
            disabled={disabled}
            aria-hidden='true'
            tabIndex={-1}
            className={styles.checkboxInput}
            data-test-id={`${testId}Checkbox`}
          />

          {children}
        </div>

        {label && <div>{label}</div>}
      </label>
    </button>
  );
}
