import FancySpinner from '@src/components/beautiful/FancySpinner';
import LoadingRadar from '@src/components/beautiful/LoadingRadar';
import LoadingTerminal from '@src/components/beautiful/LoadingTerminal';

export default function LoadersTab() {
  return (
    <>
      <div className='flex flex-col gap-2 w-full'>
        <div>LoadingRadar:</div>

        <div>
          <LoadingRadar className='size-20' />
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full max-w-md'>
        <div>LoadingTerminal:</div>
        <LoadingTerminal className='w-full' />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div>FancySpinner:</div>

        <div className='flex justify-center items-center size-44'>
          <FancySpinner className='size-10' />
        </div>
      </div>
    </>
  );
}
