import Button from '../../components/controls/Button';
import { AppComponent } from './app.component';
import { sum } from './app.worker';

const worker = new AppComponent();
worker.ngOnInit();

export default function WebWorker() {
  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Web Worker Tutorial</div>

      <Button onClick={() => worker.startHeavyCalculation()} className='mr-6'>
        Start Heavy Calculation
      </Button>

      <Button onClick={() => sum(0)} className='mr-6'>
        Block main thread with Heavy Calculation
      </Button>

      <Button onClick={() => worker.checkIfFrozen()}>Check if frozen</Button>
    </div>
  );
}
