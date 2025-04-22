import { type ReactNode, useState } from 'react';
import type { RadioOption } from '../../components/controls/RadioGroup/types';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs';
import RegisterServiceWorker from './tabs/RegisterServiceWorker';

const contentTabs: Array<RadioOption<() => ReactNode>> = [
  { value: 0, label: 'Register', item: RegisterServiceWorker },
  { value: 1, label: 'Example 2', item: RegisterServiceWorker },
  { value: 2, label: 'Example 3', item: RegisterServiceWorker },
  { value: 3, label: 'Example 4', item: RegisterServiceWorker },
];

export default function ServiceWorker() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const TabContent = contentTabs[selectedTabIndex]!.item!;

  return (
    <div className='flex flex-col gap-8 size-full p-4'>
      <RadioTabs
        value={selectedTabIndex}
        setValue={setSelectedTabIndex}
        options={contentTabs}
        className='flex gap-px'
      />

      <TabContent />
    </div>
  );
}
