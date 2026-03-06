import { useHistory } from 'react-router-dom';
import { BASE_URL } from '@src/common/constants';
import Button from '@src/components/controls/Button';

export default function OverviewTab() {
  const history = useHistory();

  function openSender() {
    history.push(`${BASE_URL}/webrtc/sender`);
  }

  function openReceiver() {
    history.push(`${BASE_URL}/webrtc/receiver`);
  }

  return (
    <div className='flex flex-col gap-6'>
      <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
          WebRTC P2P screen sharing
        </h2>

        <p className='text-sm text-gray-600 dark:text-gray-300'>
          This demo sets up a peer-to-peer connection between two browser tabs using a signaling server. One tab shares
          the screen (sender), the other displays it (receiver).
        </p>

        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Open <strong>Sender</strong> in one tab and <strong>Receiver</strong> in another (or another window). Connect
          both to the signaling server, then start sharing on the sender. The receiver will show the stream.
        </p>

        <div className='flex flex-wrap gap-3'>
          <Button onClick={openSender} className='bg-blue-600 hover:bg-blue-700'>
            Open Sender
          </Button>

          <Button onClick={openReceiver} className='bg-emerald-600 hover:bg-emerald-700'>
            Open Receiver
          </Button>
        </div>
      </section>
    </div>
  );
}
