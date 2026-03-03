export type WorkerAction = { type: 'LOG'; payload: { message: string } } | { type: 'SUM'; payload: { start: number } };

export type WorkerResponse =
  | { type: 'LOG'; payload: string }
  | { type: 'SUM'; payload: number }
  | { type: 'ERROR'; payload: string };

addEventListener('message', (event: MessageEvent<WorkerAction>) => {
  const { type, payload } = event.data;

  try {
    if (type === 'SUM') {
      const result = sum(payload.start);
      return postMessage({ type: 'SUM', payload: result });
    }

    if (type === 'LOG') return postMessage({ type: 'LOG', payload: { message: `${payload.message} in worker` } });

    throw new Error(`Unknown action type: ${type}`);
  } catch (error: any) {
    postMessage({ type: 'ERROR', payload: error.message });
  }
});

export function sum(start: number): number {
  let result = start;
  for (let i = start; i < 10000000000; i++) {
    result += i;
  }

  console.log('result is:', result);

  return result;
}
