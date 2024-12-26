import type { RadioOption } from '../types';
import RadioGroupWrapper from '../logic/RadioGroupWrapper';
import FakeRadioDot from './FakeRadioDot';

type RadioDotsProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
};

export default function RadioDots<T>(props: RadioDotsProps<T>) {
  return (
    <RadioGroupWrapper {...props}>
      <FakeRadioDot />
    </RadioGroupWrapper>
  );
}
