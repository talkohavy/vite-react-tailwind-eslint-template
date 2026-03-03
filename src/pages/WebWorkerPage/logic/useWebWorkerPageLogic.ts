import { useEffect, useRef } from 'react';
import { Actions, type WorkerResponse } from '../app.worker';

export function useWebWorkerPageLogic() {
  const webWorker = useRef<Worker>(new Worker(new URL('./app.worker.ts', import.meta.url), { type: 'module' }));
  const result = useRef(0);

  const startHeavyCalculation = () => {
    webWorker.current.postMessage({
      type: Actions.Log,
      payload: { message: 'Started heavy calculation' },
    });

    webWorker.current.postMessage({
      type: Actions.Sum,
      payload: { start: 0 },
    });
  };

  const checkIfFrozen = () => {
    console.log('I am not frozen');
  };

  useEffect(() => {
    webWorker.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, payload } = event.data;

      if (type === Actions.Sum) {
        console.log('Result:', payload);
        result.current = payload;
        return;
      }

      if (type === Actions.Log) {
        console.log('Message:', payload);
        return;
      }

      if (type === Actions.Error) {
        console.error('Error:', payload);
        return;
      }
    };
  }, []);

  return { startHeavyCalculation, checkIfFrozen };
}
