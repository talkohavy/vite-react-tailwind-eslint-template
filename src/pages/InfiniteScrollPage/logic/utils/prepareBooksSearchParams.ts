import { PAGE_SIZE } from '../constants';
import type { GetBooksSearchParams } from '../../types';

type PrepareBooksSearchParamsProps = {
  category: string | undefined;
  query: string | undefined;
  currentPageNumber: number;
};

export function prepareBooksSearchParams(props: PrepareBooksSearchParamsProps): GetBooksSearchParams {
  const { category, query, currentPageNumber } = props;

  return {
    q: query,
    category,
    page: currentPageNumber,
    limit: PAGE_SIZE,
  };
}
