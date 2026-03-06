import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from '../../common/constants';

export default function RedirectToHome() {
  const history = useHistory();

  useEffect(() => {
    history.replace(`${BASE_URL}/home`);
  }, [history]);

  return null;
}
