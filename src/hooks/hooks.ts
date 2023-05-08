import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Atom } from 'jotai/vanilla';

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
  const loadable = useAtomValue(loadableAtom);
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    if (loadable.state !== 'hasData' || !loadable.data) return;

    setState(loadable.data);
  }, [loadable]);

  return state;
}
