import { useEffect, useState } from 'react';

export function useRunningProgress() {
  const [progressBarValue, setProgressBarValue] = useState<number>(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < 80) {
        current += 1;
        setProgressBarValue(current);
      } else {
        clearInterval(interval);
        setTimeout(() => setProgressBarValue(100), 2000);
      }
    }, 50);
  }, []);

  return { progressBarValue };
}
