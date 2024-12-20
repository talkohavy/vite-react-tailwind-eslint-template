import clsx from 'clsx';
import styles from './NeonCheckboxBoom.module.scss';

type NeonCheckboxBoomProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function NeonCheckboxBoom(props: NeonCheckboxBoomProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.neonCheckbox, className)}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />

      <div className={styles.neonCheckboxFrame}>
        <div className={styles.neonCheckboxBox}>
          <div className={styles.neonCheckboxCheckContainer}>
            <svg viewBox='0 0 24 24' className={styles.neonCheckboxCheck}>
              <path d='M3,12.5l7,7L21,5'></path>
            </svg>
          </div>

          <div className={styles.neonCheckboxGlow}></div>
        </div>

        <div>
          <div className={styles.neonCheckboxParticles}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.neonCheckboxRings}>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
          </div>
          <div className={styles.neonCheckboxSparks}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </label>
  );
}
