export function getInitialTabValue(): string {
  const pathParts = window.location.pathname.split('/');
  // Find the index of 'home' in the path, then get the next segment as the tab
  const homeIndex = pathParts.findIndex((part) => part === 'home');
  if (homeIndex !== -1 && pathParts.length > homeIndex + 1) {
    return pathParts[homeIndex + 1]!;
  }

  return '';
}
