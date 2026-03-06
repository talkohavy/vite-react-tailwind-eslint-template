import type { ReactNode } from 'react';
import RadioTabs from '@src/components/controls/RadioTabs';
import { tabOptions } from './logic/constants';
import { useWebRtcPageLogic } from './logic/useWebRtcPageLogic';

type WebRtcPageProps = { children?: ReactNode };

export default function WebRtcPage({ children }: WebRtcPageProps) {
  const { currentTabValue, handleTabChange } = useWebRtcPageLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='flex flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>WebRTC P2P</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Peer-to-peer screen sharing via a signaling server. Use Sender in one tab and Receiver in another.
          </p>
        </header>

        <div className='border-b border-gray-200 dark:border-gray-600'>
          <RadioTabs
            value={currentTabValue}
            setValue={handleTabChange}
            options={tabOptions}
            className='flex space-x-1 pb-4'
          />
        </div>

        <div className='size-full'>{children}</div>
      </div>
    </div>
  );
}
