import styles from './ValueOptionItem.module.scss';

type ValueOptionItemProps = {
  keyName: string;
  value: string;
};

export default function ValueOptionItem(props: ValueOptionItemProps) {
  const { keyName, value } = props;

  return (
    <div className={styles.valueOptionItem}>
      <div className={styles.key}>{keyName}:</div>
      <div>{value}</div>
    </div>
  );
}
