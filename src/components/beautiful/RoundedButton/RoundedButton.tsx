import styles from './RoundedButton.module.css';

type RoundedButtonProps = {
  onClick: () => void;
};

export default function RoundedButton(props: RoundedButtonProps) {
  const { onClick } = props;

  return (
    <button type='button' onClick={onClick} className={styles.btn}>
      <span className={styles.btnTextOne}>Hover me</span>
      <span className={styles.btnTextTwo}>Great!</span>
    </button>
  );
}
