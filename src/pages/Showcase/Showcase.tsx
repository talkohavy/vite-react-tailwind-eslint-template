import { useEffect, useId, useRef, useState } from 'react';
import { parseColor } from '@ark-ui/react/color-picker';
import { parseDate } from '@ark-ui/react/date-picker';
import type { SelectOption } from '../../components/controls/Select/types';
import CodeBlock from '../../components/CodeBlock';
import Checkbox from '../../components/controls/Checkbox';
import Tag from '../../components/controls/Checkbox/Tag';
import ColorPicker from '../../components/controls/ColorPicker';
import Combobox from '../../components/controls/Combobox';
import NumberInput from '../../components/controls/NumberInput';
import RadioDots from '../../components/controls/RadioGroup/RadiosDots';
import Select from '../../components/controls/Select';
import Textarea from '../../components/controls/Textarea';
import Toggle from '../../components/controls/Toggle';
import DatePicker from '../../components/DatePicker';
import DropdownMenu from '../../components/DropdownMenu';
import LinearProgressBar from '../../components/LinearProgressBar';
import PinInput from '../../components/PinInput';
import DownArrow from '../../components/svgs/DownArrow';
import Tooltip from '../../components/Tooltip';
import TooltipTrigger from '../../components/Tooltip/TooltipTrigger';
import { Placement } from '../../components/Tooltip/types';
import { useIsCloseToEdge } from '../../hooks/useIsCloseToEdge';
import { useScrollToEdge } from '../../hooks/useScrollToEdge';
import DropdownMenuContent from './components/DropdownMenuContent';

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
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('colm');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption>({} as SelectOption);
  const [selectComboboxOption, setSelectComboboxOption] = useState<any>(options[4]);
  const [color, setColor] = useState(() => parseColor('hsl(20, 100%, 50%)'));
  const [date, setDate] = useState([parseDate('2022-01-01')]);
  const [pinInput, setPinInput] = useState<string>('');
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const [selectedRadio, setSelectedRadio] = useState<any>(null);
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number>(0);

  const refElement = useRef<HTMLElement>({} as HTMLElement);

  const { isVisible: isScrollToBottomVisible, onScroll: onScrollToBottom } = useIsCloseToEdge({
    to: 'bottom',
    initialIsVisible: true,
  });
  const { scrollToEdge: scrollToBottom } = useScrollToEdge({ refElement: refElement, to: 'bottom' });

  const { isVisible: isScrollToTopVisible, onScroll: onScrollToTop } = useIsCloseToEdge({ to: 'top' });
  const { scrollToEdge: scrollToTop } = useScrollToEdge({ refElement: refElement, to: 'top' });

  useEffect(() => {
    setTimeout(() => setProgressBarValue(10), 1000);
    setTimeout(() => setProgressBarValue(40), 4000);
    setTimeout(() => setProgressBarValue(100), 6000);
  }, []);

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
      {isScrollToBottomVisible && (
        <button
          type='button'
          onClick={scrollToBottom}
          className='fixed top-20 z-10 right-10 flex justify-center items-center size-12 cursor-pointer bg-red-500 hover:bg-red-400 rounded-full border'
        >
          <DownArrow className='size-3' />
        </button>
      )}

      <RadioDots
        options={[
          { value: 0, label: '0' },
          { value: 1, label: '2' },
        ]}
        value={selectedRadio}
        setValue={setSelectedRadio}
      />

      <LinearProgressBar className='shrink-0 h-12 w-full' completed={progressBarValue} />

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

      {isScrollToTopVisible && (
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
