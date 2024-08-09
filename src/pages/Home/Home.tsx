import { useState } from 'react';
import avatarImage from '../../assets/avatar.webp';
import Accordion from '../../components/AccordionStack/index';
import Avatar from '../../components/Avatar/index';
import Modal from '../../components/Modal/index';
import Popover from '../../components/Popover/index';
import Tooltip from '../../components/Tooltip/index';
import { accordionData } from './constants';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
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

      <div className='flex items-center gap-5'>
        <div className='font-bold'>Accordion:</div>

        <Accordion data={accordionData} globalContentClassName='px-5 py-4' />
      </div>

      <div className='flex items-center gap-5'>
        <div className='font-bold'>Modal:</div>

        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex h-9 items-center justify-center rounded bg-white px-4 text-sm font-medium text-gray-500 shadow-md hover:bg-gray-200 focus:shadow-sm'
        >
          open modal
        </button>

        <Modal
          isOpen={isOpen}
          onConfirmClick={() => {
            console.log('Confirmed!');
            setIsOpen(false);
          }}
          onCancelClick={() => {
            console.log('Cancelled...');
            setIsOpen(false);
          }}
          title='Edit profile'
          body={<>hello world</>}
          handleEscapeAndClickAway={() => setIsOpen(false)}
          // footerClassName='!justify-start'
          // showCancelButton={false}
          // showCloseIcon={false}
        />
      </div>
    </div>
  );
}
