export function getTextColor(percent: number): string {
  if (percent >= 80) return 'text-red-400';

  if (percent >= 60) return 'text-yellow-400';

  return 'text-emerald-400';
}
