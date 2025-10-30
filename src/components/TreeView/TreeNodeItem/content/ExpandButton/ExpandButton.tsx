import RightArrow from '../../../../svgs/RightArrow';
import styles from './ExpandButton.module.scss';

type ExpandButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  className?: string;
};

export default function ExpandButton(props: ExpandButtonProps) {
  const { onClick, disabled, className } = props;

  return (
    <button type='button' onClick={onClick} disabled={disabled} className={className}>
      <RightArrow className={styles.btnArrow} />
    </button>
  );
}
