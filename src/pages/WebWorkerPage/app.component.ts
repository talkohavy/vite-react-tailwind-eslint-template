import type { WorkerResponse } from './app.worker';

export class AppComponent {
  webWorker = new Worker(new URL('./app.worker.ts', import.meta.url), {
    type: 'module',
  });
  result = 0;

  startHeavyCalculation(): void {
    this.webWorker.postMessage({ type: 'LOG', payload: { message: 'Started heavy calculation' } });
    this.webWorker.postMessage({ type: 'SUM', payload: { start: 0 } });
  }

  checkIfFrozen(): void {
    console.log('I am not frozen');
  }

  ngOnInit() {
    this.webWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, payload } = event.data;

      if (type === 'SUM') {
        console.log('Result:', payload);
        this.result = payload;
        return;
      }

      if (type === 'LOG') {
        console.log('Message:', payload);
        return;
      }

      if (type === 'ERROR') {
        console.error('Error:', payload);
        return;
      }
    };
  }
}
