import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import NumberInput from '@src/components/controls/NumberInput';
import SuccessResponse from '../../../ServerCallPage/content/SuccessResponse/SuccessResponse';
import { useBackgroundSyncTabLogic } from './logic/useBackgroundSyncTabLogic';

export default function BackgroundSyncTab() {
  const {
    email,
    password,
    name,
    age,
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
    handleAgeChange,
    onSendDataClick,
    tryToSyncData,
    data,
    errorMessage,
  } = useBackgroundSyncTabLogic();

  return (
    <div className='flex flex-col gap-6 size-full p-6 overflow-auto'>
      <div className='text-3xl font-semibold'>Service Worker Tutorial</div>

      <div className='flex flex-col gap-4 max-w-md border rounded-lg p-4'>
        <div className='text-lg font-semibold self-center'>User Input Form</div>

        <div className='flex flex-col gap-2'>
          <div className='font-medium'>Email</div>
          <Input initialValue={email} onChange={handleEmailChange} placeholder='Enter your email' testId='email' />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='font-medium'>Password</div>
          <Input
            type='password'
            initialValue={password}
            onChange={handlePasswordChange}
            placeholder='Enter your password'
            testId='password'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='font-medium'>Name</div>
          <Input initialValue={name} onChange={handleNameChange} placeholder='Enter your name' testId='name' />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='font-medium'>Age</div>
          <NumberInput value={age} setValue={handleAgeChange} step={1} min={1} max={120} placeholder='Enter your age' />
        </div>
      </div>

      <div className='flex gap-4'>
        <Button onClick={onSendDataClick}>Send Data</Button>

        <Button onClick={tryToSyncData}>Try to sync</Button>
      </div>

      {errorMessage && (
        <div
          className='p-4 rounded border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200'
          role='alert'
        >
          {errorMessage}
        </div>
      )}

      {data && <SuccessResponse data={data} />}
    </div>
  );
}
