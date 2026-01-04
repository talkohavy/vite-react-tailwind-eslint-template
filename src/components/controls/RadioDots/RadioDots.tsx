import RadioGroup, { type RadioOption } from '../RadioGroupV2';
import SingleRadioDot from './SingleRadioDot';

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
