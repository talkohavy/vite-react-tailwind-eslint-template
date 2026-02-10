import { useCallback, useEffect, useRef, useState } from 'react';
import type { HttpRequest } from '../lib/HttpClient';

type UseAsyncFetchProps<ReturnType, TransformType = ReturnType> = {
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
  asyncFunc: (props: any) => HttpRequest<ReturnType>;
  /**
   * **IMPORTANT NOTE! Passing undefined will qualify as `true`!!! Be sure to do `Boolean(flag)` to avoid weird situations.**
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
  /**
   * Should throw an error if the request fails.
   *
   * @default true
   */
  shouldThrow?: boolean;
};

/**
 * **IMPORTANT NOTE!**
 *
 * When providing type T, it's up to you to add 'undefined' to the type,
 * depending on the value of `shouldThrow`.
 *
 * If `shouldThrow` is set to `false`, the hook WILL ALWAYS return `undefined` when the request fails!
 *
 * If you set `shouldThrow` to `true`, the hook will throw an error if the request fails.
 *
 * `shouldThrow` defaults to `false`.
 */
export type AsyncFetchResult<T> = {
  fetchData: (funcProps?: any) => Promise<T>;
} & (
  | { isLoading: true; isError: false; data: undefined }
  | { isLoading: false; isError: true; data: undefined }
  | { isLoading: false; isError: false; data: T }
);

export function useAsyncFetch<ReturnType, TransformType = ReturnType>(
  props: UseAsyncFetchProps<ReturnType, TransformType>,
): AsyncFetchResult<TransformType> {
  const { asyncFunc, transform, isAutoFetch = true, onSuccess, onError, dependencies = [], shouldThrow = true } = props;

  const [isLoading, setIsLoading] = useState(isAutoFetch);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<TransformType>();

  const asyncFuncRef = useRef(asyncFunc);
  const abortRef = useRef<(() => void) | null>(null);
  const currentRequestIdRef = useRef(0);

  useEffect(() => {
    asyncFuncRef.current = asyncFunc;
  }, [asyncFunc]);

  const isCurrentRequest = (requestId: number) => requestId === currentRequestIdRef.current;

  const fetchData = useCallback(
    async (funcProps?: any) => {
      currentRequestIdRef.current = ++currentRequestIdRef.current % 100;
      const requestId = currentRequestIdRef.current;

      try {
        if (abortRef.current) {
          abortRef.current(); // <--- Abort previous request if it exists
        }

        setIsLoading(true);
        setIsError(false);

        const { promise, abort } = asyncFuncRef.current(funcProps);

        abortRef.current = abort; // <--- Store abort function for cleanup

        const data = await promise;

        if (!isCurrentRequest(requestId)) {
          console.warn('not current request', requestId);
          return;
        }

        const updatedData = (transform ? transform(data) : data) as TransformType;

        setData(updatedData);
        setIsError(false);

        onSuccess?.(updatedData);

        return updatedData;
      } catch (error: any) {
        if (isCurrentRequest(requestId)) {
          console.error(error);
          setIsError(true);
          onError?.(error);
        }
        if (shouldThrow) throw error;
      } finally {
        if (isCurrentRequest(requestId)) {
          setIsLoading(false);
        }
      }
    },
    [transform, onSuccess, onError, shouldThrow],
  );

  useEffect(() => {
    if (!isAutoFetch) return;

    fetchData();
    // eslint-disable-next-line
  }, [fetchData, isAutoFetch, ...dependencies]);

  return { isLoading, isError, data, fetchData } as AsyncFetchResult<TransformType>;
}
