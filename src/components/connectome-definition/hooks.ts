import { useAtomValue } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Atom } from 'jotai/vanilla';
import { useEffect, useState } from 'react';

export default function useLoadable<T>(loadableAtom: Atom<Loadable<Promise<T>>>, defaultValue: T) {
  const loadable = useAtomValue(loadableAtom);
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    if (loadable.state !== 'hasData' || !loadable.data) return;

    setState(loadable.data);
  }, [loadable]);

  return state;
}
