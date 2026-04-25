import RadioGroup from '../content/RadioGroup';
import SingleRadioDot from './SingleRadioDot';
import type { RadioOption } from '../types';

type RadioDotsProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
};

/**
 * @description
 * RadioDots uses RadioGroup & SingleRadioDot as ChildItem.
 */
export default function RadioDots<T>(props: RadioDotsProps<T>) {
  return <RadioGroup {...props} ChildItem={SingleRadioDot} />;
}
