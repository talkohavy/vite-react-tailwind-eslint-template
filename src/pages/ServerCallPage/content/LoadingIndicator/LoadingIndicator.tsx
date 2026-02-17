import LoadingBumpingBalls from '../../../../components/beautiful/LoadingBumpingBalls';
import type { RequestInfo } from '../../logic/types';

type LoadingIndicatorProps = {
  requestInfo: RequestInfo | null;
};

export default function LoadingIndicator(props: LoadingIndicatorProps) {
  const { requestInfo } = props;

  return (
    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700'>
      <div className='flex flex-col items-center gap-4'>
        <LoadingBumpingBalls />

        <p className='text-gray-600 dark:text-gray-400 font-medium'>Processing request...</p>

        {requestInfo && (
          <div className='text-sm text-gray-500 dark:text-gray-500 text-center'>
            <div>
              <span className='font-semibold'>{requestInfo.method}</span> {requestInfo.url}
            </div>
            <div className='font-mono text-xs mt-1'>ID: {requestInfo.requestId}</div>
          </div>
        )}
      </div>
    </div>
  );
}
