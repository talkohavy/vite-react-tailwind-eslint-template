import { type PropsWithChildren, useState } from 'react';
import RadioDots from '@src/components/controls/RadioButtons/RadioDots';

export default function RadioTab() {
  const [selectedRadio, setSelectedRadio] = useState<any>(null);

  return (
    <div className='flex flex-col gap-4 w-full overflow-x-auto'>
      <RadioDotsSection title='RadioDots, in a row, with label to the right'>
        <RadioDots
          options={[
            { value: 0, label: 'Bananas' },
            { value: 1, label: 'Apples' },
            { value: 2, label: 'Oranges', disabled: true },
            { value: 3, label: 'Pineapples' },
          ]}
          value={selectedRadio}
          setValue={setSelectedRadio}
          className='flex gap-6'
        />
      </RadioDotsSection>

      <RadioDotsSection title='RadioDots, in a column, with label to the right'>
        <RadioDots
          options={[
            { value: 0, label: 'Bananas' },
            { value: 1, label: 'Apples' },
            { value: 2, label: 'Oranges' },
          ]}
          value={selectedRadio}
          setValue={setSelectedRadio}
          className='flex flex-col gap-2'
        />
      </RadioDotsSection>

      <RadioDotsSection title='RadioDots, in a row, with label below'>
        <RadioDots
          options={[
            { value: 0, label: 'Bananas' },
            { value: 1, label: 'Apples' },
            { value: 2, label: 'Oranges' },
          ]}
          value={selectedRadio}
          setValue={setSelectedRadio}
          className='flex items-start gap-10 flex-row'
          childClassName='flex-col'
        />
      </RadioDotsSection>

      <RadioDotsSection title='RadioDots, in a row, with label above'>
        <RadioDots
          options={[
            { value: 0, label: 'Bananas' },
            { value: 1, label: 'Apples' },
            { value: 2, label: 'Oranges' },
          ]}
          value={selectedRadio}
          setValue={setSelectedRadio}
          className='flex items-start gap-10 flex-row'
          childClassName='flex-col-reverse'
        />
      </RadioDotsSection>
    </div>
  );
}

type RadioDotsSectionProps = PropsWithChildren<{
  title: string;
}>;

function RadioDotsSection(props: RadioDotsSectionProps) {
  const { children, title } = props;

  return (
    <div className='flex flex-col gap-6 border rounded-lg p-4'>
      <div className='text-lg font-medium'>{title}</div>

      {children}
    </div>
  );
}
