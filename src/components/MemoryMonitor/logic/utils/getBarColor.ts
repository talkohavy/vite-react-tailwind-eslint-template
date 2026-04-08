export function getBarColor(percent: number): string {
  if (percent >= 80) return 'bg-red-500';

  if (percent >= 60) return 'bg-yellow-400';

  return 'bg-emerald-400';
}
