import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioTabs';
import { pageName } from './logic/constants';
import { getInitialTabValue } from './logic/utils/getInitialValue';

const Tabs = {
  StaticTree: 'static-tree',
  DynamicTree: 'dynamic-tree',
  CustomRendering: 'custom-rendering',
  RefControl: 'ref-control',
  Playground: 'playground',
} as const;

const tabOptions = [
  {
    value: Tabs.StaticTree,
    label: 'Static Tree',
  },
  {
    value: Tabs.DynamicTree,
    label: 'Dynamic Tree',
  },
  {
    value: Tabs.CustomRendering,
    label: 'Custom Rendering',
  },
  {
    value: Tabs.RefControl,
    label: 'Ref Control',
  },
  {
    value: Tabs.Playground,
    label: 'Playground',
  },
];

export default function TreeViewDemo() {
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

    const targetPath = `${BASE_URL}/${pageName}/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      <div className='px-6 pt-6'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>TreeView Component Demo</h1>
          <p className='text-gray-600 dark:text-gray-400'>
            A flexible tree view component supporting both static and dynamic configurations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-600'>
          <RadioTabs
            value={currentTabValue}
            setValue={handleTabChange}
            options={tabOptions}
            className='flex space-x-1 mb-4'
          />
        </div>
      </div>

      <div className='size-full'>
        <Outlet />
      </div>
    </div>
  );
}
