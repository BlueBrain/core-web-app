import { WritableAtom, Atom, atom, useAtomValue } from 'jotai';

const atoms: Map<string, Atom<any>> = new Map();

export function getAtom<T>(key: string, defaultValue: T | null = null) {
  console.log(key, defaultValue, atoms.get(key))
  const theAtom = atoms.get(key) ?? atom(defaultValue);
  atoms.set(key, theAtom);
  return theAtom as WritableAtom<T | null, [T | null], void>;
}

export function useAssertAtomValue<T>(key: string) {
  const v = useAtomValue(getAtom(key));
  if (!v) throw new Error(`Atom with key ${key} not initialized`);
  return v as T;
}
