import { useId, useState } from 'react';
import type { SelectOption } from '../../components/controls/Select/types';
import Checkbox from '../../components/controls/Checkbox';
import Select from '../../components/controls/Select';
import Toggle from '../../components/controls/Toggle';
import DropdownMenu from '../../components/DropdownMenu';
import Tooltip from '../../components/Tooltip';
import TooltipTrigger from '../../components/Tooltip/TooltipTrigger';
import { Placement } from '../../components/Tooltip/types';
import DropdownMenuContent from './components/DropdownMenuContent';

const opt = Array.from(Array(200).keys()).map((_, index) => ({ value: index, label: index }));

const options: Array<SelectOption> = [
  ...opt,
  { value: 997, label: 'Apples' },
  { value: 998, label: 'Bananas' },
  { value: 999, label: 'Oranges' },
];

export default function RadixComponents() {
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);
  const tooltipUniqueId = useId();
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('colm');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption>({} as SelectOption);

  console.log('selectedOption is:', selectedOption);

  return (
    <div className='flex flex-col gap-10 items-end size-full p-6 overflow-auto'>
      <Toggle isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />

      <Checkbox isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />

      <Select
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
        placeholder='choose one'
        dropdownClassName='max-h-60'
        // showArrow
        // itemClassName='bg-red-500 data-[state=checked]:bg-blue-500'
      />

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
          setValue={() => {}}
          value={''}
        />
      </DropdownMenu>

      <TooltipTrigger groupId={tooltipUniqueId} contentOverride={'spelling'} className='w-auto inline-block'>
        <div className='border border-black p-4 rounded-lg dark:border-white w-auto'>My Tooltip</div>
      </TooltipTrigger>
      <Tooltip groupId={tooltipUniqueId} place={Placement.Top} isClickable className='!p-3' />
    </div>
  );
}
