export function getInitialTabValue(): string {
  const pathParts = window.location.pathname.split('/');

  // Find the index of 'outlet' in the path, then get the next segment as the tab
  const outletIndex = pathParts.findIndex((part) => part === 'outlet');

  if (outletIndex !== -1 && pathParts.length > outletIndex + 1) {
    return pathParts[outletIndex + 1]!;
  }

  return '';
}
