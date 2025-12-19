export default function Loading() {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />

        <span className='text-gray-500 dark:text-gray-400'>Loading users...</span>
      </div>
    </div>
  );
}
