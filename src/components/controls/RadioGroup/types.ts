export type RadioOption<T = any> = {
  value: number | string;
  label: string;
  disabled?: boolean;
  item?: T;
};

export type ChildItemProps<T = any> = {
  /**
   * Must be a primitive value
   */
  value: T;
  label: string;
  isChecked?: boolean;
};
