export default function Settings() {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Settings</h2>
      <p className='text-gray-600 dark:text-gray-300 mb-6'>Configure your application settings here.</p>

      <div className='space-y-6'>
        <div className='border-b pb-4 dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>General Settings</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span>Enable notifications</span>
              <input type='checkbox' className='rounded' />
            </div>
            <div className='flex items-center justify-between'>
              <span>Auto-save changes</span>
              <input type='checkbox' className='rounded' defaultChecked />
            </div>
          </div>
        </div>

        <div className='border-b pb-4 dark:border-gray-600'>
          <h3 className='text-lg font-semibold mb-2'>Display Settings</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span>Language</span>
              <select className='border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600'>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
