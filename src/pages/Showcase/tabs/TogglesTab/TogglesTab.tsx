import { useState } from 'react';
import ToggleV1 from '@src/components/beautiful/ToggleV1';
import ToggleV2 from '@src/components/beautiful/ToggleV2';
import ToggleV3 from '@src/components/beautiful/ToggleV3';
import ToggleV4 from '@src/components/beautiful/ToggleV4';
import Toggle from '@src/components/controls/Toggle';
import FancyToggleButton from '../../../../components/beautiful/FancyToggleButton';

export default function TogglesTab() {
  const [toggleChecked, setToggleChecked] = useState(false);

  return (
    <div className='flex flex-col gap-8 w-full p-4'>
      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Toggle:</div>

        <Toggle isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV1:</div>

        <ToggleV1 isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV2:</div>

        <ToggleV2 isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV3:</div>

        <ToggleV3 isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV4:</div>

        <ToggleV4 isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>ToggleV4:</div>

        <FancyToggleButton isChecked={toggleChecked} setIsChecked={() => setToggleChecked((prev) => !prev)} />
      </div>
    </div>
  );
}
