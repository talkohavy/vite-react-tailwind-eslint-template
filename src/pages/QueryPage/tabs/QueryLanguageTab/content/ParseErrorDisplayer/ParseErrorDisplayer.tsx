import styles from './ParseErrorDisplayer.module.scss';
import type { Position } from 'create-query-language';

type DisplayedError = {
  message: string;
  position: Position;
};

type ParseErrorDisplayerProps = {
  errors: DisplayedError[];
};

export default function ParseErrorDisplayer(props: ParseErrorDisplayerProps) {
  const { errors } = props;

  return (
    <div className={styles.errorsList}>
      {errors.map((error, index) => (
        <div key={index} className={styles.errorItem}>
          Position {error.position.start + 1}-{error.position.end + 1}: {error.message}
        </div>
      ))}
    </div>
  );
}
