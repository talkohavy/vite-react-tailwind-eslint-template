import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioTabs';
import { getInitialTabValue } from '../OutletTabsPage/logic/utils/getInitialValue';
import IframeTester from './content/IframeTester';

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

export default function IFramePage() {
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

      {/* Overview, Analytics, and Settings tabs - Navigation within the host*/}
      <div className='size-full'>
        <Outlet />
      </div>

      <div className='h-225 shrink-0'>
        <IframeTester />
      </div>
    </div>
  );
}
