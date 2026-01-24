import { type ReactNode, useState } from 'react';
import RadioTabs from '../../components/controls/RadioTabs';
import BackgroundSyncTab from './tabs/BackgroundSyncTab';
import CacheAssetTab from './tabs/CacheAssetTab';
import CacheContentTab from './tabs/CacheContentTab';
import FullExampleTab from './tabs/FullExampleTab';
import RegisterServiceWorkerTab from './tabs/RegisterServiceWorkerTab';
import type { RadioOption } from '../../components/controls/RadioGroup';

const contentTabs: Array<RadioOption<() => ReactNode>> = [
  { value: 0, label: 'Register', item: RegisterServiceWorkerTab },
  { value: 1, label: 'Cache Asset', item: CacheAssetTab },
  { value: 2, label: 'Cache Content', item: CacheContentTab },
  { value: 3, label: 'Background Sync', item: BackgroundSyncTab },
  { value: 4, label: 'Full Example', item: FullExampleTab },
];

export default function ServiceWorkerPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const TabContent = contentTabs[selectedTabIndex]!.item!;

  return (
    <div className='flex flex-col gap-8 size-full p-4'>
      <RadioTabs
        value={selectedTabIndex}
        setValue={setSelectedTabIndex}
        options={contentTabs}
        className='flex gap-px overflow-auto shrink-0'
      />

      <TabContent />
    </div>
  );
}
