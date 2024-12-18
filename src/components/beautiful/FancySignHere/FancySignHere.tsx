import clsx from 'clsx';
import styles from './FancySignHere.module.css';

type FancySignHereProps = {
  value: string;
  setValue: (value: any) => void;
  className?: string;
};

export default function FancySignHere(props: FancySignHereProps) {
  const { value, setValue, className } = props;

  return (
    <div className={clsx(styles.inputWrapper, className)}>
      <input type='text' value={value} onChange={(e) => setValue(e.target.value)} className={styles.input} required />
      <div className={styles.label}>Enter Text</div>
      <div className={styles.underline} />
    </div>
  );
}
