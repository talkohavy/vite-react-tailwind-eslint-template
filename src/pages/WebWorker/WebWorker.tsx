import Button from '../../components/controls/Button';
import { AppComponent } from './app.component';
import { sum } from './app.worker';

const worker = new AppComponent();
worker.ngOnInit();

export default function WebWorker() {
  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Web Worker Tutorial</div>

      <div className='flex flex-col md:flex-row justify-start items-start gap-4 '>
        <Button onClick={() => worker.startHeavyCalculation()}>Start Heavy Calculation</Button>

        <Button onClick={() => sum(0)}>Block main thread with Heavy Calculation</Button>

        <Button onClick={() => worker.checkIfFrozen()} className='bg-green-500 hover:bg-green-600 active:bg-green-500'>
          Check if frozen
        </Button>
      </div>
    </div>
  );
}
