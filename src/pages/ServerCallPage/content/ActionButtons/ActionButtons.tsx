import Button from '@src/components/controls/Button';

type ActionButtonsProps = {
  isLoading: boolean;
  onFetchUsers: () => void;
  onCreateUser: () => void;
  onAbort: () => void;
};

export default function ActionButtons(props: ActionButtonsProps) {
  const { isLoading, onFetchUsers, onCreateUser, onAbort } = props;

  return (
    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Actions</h2>

      <div className='flex flex-wrap gap-3'>
        <Button
          onClick={onFetchUsers}
          disabled={isLoading}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
        >
          📥 Fetch Users
        </Button>

        <Button
          onClick={onCreateUser}
          disabled={isLoading}
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
        >
          ➕ Create User
        </Button>

        {isLoading && (
          <Button
            onClick={onAbort}
            className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg'
          >
            ⛔ Abort Request
          </Button>
        )}
      </div>
    </div>
  );
}
