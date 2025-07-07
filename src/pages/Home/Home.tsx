import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs/RadioTabs';
import DisplayWithUseLocation from './content/DisplayWithUseLocation';
import DisplayWithWindowLocation from './content/DisplayWithWindowLocation';
import { getInitialTabValue } from './logic/utils/getInitialValue';
import IframeTestComponent from './my-iframe';

const Tabs = {
  Overview: '',
  Analytics: 'analytics',
  Settings: 'settings',
} as const;

const tabOptions = [
  {
    value: Tabs.Overview,
    label: 'Overview',
  },
  {
    value: Tabs.Analytics,
    label: 'Analytics',
  },
  {
    value: Tabs.Settings,
    label: 'Settings',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  // Update currentTabValue when the URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTabValue = getInitialTabValue();
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/home/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200 dark:border-gray-600 px-6 pt-6'>
        <RadioTabs
          value={currentTabValue}
          setValue={handleTabChange}
          options={tabOptions}
          className='flex space-x-1 mb-4'
        />
      </div>

      <div className='size-full'>
        <Outlet />
      </div>

      <div className='h-96 flex justify-between items-center gap-4 rounded-lg'>
        <DisplayWithWindowLocation />
        <DisplayWithUseLocation />
      </div>

      <div className='h-[900px] shrink-0'>
        <IframeTestComponent />
      </div>
    </div>
  );
}
