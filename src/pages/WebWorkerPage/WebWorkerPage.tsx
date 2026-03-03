import Button from '../../components/controls/Button';
import { sum } from './app.worker';
import { useWebWorkerPageLogic } from './logic/useWebWorkerPageLogic';

export default function WebWorker() {
  const { startHeavyCalculation, checkIfFrozen } = useWebWorkerPageLogic();

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Web Worker Tutorial</div>

      <div className='flex flex-col md:flex-row justify-start items-start gap-4 '>
        <Button onClick={startHeavyCalculation}>Start Heavy Calculation</Button>

        <Button onClick={() => sum(0)}>Block main thread with Heavy Calculation</Button>

        <Button onClick={checkIfFrozen} className='bg-green-500 hover:bg-green-600 active:bg-green-500'>
          Check if frozen
        </Button>
      </div>
    </div>
  );
}
