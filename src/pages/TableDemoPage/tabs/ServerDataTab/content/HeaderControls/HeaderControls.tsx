type HeaderControlsProps = {
  handleLimitChange: (limit: number) => void;
  handleSortOrderToggle: () => void;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
};

export function HeaderControls(props: HeaderControlsProps) {
  const { handleLimitChange, handleSortOrderToggle, sortOrder, currentPage, totalPages, totalItems, limit } = props;

  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex items-center gap-2'>
        <label htmlFor='limit-select' className='text-sm text-gray-600 dark:text-gray-300'>
          Rows per page:
        </label>

        <select
          id='limit-select'
          value={limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <button
        type='button'
        onClick={handleSortOrderToggle}
        className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Sort: {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </button>

      {currentPage && (
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Page {currentPage} of {totalPages} ({totalItems} total records)
        </div>
      )}
    </div>
  );
}
