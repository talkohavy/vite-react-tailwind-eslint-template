import RadioGroup, { type RadioOption } from '../RadioGroupV2';
import FakeRadioTab from './SingleRadioTab';

type RadioTabsProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
};

export default function RadioTabs<T>(props: RadioTabsProps<T>) {
  return <RadioGroup {...props} ChildItem={FakeRadioTab} />;
}
