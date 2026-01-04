import { type ReactNode, useState } from 'react';
import type { RadioOption } from '../../components/controls/RadioGroup';
import RadioTabs from '../../components/controls/RadioTabs';
import MockDataTab from './tabs/MockDataTab';
import ServerDataTab from './tabs/ServerDataTab';

const contentTabs: Array<RadioOption<() => ReactNode>> = [
  { value: 0, label: 'Mock Data', item: MockDataTab },
  { value: 1, label: 'Server Data', item: ServerDataTab },
];

export default function TableDemoPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const TabContent = contentTabs[selectedTabIndex]!.item!;

  return (
    <div className='flex flex-col gap-8 size-full p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Table Demo</h1>
      </div>

      <RadioTabs
        value={selectedTabIndex}
        setValue={setSelectedTabIndex}
        options={contentTabs}
        className='flex gap-px overflow-auto shrink-0'
      />

      <div className='flex-1 min-h-0 overflow-auto'>
        <TabContent />
      </div>
    </div>
  );
}
