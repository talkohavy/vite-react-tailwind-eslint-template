import styles from './Realism.module.css';

type RealismProps = {
  isShiny?: boolean;
  showBorder?: boolean;
};

export default function Realism(props: RealismProps) {
  const { isShiny, showBorder } = props;
  return (
    <button type='button' className={styles.button} style={{ background: showBorder ? 'white' : undefined }}>
      <div className={styles.blob1} />

      {isShiny && <div className={styles.blob1} />}

      <div className={styles.inner}>Realism</div>
    </button>
  );
}
