import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
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

export default function ProgressiveWebAppPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  useEffect(() => {
    const newTabValue = getInitialTabValue();
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/progressive-web-app/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='flex flex-col size-full p-4'>
      <RadioTabs value={currentTabValue} setValue={handleTabChange} options={tabOptions} className='flex space-x-1' />

      <div className='size-full'>
        <Outlet />
      </div>
    </div>
  );
}
