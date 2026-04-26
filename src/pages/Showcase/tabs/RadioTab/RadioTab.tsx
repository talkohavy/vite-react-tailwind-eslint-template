import { useState } from 'react';
import RadioDots from '@src/components/controls/RadioButtons/RadioDots';

export default function RadioTab() {
  const [selectedRadio, setSelectedRadio] = useState<any>(null);

  return (
    <div className='flex flex-col gap-2 w-full'>
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
  );
}
