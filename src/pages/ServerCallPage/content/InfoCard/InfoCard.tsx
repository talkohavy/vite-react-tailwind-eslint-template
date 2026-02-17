export default function InfoCard() {
  return (
    <div className='bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg p-6 border border-amber-200 dark:border-amber-800'>
      <h2 className='text-lg font-semibold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2'>
        💡 Getting Started
      </h2>

      <div className='text-amber-800 dark:text-amber-300 space-y-2'>
        <p>Customize the user data above and click one of the buttons to make an API request.</p>

        <ul className='list-disc list-inside space-y-1 text-sm ml-2'>
          <li>
            <strong>User Data</strong> - Edit the name and email fields to control what gets sent
          </li>
          <li>
            <strong>Fetch Users</strong> - GET request to retrieve data
          </li>
          <li>
            <strong>Create User</strong> - POST request to create a new user with your custom data
          </li>
          <li>
            <strong>Abort Request</strong> - Cancel an ongoing request (appears when loading)
          </li>
        </ul>
      </div>
    </div>
  );
}
