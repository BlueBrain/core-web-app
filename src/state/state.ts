import { WritableAtom, Atom, atom } from 'jotai';

const atoms: Map<string, Atom<any>> = new Map();

export function getAtom<T>(key: string, defaultValue: T | null = null) {
  const theAtom = atoms.get(key) ?? atom(defaultValue);
  atoms.set(key, theAtom);
  return theAtom as WritableAtom<T | null, [T | null], void>;
}
