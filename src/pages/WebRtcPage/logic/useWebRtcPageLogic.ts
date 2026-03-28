import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import { pageSlug } from './constants';

export function useWebRtcPageLogic() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTabValue, setCurrentTabValue] = useState(() => extractTabValueFromPathname(pageSlug));

  useEffect(() => {
    setCurrentTabValue(extractTabValueFromPathname(pageSlug));
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);
    const targetPath = `${BASE_URL}/${pageSlug}/${tabValue}`.replace(/\/+$/, '') || `${BASE_URL}/${pageSlug}`;
    navigate(targetPath);
  }

  return { currentTabValue, handleTabChange };
}
