import RadioGroup from '../content/RadioGroup';
import FakeRadioTab from './SingleRadioTab';
import type { RadioButtonProps } from '../types';

export default function RadioTabs<T>(props: RadioButtonProps<T>) {
  return <RadioGroup {...props} ChildItem={FakeRadioTab} />;
}
