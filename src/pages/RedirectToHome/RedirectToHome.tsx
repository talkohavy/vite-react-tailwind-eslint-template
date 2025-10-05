import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../common/constants';

export default function RedirectToHome() {
  const navigateTo = useNavigate();

  useEffect(() => {
    navigateTo(`${BASE_URL}/home`, { replace: true });
  }, [navigateTo]);

  return null;
}
