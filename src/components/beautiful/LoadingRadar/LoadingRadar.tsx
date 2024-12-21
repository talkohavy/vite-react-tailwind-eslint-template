import clsx from 'clsx';
import styles from './LoadingRadar.module.scss';

type LoadingRadarProps = {
  /**
   * You must give a size in the className.
   */
  className: string;
};

export default function LoadingRadar(props: LoadingRadarProps) {
  const { className } = props;

  return (
    <div className={clsx(styles.loader, className)}>
      <div className={styles.firstRing}></div>
      <div className={styles.secondRing}></div>
      <span className={styles.rotatingLine}>
        <div className={styles.greenLightBeam}>h</div>
      </span>
    </div>
  );
}
