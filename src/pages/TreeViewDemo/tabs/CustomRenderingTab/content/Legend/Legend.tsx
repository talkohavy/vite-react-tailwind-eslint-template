export default function Legend() {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Custom Rendering Types</h3>

      <div className='space-y-4'>
        <div className='flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800'>
          <span className='text-blue-600 dark:text-blue-400 mr-3'>⚛️</span>
          <div>
            <div className='font-semibold text-blue-800 dark:text-blue-300'>React Components</div>
            <div className='text-xs text-blue-600 dark:text-blue-400'>*.tsx files with React badge</div>
          </div>
        </div>

        <div className='flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800'>
          <span className='text-yellow-600 dark:text-yellow-400 mr-3'>🟢</span>
          <div>
            <div className='font-semibold text-yellow-800 dark:text-yellow-300'>Node.js Files</div>
            <div className='text-xs text-yellow-600 dark:text-yellow-400'>*.js files with Node.js badge</div>
          </div>
        </div>

        <div className='flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800'>
          <span className='text-purple-600 dark:text-purple-400 mr-3'>🎨</span>
          <div>
            <div className='font-semibold text-purple-800 dark:text-purple-300'>Stylesheets</div>
            <div className='text-xs text-purple-600 dark:text-purple-400'>*.css files with Stylesheet badge</div>
          </div>
        </div>

        <div className='flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-200 dark:border-emerald-800'>
          <span className='text-emerald-600 dark:text-emerald-400 mr-3'>📁</span>
          <div>
            <div className='font-semibold text-emerald-800 dark:text-emerald-300'>Smart Folders</div>
            <div className='text-xs text-emerald-600 dark:text-emerald-400'>Folders with metadata and file counts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
