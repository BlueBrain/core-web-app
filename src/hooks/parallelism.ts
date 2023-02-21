/* eslint-disable import/prefer-default-export */
import React from 'react';

/**
 * @returns A function that prevents asyncronous functions
 * with the same ID to run in parallel.
 * ```
 * const getData = (url: string) => {
 *   preventParallelism(
 *     url,
 *     async () => {
 *       const resp = await fetch(url)
 *       return resp.json()
 *     }
 *   )
 * }
 * ```
 * In the above example, if you call two times `getData()` with the same URL,
 * the second call will be ignored if the first one is not resolved yet.
 */
export function usePreventParallelism<T = string>() {
  const refSet = React.useRef(new Set<T>());
  return async (id: T, action: () => Promise<void>) => {
    if (refSet.current.has(id)) return;

    try {
      refSet.current.add(id);
      await action();
    } finally {
      refSet.current.delete(id);
    }
  };
}
