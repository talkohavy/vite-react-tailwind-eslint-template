import { useId, useRef, useState } from 'react';
import { parseColor } from '@ark-ui/react/color-picker';
import { parseDate } from '@ark-ui/react/date-picker';
import FancyProgressBar from '../../components/beautiful/FancyProgressBar';
import ToggleV1 from '../../components/beautiful/ToggleV1';
import ToggleV2 from '../../components/beautiful/ToggleV2';
import ToggleV3 from '../../components/beautiful/ToggleV3';
import ToggleV4 from '../../components/beautiful/ToggleV4';
import CodeBlock from '../../components/CodeBlock';
import Autocomplete from '../../components/controls/Autocomplete';
import Checkbox from '../../components/controls/Checkbox';
import Tag from '../../components/controls/Checkbox/Tag';
import ColorPicker from '../../components/controls/ColorPicker';
import Input from '../../components/controls/Input';
import NumberInput from '../../components/controls/NumberInput';
import RadioDots from '../../components/controls/RadioDots';
import Select from '../../components/controls/Select';
import Textarea from '../../components/controls/Textarea';
import Toggle from '../../components/controls/Toggle';
import DatePicker from '../../components/DatePicker';
import DropdownMenu from '../../components/DropdownMenu';
import PinInput from '../../components/PinInput';
import ProgressBar from '../../components/ProgressBar';
import DownArrow from '../../components/svgs/DownArrow';
import Tooltip, { Placement } from '../../components/Tooltip';
import TooltipTrigger from '../../components/Tooltip/TooltipTrigger';
import { useIsCloseToEdge } from '../../hooks/useIsCloseToEdge';
import { useScrollToEdge } from '../../hooks/useScrollToEdge';
import DropdownMenuContent from './components/DropdownMenuContent';
import { useRunningProgress } from './components/useRunningProgress';
import type { SelectOption } from '../../components/controls/Select/types';

const opt = Array.from(Array(40).keys()).map((_, index) => ({ value: index || 'a', label: index.toString() }));

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
  const [_pinInput, setPinInput] = useState<string>('');
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
      <div className='font-mono flex flex-col gap-2 w-full'>
        <div>Input:</div>

        <Input
          initialValue={inputValue}
          onChange={setInputValue}
          placeholder='Enter name'
          className='dark:bg-slate-950 px-4 max-w-xs shadow-xs dark:shadow-dark-xs'
        />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Autocomplete:</div>

        <Autocomplete
          selectOption={selectComboboxOption}
          setSelectOption={setSelectComboboxOption}
          options={options}
          placeholder='Choose...'
          className='max-w-xs dark-bg-red shadow-xs dark:shadow-dark-xs'
          dropdownClassName='max-h-[224px] overflow-auto'
          loop
        />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Select:</div>

        <Select
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          options={options}
          placeholder='choose one'
          className='max-w-xs'
          dropdownClassName='max-h-60'
          // showArrow
          // itemClassName='bg-red-500 data-[state=checked]:bg-blue-500'
        />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Checkbox:</div>

        <Checkbox isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} label='Remember me?' />
      </div>

      <div className='font-mono flex flex-col gap-2 w-full'>
        <div>RadioDots:</div>

        <RadioDots
          options={[
            { value: 0, label: '0' },
            { value: 1, label: '2' },
          ]}
          value={selectedRadio}
          setValue={setSelectedRadio}
          className='flex gap-2'
        />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>DatePicker:</div>

        <DatePicker value={date} setValue={setDate} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Tooltip:</div>

        <TooltipTrigger variant='dark' groupId={tooltipUniqueId} contentOverride='spelling' className='w-fit'>
          <div>hover me</div>
        </TooltipTrigger>

        <Tooltip
          groupId={tooltipUniqueId}
          place={Placement.Top}
          isClickable
          noArrow
          className='p-3! border border-red-500 rounded-lg!'
          style={{
            '--rt-color-dark': 'black',
            // '--rt-color-white': 'white',
            // '--rt-color-success': 'green',
            // '--rt-color-error': 'red',
            // '--rt-color-warning': 'yellow',
            // '--rt-color-info': 'gray',
            // '--rt-opacity': '1',
            // '--rt-transition-show-delay': '0.15s',
            // '--rt-transition-closing-delay': '0.15s',
          }}
        />
      </div>

      <div className='font-mono flex flex-col gap-2 w-full'>
        <div>ProgressBar:</div>

        <ProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full' />
      </div>

      <div className='font-mono flex flex-col gap-2 w-full'>
        <div>FancyProgressBar:</div>

        <FancyProgressBar completed={progressBarValue} className='shrink-0 h-12 w-full max-w-lg' />
      </div>

      <div className='font-mono flex flex-col gap-2 w-full'>
        <div>PinInput:</div>

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
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>ColorPicker:</div>

        <ColorPicker color={color} setColor={setColor} className='max-w-xs' />

        <ul className='px-4'>
          <li>• hex color: {color.toString('hex')}</li>
          <li>• rgba color: {color.toString('rgba')}</li>
          <li>• rgba color: {color.toString('hsla')}</li>
        </ul>
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>NumberInput:</div>

        <NumberInput value={numberValue} setValue={setNumberValue} min={0} max={12} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Toggle:</div>

        <Toggle isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV1:</div>

        <ToggleV1 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV2:</div>

        <ToggleV2 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV3:</div>

        <ToggleV3 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV4:</div>

        <ToggleV4 isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Tag:</div>

        <Tag isChecked={isChecked} setIsChecked={() => setIsChecked((prev) => !prev)} label='Bicycle' />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>Textarea:</div>

        <Textarea
          value={textareaValue}
          setValue={(e) => setTextareaValue(e.target.value)}
          className='dark:bg-slate-950'
        />
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>DropdownMenu:</div>

        <DropdownMenu
          triggerElement={
            <button type='button' className='border border-white p-4 rounded-lg'>
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
      </div>

      <div className='font-mono flex flex-col justify-start gap-2 w-full'>
        <div>CodeBlock:</div>

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
