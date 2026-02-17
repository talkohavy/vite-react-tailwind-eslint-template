import type { UserFormData, UserRole } from '../../logic/types';

type UserInputFormProps = {
  formData: UserFormData;
  isLoading: boolean;
  onUpdateField: <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => void;
};

export default function UserInputForm(props: UserInputFormProps) {
  const { formData, isLoading, onUpdateField } = props;

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
            value={formData.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
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
            value={formData.password}
            onChange={(e) => onUpdateField('password', e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            placeholder='Enter password'
          />
        </div>

        <div>
          <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Date of Birth
          </label>

          <input
            id='dateOfBirth'
            type='date'
            value={formData.dateOfBirth}
            onChange={(e) => onUpdateField('dateOfBirth', e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
          />
        </div>

        <div>
          <label htmlFor='nickname' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Nickname
          </label>

          <input
            id='nickname'
            type='text'
            value={formData.nickname}
            onChange={(e) => onUpdateField('nickname', e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            placeholder='Enter nickname (optional)'
          />
        </div>

        <div>
          <label htmlFor='role' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Role
          </label>

          <select
            id='role'
            value={formData.role}
            onChange={(e) => onUpdateField('role', e.target.value as UserRole)}
            disabled={isLoading}
            className='w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all'
          >
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
            <option value='guest'>Guest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
