import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { getInitialTabValue } from './utils/getInitialTabValue';

export function useWebRtcPageLogic() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  useEffect(() => {
    setCurrentTabValue(getInitialTabValue());
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);
    const targetPath = `${BASE_URL}/webrtc/${tabValue}`.replace(/\/+$/, '') || `${BASE_URL}/webrtc`;
    navigate(targetPath);
  }

  return { currentTabValue, handleTabChange };
}
