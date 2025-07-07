import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs/RadioTabs';

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

  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/home/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full overflow-auto'>
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
    </div>
  );
}

function getInitialTabValue(): string {
  const pathParts = window.location.pathname.split('/');
  // Find the index of 'home' in the path, then get the next segment as the tab
  const homeIndex = pathParts.findIndex((part) => part === 'home');
  if (homeIndex !== -1 && pathParts.length > homeIndex + 1) {
    return pathParts[homeIndex + 1]!;
  }
  return '';
}
