import { BASE_URL } from '../../../../common/constants';
import { pageName } from '../constants';

export function getInitialTabValue(): string {
  const pathname = window.location.pathname;
  const basePagePath = `${BASE_URL}/${pageName}`;

  // Extract tab value from URL path
  if (pathname.startsWith(basePagePath)) {
    const tabValue = pathname.replace(`${basePagePath}/`, '').replace(`${basePagePath}`, '');
    return tabValue || 'static-tree';
  }

  return 'static-tree';
}
