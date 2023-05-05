import { Loadable } from 'jotai/vanilla/utils/loadable';
import { useEffect, useState } from 'react';

export default function useLoadable<T>(loadable: Loadable<Promise<T>>, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    if (loadable.state !== 'hasData' || !loadable.data) return;

    setState(loadable.data);
  }, [loadable]);

  return state;
}
