import Button from '../../../../components/controls/Button';
import Input from '../../../../components/controls/Input';
import NumberInput from '../../../../components/controls/NumberInput';
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
  } = useBackgroundSyncTabLogic();

  return (
    <div className='size-full p-6 overflow-auto'>
      <div className='mb-6'>Service Worker Tutorial</div>

      <div className='flex flex-col gap-4 max-w-md mb-6'>
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
    </div>
  );
}
