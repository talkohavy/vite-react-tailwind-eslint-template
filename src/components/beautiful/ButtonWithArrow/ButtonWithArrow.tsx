import styles from './ButtonWithArrow.module.css';

type ButtonWithArrowProps = {
  onClick: () => void;
};

export default function ButtonWithArrow(props: ButtonWithArrowProps) {
  const { onClick } = props;

  return (
    <button type='button' onClick={onClick} className={styles.btn}>
      Sign up
      <div className={styles.arrowWrapper}>
        <div className={styles.arrow} />
      </div>
    </button>
  );
}
