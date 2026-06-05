import styles from './CloseButton.module.scss';

type CloseButtonProps = {
  onClick?: () => void;
};

export default function CloseButton(props: CloseButtonProps) {
  const { onClick } = props;

  return (
    <button type='button' onClick={onClick} className={styles.closeButton}>
      X
    </button>
  );
}
