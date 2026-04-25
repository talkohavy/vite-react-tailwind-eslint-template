type RadioOptionBase = {
  value: number | string;
  label: string;
  disabled?: boolean;
};

export type RadioOption<T = any> = RadioOptionBase & {
  item?: T;
};

export type RadioOptionWithItem<T = any> = RadioOptionBase & {
  item: T;
};

export type ChildItemProps<T = any> = {
  /**
   * Must be a primitive value
   */
  value: T;
  label: string;
  isChecked?: boolean;
};
