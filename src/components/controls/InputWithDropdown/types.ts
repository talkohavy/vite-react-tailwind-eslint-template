import type { ReactNode } from 'react';

export type Option = {
  value: string | number;
  label: string | ReactNode | (() => ReactNode);
  disabled?: boolean;
  [extraKey: string]: any;
};

export type OptionGroup = {
  groupLabel: string | ReactNode | (() => ReactNode);
  items: Option[];
};

// @ark-ui/react type
type OpenChangeReason =
  | 'input-click'
  | 'trigger-click'
  | 'script'
  | 'arrow-key'
  | 'input-change'
  | 'interact-outside'
  | 'escape-key'
  | 'item-select'
  | 'clear-trigger';

// @ark-ui/react type
export interface OpenChangeDetails {
  open: boolean;
  reason?: OpenChangeReason | undefined;
}
