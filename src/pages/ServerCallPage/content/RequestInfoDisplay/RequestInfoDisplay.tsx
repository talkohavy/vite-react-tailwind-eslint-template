import type { RequestInfo } from '../../logic/types';

type RequestInfoDisplayProps = {
  requestInfo: RequestInfo;
};

export default function RequestInfoDisplay(props: RequestInfoDisplayProps) {
  const { requestInfo } = props;

  return (
    <div className='bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-800'>
      <h2 className='text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2'>
        📡 Last Request Info
      </h2>

      <div className='space-y-2 font-mono text-sm'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-indigo-700 dark:text-indigo-400'>Method:</span>
          <span className='px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold'>{requestInfo.method}</span>
        </div>

        <div>
          <span className='font-semibold text-indigo-700 dark:text-indigo-400'>URL:</span>
          <span className='text-gray-700 dark:text-gray-300 ml-2'>{requestInfo.url}</span>
        </div>

        <div>
          <span className='font-semibold text-indigo-700 dark:text-indigo-400'>Request ID:</span>
          <span className='text-gray-700 dark:text-gray-300 ml-2 text-xs'>{requestInfo.requestId}</span>
        </div>
      </div>
    </div>
  );
}
