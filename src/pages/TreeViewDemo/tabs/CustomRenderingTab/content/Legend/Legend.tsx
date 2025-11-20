export default function Legend() {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Features & Node Types</h3>

      {/* Features Section */}
      <div className='mb-6'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>Interactive Features</h4>
        <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-2'>
          <li className='flex items-start'>
            <span className='mr-2'>🔄</span>
            <span>
              <strong>Dynamic Loading:</strong> Children load asynchronously when folders expand
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>👆</span>
            <span>
              <strong>Clickable Nodes:</strong> All nodes are selectable and show selection state
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>📂</span>
            <span>
              <strong>Expandable Folders:</strong> Click arrows to expand/collapse with smooth animations
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>⏳</span>
            <span>
              <strong>Loading States:</strong> Visual feedback during async operations
            </span>
          </li>
        </ul>
      </div>

      {/* Node Types Section */}
      <div>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>Custom Node Types</h4>
        <div className='space-y-3'>
          <div className='flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800'>
            <span className='text-blue-600 dark:text-blue-400 mr-2 text-lg'>⚛️</span>
            <div className='text-xs'>
              <div className='font-semibold text-blue-800 dark:text-blue-300'>React Components</div>
              <div className='text-blue-600 dark:text-blue-400'>*.tsx files</div>
            </div>
          </div>

          <div className='flex items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800'>
            <span className='text-yellow-600 dark:text-yellow-400 mr-2 text-lg'>🟢</span>
            <div className='text-xs'>
              <div className='font-semibold text-yellow-800 dark:text-yellow-300'>JavaScript Files</div>
              <div className='text-yellow-600 dark:text-yellow-400'>*.js files</div>
            </div>
          </div>

          <div className='flex items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800'>
            <span className='text-purple-600 dark:text-purple-400 mr-2 text-lg'>🎨</span>
            <div className='text-xs'>
              <div className='font-semibold text-purple-800 dark:text-purple-300'>Stylesheets</div>
              <div className='text-purple-600 dark:text-purple-400'>*.css files</div>
            </div>
          </div>

          <div className='flex items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800'>
            <span className='text-emerald-600 dark:text-emerald-400 mr-2 text-lg'>📁</span>
            <div className='text-xs'>
              <div className='font-semibold text-emerald-800 dark:text-emerald-300'>Smart Folders</div>
              <div className='text-emerald-600 dark:text-emerald-400'>With metadata & counts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
