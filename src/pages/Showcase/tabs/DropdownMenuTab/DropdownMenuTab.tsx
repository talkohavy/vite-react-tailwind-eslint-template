import { useState } from 'react';
import DropdownMenu from '@src/components/DropdownMenu';
import DropdownMenuContent from '../../components/DropdownMenuContent';

export default function DropdownMenuTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('colm');

  return (
    <div className='flex flex-col justify-start gap-2 w-full'>
      <div>DropdownMenu:</div>

      <DropdownMenu
        triggerElement={
          <button type='button' className='border border-white p-4 rounded-lg'>
            Open Dropdown
          </button>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showArrow
      >
        <DropdownMenuContent
          bookmarksChecked={bookmarksChecked}
          setBookmarksChecked={setBookmarksChecked}
          urlsChecked={urlsChecked}
          setUrlsChecked={setUrlsChecked}
          person={person}
          setPerson={setPerson}
        />
      </DropdownMenu>
    </div>
  );
}
