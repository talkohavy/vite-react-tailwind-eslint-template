import { useState } from 'react';
import Checkbox from '@src/components/controls/Checkbox';
import Tag from '@src/components/controls/Checkbox/Tag';

export default function CheckboxesTab() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [tagChecked, setTagChecked] = useState(false);

  return (
    <>
      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Checkbox:</div>

        <Checkbox
          isChecked={checkboxChecked}
          setIsChecked={() => setCheckboxChecked((prev) => !prev)}
          label='Remember me?'
        />
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Tag:</div>

        <Tag isChecked={tagChecked} setIsChecked={() => setTagChecked((prev) => !prev)} label='Bicycle' />
      </div>
    </>
  );
}
