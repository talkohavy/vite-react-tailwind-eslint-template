import RightArrow from '../../../../svgs/RightArrow';
import styles from './ExpandButton.module.scss';

type ExpandButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  className?: string;
  testId?: string;
};

export default function ExpandButton(props: ExpandButtonProps) {
  const { onClick, disabled, className, testId = '' } = props;

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      data-expand-button=''
      className={className}
      data-test-id={`${testId}-expand-button`}
    >
      <RightArrow className={styles.btnArrow} />
    </button>
  );
}
