export function extractTabValueFromPathname(pageSlug: string): string {
  const pathParts = window.location.pathname.split('/');

  // Find the index of pageSlug in the path, then get the next segment as the tab
  const outletIndex = pathParts.indexOf(pageSlug);

  if (outletIndex !== -1 && pathParts.length > outletIndex + 1) {
    return pathParts[outletIndex + 1]!;
  }

  return '';
}
