import RadioGroup from '../content/RadioGroup';
import FakeRadioTab from './SingleRadioTab';
import type { RadioOption } from '../types';

type RadioTabsProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
};

export default function RadioTabs<T>(props: RadioTabsProps<T>) {
  return <RadioGroup {...props} ChildItem={FakeRadioTab} />;
}
