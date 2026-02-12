import { PAGE_SIZE } from '../constants';

type PrepareBooksSearchParamsProps = {
  category: string | undefined;
  query: string | undefined;
  currentPageNumber: number;
};

export function prepareBooksSearchParams(props: PrepareBooksSearchParamsProps) {
  const { category, query, currentPageNumber } = props;

  const params = new URLSearchParams();

  if (query) params.append('q', query);

  if (category) params.append('category', category);

  params.append('page', currentPageNumber.toString());
  params.append('limit', PAGE_SIZE.toString());

  return params;
}
