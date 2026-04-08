import { toMB } from './toMB';
import type { MemorySnapshot } from '../../types';

export function getMemorySnapshot(): MemorySnapshot | null {
  if (!performance.memory) return null;

  const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;

  const usedMB = toMB(usedJSHeapSize);
  const limitMB = toMB(jsHeapSizeLimit);
  const totalMB = toMB(totalJSHeapSize);
  const usedPercent = Math.round((usedMB / limitMB) * 100);

  return { usedMB, totalMB, limitMB, usedPercent };
}
