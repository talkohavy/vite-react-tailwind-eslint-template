export default function Analytics() {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Analytics</h2>

      <a
        href='http://localhost:3000/base/home/analytics'
        target='_blank'
        rel='noopener'
        className='text-blue-600 hover:underline hover:text-red-500'
      >
        http://localhost:3000/base/home/analytics
      </a>

      <p className='text-gray-600 dark:text-gray-300 mb-6'>View detailed analytics and performance metrics.</p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>Page Views</h3>
          <div className='text-3xl font-bold text-blue-600'>12,543</div>
          <p className='text-sm text-gray-500'>+15% from last month</p>
        </div>

        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>Users</h3>
          <div className='text-3xl font-bold text-green-600'>2,847</div>
          <p className='text-sm text-gray-500'>+8% from last month</p>
        </div>

        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>Bounce Rate</h3>
          <div className='text-3xl font-bold text-yellow-600'>24.5%</div>
          <p className='text-sm text-gray-500'>-3% from last month</p>
        </div>

        <div className='p-4 border rounded-lg dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>Conversion Rate</h3>
          <div className='text-3xl font-bold text-purple-600'>3.2%</div>
          <p className='text-sm text-gray-500'>+12% from last month</p>
        </div>
      </div>
    </div>
  );
}
