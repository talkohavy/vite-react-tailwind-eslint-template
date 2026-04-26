import { useState } from 'react';
import { parseDate } from '@ark-ui/react/date-picker';
import DatePicker from '@src/components/DatePicker';

export default function DatePickerTab() {
  const [date, setDate] = useState([parseDate('2022-01-01')]);

  return (
    <div className='flex flex-col justify-start gap-2 w-full'>
      <div>DatePicker:</div>

      <DatePicker value={date} setValue={setDate} />
    </div>
  );
}
