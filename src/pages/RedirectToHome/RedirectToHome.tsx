import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../common/constants';

export default function RedirectToHome() {
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log('hi');
    navigateTo(BASE_URL);
  }, [navigateTo]);

  return null;
}