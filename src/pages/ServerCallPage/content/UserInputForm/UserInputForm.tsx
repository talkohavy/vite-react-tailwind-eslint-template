import { parseDate, type DateValue } from '@ark-ui/react/date-picker';
import Input from '@src/components/controls/Input';
import Select from '@src/components/controls/Select';
import DatePicker from '@src/components/DatePicker';
import type { UserFormData, UserRole } from '../../logic/types';
import type { SelectOption } from '@src/components/controls/Select/types';

const roleOptions: Array<SelectOption> = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'guest', label: 'Guest' },
];

type UserInputFormProps = {
  formData: UserFormData;
  isLoading: boolean;
  onUpdateField: <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => void;
};

export default function UserInputForm(props: UserInputFormProps) {
  const { formData, isLoading, onUpdateField } = props;

  const foundRole = roleOptions.find((option) => option.value === formData.role);
  const selectedRole = foundRole ?? roleOptions[0]!;

  const dateOfBirthValue = formData.dateOfBirth ? [parseDate(formData.dateOfBirth)] : [];

  function handleDateChange(value: Array<DateValue>) {
    if (value.length > 0) {
      const dateValue = value[0];

      if (dateValue) {
        const dateString = `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}`;
        onUpdateField('dateOfBirth', dateString);
      }
    } else {
      onUpdateField('dateOfBirth', '');
    }
  }

  return (
    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>User Data</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='userEmail' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Email
          </label>

          <Input
            type='text'
            initialValue={formData.email}
            onChange={(value) => onUpdateField('email', value)}
            disabled={isLoading}
            placeholder='Enter user email'
          />
        </div>

        <div>
          <label htmlFor='userPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Password
          </label>

          <Input
            type='password'
            initialValue={formData.password}
            onChange={(value) => onUpdateField('password', value)}
            disabled={isLoading}
            placeholder='Enter password'
          />
        </div>

        <div>
          <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Date of Birth
          </label>

          <DatePicker value={dateOfBirthValue} setValue={handleDateChange} disabled={isLoading} closeOnSelect={true} />
        </div>

        <div>
          <label htmlFor='nickname' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Nickname
          </label>

          <Input
            type='text'
            initialValue={formData.nickname}
            onChange={(value) => onUpdateField('nickname', value)}
            disabled={isLoading}
            placeholder='Enter nickname (optional)'
          />
        </div>

        <div>
          <label htmlFor='role' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Role
          </label>

          <Select
            selectedOption={selectedRole}
            setSelectedOption={(option: SelectOption) => onUpdateField('role', option.value as UserRole)}
            options={roleOptions}
            disabled={isLoading}
            placeholder='Select role'
          />
        </div>
      </div>
    </div>
  );
}
