import { useState } from 'react';
import { parseColor } from '@ark-ui/react/color-picker';
import Autocomplete from '@src/components/controls/Autocomplete';
import ColorPicker from '@src/components/controls/ColorPicker';
import Input from '@src/components/controls/Input';
import NumberInput from '@src/components/controls/NumberInput';
import Select from '@src/components/controls/Select';
import Textarea from '@src/components/controls/Textarea';
import PinInput from '@src/components/PinInput';
import { selectDemoOptions } from './logic/selectDemoOptions';
import type { SelectOption } from '@src/components/controls/Select/types';

export default function FormInputsTab() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOption>({} as SelectOption);
  const [selectComboboxOption, setSelectComboboxOption] = useState<any>(selectDemoOptions[4]);
  const [color, setColor] = useState(() => parseColor('hsl(20, 100%, 50%)'));
  const [_pinInput, setPinInput] = useState<string>('');
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number>(0);

  return (
    <>
      <div className='flex flex-col gap-2 w-full'>
        <div>Input:</div>

        <Input
          initialValue={inputValue}
          onChange={setInputValue}
          placeholder='Enter name'
          className='dark:bg-slate-950 px-4 max-w-xs shadow-xs dark:shadow-dark-xs'
        />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Autocomplete:</div>

        <Autocomplete
          selectOption={selectComboboxOption}
          setSelectOption={setSelectComboboxOption}
          options={selectDemoOptions}
          placeholder='Choose...'
          className='max-w-xs dark-bg-red shadow-xs dark:shadow-dark-xs'
          dropdownClassName='max-h-[224px] overflow-auto'
          loop
        />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Select:</div>

        <Select
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          options={selectDemoOptions}
          placeholder='choose one'
          className='max-w-xs'
          dropdownClassName='max-h-60'
        />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Textarea:</div>

        <Textarea
          value={textareaValue}
          setValue={(e) => setTextareaValue(e.target.value)}
          className='dark:bg-slate-950'
        />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div>NumberInput:</div>

        <NumberInput value={numberValue} setValue={setNumberValue} min={0} max={12} />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div>PinInput:</div>

        <PinInput
          pinLength={4}
          onDone={(props) => setPinInput(props.valueAsString)}
          selectOnFocus
          blurOnComplete
          required
        />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ColorPicker:</div>

        <ColorPicker color={color} setColor={setColor} className='max-w-xs' />

        <ul className='px-4'>
          <li>• hex color: {color.toString('hex')}</li>
          <li>• rgba color: {color.toString('rgba')}</li>
          <li>• rgba color: {color.toString('hsla')}</li>
        </ul>
      </div>
    </>
  );
}
