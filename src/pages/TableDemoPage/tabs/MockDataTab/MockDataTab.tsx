import { Table } from '@talkohavy/table';
import { columnDefs, mockUsers } from './logic/constants';

export default function MockDataTab() {
  return (
    <div className='size-full flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>Mock Users Data</h2>

        <p className='text-sm text-gray-500 dark:text-gray-400'>
          This table displays static mock data with sorting and pagination enabled.
        </p>
      </div>

      <Table
        data={mockUsers}
        columnDefs={columnDefs}
        showFooter
        initialPageSize={10}
        allowColumnResizing
        defaultColumn={{
          enableSorting: false,
        }}
      />
    </div>
  );
}
