import avatarImage from '../../assets/avatar.webp';
import Avatar from '../../components/Avatar/index';
import Popover from '../../components/Popover/index';
import Tooltip from '../../components/Tooltip/index';

export default function HomePage() {
  return (
    <div className='size-full p-6'>
      <div className='flex flex-col items-start justify-start gap-10 p-10'>
        <div className='flex items-center gap-5'>
          <div className='font-bold'>Popover:</div>

          <Popover content='Some more info...' />
        </div>

        <div className='flex items-center gap-5'>
          <div className='font-bold'>Tooltip:</div>

          <Tooltip content='What are you doing?!?!'>
            <span>
              <button
                type='button'
                disabled
                style={{ pointerEvents: 'none' }}
                className='pointer-events-none rounded-lg border border-black bg-gray-100 px-5 py-2 text-gray-800'
              >
                click me
              </button>
            </span>
          </Tooltip>
        </div>

        <div className='flex items-center gap-5'>
          <div className='font-bold'>Avatar:</div>

          <Avatar imgSrc={avatarImage} size='xl' />
        </div>
      </div>
    </div>
  );
}
