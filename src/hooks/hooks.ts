import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Atom } from 'jotai/vanilla';
import { unwrap, loadable } from 'jotai/utils';
import { usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';
import sessionAtom from '@/state/session';

export function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function useLoadable<T>(loadableAtom: Atom<Loadable<Promise<T>>>, defaultValue: T) {
  const loadableValue = useAtomValue(loadableAtom);
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    if (loadableValue.state !== 'hasData' || !loadableValue.data) return;

    setState(loadableValue.data);
  }, [loadableValue]);

  return state;
}

export function useSessionAtomValue() {
  return useAtomValue(sessionAtom);
}

export function useUnwrappedValue<T>(atom: Atom<T>) {
  return useAtomValue(unwrap(atom));
}

export function useLoadableValue<T>(atom: Atom<T>) {
  return useAtomValue(loadable(atom));
}

export function useEnsuredPath() {
  const path = usePathname();
  if (!path) throw new Error('Invalid pathname');
  return path;
}

type Function = (...args: any) => any;
type RestParameters<T> = T extends (first: any, ...rest: infer R) => any ? R : never;
type DebounceParams = RestParameters<typeof debounce>;

/**
  Creates a debounced callback that delays invoking func until after 
  wait milliseconds have elapsed since the last time the debounced function was invoked. 
  See: https://lodash.com/docs/4.17.15#debounce
 
  The callback will be memoized so that it only changes if one of the deps has changed.
   
  @param func The function to debounce.
  @param deps The dependency array.
  @param wait The number of milliseconds to delay.
  @param options The options object. (See lodash.debounce docs).

  @returns - The memoized, debounced version of the callback.
*/
export function useDebouncedCallback<T extends Function>(
  func: T,
  deps: DependencyList,
  ...params: DebounceParams
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(func, ...params), deps);
}
