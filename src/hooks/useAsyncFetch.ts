import { useCallback, useEffect, useRef, useState } from 'react';
import type { HttpResponse } from '../lib/HttpClient/types';
import { httpClient } from '../lib/HttpClient';

type useAsyncFetchProps<ReturnType, TransformType = ReturnType> = {
  /**
   * @description
   * Doesn't need to be a memoed function!
   *
   * A new request will NOT be invoked upon a new reference.
   * But please keep it in sync with `dependencies` prop to make sure that
   * the request is properly invoked and only when needed.
   *
   * @example
   * const { data, isError, isLoading } = useAsyncFetch({
   *   asyncFunc: () => {
   *     return httpClient.get<GalleryResponseDto>(
   *       `/users-service/users?page=${page}&view=${viewType}&limit=${ITEMS_PER_PAGE}`,
   *     );
   *   },
   *   dependencies: [page, viewType],
   * });
   */
  asyncFunc: (props: any) => Promise<HttpResponse<ReturnType>>;
  /**
   * **IMPORTANT NOTE! Passing undefined will qualify as `true`!!! Be sure to do !!flag to avoid weird situations.**
   *
   *
   * `isAutoFetch` is set to `true` by default.
   *
   * When `true`, fetch will be invoked automatically.
   *
   * There are two ways to use this property:
   *
   * 1. If you want full manual control, you can set this to `false`,
   * and use the `fetchData` function returned from the hook.
   * Note that `isLoading` & `isError` would still be updated correctly.
   *
   * 2. If you want fetching enabled intermittently, you can toggle `isAutoFetch`.
   *
   * Whether this property is set to `true` or `false`, you can still use the `fetchData` function.
   *
   * @default true
   */
  isAutoFetch?: boolean;
  /**
   * Should be a memoed function.
   */
  transform?: (data: ReturnType) => TransformType;
  /**
   * Should be a memoed function.
   */
  onSuccess?: (data: TransformType) => void;
  /**
   * Should be a memoed function.
   */
  onError?: (error: any) => void;
  /**
   * What changes should execute another fetch?
   *
   * Defaults to "on component mount", which means it only happens once.
   *
   * @default []
   */
  dependencies?: any[];
};

export function useAsyncFetch<ReturnType, TransformType = ReturnType>(
  props: useAsyncFetchProps<ReturnType, TransformType>,
) {
  const { asyncFunc, transform, isAutoFetch = true, onSuccess, onError, dependencies = [] } = props;

  const [isLoading, setIsLoading] = useState(isAutoFetch);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined as TransformType);

  const asyncFuncRef = useRef(asyncFunc);
  const requestIdRef = useRef<string>('');

  useEffect(() => {
    asyncFuncRef.current = asyncFunc;
  }, [asyncFunc]);

  const fetchData = useCallback(
    async (funcProps?: any) => {
      try {
        if (requestIdRef.current) {
          httpClient.abortRequestById(requestIdRef.current);
        }

        setIsLoading(true);
        setIsError(false);

        const { data, requestInfo } = await asyncFuncRef.current(funcProps);

        requestIdRef.current = requestInfo.requestId;

        const updatedData = (transform ? transform(data) : data) as TransformType;

        setData(updatedData);

        onSuccess?.(updatedData);

        return updatedData;
      } catch (error) {
        console.error(error);
        setIsError(true);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [transform, onSuccess, onError],
  );

  // MUST come before the refetch useEffect! Otherwise, an outgoing request would immediately terminate.
  useEffect(() => {
    return () => {
      if (requestIdRef.current) httpClient.abortRequestById(requestIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isAutoFetch) return;

    fetchData();
  }, [fetchData, isAutoFetch, ...dependencies]);

  return { isLoading, isError, data, fetchData };
}
