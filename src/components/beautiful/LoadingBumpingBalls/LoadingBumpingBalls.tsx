import styles from './LoadingBumpingBalls.module.scss';

export default function LoadingBumpingBalls() {
  return (
    <div className={styles.loadingBumpingBalls}>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
      <div className={styles.ballShadow}></div>
      <div className={styles.ballShadow}></div>
      <div className={styles.ballShadow}></div>
    </div>
  );
}
