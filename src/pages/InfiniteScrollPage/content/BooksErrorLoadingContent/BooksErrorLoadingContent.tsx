import BooksContent from '../BooksContent';
import LoadingError from '../LoadingError';
import LoadingFirstPage from '../LoadingFirstPage';
import ZeroBooksFound from '../ZeroBooksFound';
import type { Book, GetBooksResponse } from '../../types';
import type { AsyncFetchResult } from '@src/hooks/useAsyncFetch';

export type BooksErrorLoadingContentProps = {
  books: Book[];
  booksHookResult: AsyncFetchResult<GetBooksResponse>;
  isLoadingNextPage: boolean;
  onBottomReached: (val?: any) => void;
};

export default function BooksErrorLoadingContent(props: BooksErrorLoadingContentProps) {
  const { books, booksHookResult, isLoadingNextPage, onBottomReached } = props;
  const { isError, isLoading } = booksHookResult;

  if (isError) return <LoadingError />;

  if (isLoading && !isLoadingNextPage) return <LoadingFirstPage />;

  if (books.length === 0) return <ZeroBooksFound />;

  return <BooksContent books={books} isLoadingNextPage={isLoadingNextPage} onBottomReached={onBottomReached} />;
}
