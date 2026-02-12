export function toSearchParams(params: Record<any, any>): URLSearchParams {
  const entries = (Object.entries(params) as [keyof Record<any, any>, any][])
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => [key, String(value)] as [string, string]);

  return new URLSearchParams(entries);
}
