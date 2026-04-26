import type { SelectOption } from '@src/components/controls/Select/types';

const opt = Array.from(Array(40).keys()).map((_, index) => ({ value: index || 'a', label: index.toString() }));

export const selectDemoOptions: Array<SelectOption> = [
  ...opt,
  { value: 997, label: 'Apples' },
  { value: 998, label: 'Bananas', disabled: true },
  { value: 999, label: 'Oranges' },
];
