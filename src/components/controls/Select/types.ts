export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
  [extraKey: string]: any;
};
