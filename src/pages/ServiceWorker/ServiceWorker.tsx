import { type ReactNode, useState } from 'react';
import type { RadioOption } from '../../components/controls/RadioGroup/types';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs';
import CacheAssetTab from './tabs/CacheAssetTab';
import CacheContentTab from './tabs/CacheContentTab';
import FullExampleTab from './tabs/FullExampleTab';
import RegisterServiceWorkerTab from './tabs/RegisterServiceWorkerTab';

const contentTabs: Array<RadioOption<() => ReactNode>> = [
  { value: 0, label: 'Register', item: RegisterServiceWorkerTab },
  { value: 1, label: 'Cache Asset', item: CacheAssetTab },
  { value: 2, label: 'Cache Content', item: CacheContentTab },
  { value: 3, label: 'Full Example', item: FullExampleTab },
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
