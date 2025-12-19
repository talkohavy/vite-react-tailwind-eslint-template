export default function ErrorState() {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center'>
          <span className='text-red-600 dark:text-red-400 text-xl'>!</span>
        </div>

        <div>
          <p className='text-red-600 dark:text-red-400 font-medium'>Failed to load users</p>

          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Make sure the server is running and the API endpoint is available.
          </p>
        </div>
      </div>
    </div>
  );
}
