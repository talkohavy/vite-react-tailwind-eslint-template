import { useId, useState } from 'react';
import DropdownMenu from '../../components/DropdownMenu';
import Tooltip from '../../components/Tooltip';
import TooltipTrigger from '../../components/Tooltip/TooltipTrigger';
import { Placement } from '../../components/Tooltip/types';
import DropdownMenuContent from './components/DropdownMenuContent';

export default function RadixComponents() {
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);
  const tooltipUniqueId = useId();
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('colm');

  return (
    <div className='flex flex-col gap-10 items-end size-full p-6 overflow-auto'>
      <DropdownMenu
        triggerElement={
          <button type='button' className='!border !border-white !p-4 !rounded-lg'>
            Open Dropdown
          </button>
        }
        isOpen={isDropDownMenuOpen}
        setIsOpen={setIsDropDownMenuOpen}
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

      <TooltipTrigger groupId={tooltipUniqueId} contentOverride={'spelling'} className='w-auto inline-block'>
        <div className='border border-black p-4 rounded-lg dark:border-white w-auto'>My Tooltip</div>
      </TooltipTrigger>
      <Tooltip groupId={tooltipUniqueId} place={Placement.Top} isClickable className='!p-3' />
    </div>
  );
}
