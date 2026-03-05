import { pageName } from '../constants';

export function getInitialTabValue(): string {
  const pathParts = window.location.pathname.split('/');

  const outletIndex = pathParts.findIndex((part) => part === pageName);

  if (outletIndex !== -1 && pathParts.length > outletIndex + 1) {
    return pathParts[outletIndex + 1]!;
  }

  return '';
}
