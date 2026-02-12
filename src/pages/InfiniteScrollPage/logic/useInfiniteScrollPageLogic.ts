import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URLS } from '../../../common/constants';
import { toSearchParams } from '../../../common/utils/toSearchParams';
import { useAsyncFetch } from '../../../hooks/useAsyncFetch';
import { httpClient } from '../../../lib/HttpClient';
import { DEFAULT_SEARCH_PARAMS } from './constants';
import { prepareBooksSearchParams } from './utils/prepareBooksSearchParams';
import type { GetBooksResponse, Book, PreviousSearchParams, GetBooksSearchParams } from '../types';

export function useInfiniteScrollPageLogic() {
  const [query, setQuery] = useState('');
  const [category, _setCategory] = useState('business');
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);

  const previousSearchParamsRef = useRef<PreviousSearchParams>({} as PreviousSearchParams);

  const booksHookResult = useAsyncFetch<GetBooksResponse>({
    asyncFunc: (params?: GetBooksSearchParams) => {
      const paramString = toSearchParams(params ?? DEFAULT_SEARCH_PARAMS).toString();
      const urlSearchQuery = paramString ? `?${paramString}` : '';
      const targetUrl = `${API_URLS.books}${urlSearchQuery}`;

      return httpClient.get<GetBooksResponse>(targetUrl);
    },
  });

  const getShouldOverridePreviousSearchResults = useCallback(
    (previousSearchParams: PreviousSearchParams) => {
      return (
        currentPageNumber === 1 || category !== previousSearchParams.category || query !== previousSearchParams.query
      );
    },
    [currentPageNumber, category, query],
  );

  const loadMore = useCallback(async () => {
    try {
      setIsLoadingNextPage(true);

      const params = prepareBooksSearchParams({ category, query, currentPageNumber });
      const response = await booksHookResult.fetchData(params);
      const { data, hasMore } = response;

      const shouldOverridePreviousSearchResults = getShouldOverridePreviousSearchResults(
        previousSearchParamsRef.current,
      );

      previousSearchParamsRef.current = { category, query, currentPageNumber };

      if (shouldOverridePreviousSearchResults) {
        setBooks(data);
        setHasMore(hasMore);
        setCurrentPageNumber((prev) => prev + 1);
        setIsLoadingNextPage(false);
        return;
      }

      setBooks((prev) => [...prev, ...data]); // <--- Append new books to the existing books
      setHasMore(hasMore);

      if (hasMore) {
        setCurrentPageNumber((prev) => prev + 1);
      }

      setIsLoadingNextPage(false);
    } catch (error: any) {
      if (error.name == 'AbortError') return;

      console.error('Error loading books:', error);

      setIsLoadingNextPage(false);
    }
  }, [query, category, currentPageNumber, booksHookResult, getShouldOverridePreviousSearchResults]);

  const handleFetchBooks = useCallback(() => {
    const params = prepareBooksSearchParams({ category, query, currentPageNumber: 1 });

    booksHookResult.fetchData(params).then((data) => {
      setBooks(data.data);
      setCurrentPageNumber(1);
      setHasMore(data.hasMore);
    });
  }, [query, category, booksHookResult]);

  const onBottomReached = useCallback(() => {
    if (hasMore && !booksHookResult.isLoading) loadMore();
  }, [hasMore, booksHookResult.isLoading, loadMore]);

  useEffect(() => {
    if (booksHookResult.data) {
      setBooks(booksHookResult.data.data);
      setHasMore(booksHookResult.data.hasMore);
    }
    // eslint-disable-next-line
  }, [Boolean(booksHookResult.data)]);

  return {
    query,
    setQuery,
    // FetchBooks button:
    handleFetchBooks,
    // fetch books:
    books,
    booksHookResult,
    // infinite scroll:
    onBottomReached,
    isLoadingNextPage,
  };
}
