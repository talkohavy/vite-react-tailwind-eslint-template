type ErrorResponseProps = {
  error: any;
};

export default function ErrorResponse(props: ErrorResponseProps) {
  const { error } = props;

  return (
    <div className='bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-800'>
      <h2 className='text-lg font-semibold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2'>❌ Error</h2>

      <div className='bg-white dark:bg-slate-900 rounded-lg p-4 border border-red-200 dark:border-red-800'>
        <p className='text-red-700 dark:text-red-400 font-semibold mb-2'>{error?.message || 'An error occurred'}</p>

        {error?.status && (
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Status Code: <span className='font-mono font-bold'>{error.status}</span>
          </p>
        )}
      </div>
    </div>
  );
}
