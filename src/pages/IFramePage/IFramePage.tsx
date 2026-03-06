import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioTabs';
import { getInitialTabValue } from '../OutletTabsPage/logic/utils/getInitialValue';
import IframeTester from './IframeTester';

const Tabs = {
  HostTab1: '',
  HostTab2: 'host-tab-2',
  HostTab3: 'host-tab-3',
} as const;

const tabOptions = [
  {
    value: Tabs.HostTab1,
    label: 'Host route 1',
  },
  {
    value: Tabs.HostTab2,
    label: 'Host route 2',
  },
  {
    value: Tabs.HostTab3,
    label: 'Host route 3',
  },
];

type IFramePageProps = { children?: ReactNode };

export default function IFramePage({ children }: IFramePageProps) {
  const history = useHistory();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  // Update currentTabValue when the URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTabValue = getInitialTabValue();
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/iframe/${tabValue}`;
    history.push(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 p-6 overflow-auto'>
      <div className='border-b border-gray-200 dark:border-gray-600'>
        <RadioTabs
          value={currentTabValue}
          setValue={handleTabChange}
          options={tabOptions}
          className='flex overflow-x-auto'
        />
      </div>

      {/* Overview, Analytics, and Settings tabs - Navigation within the host*/}
      <div className='size-full'>{children}</div>

      <div className='w-full h-225 shrink-0'>
        <IframeTester />
      </div>
    </div>
  );
}
