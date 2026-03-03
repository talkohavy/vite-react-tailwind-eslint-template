export function getInitialTabValue(): string {
  const pathParts = window.location.pathname.split('/');

  const outletIndex = pathParts.indexOf('progressive-web-app'); // <--- the slug before the tab names

  if (outletIndex !== -1 && pathParts.length > outletIndex + 1) {
    return pathParts[outletIndex + 1]!;
  }

  return '';
}
