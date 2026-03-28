import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import { extractTabValueFromPathname } from '../../common/utils/extractTabValueFromPathname';
import RadioTabs from '../../components/controls/RadioTabs';

const pageSlug = 'websocket';

const Tabs = {
  WebsocketHookConnection: '',
  WebsocketManagerConnection: 'websocket-manager',
} as const;

const tabOptions = [
  {
    value: Tabs.WebsocketHookConnection,
    label: 'Hook',
  },
  {
    value: Tabs.WebsocketManagerConnection,
    label: 'Manager',
  },
];

export default function WebSocketPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(() => extractTabValueFromPathname(pageSlug));

  // Update currentTabValue when the URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTabValue = extractTabValueFromPathname(pageSlug);
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/${pageSlug}/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      <div className='border-b border-gray-200 dark:border-gray-600 px-6 pt-6'>
        <RadioTabs
          value={currentTabValue}
          setValue={handleTabChange}
          options={tabOptions}
          className='flex space-x-1 mb-4'
        />
      </div>

      <div className='size-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}
