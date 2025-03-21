import type { PropsWithChildren } from 'react';
import { Item, ItemText, ItemIndicator } from '@radix-ui/react-select';
import clsx from 'clsx';
import CheckIcon from '../../../svgs/CheckIcon';
import styles from './SelectItem.module.scss';

type SelectItemProps = PropsWithChildren<{
  value: string | number;
  disabled?: boolean;
  className?: string;
}>;

export default function SelectItem(props: SelectItemProps) {
  const { value, disabled, children, className } = props;

  return (
    // Item expects the value type to be string, so we put `any`.
    <Item value={value as any} disabled={disabled} className={clsx(styles.selectItem, className)}>
      <ItemText>{children}</ItemText>
      <ItemIndicator className={styles.selectItemIndicator}>
        <CheckIcon />
      </ItemIndicator>
    </Item>
  );
}
