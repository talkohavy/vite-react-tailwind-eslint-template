import { useId, useRef, useState } from 'react';
import { parseColor } from '@ark-ui/react/color-picker';
import { parseDate } from '@ark-ui/react/date-picker';
import type { SelectOption } from '../../components/controls/Select/types';
import FancyProgressBar from '../../components/beautiful/FancyProgressBar';
import ToggleV1 from '../../components/beautiful/ToggleV1';
import ToggleV2 from '../../components/beautiful/ToggleV2';
import ToggleV3 from '../../components/beautiful/ToggleV3';
import ToggleV4 from '../../components/beautiful/ToggleV4';
import CodeBlock from '../../components/CodeBlock';
import Checkbox from '../../components/controls/Checkbox';
import Tag from '../../components/controls/Checkbox/Tag';
import ColorPicker from '../../components/controls/ColorPicker';
import Combobox from '../../components/controls/Combobox';
import Input from '../../components/controls/Input';
import NumberInput from '../../components/controls/NumberInput';
import RadioDots from '../../components/controls/RadioGroup/RadiosDots';
import Select from '../../components/controls/Select';
import Textarea from '../../components/controls/Textarea';
import Toggle from '../../components/controls/Toggle';
import DatePicker from '../../components/DatePicker';
import DropdownMenu from '../../components/DropdownMenu';
import PinInput from '../../components/PinInput';
import ProgressBar from '../../components/ProgressBar';
import DownArrow from '../../components/svgs/DownArrow';
import Tooltip from '../../components/Tooltip';
import TooltipTrigger from '../../components/Tooltip/TooltipTrigger';
import { Placement } from '../../components/Tooltip/types';
import { useIsCloseToEdge } from '../../hooks/useIsCloseToEdge';
import { useScrollToEdge } from '../../hooks/useScrollToEdge';
import DropdownMenuContent from './components/DropdownMenuContent';
import { useRunningProgress } from './components/useRunningProgress';

const opt = Array.from(Array(4).keys()).map((_, index) => ({ value: index || 'a', label: index.toString() }));

const options: Array<SelectOption> = [
  ...opt,
  { value: 997, label: 'Apples' },
  { value: 998, label: 'Bananas', disabled: true },
  { value: 999, label: 'Oranges' },
];

export default function RadixComponents() {
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);
  const tooltipUniqueId = useId();
  const [inputValue, setInputValue] = useState('');
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('colm');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption>({} as SelectOption);
  const [selectComboboxOption, setSelectComboboxOption] = useState<any>(options[4]);
  const [color, setColor] = useState(() => parseColor('hsl(20, 100%, 50%)'));
  const [date, setDate] = useState([parseDate('2022-01-01')]);
  const [pinInput, setPinInput] = useState<string>('');
  const [selectedRadio, setSelectedRadio] = useState<any>(null);
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number>(0);
  const { progressBarValue } = useRunningProgress();

  const refElement = useRef<HTMLElement>({} as HTMLElement);

  const { isCloseToEdge: isCloseToBottom, onScroll: onScrollToBottom } = useIsCloseToEdge({
    to: 'bottom',
    initialState: true,
  });
  const { scrollToEdge: scrollToBottom } = useScrollToEdge({ refElement: refElement, to: 'bottom' });

  const { isCloseToEdge: isCloseToTop, onScroll: onScrollToTop } = useIsCloseToEdge({ to: 'top' });
  const { scrollToEdge: scrollToTop } = useScrollToEdge({ refElement: refElement, to: 'top' });

  console.log('pinInput is:', pinInput);

  return (
    <div
      ref={refElement as any}
      onScroll={(e) => {
        onScrollToBottom(e);
        onScrollToTop(e);
      }}
      className='flex flex-col gap-10 items-start size-full p-6 overflow-auto'
    >
      {!isCloseToBottom && (
        <button
          type='button'
          onClick={scrollToBottom}
          className='fixed top-20 z-10 right-10 flex justify-center items-center size-12 cursor-pointer bg-red-500 hover:bg-red-400 rounded-full border'
        >
          <DownArrow className='size-3' />
        </button>
      )}

      <Input initialValue={inputValue} onChange={setInputValue} placeholder='Enter name' />

      <RadioDots
        options={[
          { value: 0, label: '0' },
          { value: 1, label: '2' },
        ]}
        value={selectedRadio}
        setValue={setSelectedRadio}
      />

      <ProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full' />

      <FancyProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full' />

      <PinInput
        pinLength={4}
        onDone={(props) => setPinInput(props.valueAsString)}
        selectOnFocus
        blurOnComplete
        required
        // disabled
        // placeholder='_'
        // isOtp
        // isSecureMask
        // autoFocus
        // defaultValue={['1', '2', '3', '4']}
      />

      <DatePicker value={date} setValue={setDate} />

      <ColorPicker color={color} setColor={setColor} />

      <div>
        <div>hex color: {color.toString('hex')}</div>
        <div>rgba color: {color.toString('rgba')}</div>
        <div>rgba color: {color.toString('hsla')}</div>
      </div>

      <NumberInput value={numberValue} setValue={setNumberValue} min={0} max={12} />

      <Toggle isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      <ToggleV1 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      <ToggleV2 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      <ToggleV3 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      <ToggleV4 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />

      <Checkbox isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} label='Remember me?' />

      <Tag isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} label='Bicycle' />

      <Textarea value={textareaValue} setValue={(e) => setTextareaValue(e.target.value)} />

      <Select
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
        placeholder='choose one'
        dropdownClassName='max-h-60'
        // showArrow
        // itemClassName='bg-red-500 data-[state=checked]:bg-blue-500'
      />

      <Combobox
        selectOption={selectComboboxOption}
        setSelectOption={setSelectComboboxOption}
        options={options}
        placeholder='Choose...'
        loop
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
        />
      </DropdownMenu>

      <TooltipTrigger groupId={tooltipUniqueId} contentOverride={'spelling'} className='w-auto inline-block'>
        <div className='border border-black p-4 rounded-lg dark:border-white w-auto'>My Tooltip</div>
      </TooltipTrigger>
      <Tooltip groupId={tooltipUniqueId} place={Placement.Top} isClickable className='!p-3' />

      <div>
        <CodeBlock
          language='typescript'
          code={`'use strict'

import { useMemo, useEffect } from 'react';
import { convertReactPropsToRevealProps } from '../utils/convertReactPropsToRevealProps';

const UPPER_CASE_CONST = 300;

/**
 * this is a JSDOC (shocking...)
 */

async function killMe2(arr: Array<any>) {
    return void arr.pop();
}

class Person {
    constructor(name){
        super('kill me')
        this.name = name;
    }
}`}
        />
      </div>

      <div className='w-96 h-10'>
        <CodeBlock code={'ls --name hello'} />
      </div>

      {!isCloseToTop && (
        <button
          type='button'
          onClick={scrollToTop}
          className='fixed bottom-10 right-10 flex justify-center items-center size-12 cursor-pointer bg-blue-500 hover:bg-blue-400 rounded-full border'
        >
          <DownArrow className='size-3 rotate-180' />
        </button>
      )}
    </div>
  );
}
