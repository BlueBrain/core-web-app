import { WritableAtom, atom } from 'jotai';
import memoize from 'lodash/memoize';

// eslint-disable-next-line
const atoms = memoize((key: string) => atom<unknown>(null));

export function getAtom<T>(key: string) {
  return atoms(key) as WritableAtom<T | null, [T | null], void>;
}
