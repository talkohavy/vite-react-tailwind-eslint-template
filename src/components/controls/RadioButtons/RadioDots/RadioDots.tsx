import RadioGroup from '../content/RadioGroup';
import SingleRadioDot from './SingleRadioDot';
import type { RadioButtonProps } from '../types';

export default function RadioDots<T>(props: RadioButtonProps<T>) {
  return <RadioGroup {...props} ChildItem={SingleRadioDot} />;
}
