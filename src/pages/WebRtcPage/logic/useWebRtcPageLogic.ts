import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BASE_URL } from '@src/common/constants';
import { getInitialTabValue } from './utils/getInitialTabValue';

export function useWebRtcPageLogic() {
  const history = useHistory();
  const location = useLocation();
  const [currentTabValue, setCurrentTabValue] = useState(getInitialTabValue);

  useEffect(() => {
    setCurrentTabValue(getInitialTabValue());
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);
    const targetPath = `${BASE_URL}/webrtc/${tabValue}`.replace(/\/+$/, '') || `${BASE_URL}/webrtc`;
    history.push(targetPath);
  }

  return { currentTabValue, handleTabChange };
}
