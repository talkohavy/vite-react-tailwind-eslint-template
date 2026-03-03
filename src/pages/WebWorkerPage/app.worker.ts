export const Actions = {
  Log: 'log',
  Sum: 'sum',
  Error: 'error',
} as const;

type LogAction = {
  type: typeof Actions.Log;
  payload: { message: string };
};

type SumAction = {
  type: typeof Actions.Sum;
  payload: { start: number };
};

export type WorkerAction = LogAction | SumAction;

export type WorkerResponse =
  | { type: typeof Actions.Log; payload: string }
  | { type: typeof Actions.Sum; payload: number }
  | { type: typeof Actions.Error; payload: string };

addEventListener('message', (event: MessageEvent<WorkerAction>) => {
  const { type, payload } = event.data;

  try {
    if (type === Actions.Sum) {
      const result = heavyCalculation();

      return postMessage({ type: Actions.Sum, payload: result });
    }

    if (type === Actions.Log) {
      return postMessage({
        type: Actions.Log,
        payload: {
          message: `${payload.message} in worker`,
        },
      });
    }

    throw new Error(`Unknown action type: ${type}`);
  } catch (error: any) {
    postMessage({ type: Actions.Error, payload: error.message });
  }
});

export function heavyCalculation(): number {
  let result = 0;

  for (let i = 0; i < 10000000000; i++) {
    result += i;
  }

  console.log('result is:', result);

  return result;
}
