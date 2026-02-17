type UserInputFormProps = {
  userEmail: string;
  userPassword: string;
  setUserEmail: (userEmail: string) => void;
  setUserPassword: (userPassword: string) => void;
  isLoading: boolean;
};

export default function UserInputForm(props: UserInputFormProps) {
  const { userEmail, userPassword, setUserEmail, setUserPassword, isLoading } = props;

  return (
    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>User Data</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='userEmail' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Email
          </label>

          <input
            id='userEmail'
            type='email'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            placeholder='Enter user email'
          />
        </div>

        <div>
          <label htmlFor='userPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Password
          </label>

          <input
            id='userPassword'
            type='password'
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            placeholder='Enter password'
          />
        </div>
      </div>
    </div>
  );
}
