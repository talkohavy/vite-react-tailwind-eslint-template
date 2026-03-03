import Button from '../../components/controls/Button';
import { useWebWorkerPageLogic } from './logic/useWebWorkerPageLogic';

export default function WebWorker() {
  const { startHeavyCalculation, startHeavyCalculationInMainThread, checkIfFrozen, logEntries, clearLog } =
    useWebWorkerPageLogic();

  return (
    <div className='size-full p-6 overflow-auto'>
      <h1 className='text-xl font-semibold mb-2'>Web Worker Tutorial</h1>

      <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl'>
        This page demonstrates running heavy work off the main thread with a Web Worker. When work runs in a worker, the
        UI stays responsive. When the same work runs on the main thread, the UI freezes until it finishes. The log below
        updates in real time so you can see when each step completes.
      </p>

      <div className='flex flex-col gap-4 mb-6'>
        <div className='flex flex-wrap gap-2 items-center'>
          <Button onClick={startHeavyCalculation}>Start heavy calculation (in worker)</Button>

          <span className='text-xs text-neutral-500'>
            Runs a long loop in a background thread. The UI stays responsive and new log lines appear as the worker
            reports back.
          </span>
        </div>

        <div className='flex flex-wrap gap-2 items-center'>
          <Button onClick={startHeavyCalculationInMainThread}>Start heavy calculation (in main thread)</Button>

          <span className='text-xs text-neutral-500'>
            Runs the same calculation on the main thread. The page will freeze for several seconds; you won't be able to
            click or scroll until it finishes. Use "Check if frozen" to confirm the UI is stuck.
          </span>
        </div>

        <div className='flex flex-wrap gap-2 items-center'>
          <Button onClick={checkIfFrozen} className='bg-green-500 hover:bg-green-600 active:bg-green-500'>
            Check if frozen
          </Button>
        </div>
      </div>

      <div className='border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Activity log</span>

          <Button onClick={clearLog} className='py-1! px-2! text-xs'>
            Clear
          </Button>
        </div>

        <div className='min-h-30 max-h-64 overflow-y-auto font-mono text-xs text-neutral-600 dark:text-neutral-400'>
          {logEntries.length === 0 ? (
            <span className='italic'>No activity yet. Use the buttons above to see messages here.</span>
          ) : (
            <ul className='list-none space-y-1'>
              {logEntries.map((entry, i) => (
                <li key={i}>{entry}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
