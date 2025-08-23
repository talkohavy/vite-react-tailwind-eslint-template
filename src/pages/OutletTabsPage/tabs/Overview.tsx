export default function Overview() {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Overview</h2>

      <a
        href='http://localhost:3000/base/home/'
        target='_blank'
        rel='noopener'
        className='text-blue-600 hover:underline hover:text-red-500'
      >
        http://localhost:3000/base/home/
      </a>

      <p className='text-gray-600 dark:text-gray-300'>
        Welcome to the overview tab! This is the main dashboard where you can see a summary of all features.
      </p>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='font-semibold'>Feature 1</h3>
          <p className='text-sm text-gray-500'>Description of feature 1</p>
        </div>

        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='font-semibold'>Feature 2</h3>
          <p className='text-sm text-gray-500'>Description of feature 2</p>
        </div>

        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='font-semibold'>Feature 3</h3>
          <p className='text-sm text-gray-500'>Description of feature 3</p>
        </div>
      </div>
    </div>
  );
}
