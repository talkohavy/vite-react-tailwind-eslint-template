import { Table } from '@talkohavy/table';
import ErrorState from './content/ErrorState';
import { HeaderControls } from './content/HeaderControls/HeaderControls';
import Loading from './content/Loading';
import PaginationControls from './content/PaginationControls';
import { columnDefs } from './logic/constants';
import { useServerDataTabLogic } from './logic/useServerDataTabLogic';

export default function ServerDataTab() {
  const {
    limit,
    handleLimitChange,
    handleSortOrderToggle,
    sortOrder,
    currentPage,
    tableData,
    isLoading,
    isError,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    handlePageChange,
  } = useServerDataTabLogic();

  return (
    <div className='size-full flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>Server Users Data</h2>

        <p className='text-sm text-gray-500 dark:text-gray-400'>
          This table fetches data from <code className='bg-gray-100 dark:bg-gray-800 px-1 rounded'>/api/users</code>{' '}
          with server-side pagination.
        </p>
      </div>

      <HeaderControls
        handleLimitChange={handleLimitChange}
        handleSortOrderToggle={handleSortOrderToggle}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
      />

      {/* Table or loading/error states */}
      <div className='flex-1 min-h-0'>
        {isLoading && <Loading />}

        {isError && <ErrorState />}

        {!isLoading && !isError && tableData && (
          <Table
            data={tableData}
            columnDefs={columnDefs}
            defaultColumn={{
              enableSorting: false,
            }}
            className='h-full'
          />
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && !isError && tableData && (
        <PaginationControls
          handlePageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          page={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
