import { useEffect, useState } from 'react';
import { getMemorySnapshot } from './utils/getMemorySnapshot';
import type { MemorySnapshot } from '../types';

export type UseMemoryMonitorLogicProps = {
  /**
   * Polling interval in milliseconds.
   * @default 2000
   */
  intervalMs?: number;
};

export function useMemoryMonitorLogic(props: UseMemoryMonitorLogicProps) {
  const { intervalMs = 2000 } = props;

  const [snapshot, setSnapshot] = useState<MemorySnapshot | null>(getMemorySnapshot);

  const isSupported = 'memory' in performance;

  useEffect(() => {
    if (!isSupported) return;

    const id = setInterval(() => {
      setSnapshot(getMemorySnapshot());
    }, intervalMs);

    return () => clearInterval(id);
  }, [isSupported, intervalMs]);

  return { snapshot, isSupported };
}
