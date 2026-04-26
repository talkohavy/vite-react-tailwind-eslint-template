import FancyProgressBar from '@src/components/beautiful/FancyProgressBar';
import ProgressBar from '@src/components/ProgressBar';
import { useRunningProgress } from './logic/useRunningProgress';

export default function ProgressTab() {
  const { progressBarValue } = useRunningProgress();

  return (
    <>
      <div className='flex flex-col gap-2 w-full'>
        <div>ProgressBar:</div>

        <ProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full' />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div>FancyProgressBar:</div>

        <FancyProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full max-w-lg' />
      </div>
    </>
  );
}
