import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '../../common/constants';
import RadioTabs from '../../components/controls/RadioGroup/RadioTabs';
import { pageName } from './logic/constants';
import { getInitialTabValue } from './logic/utils/getInitialValue';

const Tabs = {
  Lexer: 'lexer',
  TokenStream: 'token-stream',
  QueryParser: 'query-parser',
  ContextAnalyzer: 'context-analyzer',
  QueryLanguage: 'query-language',
} as const;

const tabOptions = [
  {
    value: Tabs.Lexer,
    label: 'Lexer',
  },
  {
    value: Tabs.TokenStream,
    label: 'Token Stream',
  },
  {
    value: Tabs.QueryParser,
    label: 'Query Parser',
  },
  {
    value: Tabs.QueryLanguage,
    label: 'Query Language',
  },
];

export default function QueryPage() {
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
