export function formatDate(timestamp: string) {
  const date = new Date(Number(timestamp));

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
