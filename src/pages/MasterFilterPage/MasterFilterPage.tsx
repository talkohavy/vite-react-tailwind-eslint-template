import { useMemo } from 'react';
import { ArrayFilter, type OperatorNames, type FilterScheme } from '@talkohavy/filters';
import { data } from './logic/constants';

const filters: FilterScheme<OperatorNames> = [
  {
    fieldName: 'role',
    operator: 'exists',
    // NOT: true,
  },
  // {
  //   OR: [
  //     {
  //       fieldName: 'age',
  //       operator: 'between',
  //       value: [25, 30],
  //       NOT: true,
  //     },
  //     // {
  //     //   fieldName: 'age',
  //     //   operator: 'equals',
  //     //   value: 35,
  //     // },
  //   ],
  // },
];

const arrayFilter = new ArrayFilter(filters);

export default function MasterFilterPage() {
  const results = useMemo(() => {
    const filteredData = arrayFilter.applyFilters(data);
    return filteredData;
  }, []);

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      <h1 className='text-2xl font-bold'>Master Filter Page</h1>

      <div>Data length: {data.length}</div>
      <div>Filtered length: {results.length}</div>

      <div className='flex flex-col gap-4'>
        {results.map((item) => (
          <div key={item.id} className='p-4 border rounded shadow'>
            <h2 className='text-xl font-semibold'>{item.name}</h2>
            <p>Age: {item.age}</p>
            <p>Role: {item.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
