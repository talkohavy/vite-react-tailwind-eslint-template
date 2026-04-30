import type { ReactNode } from 'react';

export type _RadioGroupProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  ChildItem: (props: ChildItemProps) => ReactNode;
  className?: string;
  childClassName?: string;
};

export type RadioButtonProps<T> = Omit<_RadioGroupProps<T>, 'ChildItem'>;

type RadioOptionBase = {
  value: number | string;
  label: string;
  disabled?: boolean;
};

export type RadioOption<T = any> = RadioOptionBase & {
  item?: T;
};

export type RadioOptionWithItem<T = any> = Required<RadioOption<T>>;

export type ChildItemProps<T = any> = {
  /**
   * Must be a primitive value
   */
  value: T;
  label: string;
  isChecked?: boolean;
  className?: string;
};
