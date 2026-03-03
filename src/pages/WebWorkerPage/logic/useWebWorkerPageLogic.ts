import { useEffect, useRef, useState } from 'react';
import { Actions, heavyCalculation, type WorkerResponse } from '../app.worker';
import { formatLogPayload } from './utils/formatLogPayload';

export function useWebWorkerPageLogic() {
  const webWorker = useRef<Worker>(new Worker(new URL('../app.worker.ts', import.meta.url), { type: 'module' }));
  const result = useRef(0);
  const [logEntries, setLogEntries] = useState<string[]>([]);

  const addLog = (entry: string) => {
    setLogEntries((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${entry}`]);
  };

  const startHeavyCalculation = () => {
    addLog('Sending heavy calculation to worker...');

    webWorker.current.postMessage({
      type: Actions.Log,
      payload: { message: 'Started heavy calculation' },
    });

    webWorker.current.postMessage({
      type: Actions.Sum,
      payload: { start: 0 },
    });
  };

  const startHeavyCalculationInMainThread = () => {
    addLog('Sending heavy calculation to main thread...');

    const result = heavyCalculation();

    addLog(`Main thread result: ${result}`);
  };

  const checkIfFrozen = () => {
    addLog('Main thread responded — not frozen');
  };

  const clearLog = () => {
    setLogEntries([]);
  };

  useEffect(() => {
    webWorker.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, payload } = event.data;

      if (type === Actions.Sum) {
        result.current = payload;
        setLogEntries((prev) => [...prev, `${new Date().toLocaleTimeString()} — Worker result: ${payload}`]);
        return;
      }

      if (type === Actions.Log) {
        setLogEntries((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${formatLogPayload(payload)}`]);
        return;
      }

      if (type === Actions.Error) {
        setLogEntries((prev) => [...prev, `${new Date().toLocaleTimeString()} — Error: ${payload}`]);
        return;
      }
    };
  }, []);

  return {
    startHeavyCalculation,
    startHeavyCalculationInMainThread,
    checkIfFrozen,
    clearLog,
    logEntries,
  };
}
