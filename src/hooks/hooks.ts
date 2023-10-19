import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Atom } from 'jotai/vanilla';
import { unwrap, loadable } from 'jotai/utils';
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
  const [unwrapped, setUnwrapped] = useState(unwrap(atom));
  useEffect(() => {
    setUnwrapped(unwrap(atom));
  }, [atom]);
  return useAtomValue(unwrapped);
}

export function useLoadableValue<T>(atom: Atom<T>) {
  const [loadableValue, setLoadableValue] = useState(loadable(atom));
  useEffect(() => {
    setLoadableValue(loadable(atom));
  }, [atom]);
  return useAtomValue(loadableValue);
}
