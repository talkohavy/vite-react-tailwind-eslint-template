import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioTabs';
import { getInitialTabValue } from './logic/utils/getInitialTabValue';

const Tabs = {
  Register: '',
  CacheAsset: 'cache-asset',
  CacheContent: 'cache-content',
  BackgroundSync: 'background-sync',
  FullExample: 'full-example',
} as const;

const tabOptions = [
  {
    value: Tabs.Register,
    label: 'Register',
  },
  {
    value: Tabs.CacheAsset,
    label: 'Cache Asset',
  },
  {
    value: Tabs.CacheContent,
    label: 'Cache Content',
  },
  {
    value: Tabs.BackgroundSync,
    label: 'Background Sync',
  },
  {
    value: Tabs.FullExample,
    label: 'Full Example',
  },
];

type ProgressiveWebAppPageProps = { children?: ReactNode };

export default function ProgressiveWebAppPage({ children }: ProgressiveWebAppPageProps) {
  const history = useHistory();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  useEffect(() => {
    const newTabValue = getInitialTabValue();
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/progressive-web-app/${tabValue}`;
    history.push(targetPath);
  }

  return (
    <div className='flex flex-col size-full p-4'>
      <RadioTabs
        value={currentTabValue}
        setValue={handleTabChange}
        options={tabOptions}
        className='flex overflow-auto'
      />

      <div className='size-full overflow-auto'>{children}</div>
    </div>
  );
}
