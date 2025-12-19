import { useState } from 'react';

export function usePagination() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    handlePageChange,
    handleLimitChange,
    limit,
    page,
  };
}
