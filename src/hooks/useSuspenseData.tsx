import React, { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching that works well with Suspense
 * This creates a promise-based approach that Suspense can handle
 */

interface UseSuspenseDataOptions<T> {
  initialData?: T;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

interface UseSuspenseDataResult<T> {
  data: T;
  refetch: () => Promise<T>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching data with Suspense support
 * Usage:
 * const { data } = useSuspenseData(fetchFunction, [dependency1, dependency2]);
 */
export function useSuspenseData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: UseSuspenseDataOptions<T> = {}
): UseSuspenseDataResult<T> {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFn();
      setData(result);

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options.onSuccess, options.onError]);

  useEffect(() => {
    fetchData();
  }, deps);

  // If we don't have data yet and we're not loading, throw a promise
  // This will cause Suspense to show the fallback
  if (!data && !isLoading && !error) {
    throw fetchData();
  }

  // If we have an error, throw it so ErrorBoundary can catch it
  if (error) {
    throw error;
  }

  // If we don't have data yet, throw the promise to keep Suspense active
  if (!data) {
    throw fetchData();
  }

  return {
    data,
    refetch: fetchData,
    isLoading,
    error: null,
  };
}

/**
 * Hook for creating a Suspense-compatible data fetcher
 * This is useful when you want to manually control when data fetching starts
 */
export function useSuspenseFetcher<T>() {
  const [promises, setPromises] = useState<Map<string, Promise<T>>>(new Map());

  const fetch = useCallback(
    (key: string, fetchFn: () => Promise<T>): T => {
      // If we already have a promise for this key, return it
      if (promises.has(key)) {
        throw promises.get(key)!;
      }

      // Create a new promise and store it
      const promise = fetchFn()
        .then(result => {
          // Clean up the promise after it resolves
          setPromises(prev => {
            const newPromises = new Map(prev);
            newPromises.delete(key);
            return newPromises;
          });
          return result;
        })
        .catch(error => {
          // Clean up the promise after it rejects
          setPromises(prev => {
            const newPromises = new Map(prev);
            newPromises.delete(key);
            return newPromises;
          });
          throw error;
        });

      setPromises(prev => new Map(prev).set(key, promise));
      throw promise;
    },
    [promises]
  );

  return { fetch };
}

/**
 * Higher-order component that wraps a component with Suspense data fetching
 */
export function withSuspenseData<P extends object>(
  Component: React.ComponentType<P>,
  dataFetcher: () => Promise<any>
) {
  return function SuspenseDataWrapper(props: P) {
    const { data } = useSuspenseData(() => dataFetcher(), []);

    return <Component {...props} data={data} />;
  };
}
