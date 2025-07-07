import { Outlet, useNavigate, useLocation } from 'react-router';
import type { RadioOption } from '../../components/controls/RadioGroup/types';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs/RadioTabs';

const tabOptions: Array<RadioOption> = [
  { value: 'overview', label: 'Overview' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'settings', label: 'Settings' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current tab from the URL path
  const currentPath = location.pathname;
  const basePath = `${BASE_URL}/`;
  const relativePath = currentPath.replace(basePath, '');

  const currentTab = relativePath === 'analytics' ? 'analytics' : relativePath === 'settings' ? 'settings' : 'overview';

  function handleTabChange(tabValue: string) {
    const targetPath = tabValue === 'overview' ? basePath : `${basePath}${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full overflow-auto'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200 dark:border-gray-600 px-6 pt-6'>
        <RadioTabs value={currentTab} setValue={handleTabChange} options={tabOptions} className='flex space-x-1 mb-4' />
      </div>

      {/* Tab Content - Outlet renders the matched child route */}
      <div className='size-full'>
        <Outlet />
      </div>
    </div>
  );
}
