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

type RestParameters<T extends (...args: any) => any> = T extends (
  first: any,
  ...rest: infer R
) => any
  ? R
  : never;

type DebounceParams = RestParameters<typeof debounce>;

export function useDebouncedCallback<T extends (...args: any) => any>(
  func: T,
  deps: DependencyList,
  ...params: DebounceParams
) {
  // eslint-disable-next-line
  return useCallback(debounce(func, ...params), deps);
}
