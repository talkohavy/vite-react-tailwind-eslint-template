import type { ReactNode } from 'react';

export type SelectOption = {
  value: string | number;
  label: ReactNode;
  isDisabled?: boolean;
  [extraKey: string]: any;
};
