import clsx from 'clsx';
import styles from './FancySpinner.module.css';

type FancySpinnerProps = {
  className?: string;
};

export default function FancySpinner(props: FancySpinnerProps) {
  const { className } = props;

  return <div className={clsx(styles.spinner, className)} />;
}
